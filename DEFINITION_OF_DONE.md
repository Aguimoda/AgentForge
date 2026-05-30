# Definition of Done — De Vacío

> Fuente única de verdad. Referenciada desde: `04-ejecutor.md`, `06-qa-strategy.md`, `rules/01-sdd-bdd-approach.md`
>
> Una User Story está DONE cuando **todos** los ítems de su fase están marcados.

---

## Fase 1 — BDD READY (antes de escribir código)

- [ ] Existe el `.feature` aprobado por el humano en `specs/features/[épica]/[US-ID]-[nombre].feature`
- [ ] El `.feature` tiene escenarios para: happy path, estado vacío, estado de carga, errores de red/validación, accesibilidad (teclado + lector de pantalla)
- [ ] Los fixtures/factories necesarios están definidos en `specs/[US-ID]-fixtures.ts` (si aplica)
- [ ] Si tiene UI: `docs/VISUAL-BRIEF.md` existe y está aprobado

---

## Fase 2 — IMPLEMENTATION (código en verde)

**Funcionalidad:**
- [ ] Todos los escenarios BDD del `.feature` pasan en verde (`npm run test:e2e`)
- [ ] Los tests unitarios Vitest pasan (si hay lógica de negocio compleja)
- [ ] TypeScript sin errores (`npx tsc --noEmit` limpio)
- [ ] Sin `console.log` en el código
- [ ] Sin `any` en TypeScript sin comentario explicativo

**UI (si la US tiene componentes visuales):**
- [ ] Tokens OKLCH de `globals.css` (no colores hex hardcodeados)
- [ ] Mobile testado visualmente a 375px
- [ ] Touch targets ≥ 44px (≥ 64px en Modo Conducción)
- [ ] 4 estados implementados: `empty | loading | error | success` (si datos remotos)
- [ ] `aria-label` en todos los botones icon-only
- [ ] Focus ring visible (`focus-visible:ring`)
- [ ] HTML semántico (`<button>` para acciones, `<a>` para navegación, `<nav>` etc.)
- [ ] Indicadores de estado con icono + color + texto (nunca solo color)
- [ ] Modales/sheets usan `<BottomSheet>` existente (no inline `role="dialog"` nuevo)
- [ ] `prefers-reduced-motion` respetado si hay animaciones
- [ ] `'use client'` solo donde necesario

**Seguridad:**
- [ ] Inputs del usuario validados con Zod antes de usar
- [ ] Sin secrets ni credenciales en el código
- [ ] Endpoints protegidos con auth/auth (cuando haya backend)

---

## Fase 3 — REVIEW (Revisor aprueba)

- [ ] Revisor ha revisado en los 6 niveles (`05-revisor.md`)
- [ ] Sin hallazgos 🔴 CRÍTICO pendientes
- [ ] CI en verde (tests E2E + type-check + lint)
- [ ] PR aprobado (cuando haya GitHub configurado)

---

## Fase 4 — DONE (sincronización)

- [ ] `estado.md` actualizado: US marcada como ✅ con count de tests
- [ ] `plan.md` actualizado: US marcada como ✅ Completo con notas
- [ ] Learnings del sprint capturados en `.claude/learnings.md` (si aplica)
- [ ] Commit atómico con mensaje `feat: [US-ID] descripción`

---

## Quick checklist — para el Revisor (nivel 1)

Para aprobar rápido sin leer el full DoD:

```
☐ .feature existe y todos los scenarios pasan?  → NO: 🔴
☐ TypeScript limpio?                             → NO: 🔴
☐ Sin console.log ni secrets?                    → NO: 🔴
☐ aria-label en botones icon-only?               → NO: 🔴
☐ Contraste ≥4.5:1?                              → NO: 🔴
☐ Hex hardcodeado en CSS?                        → NO: 🔴
☐ Nuevo modal sin BottomSheet?                   → Sí: 🟡
☐ Estado solo con color (sin icono+texto)?       → Sí: 🔴
```
