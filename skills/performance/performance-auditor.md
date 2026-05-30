---
name: performance-auditor
description: Activar antes de cualquier release o cuando el usuario reporta lentitud. Audita rendimiento con métricas reales (Core Web Vitals), identifica los cuellos de botella más frecuentes y prioriza las optimizaciones por impacto.
---

# Skill: Performance Auditor

## Core Web Vitals — los 3 KPIs obligatorios

| Métrica | Qué mide | Objetivo | Cómo mejorar |
|---------|----------|----------|--------------|
| **LCP** (Largest Contentful Paint) | Cuándo carga el elemento principal | < 2.5s | Preload hero image, CDN, server-side render |
| **INP** (Interaction to Next Paint) | Respuesta a interacciones del usuario | < 200ms | Reducir JavaScript en el main thread |
| **CLS** (Cumulative Layout Shift) | Estabilidad visual | < 0.1 | Reservar espacio para imágenes/ads, evitar insertar contenido encima de contenido existente |

## Auditoría en orden de impacto

### 1. JavaScript — el mayor cuello de botella

```bash
# Analizar el bundle
npx @next/bundle-analyzer  # Next.js
npx webpack-bundle-analyzer stats.json  # Webpack genérico

# Ver qué se carga en cada página
# En Chrome DevTools → Coverage tab
```

**Patrones de problema más frecuentes:**

```typescript
// ❌ Importar toda la librería
import _ from 'lodash'
const result = _.sortBy(items, 'name')

// ✅ Importar solo lo necesario
import sortBy from 'lodash/sortBy'
const result = sortBy(items, 'name')

// ❌ Cargar todo en el bundle inicial
import HeavyComponent from './HeavyComponent'

// ✅ Code splitting — cargar solo cuando se necesita
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false  // si no necesita SSR
})
```

### 2. Imágenes — el segundo mayor problema

```typescript
// ❌ Imágenes sin optimizar
<img src="/hero.png" alt="Hero" />

// ✅ Next.js Image con lazy loading y optimización automática
import Image from 'next/image'
<Image
  src="/hero.png"
  alt="Hero"
  width={1200}
  height={630}
  priority  // solo para above-the-fold
  placeholder="blur"
/>

// ✅ Para imágenes externas — preload crítico
<link rel="preload" as="image" href="/hero.webp" />
```

**Checklist de imágenes:**
- [ ] Formato WebP/AVIF (20-30% más pequeño que PNG/JPG)
- [ ] Dimensiones correctas (no usar CSS para reducir imágenes grandes)
- [ ] Lazy loading en imágenes below-the-fold
- [ ] Priority en LCP candidate (primera imagen visible)

### 3. Fuentes web

```html
<!-- ✅ Preconectar al servidor de fuentes -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- ✅ font-display: swap evita texto invisible durante carga -->
@font-face {
  font-family: 'Inter';
  font-display: swap;
  src: url('/fonts/inter.woff2') format('woff2');
}
```

### 4. Base de datos — N+1 queries

```typescript
// ❌ N+1: 1 query para portes + N queries para cada usuario
const portes = await db.porte.findMany()
for (const porte of portes) {
  porte.usuario = await db.usuario.findById(porte.usuarioId)  // N queries!
}

// ✅ 1 query con JOIN
const portes = await db.porte.findMany({
  include: { usuario: true }  // Prisma ORM
})

// ✅ O con SQL raw
SELECT p.*, u.nombre, u.avatar
FROM portes p
JOIN usuarios u ON u.id = p.usuario_id
WHERE p.estado = 'activo'
```

**Índices obligatorios:**
```sql
-- Siempre indexar: FKs, campos de filtro frecuente, campos de orden frecuente
CREATE INDEX idx_portes_usuario_id ON portes(usuario_id);
CREATE INDEX idx_portes_estado ON portes(estado);
CREATE INDEX idx_portes_created_at ON portes(created_at DESC);

-- Verificar que los índices se usan
EXPLAIN ANALYZE SELECT * FROM portes WHERE estado = 'activo' ORDER BY created_at DESC;
```

### 5. Caché

```typescript
// Caché en memoria para datos que no cambian frecuentemente
const cache = new Map<string, { data: any; expires: number }>()

async function getCachedData(key: string, fetcher: () => Promise<any>, ttlMs = 60_000) {
  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }
  const data = await fetcher()
  cache.set(key, { data, expires: Date.now() + ttlMs })
  return data
}

// Redis para entornos distribuidos
await redis.setex(`porte:${id}`, 300, JSON.stringify(porte))  // TTL: 5 minutos
```

## Métricas a medir en producción

```typescript
// Web Vitals en Next.js
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === 'web-vital') {
    analytics.track('web_vital', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,  // 'good' | 'needs-improvement' | 'poor'
      url: window.location.pathname
    })
  }
}
```

## Checklist de performance antes de un release

- [ ] LCP < 2.5s en mobile 4G simulado (Chrome DevTools → Network throttling)
- [ ] Bundle JavaScript < 200KB gzipped para la página inicial
- [ ] No hay imágenes sin dimensiones explícitas (causa CLS)
- [ ] Fuentes con font-display: swap
- [ ] No hay N+1 queries en las rutas principales (verificar con query logging)
- [ ] Los índices más usados existen en la BD
- [ ] Lighthouse score > 90 en producción (o staging con datos reales)
