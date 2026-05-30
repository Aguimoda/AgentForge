---
name: data-modeler
description: Activar al diseñar o revisar el schema de base de datos. Cubre convenciones de naming, tipos de datos correctos, normalización vs desnormalización, relaciones e índices estratégicos. Diferente del domain-modeler (DDD) — este skill se enfoca en la implementación real del schema SQL.
---

# Skill: Data Modeler

## Convenciones de schema SQL

### Naming
```sql
-- Tablas: plural, snake_case
CREATE TABLE usuarios (...);
CREATE TABLE portes (...);
CREATE TABLE valoraciones (...);

-- Columnas: snake_case
usuario_id, created_at, precio_estimado

-- Índices: idx_{tabla}_{columna(s)}
CREATE INDEX idx_portes_usuario_id ON portes(usuario_id);
CREATE INDEX idx_portes_estado_created ON portes(estado, created_at DESC);

-- Constraints: {tipo}_{tabla}_{columna}
CONSTRAINT fk_portes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
CONSTRAINT uq_usuarios_email UNIQUE (email)
CONSTRAINT chk_portes_precio CHECK (precio > 0)
```

### Tipos de datos críticos

```sql
-- ✅ IDs: UUID (no integer autoincrement en producción)
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- ✅ Dinero: NUMERIC(12,2) o INTEGER (céntimos) — NUNCA float
precio_estimado NUMERIC(12, 2) NOT NULL  -- euros con 2 decimales
-- o mejor aún:
precio_centimos INTEGER NOT NULL  -- 1500 = 15.00€ (evita problemas de coma flotante)

-- ✅ Timestamps: TIMESTAMPTZ (siempre con zona horaria)
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
deleted_at TIMESTAMPTZ  -- para soft delete

-- ✅ Enums: tipo TEXT con CHECK constraint (más flexible que ENUM nativo)
estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'activo', 'completado', 'cancelado'))

-- ✅ JSON: JSONB (no JSON) para poder hacer queries sobre el contenido
metadata JSONB

-- ✅ Coordenadas geográficas
latitud NUMERIC(10, 7)
longitud NUMERIC(10, 7)
-- o con PostGIS:
ubicacion GEOGRAPHY(POINT, 4326)
```

## Ejemplo de schema bien diseñado

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT,  -- nunca datos de tarjeta, solo el token
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,  -- soft delete: el usuario "elimina" su cuenta
  CONSTRAINT uq_usuarios_email UNIQUE (email)
);

CREATE TABLE portes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL,
  transportista_id UUID,  -- null hasta que alguien acepta
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (
    estado IN ('pendiente', 'asignado', 'recogido', 'entregado', 'cancelado')
  ),
  origen_direccion TEXT NOT NULL,
  origen_lat NUMERIC(10, 7) NOT NULL,
  origen_lng NUMERIC(10, 7) NOT NULL,
  destino_direccion TEXT NOT NULL,
  destino_lat NUMERIC(10, 7) NOT NULL,
  destino_lng NUMERIC(10, 7) NOT NULL,
  precio_centimos INTEGER NOT NULL CHECK (precio_centimos > 0),
  descripcion TEXT,
  fecha_recogida TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_portes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  CONSTRAINT fk_portes_transportista FOREIGN KEY (transportista_id) REFERENCES usuarios(id)
);

-- Índices estratégicos (solo los que se usan en queries reales)
CREATE INDEX idx_portes_usuario_id ON portes(usuario_id);
CREATE INDEX idx_portes_transportista_id ON portes(transportista_id) WHERE transportista_id IS NOT NULL;
CREATE INDEX idx_portes_estado ON portes(estado) WHERE estado NOT IN ('entregado', 'cancelado');
CREATE INDEX idx_portes_created_at ON portes(created_at DESC);
```

## Cuándo normalizar vs desnormalizar

### Normalizar (3NF) — la regla por defecto
```
Cada dato existe exactamente en un lugar.
Si cambia el nombre de un usuario, cambia en un solo sitio.
```

### Desnormalizar — solo con justificación explícita
```sql
-- ✅ Desnormalizar cuando la query es crítica y el JOIN es costoso
-- Ejemplo: guardar nombre_usuario en valoraciones para evitar JOIN en cada read
CREATE TABLE valoraciones (
  ...
  nombre_evaluador TEXT NOT NULL,  -- denormalizado de usuarios.nombre
  -- Justificación: se lee 1000x más que se actualiza. El nombre puede cambiar
  -- pero en el contexto de una valoración histórica tiene sentido conservarlo.
)
```

## Soft delete vs hard delete

```sql
-- Soft delete: marcar como eliminado (preserva historial, necesario para RGPD fiscal)
UPDATE usuarios SET deleted_at = NOW() WHERE id = $1

-- Filtrar registros no eliminados en todas las queries
SELECT * FROM usuarios WHERE deleted_at IS NULL

-- Índice parcial para eficiencia
CREATE INDEX idx_usuarios_activos ON usuarios(email) WHERE deleted_at IS NULL;
```

## Migraciones — reglas de oro

```typescript
// ✅ Siempre reversible
export async function up(db: Kysely<Database>) {
  await db.schema
    .alterTable('portes')
    .addColumn('descripcion_corta', 'text')  // nullable = reversible
    .execute()
}

export async function down(db: Kysely<Database>) {
  await db.schema
    .alterTable('portes')
    .dropColumn('descripcion_corta')
    .execute()
}
```

**Cambios de schema seguros (sin downtime):**
- Añadir columna nullable ✅
- Añadir índice concurrentemente ✅ (`CREATE INDEX CONCURRENTLY`)
- Añadir tabla nueva ✅

**Cambios de schema peligrosos (requieren estrategia):**
- Borrar columna → primero dejar de usarla en código, luego borrar
- Renombrar columna → añadir nueva, migrar datos, eliminar vieja (dos deploys)
- Añadir columna NOT NULL → añadir nullable + backfill + añadir constraint
- Cambiar tipo de columna → columna nueva + migración de datos + rename

## Checklist de schema review

- [ ] IDs son UUID, no integer autoincrement
- [ ] Dinero es INTEGER (céntimos) o NUMERIC(12,2), no float
- [ ] Timestamps son TIMESTAMPTZ
- [ ] Hay índice en todas las Foreign Keys
- [ ] Hay índice en los campos más usados en WHERE/ORDER BY
- [ ] Las migraciones tienen método `down` implementado
- [ ] No hay datos duplicados que deberían estar normalizados
- [ ] El soft delete está implementado para datos con implicaciones legales/fiscales
