---
name: mobile-first-designer
description: Activar al diseñar o implementar cualquier interfaz. Mobile-first no es solo "que se vea bien en móvil" — es una filosofía que fuerza a priorizar el contenido esencial y construir hacia arriba desde la restricción más severa.
---

# Skill: Mobile First Designer

## Por qué mobile-first (no mobile-friendly)

```
Mobile-friendly: diseñar para desktop y adaptar para mobile → resultado mediocre en ambos
Mobile-first: diseñar para mobile y expandir para desktop → óptimo en ambos

La restricción del móvil fuerza buenas decisiones:
- ¿Qué es realmente esencial? (el espacio no perdona)
- ¿Cuál es la jerarquía real? (solo cabe 1 CTA principal)
- ¿Qué funciona con un dedo? (diseño gestual)
```

## El layout base: de 1 columna a múltiples

```typescript
// ✅ Mobile first con Tailwind — siempre empezar sin prefijo (es mobile)
<div className="
  flex flex-col gap-4        /* mobile: columna */
  md:flex-row md:gap-8       /* tablet: fila */
">
  <main className="
    w-full                   /* mobile: ancho completo */
    md:flex-1                /* tablet: ocupa el espacio restante */
  ">
    {content}
  </main>
  <aside className="
    w-full                   /* mobile: ancho completo */
    md:w-80                  /* tablet: sidebar fijo */
  ">
    {sidebar}
  </aside>
</div>

// ✅ Grid responsive
<div className="
  grid grid-cols-1 gap-4
  sm:grid-cols-2
  lg:grid-cols-3
">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

## Navegación mobile vs desktop

```typescript
// Mobile: Bottom Navigation (pulgares llegan fácil)
// Desktop: Sidebar o Top Navigation

// ✅ Bottom Navigation para apps con 3-5 secciones principales
<nav className="
  fixed bottom-0 left-0 right-0
  flex items-center justify-around
  bg-white border-t border-gray-200
  h-16 px-4
  pb-safe  /* safe area para iPhone con notch */
  md:hidden  /* ocultar en desktop */
">
  <NavItem href="/portes" icon={<PackageIcon />} label="Portes" />
  <NavItem href="/explorar" icon={<SearchIcon />} label="Explorar" />
  <NavItem href="/mensajes" icon={<MessageIcon />} label="Mensajes" />
  <NavItem href="/perfil" icon={<UserIcon />} label="Perfil" />
</nav>

// Safe area para notch de iPhone
// En globals.css:
// padding-bottom: env(safe-area-inset-bottom);
```

## Tipografía responsive

```typescript
// ✅ Escala tipográfica que funciona en ambos contextos
// Mobile: texto más grande (distancia de lectura mayor)
// Desktop: texto puede ser algo más pequeño

const typographyScale = {
  // Mobile → Desktop
  h1: 'text-2xl md:text-3xl lg:text-4xl',     // 24px → 30px → 36px
  h2: 'text-xl md:text-2xl lg:text-3xl',       // 20px → 24px → 30px
  h3: 'text-lg md:text-xl',                     // 18px → 20px
  body: 'text-base',                            // 16px (no reducir en mobile)
  small: 'text-sm',                             // 14px
}
```

## Imágenes responsive

```typescript
// ✅ Diferentes tamaños según viewport
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={630}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  // → mobile: 100% del viewport
  // → tablet: 50% del viewport
  // → desktop: máximo 800px
/>

// ✅ Imágenes de fondo responsive
<div className="
  h-48           /* mobile: 192px */
  md:h-64        /* tablet: 256px */
  lg:h-80        /* desktop: 320px */
  bg-cover bg-center
  style={{ backgroundImage: 'url(/bg.jpg)' }}
"/>
```

## Formularios en mobile

```typescript
// ✅ Teclado correcto según el tipo de campo
<input type="email" inputMode="email" autoComplete="email" />
<input type="tel" inputMode="tel" autoComplete="tel" />
<input type="number" inputMode="numeric" />
<input type="text" inputMode="numeric" pattern="[0-9]*" />  // solo números, teclado numérico

// ✅ Evitar que el zoom se active al hacer focus en iOS (font-size mínimo 16px)
<input className="text-base" />  // text-base = 16px — NO reducir

// ✅ Labels arriba (no a la izquierda) — más espacio en mobile
<div className="flex flex-col gap-1">
  <label htmlFor="precio" className="text-sm font-medium">Precio (€)</label>
  <input id="precio" type="number" className="..." />
</div>
```

## Touch targets y gestos

```typescript
// ✅ Mínimo 44x44px (Apple HIG) o 48x48dp (Material Design)
<button className="min-h-[44px] min-w-[44px] flex items-center justify-center">
  <CloseIcon />
</button>

// ✅ Espacio entre elementos táctiles (mínimo 8px)
<div className="flex gap-2">  /* no menos de gap-2 entre botones táctiles */
  <Button>Aceptar</Button>
  <Button variant="secondary">Cancelar</Button>
</div>

// ✅ Swipe gestures para acciones frecuentes (con feedback visual)
// Swipe left para eliminar/cancelar
// Swipe right para completar/aceptar
// → implementar con Framer Motion o react-swipeable
```

## Performance específica de mobile

```typescript
// ✅ Lazy loading agresivo para mobile (conexiones lentas)
const MapComponent = dynamic(
  () => import('@/components/Map'),
  {
    loading: () => <div className="h-48 bg-gray-200 animate-pulse rounded-lg" />,
    ssr: false
  }
)

// ✅ Skeleton screens en vez de spinners (menos salto de layout)
function PorteCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  )
}
```

## Checklist mobile-first

- [ ] Diseño empieza en 375px (iPhone SE) — no en desktop
- [ ] Bottom navigation en mobile (no hamburger menu)
- [ ] Todos los touch targets ≥ 44x44px
- [ ] font-size mínimo 16px en inputs (evita zoom en iOS)
- [ ] Teclados específicos por tipo de campo (email, tel, numeric)
- [ ] Imágenes con srcset/sizes para no descargar imágenes grandes en mobile
- [ ] No hay scroll horizontal en ningún breakpoint
- [ ] Las animaciones respetan prefers-reduced-motion
- [ ] Safe area para iPhones con notch (pb-safe en bottom nav)
