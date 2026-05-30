---
description: Accesibilidad WCAG AA y Mobile-First — obligatorio en todo componente frontend. Siempre activo.
alwaysApply: true
---
# Regla: Accesibilidad y Mobile-First — Siempre activa

> Esta regla se aplica a cualquier tarea de desarrollo frontend o diseño de componentes.

## Mobile-First — no es opcional

1. Diseñar y codificar siempre para 375px primero
2. Luego escalar hacia arriba (768px tablet, 1280px+ desktop)
3. En Tailwind: las clases sin prefijo son mobile. `md:` y `lg:` añaden desktop.
4. Verificar siempre los dos breakpoints clave: 375px y 1280px+

```css
/* ✅ Correcto — mobile first */
.container {
  @apply flex flex-col gap-4 md:flex-row md:gap-8;
}

/* ❌ Incorrecto — desktop first */
.container {
  @apply flex flex-row gap-8 sm:flex-col sm:gap-4;
}
```

## Accesibilidad — WCAG 2.1 AA mínimo

### Obligatorio en cada componente:

**Semántica HTML:**
- Usar elementos semánticos (`<button>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- Nunca `<div onClick={...}>` cuando corresponde un `<button>`
- Jerarquía de headings lógica (h1 → h2 → h3, sin saltar niveles)

**ARIA:**
- `aria-label` en todos los botones icon-only (sin texto visible)
- `aria-describedby` cuando hay texto de ayuda asociado
- `role` solo cuando el HTML semántico no es suficiente
- `aria-live` para contenido que cambia dinámicamente (notificaciones, estados del porte)

**Foco y teclado:**
- Todo elemento interactivo es accesible por teclado (Tab, Enter, Space, Escape)
- Focus state visible y con suficiente contraste (nunca `outline: none` sin alternativa)
- Trap de foco en modales y drawers (cuando están abiertos)

**Contraste:**
- Texto normal: mínimo 4.5:1 con el fondo
- Texto grande (>= 18px o >= 14px bold): mínimo 3:1
- Elementos de UI (bordes de inputs, iconos): mínimo 3:1

**Formularios:**
- `<label>` asociado a cada input (htmlFor / id, o label wrapping)
- Mensajes de error asociados con `aria-describedby`
- No usar solo el color para indicar error — añadir icono + texto

**Imágenes:**
- `alt` descriptivo en imágenes de contenido
- `alt=""` en imágenes decorativas

**Movimiento:**
- Respetar `prefers-reduced-motion` en animaciones
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

## Modo Conducción — requisitos adicionales (UX crítico de seguridad)

El Modo Conducción (transportista en salpicadero) requiere:
- Botones de al menos 64x64px (no el mínimo WCAG de 44x44px)
- Texto mínimo de 24px en información clave
- Contraste muy alto (el brillo de la pantalla varía)
- Máximo 2 botones visibles a la vez en cualquier momento
- Confirmaciones en un solo tap sin zonas de toque pequeñas
- Alerta sonora + vibración para peticiones entrantes (no solo visual)

## Performance

- **LCP < 2.5s** objetivo (Core Web Vital)
- **INP < 200ms** objetivo (Core Web Vital)
- **Tracking GPS:** actualización cada 5-10s (balance UX/batería)
- Imágenes de usuario y fotos de portes: usar `next/image` siempre
- No bloquear el thread principal con operaciones pesadas
