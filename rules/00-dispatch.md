---
description: >
  DISPATCHER MAESTRO — se ejecuta ANTES de cualquier tarea. Clasifica el tipo
  de trabajo y determina la secuencia de agentes obligatoria. Sin excepciones.
  Este archivo es el punto de entrada de todo el sistema AgentForge.
alwaysApply: true
---

# DISPATCHER — Leer antes de cualquier acción

> **REGLA ABSOLUTA:** Antes de escribir una sola línea de código, responder a una pregunta de diseño, o tomar cualquier decisión técnica → **clasificar la tarea** usando esta tabla y **seguir la secuencia exacta**.

---

## PASO 0 — Cargar contexto del proyecto

Antes de clasificar cualquier tarea, cargar:

1. **Lee `.claude/skills/devacio-context/SKILL.md`** — contexto completo del producto: personas, flujos críticos, requisitos, normas legales, decisiones ya tomadas. Sin este contexto, todas las decisiones posteriores son ciegas.

2. **Lee `.claude/estado.md`** si la tarea implica implementación o planificación — para saber en qué sprint estás, qué US están en curso y qué bloqueantes hay.

> Si ya tienes este contexto cargado de la misma sesión, no es necesario releerlo. Pero si hay dudas sobre el estado actual, releer `estado.md`.

---

## PASO 1 — Clasificar la tarea

Lee el prompt del usuario. Identifica el tipo de trabajo:

| Si el usuario pide... | Tipo | Secuencia obligatoria |
|-----------------------|------|----------------------|
| "implementa", "crea", "construye", "añade" una **pantalla nueva** o componente visual nuevo | `UI-NUEVA` | VD → SW → CD → REV |
| "implementa", "crea", "añade" una **feature con lógica** (sin UI nueva) | `FEATURE` | SW → EJ → REV |
| "implementa", "crea" una **feature con UI y lógica** | `FEATURE-UI` | VD → SW → CD+EJ → REV |
| "arregla", "fix", "corrige" un **bug** | `BUG` | EJ (verificar .feature) → REV |
| "refactoriza", "mejora visualmente", "rediseña" UI existente | `REFACTOR-UI` | VD → CD → REV |
| "revisa", "review", "audita" código o un PR | `REVIEW` | REV |
| "auditoría visual", "coherencia visual", "mejora el diseño" del sistema | `AUDIT-VD` | VD |
| "planifica", "qué sigue", "próximo sprint", "prioriza" | `PLANNING` | CON → leer plan.md |
| "arquitectura", "diseña el sistema", "qué stack" | `ARCH` | ARQ |
| "estrategia de testing", "cobertura", "qué testear" | `QA` | QA |
| "documenta", "actualiza docs", "README" | `DOCS` | DOC |
| "deploy", "CI", "pipeline", "secrets", ".env", "monitoring" | `DEVOPS` | DEVOPS |
| "incidente", "está caído", "rollback", "producción rota" | `INCIDENT` | DEVOPS → DOC |
| "migración BD", "RLS", "schema", "nueva tabla" | `DB` | EJ (skill de BD del stack) → REV |

**Abreviaturas:**
- **VD** = Visual Designer (`agents/09-visual-designer.md`)
- **SW** = Spec Writer (`agents/03-spec-writer.md`)
- **CD** = Component Designer (`agents/component-designer.md`)
- **EJ** = Ejecutor (`agents/04-ejecutor.md`)
- **REV** = Revisor (`agents/05-revisor.md`)
- **CON** = Consultor (`agents/01-consultor-producto.md`)
- **ARQ** = Arquitecto (`agents/02-arquitecto.md`)
- **QA** = QA Strategy (`agents/06-qa-strategy.md`)
- **DOC** = Documentación (`agents/08-documentacion.md`)
- **DEVOPS** = DevOps (`agents/07-devops.md`)

---

## PASO 2 — Verificar gates antes de empezar

Antes de ejecutar el primer agente de la secuencia, verificar:

```
GATE UNIVERSAL:
☐ ¿Existe docs/VISUAL-BRIEF.md?       → NO + tarea tiene UI → STOP, invocar VD primero
☐ ¿Existe el .feature aprobado?        → NO + tarea tiene código → STOP, invocar SW primero
☐ ¿CI verde (488+ tests E2E)?          → NO + tarea toca código → STOP, arreglar tests primero
```

Si un gate falla:
```
[GATE FAIL] No puedo continuar porque falta: [X]
Quién lo genera: [agente]
Acción: "[prompt exacto para desbloquearlo]"
```

---

## PASO 3 — Ejecutar la secuencia

Invocar cada agente en orden. **No saltar ninguno.** Cada agente indica su HANDOFF al terminar.

### Cómo invocar un agente

1. Lee el archivo del agente completo en `.claude/agents/[nombre].md`
2. Lee **todos los skills** que ese agente lista en su sección "Skills que invoco" — están en `.claude/skills/[categoría]/[skill].md` o `.claude/skills/[categoría]/[skill]/SKILL.md`
3. Sigue el protocolo exacto del agente, aplicando el conocimiento de los skills leídos
4. Al terminar, emite el bloque HANDOFF del agente

**Formato de HANDOFF obligatorio al terminar cada agente:**
```
✅ [NOMBRE AGENTE] completado
Output: [qué se produjo]
Siguiente: [nombre del siguiente agente o "FIN" si es el último]
Para continuar: "[prompt exacto para el siguiente agente]"
```

---

## PASO 4 — Condiciones de excepción

**Las ÚNICAS excepciones permitidas:**

| Condición | Acción permitida |
|-----------|-----------------|
| Tarea es puramente de configuración (settings, env, .gitignore) | Ejecutar directamente sin secuencia |
| Bug trivial (typo, import path) con test que ya falla + fix obvio | EJ directo sin SW si ya hay .feature |
| Pregunta teórica ("¿por qué funciona X?") | Responder directamente |
| El usuario dice explícitamente "hazlo sin seguir el proceso" | Hacerlo, pero advertir en la respuesta |

**En cualquier otro caso → seguir la secuencia sin excepción.**

---

## PASO 5 — Al terminar cualquier tarea

Siempre al finalizar:
1. Actualizar `estado.md` con el trabajo realizado (formato definido en `06-orquestacion.md`)
2. Si cambió el estado de una US → actualizar `plan.md`
3. Si se aprendió algo útil → añadir a `.claude/learnings.md` (formato en `04-learnings-automaticos.md`)
4. Indicar el siguiente paso recomendado

---

## EJEMPLO de flujo correcto

**Usuario:** "Implementa la pantalla de configuración de cuenta"

```
DISPATCH:
  Task type: UI-NUEVA (pantalla nueva con UI)
  Secuencia: VD → SW → CD → REV

GATE CHECK:
  ✅ docs/VISUAL-BRIEF.md existe
  ❌ .feature de configuración-cuenta NO existe
  → STOP. Invocar SW antes de VD porque ya hay VISUAL-BRIEF.md

ACCIÓN:
  "Actúa como el Spec Writer (agents/03-spec-writer.md).
   Escribe el .feature para la pantalla de configuración de cuenta.
   Lee: VISUAL-BRIEF.md + globals.css + ARCHITECTURE.md (sección perfil).
   Incluye: happy path, vacío, carga, error, accesibilidad."

HANDOFF al terminar SW:
  ✅ SPEC WRITER completado — specs/features/perfil/US-CFG-01.feature
  Siguiente: Component Designer
  Para continuar: "Actúa como el component-designer. Implementa la pantalla de configuración usando el .feature de specs/features/perfil/US-CFG-01.feature"
```
