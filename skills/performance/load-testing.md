---
name: load-testing
description: Activar antes de lanzar a producción o antes de campañas de marketing que aumentarán el tráfico. Define los escenarios de carga realistas, los umbrales de aceptación y cómo interpretar los resultados.
---

# Skill: Load Testing

## Cuándo hacer load testing

- Antes del primer lanzamiento a producción
- Antes de campañas que multiplican el tráfico esperado
- Después de cambios arquitecturales significativos
- Cuando se detecta degradación de performance en producción

## Tipos de prueba de carga

| Tipo | Qué prueba | Cuándo usar |
|------|-----------|-------------|
| **Smoke test** | ¿Funciona con 1-2 usuarios? | Siempre, antes del load test real |
| **Load test** | ¿Aguanta el tráfico esperado? | Antes de cada release |
| **Stress test** | ¿Cuándo empieza a fallar? | Trimestral, para conocer límites |
| **Spike test** | ¿Aguanta picos súbitos? | Si hay eventos (campañas, prensa) |
| **Soak test** | ¿Aguanta durante horas? | Para detectar memory leaks |

## Herramienta recomendada: k6

```javascript
// tests/load/smoke.js — el más simple, siempre primero
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 2,           // 2 usuarios virtuales
  duration: '30s',  // durante 30 segundos
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% de requests < 500ms
    http_req_failed: ['rate<0.01'],    // < 1% de errores
  },
}

export default function () {
  const res = http.get('https://staging.tuapp.com/api/portes')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 500,
  })
  sleep(1)
}
```

```javascript
// tests/load/load-test.js — tráfico realista
import http from 'k6/http'
import { check, group, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // ramp-up a 50 usuarios
    { duration: '5m', target: 50 },   // mantener 50 usuarios durante 5 min
    { duration: '2m', target: 100 },  // pico a 100 usuarios
    { duration: '5m', target: 100 },  // mantener el pico
    { duration: '2m', target: 0 },    // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(50)<200', 'p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.01'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'https://staging.tuapp.com'

export default function () {
  group('flujo principal — ver portes disponibles', () => {
    const res = http.get(`${BASE_URL}/api/portes?estado=disponible`)
    check(res, { 'lista de portes OK': (r) => r.status === 200 })
  })

  sleep(Math.random() * 3 + 1)  // pausa realista entre acciones
}
```

```javascript
// tests/load/stress-test.js — encontrar el límite
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 400 },  // doblar cada vez
    { duration: '5m', target: 400 },
    { duration: '2m', target: 0 },
  ],
}
```

## Ejecutar los tests

```bash
# Instalar k6
brew install k6  # macOS
# o usar Docker:
docker run -i grafana/k6 run - < tests/load/smoke.js

# Ejecutar contra staging
k6 run --env BASE_URL=https://staging.tuapp.com tests/load/load-test.js

# Con output detallado
k6 run --out json=results.json tests/load/load-test.js
```

## Umbrales de aceptación por tipo de endpoint

| Endpoint | P50 | P95 | P99 | Error rate |
|----------|-----|-----|-----|------------|
| Páginas estáticas | <100ms | <300ms | <500ms | <0.1% |
| API de lectura (listados) | <200ms | <800ms | <1.5s | <1% |
| API de escritura (crear, pagar) | <500ms | <2s | <3s | <0.5% |
| Webhooks de Stripe | <1s | <3s | <5s | <0.1% |

## Interpretar resultados

```
✅ Load test exitoso:
- p(95) por debajo del umbral
- Error rate < 1%
- Tiempo de respuesta estable (no sube durante el test)

🟡 Degradación aceptable:
- p(95) llega al umbral pero no lo supera
- Algunos timeouts esporádicos bajo carga máxima

🔴 Necesita optimización:
- p(95) supera el umbral
- Error rate > 1%
- Tiempo de respuesta aumenta linealmente con carga (no estabiliza)
- La app no se recupera al reducir carga (memory leak)
```

## Checklist antes del primer launch

- [ ] Smoke test: 0 errores con 2 usuarios
- [ ] Load test: p(95) < umbral con el tráfico esperado del día 1
- [ ] Los endpoints de pago aguantan sin errores
- [ ] La BD no llega a 80% de conexiones bajo carga
- [ ] El tiempo de respuesta se estabiliza (no crece indefinidamente)
- [ ] El servidor se recupera normalmente al reducir carga
