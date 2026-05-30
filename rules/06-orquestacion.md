---
description: >
  Orquestación de agentes — gates de entrada, transmisión de contexto y sincronización de
  estado. Siempre activo. Incluye el gate de diseño UI/UX que requiere Visual Designer +
  ui-ux-pro-max antes de cualquier implementación visual.
alwaysApply: true
---

# Regla: Orquestación de AgentForge

## Qué documento leer y cuándo

`estado.md` y `plan.md` tienen propósitos distintos. No leer los dos siempre — leer el que corresponde.

### Lee `estado.md` cuando:
- Al empezar cualquier tarea de implementación
- Antes de invocar al Ejecutor o al Revisor
- Cuando el humano da un prompt ambiguo ("implementa lo siguiente")
- Para saber qué hay hecho y qué decisiones ya están tomadas
- Para detectar bloqueantes activos

### Lee `plan.md` cuando:
- Al planificar un sprint o priorizar trabajo
- Cuando el humano pregunta "¿qué hacemos ahora?"
- Para verificar dependencias entre US antes de empezar una

### No leas ninguno cuando:
- La tarea es técnica y puntual (arreglar un bug concreto, test específico)
- El humano ya ha dado todo el contexto en el prompt
- Estás en medio de un ciclo Red→Green→Refactor

---

## Gates de entrada por agente

### Arquitecto — antes de diseñar:
- ¿Existe docs/REQUIREMENTS.md? → NO: STOP. Pedir al Consultor primero.

### Spec Writer — antes de escribir el .feature:
- ¿Existe la User Story con criterios de aceptación? → NO: STOP. Invocar Consultor.
- ¿Existe docs/ARCHITECTURE.md? → NO: STOP. Invocar Arquitecto.
- ¿La historia tiene UI y no hay docs/VISUAL-BRIEF.md? → **STOP** (no solo advertencia). Invocar Visual Designer.

### Visual Designer — antes de aprobar tokens:
- ¿Existe REQUIREMENTS.md? → NO: STOP. Pedir al Consultor.
- ¿Se ha leído `ui-ux-pro-max/SKILL.md`? → NO: leer antes de cualquier decisión visual.
- ¿Todos los pares de contraste pasan WCAG AA? → NO: STOP. Ajustar antes de aprobar.

### Component Designer — antes de implementar:
- ¿Existe docs/VISUAL-BRIEF.md? → NO: STOP. Invocar Visual Designer primero.
- ¿Existe el .feature aprobado? → NO: STOP. Invocar Spec Writer primero.
- ¿Se ha leído `ui-ux-pro-max/SKILL.md`? → NO: leer antes de implementar.

### Ejecutor — antes de escribir código:
- ¿Existe el .feature aprobado? → NO: STOP. "Invocar Spec Writer para [US-ID] primero."
- ¿El .feature tiene solo el happy path? → STOP. Pedir al Spec Writer que añada errores + accesibilidad.
- ¿La US tiene UI y no hay VISUAL-BRIEF.md? → STOP. Invocar Visual Designer.
- ¿Los tests BDD están en rojo? → Ejecutarlos ahora. Si ya pasan, verificar con el humano.

### Revisor — antes de revisar:
- ¿El PR referencia una US-ID? → NO: pedirla al autor.
- ¿Existe el .feature correspondiente? → NO: 🔴 CRÍTICO. No aprobar.
- ¿CI verde? → NO: devolver al Ejecutor sin revisar.
- ¿El código tiene hex hardcodeado o emojis como iconos UI? → 🔴 en nivel 6 (Diseño UX).

### Cualquier agente — si falta un input obligatorio:
No adivinar. Producir:
```
[GATE FAIL] No puedo continuar porque falta: [X]
Quién lo genera: [agente]
Cómo invocarlo: "[prompt exacto]"
```

---

## Flujo completo de una User Story con UI

```
1. CONSULTOR → User Story aprobada con criterios de aceptación
       ↓
2. ARQUITECTO → ARCHITECTURE.md (si no existe)
       ↓
3. VISUAL DESIGNER → VISUAL-BRIEF.md + tokens en globals.css
   - Lee ui-ux-pro-max/SKILL.md
   - Verifica WCAG AA en todos los pares
   - Aprobación humana [GATE]
       ↓
4. SPEC WRITER → .feature Gherkin (happy path + errores + accesibilidad + UI states)
   - Lee VISUAL-BRIEF.md si la US tiene UI
   - Aprobación humana [GATE]
       ↓
5. COMPONENT DESIGNER → componente implementado
   - Lee ui-ux-pro-max/SKILL.md (PRIMERO)
   - Lee VISUAL-BRIEF.md + globals.css
   - Red → Green → Refactor
   - Completa checklist pre-entrega
       ↓ (o EJECUTOR si no es solo UI)
5b. EJECUTOR → lógica de negocio + componentes
   - Lee .feature + fragmento ARCHITECTURE.md
   - Red → Green → Refactor por scenario
   - Commit atómico por scenario
       ↓
6. REVISOR → code review en 6 niveles
   - Nivel 1: Corrección funcional (BDD)
   - Nivel 2: Seguridad
   - Nivel 3: Accesibilidad (WCAG AA)
   - Nivel 4: Performance
   - Nivel 5: Calidad de código
   - Nivel 6: Diseño UX (ui-ux-pro-max checklist)
   - 🔴 CRÍTICO → devolver al autor
       ↓
7. DOCUMENTACIÓN → actualizar estado.md + learnings.md
```

---

## Contexto mínimo obligatorio por agente

**Visual Designer** lee antes de trabajar:
- REQUIREMENTS.md — usuarios y emociones del producto
- `.claude/skills/uxui/ui-ux-pro-max/SKILL.md` — reglas de diseño priorizadas
- VISUAL-BRIEF.md existente (si actualiza proyecto)

**Spec Writer** lee antes de escribir el .feature:
- La User Story específica (docs/fase2_definicion_requisitos.md)
- docs/ARCHITECTURE.md — modelo de datos y endpoints relevantes
- docs/VISUAL-BRIEF.md si la historia tiene UI
- docs/discovery/NFRs.md si existe

**Component Designer** lee antes de implementar:
- `.claude/skills/uxui/ui-ux-pro-max/SKILL.md` — PRIMERO SIEMPRE
- docs/VISUAL-BRIEF.md
- src/app/globals.css — tokens actuales
- El .feature de la US
- Componentes similares en src/components/

**Ejecutor** lee solo lo necesario:
- El .feature de esta tarea
- El fragmento de ARCHITECTURE.md de la capa que toca
- El endpoint de openapi.yaml si toca API
- Los ADRs relevantes

**Revisor** lee para cada PR:
- El diff completo + el .feature que implementa
- La sección de ARCHITECTURE.md relevante
- docs/SECURITY.md si existe
- `.claude/skills/uxui/ui-ux-pro-max/SKILL.md` para nivel 6 (Diseño UX)

---

## Ambigüedad entre documentos

Si un agente encuentra contradicción entre documentos, no adivinar:
```
[AMBIGÜEDAD] [documento A] dice "[X]" pero [documento B] dice "[Y]".
Impacto: si asumo X haré A; si asumo Y haré B.
Quién resuelve: [humano / agente específico]
```

---

## Actualizar al terminar

**Actualiza `estado.md`** cuando:
- Se completa o avanza una US
- Se toma una decisión de producto no obvia
- Se descubre una lección aprendida
- Hay un bloqueante nuevo

**Actualiza `plan.md`** cuando:
- Una US cambia de estado
- Se descubre una dependencia nueva
- Cambia la prioridad del sprint
- Se completa un sprint

**Actualiza `learnings.md`** cuando:
- Un patrón de diseño funcionó especialmente bien
- Una regla de ui-ux-pro-max evitó un problema concreto
- Un anti-patrón fue detectado en el Revisor que no estaba documentado

Formato de entrada en `estado.md`:
```
### [Agente] — [fecha] — [US-ID o tarea]
Output: [archivos generados o modificados]
Decisiones: [solo las no obvias]
Aprobación: ✅ / ❌ / 🔄 Pendiente
Siguiente paso: [agente] — "[prompt exacto para invocarlo]"
```
