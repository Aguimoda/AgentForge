---
name: ui-ux-pro-max
description: >
  Inteligencia de diseño UI/UX de nivel profesional. Activar automáticamente en cualquier
  tarea de diseño de componentes, pantallas o sistemas visuales. Contiene 10 categorías de
  reglas priorizadas (Accesibilidad CRÍTICO → Charts BAJO), guías de estilo, selección de
  paleta, tipografía y directrices por stack. Aplica a: diseño de páginas nuevas, refactor
  visual de componentes, revisión de UI, decisiones de navegación, animaciones y diseño
  responsivo. No aplica a: backend puro, APIs, BD, DevOps, scripts no visuales.
alwaysApply: false
---

# UI/UX Pro Max — Inteligencia de Diseño

Adaptado al stack y producto de De Vacío: **Next.js 16 + React 19 + Tailwind CSS v4 + OKLCH**, marketplace P2P de logística, móvil-first 375px, usuarios en contexto de movilidad.

---

## Cuándo aplicar este skill

**Obligatorio:**
- Diseñar pantallas nuevas o componentes visuales nuevos
- Crear o refactorizar un componente de `src/components/`
- Decidir colores, tipografía o layout
- Revisar código de UI antes del PR
- Implementar navegación, animaciones o comportamiento responsivo
- Tomar decisiones de diseño a nivel de producto

**Recomendado:**
- La UI se ve poco profesional o inconsistente
- Se recibe feedback de usabilidad
- Optimización pre-lanzamiento
- Alineación cross-platform

**No aplicar:**
- Backend puro, APIs, BD, scripts sin UI, DevOps

---

## Las 10 categorías de reglas — ordenadas por prioridad

| Pri | Categoría | Impacto | Checks clave | Anti-patrones a evitar |
|-----|-----------|---------|--------------|------------------------|
| 1 | **Accesibilidad** | 🔴 CRÍTICO | Contraste ≥4.5:1 texto / ≥3:1 UI, alt text, nav teclado, aria-label | Quitar focus ring, botones icon-only sin label |
| 2 | **Touch e Interacción** | 🔴 CRÍTICO | Targets ≥44×44px (64px en Modo Conducción), spacing ≥8px, feedback de carga | Solo hover, transiciones 0ms |
| 3 | **Performance** | 🟠 ALTO | WebP/AVIF, lazy loading, CLS < 0.1, Server Components por defecto | Layout thrashing, imágenes sin `next/image` |
| 4 | **Selección de Estilo** | 🟠 ALTO | Coherente con producto, SVG icons, sin mezclar estilos flat+skeuomórfico | Emojis como iconos, mezclar estilos |
| 5 | **Layout y Responsivo** | 🟠 ALTO | Mobile-first 375px, sin scroll horizontal, viewport meta | Anchos fijos en px, desktop-first |
| 6 | **Tipografía y Color** | 🟡 MEDIO | Base ≥16px, line-height ≥1.5, tokens semánticos OKLCH | Texto <12px, hex hardcodeado, gris sobre gris |
| 7 | **Animación** | 🟡 MEDIO | 150–300ms, significado espacial, `prefers-reduced-motion` | Animaciones decorativas, sin reduced-motion |
| 8 | **Formularios y Feedback** | 🟡 MEDIO | Labels visibles, error cerca del campo, progressive disclosure | Label solo en placeholder |
| 9 | **Navegación** | 🟠 ALTO | Back predecible, bottom nav ≤5 ítems, deep linking | Nav sobrecargada, >5 ítems bottom |
| 10 | **Charts y Datos** | 🟢 BAJO | Leyendas, tooltips, colores accesibles | Solo color para distinguir datos |

---

## Quick Reference por categoría

### 1. Accesibilidad (CRÍTICO)
```
✅ DO:
- Contraste texto normal: ≥4.5:1 (WCAG AA)
- Contraste texto grande (≥18px/14px bold): ≥3:1
- Contraste elementos UI (bordes, iconos): ≥3:1
- aria-label en TODO botón sin texto visible
- role="dialog" + aria-modal="true" + trap de foco en modales
- aria-live="polite" para estados que cambian dinámicamente
- HTML semántico: <button> para acciones, <a> para navegación
- Focus ring visible siempre (focus-visible:ring-2 focus-visible:ring-verde)

❌ NO:
- outline: none / focus:outline-none sin alternativa visible
- Botones icon-only sin aria-label
- Error indicado solo con color (añadir icono + texto)
- div con onClick en vez de <button>
- Jerarquía de headings irregular (saltar h1→h3)
```

### 2. Touch e Interacción (CRÍTICO)
```
✅ DO:
- Target mínimo: 44×44px (WCAG 2.5.5)
- Target Modo Conducción: 64×64px mínimo
- Spacing entre targets táctiles: ≥8px
- Feedback visual inmediato en todas las acciones (<100ms)
- Estado de carga explícito (spinner, skeleton, texto "Cargando...")
- Active state en botones: scale(0.97) o cambio de fondo

❌ NO:
- Targets <44px en cualquier pantalla (especialmente móvil)
- Acción sin ningún feedback visual
- Transición 0ms (percibido como error del sistema)
```

### 3. Performance
```
✅ DO:
- Server Components por defecto en Next.js App Router
- 'use client' solo cuando necesario (hooks, eventos)
- next/image con width/height para todas las imágenes
- Lazy loading de componentes pesados con next/dynamic
- Fuentes con next/font/google (evita FOUT)

❌ NO:
- <img> en lugar de next/image
- Importar componentes pesados en el bundle principal
- Estado global para datos que son de sesión
```

### 4. Estilo (De Vacío — Marketplace Logístico P2P)
```
Categoría de producto: Marketplace / Servicio P2P
Estilo objetivo: Clean Minimal + Trust cues
Referentes: Uber Driver, BlaBlaCar, Cabify

Tokens establecidos en globals.css:
  --azul: oklch(0.35 0.15 265)       → color de marca primario
  --verde: oklch(0.52 0.17 145)      → acciones, éxito, CTA
  --naranja: oklch(0.65 0.18 55)     → alerta, atención
  --valoracion: oklch(0.58 0.19 75)  → estrellas de valoración

Superficies:
  --surface-page: blanco puro para páginas de contenido
  --surface-card: ligeramente off-white para tarjetas
  --surface-elevated: blanco para sheets y modales

✅ DO:
- SVG icons inline (coherentes, no mezclar heroicons + emojis + otros)
- bottom-sheet-panel para modales en móvil
- Cards con border sutil (zinc-200), sin sombras enormes
- EstadoBadge con icono + color + texto (nunca solo color)

❌ NO:
- Emojis como iconos en UI funcional (solo si es decorativo y hay alternativa)
- Gradientes innecesarios
- Sombras xl en cards de contenido
- Hardcodear colores hex (siempre tokens OKLCH)
```

### 5. Layout y Responsivo
```
✅ DO:
- Mobile-first: clases sin prefijo = 375px
- md: para 768px+, lg: para 1280px+
- pb-24 en páginas con bottom nav (espacio para la barra fija)
- safe-area-inset con env() en dispositivos notch
- max-w-xl mx-auto para contenido en desktop

❌ NO:
- w-[375px] o anchos fijos en px
- Diseñar desktop-first y usar sm: para reducir
- Olvidar el espacio para el BottomNav en páginas de contenido
```

### 6. Tipografía y Color
```
Fuente del proyecto: DM Sans (--font-sans), cargada via next/font/google
Scale:
  text-xs (12px) → metadata, labels secundarios
  text-sm (14px) → cuerpo secundario, hints
  text-base (16px) → cuerpo principal ✅ mínimo para lectura
  text-lg (18px) → subheadings
  text-xl / text-2xl → headings de página
  text-3xl+ → headings hero (solo SelectorModo)

✅ DO:
- Jerarquía visual clara: heading → subheading → body → caption
- leading-relaxed (1.625) para párrafos largos
- font-medium/semibold/bold según importancia
- Colores semánticos: text-zinc-900 body, text-zinc-500 secondary, text-verde acciones

❌ NO:
- text-[11px] o menor en UI interactiva
- text-zinc-400 para texto funcional (muy bajo contraste)
- Mezclar > 2 fuentes en la misma vista
```

### 7. Animación
```
Tokens de duración (definidos en globals.css):
  --duration-fast: 100ms   → feedback táctil
  --duration-base: 180ms   → transiciones estándar
  --duration-slow: 280ms   → cambios de estado complejos
  --duration-sheet: 320ms  → bottom sheets

Easing recomendado:
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  → entradas con carácter
  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1)         → salidas

✅ DO:
- Animaciones con propósito: indican relación espacial o jerarquía
- Siempre prefers-reduced-motion: no animation / instant
- Bottom sheets: sheet-slide-up + sheet-backdrop-in (ya definidos)
- Botones: active:scale-[0.97] transition-transform

❌ NO:
- Animaciones puramente decorativas sin significado
- duration > 400ms en feedback táctil
- Olvidar @media (prefers-reduced-motion: reduce)
```

### 8. Formularios y Feedback
```
✅ DO:
- Label visible siempre (no solo placeholder)
- Error message con aria-describedby + icono + texto
- Button disabled + texto explicativo durante submit
- Toast/snackbar para confirmaciones no bloqueantes

❌ NO:
- Placeholder como único label (desaparece al escribir)
- Error solo con borde rojo (sin texto ni icono)
- Formulario que resetea al hacer submit sin confirmación
```

### 9. Navegación (De Vacío específico)
```
BottomNav actual: Inicio / Publicar / Actividad / Perfil (4 ítems)
AppHeader: azul navy, altura --header-h: 60px

✅ DO:
- active state claro con text-verde + icono más grueso
- aria-current="page" en el ítem activo
- Rutas coherentes con las expectativas del usuario (/actividad, /negociar)
- Back navigation con comportamiento predecible

❌ NO:
- Más de 5 ítems en BottomNav
- Items sin label (solo icono)
- Overlay nav en móvil cuando hay BottomNav
```

### 10. Charts y Datos
```
Para De Vacío aplica principalmente en: valoraciones (star rating),
estadísticas de perfil, historial de portes.

✅ DO:
- Stars con aria-label numérico ("4 de 5 estrellas")
- Colores de valoración: usar --valoracion (3.09:1 vs blanco ✅)
- Datos de precio: font-bold + text-verde, tamaño prominente
- Estados de porte: EstadoBadge con icono + color + texto
```

---

## Checklist pre-entrega — De Vacío

Antes de marcar cualquier componente UI como listo:

```
Visual Quality
☐ Consistent with globals.css tokens (no hardcoded hex)
☐ Uses DM Sans — no other fonts introduced
☐ Mobile layout tested at 375px
☐ Desktop layout tested at 1280px+
☐ bg-surface-page / bg-surface-card / bg-surface-elevated applied correctly

Interaction
☐ All interactive elements have hover + focus + active states
☐ Touch targets ≥44px (≥64px in Modo Conducción)
☐ Loading state implemented if async data
☐ Error state implemented if async data

Accessibility
☐ Contrast ≥4.5:1 for body text
☐ Contrast ≥3:1 for UI elements
☐ aria-label on all icon-only buttons
☐ Focus visible (focus-visible:ring)
☐ Keyboard navigable (Tab, Enter, Escape)
☐ HTML semantics correct (button vs a vs div)
☐ No color-only state indicators (badge has icon + text + color)

Performance
☐ 'use client' only where needed
☐ No inline styles
☐ Images use next/image
☐ No console.log left

Bottom Sheet / Modal (si aplica)
☐ role="dialog" + aria-modal="true" + aria-label
☐ Focus trap implemented (Tab cycling)
☐ Escape closes
☐ Body scroll locked while open
☐ Return focus on close
☐ Uses <BottomSheet> component (src/components/ui/BottomSheet.tsx)
```

---

## Notas de integración

Este skill es la inteligencia de diseño integrada en el flujo AgentForge de De Vacío.
Complementa (no sustituye) los agentes y reglas existentes:

- **Agente 09 Visual Designer** usa este skill en su Paso 1 (research) y Paso 2 (personalidad)
- **component-designer** consulta este skill antes de implementar cualquier componente
- **Revisor** verifica el nivel 6 (Diseño UX) contra las reglas de este skill
- **Regla 05** (visual-designer-checkpoint) referencia este skill como guía de verificación

Si se quiere la búsqueda programática completa (161 paletas, 57 font pairings, design system generation):
```bash
# Instalar scripts Python + CSV data:
uipro init --ai claude
# Luego usar:
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "logistics marketplace p2p" --design-system -p "De Vacío"
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "mobile app" --stack nextjs
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style
```
