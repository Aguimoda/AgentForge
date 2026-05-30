---
description: Iniciar una nueva feature con BDD — flujo completo con checkpoint de diseño UI
---

Quiero implementar la siguiente historia de usuario:
[PEGAR AQUÍ LA HISTORIA DE USUARIO]

Antes de empezar, lee `.claude/estado.md` y `.claude/plan.md` para tener contexto del sprint actual.

Sigue este proceso EN ORDEN. No saltes ningún paso. Espera confirmación explícita antes de continuar al siguiente.

## Paso 1 — Spec (siempre)
Invoca al Spec Writer (`.claude/agents/03-spec-writer.md`):
- Lee la US del PRD (`docs/fase2_definicion_requisitos.md`)
- Escribe el `.feature` completo en `specs/features/[epic]/[US-ID]-[nombre].feature`
- Cubre: caso feliz, estados vacío/error/carga, validación, autorización, accesibilidad, edge cases

⏸ CHECKPOINT 1: Espera que el usuario apruebe el `.feature` antes de continuar.

## Paso 2 — Diseño UI (solo si la US tiene componentes visuales nuevos)
Evalúa si la US implica:
- Una pantalla nueva
- Un componente visual nuevo (no solo lógica)
- Cambios en la paleta, tipografía o tokens

**Si sí → Invoca al Visual Designer (`.claude/agents/09-visual-designer.md`):**
- Revisa el VISUAL-BRIEF.md si existe (`docs/VISUAL-BRIEF.md`)
- Si no existe, créalo con la skill `uxui/brand-identity`
- Define o verifica: colores, tipografía, espaciado, estados visuales del componente
- Verifica contraste WCAG AA en todos los pares de color del componente

⏸ CHECKPOINT 2 (solo si aplica): Espera que el usuario apruebe las decisiones visuales.

**Si no → continúa al Paso 3 directamente.**

## Paso 3 — Implementación
Invoca al Ejecutor (`.claude/agents/04-ejecutor.md`):
- Un scenario a la vez: Red → Green → Refactor → commit atómico
- No implementa behavior fuera del `.feature`
- Si hay componente UI: usa los tokens y decisiones aprobadas en el Paso 2

## Paso 4 — Revisión
Invoca al Revisor (`.claude/agents/05-revisor.md`):
- Formato: 🔴 CRÍTICO / 🟡 IMPORTANTE / 🟢 SUGERENCIA
- Veredicto: aprobado o bloqueado

## Paso 5 — Actualizar estado
Al terminar, actualiza `.claude/estado.md`:
- Marca la US como ✅ en "Qué hay hecho"
- Añade cualquier decisión de producto o lección aprendida relevante
- Actualiza `.claude/plan.md`: mueve la US de pendiente a completada en el sprint actual
- Si quedan US del sprint, indica cuál es la siguiente según el plan
