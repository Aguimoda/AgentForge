# [Nombre del Proyecto] — Contexto para Claude Code

---

## ⚡ ROUTING — Clasificar ANTES de cualquier acción

> Cada tarea sigue una secuencia de agentes obligatoria. Leer `rules/00-dispatch.md` para la tabla completa.

| Tipo de tarea | Secuencia |
|---------------|-----------|
| Pantalla nueva / componente visual nuevo | **VD → SW → CD → REV** |
| Feature con UI + lógica | **VD → SW → CD+EJ → REV** |
| Feature solo lógica (sin UI nueva) | **SW → EJ → REV** |
| Bug fix | **EJ** (verificar .feature) **→ REV** |
| Refactor visual / auditoría de diseño | **VD → CD → REV** |
| Code review / PR | **REV** |
| Planning / sprint | **CON** → leer plan.md |
| Arquitectura | **ARQ** |

**VD**=Visual Designer · **SW**=Spec Writer · **CD**=Component Designer · **EJ**=Ejecutor · **REV**=Revisor · **CON**=Consultor · **ARQ**=Arquitecto

---

## El proyecto

[Descripción en 2-3 líneas: qué problema resuelve, para quién, en qué estado está]

## Documentos clave

| Documento | Propósito |
|-----------|-----------|
| `.claude/estado.md` | Estado actual, decisiones tomadas, lecciones aprendidas |
| `.claude/plan.md` | Planning sprint a sprint, backlog priorizado |
| `docs/VISUAL-BRIEF.md` | Fuente de verdad visual — identidad, tokens, paleta |
| `docs/[nombre-prd].md` | PRD completo — fuente de verdad de producto |
| `specs/features/` | Specs Gherkin por US |

## Stack tecnológico

- **Framework:** [Framework + versión]
- **Estilos:** [CSS framework + tokens]
- **Formularios:** [librería de formularios + validación]
- **Test unitario:** [framework de tests]
- **Test E2E:** [framework E2E]
- **BD/Auth:** [BD + ORM + Auth]

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run test         # tests unitarios
npm run test:e2e     # tests E2E
npm run lint
npx tsc --noEmit
```

## Metodología — AgentForge (SDD + BDD + TDD)

1. **Spec Gherkin primero** — `.feature` aprobado antes de tocar código
2. **Red → Green → Refactor** — un scenario a la vez
3. **Commit atómico** — por scenario completado
4. **Agentes en secuencia** — ver tabla de routing arriba

## Convenciones de código

- TypeScript: `interface` para objetos (nunca `type` alias)
- Server Components por defecto (si Next.js App Router)
- Sin barrel imports
- `aria-label` obligatorio en botones icon-only
- 4 estados en componentes con datos remotos: `empty | loading | error | success`
- Commits: `feat:` `fix:` `design:` `spec:` `test:` `docs:` `refactor:` `chore:`

## Personas

[Lista de personas del producto — ver skills/[proyecto]-context/SKILL.md para el detalle]
