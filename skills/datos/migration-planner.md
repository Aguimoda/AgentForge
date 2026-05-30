---
name: migration-planner
description: Activar cuando se necesita cambiar el schema de una BD en producción con datos reales. Las migraciones mal planificadas causan downtime, pérdida de datos o deploys fallidos. Este skill define la estrategia correcta según el tipo de cambio.
---

# Skill: Migration Planner

## El principio fundamental: expand-contract

Para cambios de schema sin downtime, siempre seguir el patrón **Expand → Migrate → Contract**:

```
Deploy 1 (Expand):   Añadir lo nuevo sin eliminar lo viejo
Backfill:            Migrar datos existentes a la nueva estructura
Deploy 2 (Contract): Eliminar lo viejo una vez el código no lo usa
```

## Casos comunes y cómo manejarlos

### Caso 1: Añadir columna NOT NULL con valor por defecto

```sql
-- ❌ Peligroso: bloquea la tabla en PostgreSQL hasta completar
ALTER TABLE portes ADD COLUMN prioridad TEXT NOT NULL DEFAULT 'normal';

-- ✅ Seguro: 3 pasos
-- Paso 1 (Deploy 1): añadir nullable
ALTER TABLE portes ADD COLUMN prioridad TEXT;

-- Paso 2 (Backfill): rellenar datos existentes en batches
UPDATE portes SET prioridad = 'normal' WHERE prioridad IS NULL AND id IN (
  SELECT id FROM portes WHERE prioridad IS NULL LIMIT 1000
);
-- Repetir hasta que no queden NULLs

-- Paso 3 (Deploy 2): añadir constraint NOT NULL
ALTER TABLE portes ALTER COLUMN prioridad SET NOT NULL;
ALTER TABLE portes ALTER COLUMN prioridad SET DEFAULT 'normal';
```

### Caso 2: Renombrar columna

```sql
-- ❌ Peligroso: rompe el código existente inmediatamente
ALTER TABLE portes RENAME COLUMN descripcion TO descripcion_larga;

-- ✅ Seguro: expand-contract en 3 deploys
-- Deploy 1: añadir columna nueva
ALTER TABLE portes ADD COLUMN descripcion_larga TEXT;

-- Backfill: copiar datos
UPDATE portes SET descripcion_larga = descripcion WHERE descripcion_larga IS NULL;

-- Deploy 2: actualizar código para usar descripcion_larga, mantener sync
-- (trigger o lógica de app que escribe en ambas columnas)

-- Deploy 3: verificar que descripcion ya no se usa → eliminar columna vieja
ALTER TABLE portes DROP COLUMN descripcion;
```

### Caso 3: Dividir una tabla

```sql
-- Escenario: separar "usuarios" en "usuarios" + "perfiles_transportista"
-- Deploy 1: crear tabla nueva
CREATE TABLE perfiles_transportista (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id),
  vehiculo TEXT,
  capacidad_kg NUMERIC(8,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backfill: migrar datos de transportistas
INSERT INTO perfiles_transportista (usuario_id, vehiculo, capacidad_kg)
SELECT id, vehiculo, capacidad_kg FROM usuarios WHERE es_transportista = true;

-- Deploy 2: actualizar código para usar la nueva tabla
-- Deploy 3: eliminar columnas de usuarios que ya están en perfiles_transportista
ALTER TABLE usuarios DROP COLUMN vehiculo;
ALTER TABLE usuarios DROP COLUMN capacidad_kg;
```

### Caso 4: Añadir índice sin bloquear la tabla

```sql
-- ❌ Bloquea escrituras durante la creación del índice
CREATE INDEX idx_portes_estado ON portes(estado);

-- ✅ CONCURRENTLY no bloquea (tarda más pero es seguro en producción)
CREATE INDEX CONCURRENTLY idx_portes_estado ON portes(estado);
```

## Backfill seguro en tablas grandes

```typescript
// Para tablas con millones de filas, hacer backfill en batches para no bloquear
async function backfillPrioridad() {
  let lastId: string | null = null
  let processedCount = 0

  do {
    const batch = await db
      .updateTable('portes')
      .set({ prioridad: 'normal' })
      .where('prioridad', 'is', null)
      .where('id', '>', lastId ?? '')
      .orderBy('id')
      .limit(1000)
      .returning('id')
      .execute()

    processedCount += batch.length
    lastId = batch[batch.length - 1]?.id ?? null

    console.log(`Backfill progress: ${processedCount} rows processed`)

    // Pausa entre batches para no saturar la BD
    await sleep(100)
  } while (lastId !== null)
}
```

## Verificación antes de ejecutar en producción

```bash
# 1. Ejecutar en staging primero (siempre)
npm run db:migrate -- --env=staging

# 2. Medir tiempo de ejecución en staging
# Si tarda > 5 segundos → implementar como migración online (CONCURRENTLY, batches)

# 3. Tener el rollback listo ANTES de ejecutar
npm run db:migrate:down  # debe funcionar sin errores

# 4. Backup previo al deploy (automático en managed DB, verificar en self-hosted)
pg_dump $PROD_DATABASE_URL > backup_pre_migration_$(date +%Y%m%d_%H%M%S).sql
```

## Template de migración

```typescript
// migrations/YYYYMMDDHHMMSS_descripcion.ts
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // CAMBIO: descripción breve de qué hace esta migración
  // IMPACTO: ¿bloquea escrituras? ¿cuánto tarda estimado?
  // ROLLBACK: ¿es reversible? ¿requiere backfill inverso?

  await db.schema
    .alterTable('portes')
    .addColumn('prioridad', 'text')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('portes')
    .dropColumn('prioridad')
    .execute()
}
```

## Checklist antes de ejecutar una migración en producción

- [ ] La migración se ha ejecutado en staging sin errores
- [ ] El tiempo de ejecución en staging es < 1 segundo (o se usa CONCURRENTLY/batches)
- [ ] El método `down` está implementado y testeado
- [ ] Hay backup de producción previo al deploy
- [ ] El equipo está disponible durante la migración (no ejecutar en viernes)
- [ ] Se ha comunicado posible downtime si la migración no es online
- [ ] El deploy de aplicación y la migración están coordinados (qué primero)
