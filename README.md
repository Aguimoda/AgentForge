# AgentForge — Sistema de Agentes para Claude Code

Un sistema de orquestación de agentes especializados para desarrollo de producto con Claude Code. Implementa la metodología **SDD + BDD + TDD** con handoffs automáticos entre agentes.

## Qué es

AgentForge es la carpeta `.claude/` que va dentro de cualquier proyecto. Contiene:

- **11 agentes especializados** — cada uno con un rol concreto, protocolo de trabajo, y handoff al siguiente
- **Skills de dominio** — conocimiento especializado que los agentes leen en el momento exacto que lo necesitan
- **Reglas siempre activas** — dispatcher maestro, gates de calidad, contexto del proyecto auto-cargado
- **Definition of Done** — única fuente de verdad para saber cuándo una tarea está realmente terminada

## Los 11 agentes

| # | Agente | Rol | Activa cuando... |
|---|--------|-----|-----------------|
| 01 | **Consultor de Producto** | Define User Stories y criterios de aceptación | "nueva idea", "qué construyo", "planifica" |
| 02 | **Arquitecto** | Diseña el sistema, ADRs, modelo de datos | "qué stack", "arquitectura", "ADR" |
| 03 | **Spec Writer** | Escribe specs Gherkin antes de cualquier código | "escribe el .feature", "define el comportamiento" |
| 04 | **Ejecutor** | Implementa código siguiendo Red→Green→Refactor | "implementa", "construye", "añade" |
| 05 | **Revisor** | Code review en 6 niveles antes de mergear | "revisa", "review", "audita" |
| 06 | **QA Strategy** | Define estrategia de testing y cobertura | "estrategia de testing", "cobertura" |
| 07 | **DevOps** | CI/CD, entornos, monitoring, runbooks | "CI", "pipeline", "deploy" |
| 08 | **Documentación** | Mantiene docs sincronizados con el código | "documenta", "README", "cierre de sprint" |
| 09 | **Visual Designer** | Define identidad visual, tokens, VISUAL-BRIEF | "diseña", "identidad visual", auditoría UX |
| CD | **Component Designer** | Implementa componentes UI con design system | "crea componente", "implementa pantalla" |
| PR | **PR Reviewer** | Alias del Revisor para revisiones de PR | "revisa el PR" |

## Secuencias de trabajo

El dispatcher (`rules/00-dispatch.md`) clasifica cada tarea y aplica la secuencia correcta:

```
Pantalla nueva:    VD → SW → CD → REV
Feature UI+lógica: VD → SW → CD+EJ → REV
Feature solo lógica:    SW → EJ → REV
Bug fix:                EJ (verificar .feature) → REV
Refactor visual:   VD → CD → REV
```

## Skills incluidas

### UX/UI
- `ui-ux-pro-max` — 10 categorías de reglas priorizadas (Accesibilidad CRÍTICO → Charts BAJO)
- `visual-research` — protocolo de análisis de referentes del sector
- `brand-identity` — psicología del color, tipografía, identidad visual
- `design-system-builder` — tokens semánticos, componentes
- `accessibility-auditor` — WCAG 2.1 AA completo
- `mobile-first-designer` — coherencia 375px→1280px+
- `ux-flows` — mapeo de flujos de navegación

### BDD / Testing
- `gherkin-writer` — formato, cobertura, anti-patrones
- `test-data-factory` — factories, fixtures, estados de borde

### Arquitectura
- `adr-writer`, `api-designer`, `state-machine-designer`
- `system-boundaries`, `domain-modeler`

### Calidad
- `code-reviewer`, `refactoring-guide`

### Seguridad
- `security-reviewer`, `threat-modeler`, `compliance-checker`

### Performance
- `performance-auditor`, `load-testing`, `observability-designer`

### CI/CD
- `ci-cd-designer`, `environment-manager`, `rollback-strategist`, `dependency-manager`

### Producto
- `user-story-writer`, `nfr-elicitor`, `event-storming`, `impact-mapping`

### Skills adicionales (Bencium)
- `bencium-bencium-controlled-ux-designer` — sistema de diseño controlado
- `bencium-bencium-impact-designer` — diseño orientado a impacto
- `bencium-human-architect-mindset` — arquitectura centrada en personas
- `bencium-design-audit` — auditoría de diseño estructurada
- `bencium-typography` — tipografía avanzada con CSS
- `bencium-insurgent-campaign` — estrategia de lanzamiento
- `bencium-adaptive-communication` — comunicación adaptativa
- `bencium-negentropy-lens` — marco de análisis sistémico
- `bencium-renaissance-architecture` — arquitectura de sistemas complejos
- `bencium-vanity-engineering-review` — detectar trabajo sin impacto real

### Skills Vercel
- `vercel-react-best-practices` — 150+ reglas de React/Next.js
- `vercel-composition-patterns` — compound components, context, state
- `vercel-react-view-transitions` — View Transitions API
- `vercel-react-native-skills` — React Native con Reanimated
- `vercel-vercel-optimize` — optimización de deployments en Vercel
- `vercel-vercel-cli-with-tokens` — CLI de Vercel
- `vercel-web-design-guidelines` — directrices de diseño web

## Instalación en un proyecto nuevo

### 1. Clonar AgentForge en tu proyecto

```bash
# Desde la raíz de tu proyecto
git clone https://github.com/Aguimoda/AgentForge.git .claude
rm -rf .claude/.git  # desconectar del repo de AgentForge
```

### 2. Configurar el contexto del proyecto

```bash
# Renombrar la plantilla de contexto
cp .claude/skills/project-context/SKILL.md \
   .claude/skills/[tu-proyecto]-context/SKILL.md

# Editar con la información de tu proyecto
# Rellenar todos los campos [entre corchetes]
```

### 3. Actualizar las referencias al proyecto

Editar estos archivos con el nombre y stack de tu proyecto:
- `.claude/CLAUDE.md` — routing + stack + personas
- `.claude/rules/07-project-context.md` — apuntar a `[tu-proyecto]-context`
- `.claude/rules/00-dispatch.md` — verificar que las rutas de agentes son correctas

### 4. Crear los archivos de estado del proyecto

```bash
# Crear archivos de estado (vacíos, para que los rellene Claude)
touch .claude/estado.md
touch .claude/plan.md
touch .claude/learnings.md
```

### 5. Verificar que Claude Code los carga

Abre Claude Code en tu proyecto y ejecuta:
```
¿Qué agentes tienes disponibles?
```
Claude debe responder listando los 11 agentes y el dispatcher.

---

## Estructura de carpetas

```
.claude/
├── CLAUDE.md                    ← Instrucciones principales para Claude Code
├── DEFINITION_OF_DONE.md        ← DoD única fuente de verdad
├── estado.md                    ← Estado actual del proyecto (por sprint)
├── plan.md                      ← Planning de sprints y backlog
├── learnings.md                 ← Decisiones y aprendizajes del equipo
├── agents/
│   ├── 01-consultor-producto.md
│   ├── 02-arquitecto.md
│   ├── 03-spec-writer.md
│   ├── 04-ejecutor.md
│   ├── 05-revisor.md
│   ├── 06-qa-strategy.md
│   ├── 07-devops.md
│   ├── 08-documentacion.md
│   ├── 09-visual-designer.md
│   ├── component-designer.md
│   └── pr-reviewer.md
├── rules/
│   ├── 00-dispatch.md           ← Router maestro (alwaysApply)
│   ├── 01-sdd-bdd-approach.md   ← Spec → BDD → TDD (alwaysApply)
│   ├── 02-accesibilidad-mobile-first.md
│   ├── 03-no-ai-slop-design.md
│   ├── 04-learnings-automaticos.md
│   ├── 05-visual-designer-checkpoint.md
│   ├── 06-orquestacion.md
│   ├── 07-project-context.md    ← Auto-carga contexto del proyecto
│   ├── 07-produccion-checklist.md
│   ├── security.md
│   └── spec-driven.md
└── skills/
    ├── project-context/         ← PLANTILLA — copiar y rellenar
    ├── uxui/
    ├── bdd/
    ├── arquitectura/
    ├── calidad/
    ├── seguridad/
    ├── performance/
    ├── cicd/
    ├── producto/
    ├── datos/
    ├── documentacion/
    ├── bencium-*/               ← Skills Bencium
    └── vercel-*/                ← Skills Vercel
```

---

## Filosofía del sistema

**El dispatcher es el cerebro.** Antes de cualquier acción, clasifica la tarea y determina qué agentes deben ejecutarse y en qué orden. No hay creatividad en el routing — hay disciplina.

**Los agentes no improvisan.** Cada agente tiene un protocolo fijo, lee skills específicas en momentos concretos, y termina con un HANDOFF explícito al siguiente agente.

**Las skills son el conocimiento.** No están en los agentes para mantenerlos pequeños y reutilizables. Se leen en el momento exacto que se necesitan, no al inicio del día.

**La spec precede al código.** Siempre. Sin `.feature` aprobado, el Ejecutor no puede empezar.

**El contexto del producto es sagrado.** La regla `07-project-context.md` con `alwaysApply: true` garantiza que Claude siempre conoce el producto antes de actuar.
