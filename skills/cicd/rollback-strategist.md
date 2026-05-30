---
name: rollback-strategist
description: Activar antes de cualquier deploy a producción. Define cuándo hacer rollback vs hotfix, cómo revertir migraciones de BD, cómo usar feature flags como mecanismo de rollback instantáneo, y el runbook documentado antes del primer deploy.
---

# Skill: Rollback Strategist

## Cuándo hacer rollback vs hotfix

| Situación | Decisión | Tiempo máximo |
|-----------|----------|---------------|
| Bug crítico sin fix obvio | Rollback inmediato | <15 minutos |
| Bug crítico con fix de 1 línea | Hotfix | <30 minutos |
| Degradación de performance | Rollback si >20% peor | <30 minutos |
| Bug no crítico (afecta <5% usuarios) | Hotfix en próximo sprint | Planificar |
| Migración de BD con problemas | Rollback si es reversible | <10 minutos |

## Tipos de rollback

### 1. Rollback de aplicación (el más fácil)
```bash
# Vercel — redeployar la versión anterior
vercel rollback [deployment-url]

# Docker — cambiar la imagen
docker service update --image app:v1.2.3 proyecto_app

# Git — crear un revert commit (mejor que reset en ramas compartidas)
git revert HEAD --no-edit
git push origin main
```

### 2. Rollback de base de datos (el más delicado)
```bash
# Ejecutar la migración down
npm run db:migrate:down

# O restaurar desde backup si la migración no es reversible
# IMPORTANTE: coordinar con el rollback de aplicación
```

**Regla de oro de las migraciones:** cada migración debe tener un método `down` que revierte exactamente lo que hace el `up`.

```typescript
// ✅ Migración reversible
export async function up(db: Database) {
  await db.schema.alterTable('portes', (t) => {
    t.string('descripcion_corta').nullable()
  })
}

export async function down(db: Database) {
  await db.schema.alterTable('portes', (t) => {
    t.dropColumn('descripcion_corta')
  })
}
```

**Migraciones NO reversibles** (evitar en lo posible):
- Borrar datos (usar soft delete primero)
- Renombrar columnas (añadir la nueva, migrar datos, luego borrar la vieja en otra migración)

### 3. Rollback instantáneo con Feature Flags
```typescript
// Si el feature está detrás de un flag → apagar el flag = rollback en 0 segundos
// Sin redeploy, sin migraciones, sin downtime
FF_NUEVA_FUNCIONALIDAD=false  // en las variables de entorno del servidor
```

## Runbook de rollback (plantilla)

```markdown
# Runbook: Rollback de [Nombre del Deploy]

## Identificar el problema
1. Verificar Sentry: ¿hay errores nuevos desde el deploy? ¿cuántos afectados?
2. Verificar métricas: ¿error rate > 1%? ¿latencia P95 > 3s?
3. Decidir: ¿rollback o hotfix?

## Ejecutar rollback

### Si es solo código (sin migración de BD):
```bash
vercel rollback  # o el comando de tu plataforma
```
Tiempo estimado: 2-3 minutos

### Si hay migración de BD:
1. Pausar el tráfico a la aplicación (activar página de mantenimiento)
2. `npm run db:migrate:down`
3. Redeployar versión anterior de la aplicación
4. Verificar que funciona
5. Quitar página de mantenimiento
Tiempo estimado: 10-15 minutos

## Verificar que el rollback fue exitoso
- [ ] Error rate vuelve a <0.1%
- [ ] Los tests de humo pasan en producción
- [ ] No hay alertas nuevas en Sentry

## Post-rollback
1. Crear issue con descripción del problema y los síntomas
2. Post-mortem en las próximas 24h
3. Fix planificado en el siguiente sprint
```
