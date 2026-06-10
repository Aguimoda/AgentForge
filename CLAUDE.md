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
| Deploy, CI, pipeline, secrets, .env | **DEVOPS** |
| Incidente en producción / rollback | **DEVOPS → DOC** |
| Migraciones BD, RLS, schema | **EJ** (skill de BD del stack) **→ REV** |
| Estrategia de testing, cobertura | **QA** |
| Documentar, README, CHANGELOG | **DOC** |

**VD**=Visual Designer · **SW**=Spec Writer · **CD**=Component Designer · **EJ**=Ejecutor · **REV**=Revisor · **CON**=Consultor · **ARQ**=Arquitecto · **DEVOPS**=DevOps · **QA**=QA Strategy · **DOC**=Documentación

---

## ⚡ ENFORCEMENT — current-task.json (OBLIGATORIO antes de escribir código)

Antes de que cualquier agente escriba en `src/`, copiar `current-task.template.json`
como `.claude/current-task.json` y rellenarlo:

```json
{
  "us_id": "US-XX",
  "us_name": "Nombre de la User Story",
  "feature_path": "specs/features/[epic]/US-XX-nombre.feature",
  "current_agent": "spec-writer"
}
```

Los hooks de `.claude/settings.json` (carpeta `hooks/`) **bloquean mecánicamente**:
- Escrituras en `src/` sin `current-task.json` o sin el `.feature` en disco (`gate-task.js`)
- Colores hex hardcodeados en componentes (`gate-code-quality.js`)
- Secretos/credenciales en cualquier fichero (`gate-secrets.js`)
- Cierre de sesión con tarea activa o código sin commitear (`stop-reminder.js`)

Al hacer HANDOFF actualiza `current_agent`. Al completar la US (Revisor aprueba) → **borra el fichero**.

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
