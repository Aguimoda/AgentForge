---
name: observability-designer
description: Activar al diseñar el sistema de monitorización y alertas. Los tres pilares de observabilidad son logs estructurados, métricas de negocio y trazas distribuidas. Sin observabilidad, producción es una caja negra.
---

# Skill: Observability Designer

## Los 3 pilares de observabilidad

```
Logs → ¿Qué pasó exactamente?
Métricas → ¿Cuánto y con qué frecuencia?
Trazas → ¿Dónde tardó más la request?
```

## 1. Logs estructurados (no console.log)

```typescript
// ❌ Logs sin estructura — imposible de filtrar en producción
console.log('Porte creado:', porteId)
console.error('Error al procesar pago')

// ✅ Logs estructurados con contexto
import { logger } from '@/lib/logger'

// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // En producción: JSON. En desarrollo: pretty print
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
})

// Uso con contexto relevante
logger.info({
  event: 'porte.created',
  porteId,
  usuarioId,
  origen: porte.origen,
  destino: porte.destino,
  precioEstimado: porte.precio,
}, 'Porte creado exitosamente')

logger.error({
  event: 'pago.failed',
  porteId,
  usuarioId,
  error: error.message,
  stripeCode: error.code,
}, 'Pago fallido')
```

**Campos que deben estar en TODOS los logs:**
- `event` — identificador de qué ocurrió (dominio.acción)
- `requestId` — para correlacionar logs de la misma request
- `usuarioId` — quién lo hizo (si está autenticado)
- `timestamp` — automático con pino

## 2. Métricas de negocio vs métricas técnicas

### Métricas de negocio (las que importan al negocio)
```typescript
// Ejemplos para De Vacío:
analytics.track('porte_created')
analytics.track('porte_matched', { timeToMatchMs })
analytics.track('pago_completado', { importe })
analytics.track('valoracion_enviada', { puntuacion })
analytics.track('usuario_registrado', { canal: 'organic' | 'referral' })
```

### Métricas técnicas (las que importan a ingeniería)
```typescript
// Error rate por endpoint
// Latencia P50, P95, P99
// Throughput (requests/segundo)
// Disponibilidad (uptime %)
```

## 3. Error tracking con Sentry

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

// Capturar error con contexto
export function captureError(error: Error, context?: Record<string, unknown>) {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setExtras(context)
    }
    Sentry.captureException(error)
  })
}

// En API routes — capturar y añadir contexto del usuario
export async function POST(req: Request) {
  try {
    // ... lógica
  } catch (error) {
    captureError(error as Error, {
      endpoint: '/api/portes',
      method: 'POST',
      body: await req.json(),  // cuidado: no loguear datos sensibles
    })
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## Alertas — qué alertar y con qué umbral

| Métrica | Umbral de alerta | Severidad | Canal |
|---------|-----------------|-----------|-------|
| Error rate | > 1% durante 5 min | 🔴 Crítico | PagerDuty/SMS |
| Latencia P95 | > 3s durante 5 min | 🔴 Crítico | PagerDuty |
| Disponibilidad | < 99.9% | 🔴 Crítico | PagerDuty |
| Error rate | > 0.1% durante 15 min | 🟡 Warning | Slack |
| Latencia P95 | > 1.5s durante 15 min | 🟡 Warning | Slack |
| Nuevos errores Sentry | Cualquier error nuevo | 🟡 Warning | Slack |

## Health check endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = await Promise.allSettled([
    checkDatabase(),
    checkRedis(),
    checkStripe(),
  ])

  const status = checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'degraded'

  return Response.json({
    status,
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION,
    checks: {
      database: checks[0].status === 'fulfilled' ? 'ok' : 'error',
      redis: checks[1].status === 'fulfilled' ? 'ok' : 'error',
      stripe: checks[2].status === 'fulfilled' ? 'ok' : 'error',
    }
  }, {
    status: status === 'healthy' ? 200 : 503
  })
}

async function checkDatabase() {
  await db.$queryRaw`SELECT 1`
}
```

## Dashboard mínimo viable (para el primer sprint de producción)

1. **Error rate** en el tiempo (últimas 24h)
2. **Latencia P95** por endpoint (últimas 24h)
3. **Eventos de negocio** clave (portes creados, pagos completados)
4. **Usuarios activos** (últimas 1h, 24h, 7 días)
5. **Errores más frecuentes** en Sentry (top 10)

## Checklist de observabilidad antes del primer deploy

- [ ] Sentry instalado y configurado con DSN de producción
- [ ] Logs estructurados (no console.log) en todos los endpoints críticos
- [ ] Health check endpoint implementado y añadido al uptime monitor
- [ ] Métricas de negocio clave definidas y trackeadas
- [ ] Al menos 1 alerta crítica configurada (error rate)
- [ ] Dashboard mínimo creado
- [ ] Se ha probado que los errores llegan a Sentry
