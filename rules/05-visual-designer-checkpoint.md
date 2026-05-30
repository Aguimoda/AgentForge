---
description: >
  Checkpoint obligatorio de diseño UI/UX — siempre activo. Antes de implementar cualquier
  componente o pantalla nueva, verificar este checklist. Integra la inteligencia de diseño
  de ui-ux-pro-max con el sistema de agentes AgentForge.
alwaysApply: true
---

# Regla: Visual Designer + UI/UX Intelligence — checkpoint obligatorio

## Gate de diseño — STOP antes de cualquier UI nueva

Antes de que el Ejecutor o el component-designer escriban código visual, verificar:

| Check | ¿Pasa? | Acción si NO |
|-------|--------|--------------|
| ¿Existe `docs/VISUAL-BRIEF.md`? | ✅/❌ | STOP → Invocar Agente 09 Visual Designer |
| ¿Están los tokens en `globals.css`? | ✅/❌ | STOP → Invocar Visual Designer / component-designer |
| ¿Existe el `.feature` aprobado? | ✅/❌ | STOP → Invocar Spec Writer |
| ¿Se ha leído `ui-ux-pro-max/SKILL.md`? | ✅/❌ | Leer antes de continuar |

**Si cualquiera falla → STOP. No continuar con la implementación.**

---

## Cuándo invocar al Visual Designer (Agente 09)

Invocar cuando:
- ✅ Pantalla nueva (route/page nueva)
- ✅ Componente visual nuevo que el usuario ve
- ✅ Cambio de paleta, tipografía o design tokens
- ✅ Auditoría visual del proyecto (inconsistencias, prep de sprint)
- ✅ Nuevo tipo de usuario con necesidades visuales distintas
- ✅ Iconografía o ilustraciones nuevas

**Prompt exacto para invocarlo:**
```
Actúa como el Visual Designer (.claude/agents/09-visual-designer.md).
Antes de implementar [nombre del componente/pantalla]:
1. Lee .claude/skills/uxui/ui-ux-pro-max/SKILL.md
2. ¿Existe VISUAL-BRIEF.md? Si no, créalo
3. ¿Qué tokens de color y tipografía usa este componente?
4. ¿Cuáles son los estados visuales? (default, hover, focus, disabled, error)
5. ¿Pasa el contraste WCAG AA en todos los estados?
Espera aprobación antes de continuar.
```

---

## Cuándo invocar al component-designer

Invocar cuando ya existe el Visual Brief y el .feature aprobado:
- ✅ Crear un componente de `src/components/`
- ✅ Refactorizar visualmente un componente existente
- ✅ Implementar una pantalla (page.tsx) nueva

**Prompt exacto:**
```
Actúa como el component-designer (.claude/agents/component-designer.md).
Implementa [componente] para [US-XX].
Lee en este orden: ui-ux-pro-max SKILL.md → VISUAL-BRIEF.md → globals.css → .feature
Usa los tokens de globals.css. Sigue el checklist del Paso 4.
```

---

## Cuándo NO es necesario ninguno de los dos

- La tarea es solo lógica de negocio (sin UI)
- El componente ya existe y no cambia visualmente
- Se usa un componente de shadcn/ui sin modificar su apariencia
- Es migración de BD, endpoint de API puro, o script de build

---

## Inteligencia de diseño — ui-ux-pro-max

El skill `.claude/skills/uxui/ui-ux-pro-max/SKILL.md` contiene:
- **10 categorías de reglas priorizadas** (Accesibilidad CRÍTICO → Charts BAJO)
- **Checklist pre-entrega** específico para De Vacío
- **Tokens actuales** del proyecto (OKLCH, superficies, animaciones)
- **Directrices de stack** (Next.js + Tailwind v4 + shadcn)

**Orden de prioridad de las reglas:**
1. 🔴 Accesibilidad (CRÍTICO) — bloquea PR si falla
2. 🔴 Touch e Interacción (CRÍTICO) — targets ≥44px
3. 🟠 Performance, Estilo, Layout, Navegación (ALTO)
4. 🟡 Tipografía, Color, Animación, Formularios (MEDIO)
5. 🟢 Charts y Datos (BAJO)

---

## Tokens actuales — referencia rápida

```
COLORES:
bg-azul / text-azul       → color de marca, AppHeader
bg-verde / text-verde     → acciones, CTA, éxito
bg-naranja / text-naranja → alertas, atención
text-valoracion           → estrellas de valoración (≥3:1 WCAG)

SUPERFICIES:
bg-surface-page      → fondo de páginas de contenido
bg-surface-card      → tarjetas y formularios
bg-surface-elevated  → bottom sheets y modales

COMPONENTES:
btn-primary     → botón de acción principal
btn-secondary   → botón secundario outline
estado-badge    → badge con icono + color + texto
bottom-sheet*   → clases para BottomSheet component

NUNCA: bg-[#hex], text-[#hex], colores hardcodeados
SIEMPRE: tokens semánticos de globals.css
```

---

## Anti-patrones detectados — De Vacío específico

Estos errores han aparecido en el proyecto. Revisar activamente:

```
❌ text-amber-400 → usar text-valoracion (WCAG fail)
❌ Fondos inconsistentes (bg-azul-sutil/white/zinc-50 mezclados) → usar bg-surface-page
❌ Emojis 📦🚐✅ en UI funcional → usar SVG inline
❌ Modal/sheet ad-hoc inline → usar <BottomSheet>
❌ EstadoBadge solo con color → añadir icono SVG por estado
❌ pt-[76px] para header de 60px → usar pt-[60px] o var(--header-h)
❌ BottomNav sin sombra sutil → shadow-[0_-1px_0_0_theme(colors.zinc.200)]
```
