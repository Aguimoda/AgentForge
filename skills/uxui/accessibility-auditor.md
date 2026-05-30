---
name: accessibility-auditor
description: Activar en la fase de revisión de código o antes de un release. WCAG 2.1 AA es el estándar legal en España y la UE. La accesibilidad no es opcional — es un requisito funcional. Este skill traduce el estándar a código concreto.
---

# Skill: Accessibility Auditor

## Los 4 principios WCAG (POUR)

```
Perceptible  — La información debe ser perceptible por todos los sentidos
Operable     — La interfaz debe ser operable con distintos dispositivos de entrada
Comprensible — El contenido y la operación deben ser comprensibles
Robusto      — El contenido debe ser interpretable por tecnologías asistivas
```

## Nivel AA — requisitos concretos

### 1. Contraste de color (Criterio 1.4.3)

```
Texto normal (<18px): ratio mínimo 4.5:1
Texto grande (≥18px o ≥14px bold): ratio mínimo 3:1
Elementos UI (inputs, botones, iconos): ratio mínimo 3:1

Herramientas:
- https://webaim.org/resources/contrastchecker/
- Chrome DevTools → Accessibility → Color contrast
```

```typescript
// ❌ Gris claro sobre blanco — probablemente falla
<p className="text-gray-400">Descripción secundaria</p>

// ✅ Mínimo gray-600 para texto sobre blanco
<p className="text-gray-600">Descripción secundaria</p>
```

### 2. Navegación por teclado (Criterio 2.1.1)

```typescript
// ✅ Todos los elementos interactivos son alcanzables con Tab
// ✅ Focus ring visible
<button
  className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
  Publicar porte
</button>

// ✅ Orden de foco lógico (sigue el orden visual)
// ❌ tabIndex > 0 — rompe el orden natural, evitar salvo casos muy justificados

// ✅ Diálogos atrapan el foco (focus trap)
// Cuando un modal se abre, Tab debe ciclar solo dentro del modal
import { useFocusTrap } from '@/hooks/useFocusTrap'

function Modal({ isOpen, onClose, children }) {
  const ref = useFocusTrap(isOpen)
  // Al cerrar, devolver foco al elemento que abrió el modal
}
```

### 3. Textos alternativos para imágenes (Criterio 1.1.1)

```typescript
// ❌ Sin alt
<img src="/porte-foto.jpg" />

// ❌ Alt redundante o inútil
<img src="/porte-foto.jpg" alt="imagen" />
<img src="/porte-foto.jpg" alt="foto de porte" />

// ✅ Alt descriptivo del contenido relevante
<img src="/porte-foto.jpg" alt="Caja de cartón mediana con etiqueta de frágil" />

// ✅ Imagen decorativa — alt vacío (screen reader la ignora)
<img src="/decoracion.svg" alt="" role="presentation" />

// ✅ Next.js Image
<Image
  src="/porte-foto.jpg"
  alt="Caja de cartón mediana con etiqueta de frágil"
  width={400}
  height={300}
/>
```

### 4. ARIA — cuándo y cómo usarlo

```typescript
// Regla principal: HTML semántico primero, ARIA solo cuando no hay alternativa nativa

// ✅ Usar HTML semántico
<button>Publicar porte</button>          // no: <div onClick={...}>
<nav>...</nav>                           // no: <div role="navigation">
<main>...</main>                         // no: <div role="main">
<h1>Mis portes</h1>                      // jerarquía de headings correcta

// ✅ ARIA para estados dinámicos
<button
  aria-pressed={isActive}               // botones toggle
  aria-expanded={isOpen}                // accordions, menus
  aria-controls="menu-list"             // relacionar botón con su panel
>
  Filtros
</button>

// ✅ ARIA para contenido en vivo
<div aria-live="polite" aria-atomic="true">
  {toastMessage}                        // anunciar cambios al screen reader
</div>

// ✅ ARIA labels cuando el texto visible no es suficiente
<button aria-label="Eliminar porte Madrid-Barcelona">
  <TrashIcon />  // solo icono, sin texto visible
</button>

// ✅ Describir errores de formulario
<input
  id="email"
  aria-describedby="email-error"
  aria-invalid={!!error}
/>
<p id="email-error" role="alert">{error}</p>
```

### 5. Formularios accesibles (Criterio 1.3.1, 3.3.1, 3.3.2)

```typescript
// ✅ Todo input tiene label explícito (no solo placeholder)
<label htmlFor="email">Correo electrónico</label>
<input
  id="email"
  type="email"
  autoComplete="email"
  required
  aria-required="true"
/>

// ✅ Errores identificados y descritos
<input
  id="precio"
  type="number"
  aria-invalid={errors.precio ? 'true' : 'false'}
  aria-describedby={errors.precio ? 'precio-error' : undefined}
/>
{errors.precio && (
  <p id="precio-error" role="alert" className="text-red-600 text-sm">
    El precio debe ser mayor que 0
  </p>
)}

// ✅ Autocompletado para datos personales
<input type="email" autoComplete="email" />
<input type="tel" autoComplete="tel" />
<input type="text" autoComplete="given-name" />
```

### 6. Tamaño de área táctil en mobile (Criterio 2.5.5)

```typescript
// Mínimo 44x44px para elementos interactivos en mobile
<button className="min-h-[44px] min-w-[44px] p-3">
  <PlusIcon className="h-5 w-5" />
</button>

// ❌ Demasiado pequeño
<button className="p-1">
  <PlusIcon className="h-4 w-4" />  // área táctil: 24px — muy pequeño
</button>
```

## Herramientas de auditoría

```bash
# axe-core — en tests automatizados
npm install --save-dev @axe-core/playwright

# En tests de Playwright
const { checkA11y } = require('axe-playwright')
await checkA11y(page, '#main', {
  detailedReport: true,
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
})

# En el browser durante desarrollo
# Chrome extension: axe DevTools, Lighthouse
# Firefox: Accessibility Inspector
```

## Checklist WCAG 2.1 AA antes de un release

- [ ] Contraste de color ≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande e iconos
- [ ] Toda la interfaz es navegable por teclado (Tab, Shift+Tab, Enter, Space, Escape)
- [ ] Focus ring visible en todos los elementos interactivos
- [ ] Todas las imágenes tienen alt text (o alt="" para decorativas)
- [ ] Todos los inputs tienen label asociado (no solo placeholder)
- [ ] Los errores de formulario están programáticamente asociados al input
- [ ] Los modales atrapan el foco y devuelven el foco al cerrarse
- [ ] Los iconos sin texto tienen aria-label
- [ ] Área táctil mínima 44x44px en mobile
- [ ] Los cambios dinámicos de contenido se anuncian con aria-live
- [ ] axe-core no reporta violations en las páginas principales
