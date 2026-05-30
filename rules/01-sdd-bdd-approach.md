---
description: Spec-Driven Development + BDD + TDD — approach de testing y desarrollo. Siempre activo.
alwaysApply: true
---
# Regla: SDD + BDD + TDD — Approach de testing y desarrollo

> Esta regla está siempre activa. Se aplica a cualquier tarea de implementación.

## Principio fundamental

> "La especificación precede a la implementación. Nunca escribir código sin antes definir el comportamiento esperado en forma de spec ejecutable."

## Cuándo aplicar qué

### SDD (Spec Driven Development) — siempre
Antes de cualquier tarea de implementación:
1. Identificar la User Story del PRD que estás implementando (o crear una si falta)
2. Leer sus criterios de aceptación completos
3. Si la spec no existe, escribirla antes de tocar código

### BDD (Behaviour Driven Development) — en cualquier flujo de usuario
Para cualquier funcionalidad que implique interacción del usuario:
1. Traducir los criterios de aceptación a escenario(s) Gherkin
2. Guardar en `/specs/features/[epic]/[US-ID]-[nombre].feature`
3. Ejecutar con Playwright BDD → debe fallar primero
4. Implementar hasta que pase

**Formato Gherkin obligatorio:**
```gherkin
Feature: [Nombre de la funcionalidad]
  Como [persona del PRD]
  Quiero [acción]
  Para [beneficio]

  Background:
    Given [estado común a todos los escenarios]

  Scenario: [Nombre del caso — descripción clara]
    Given [estado inicial específico]
    When [acción del usuario o del sistema]
    Then [resultado observable y verificable]
    And [resultado adicional si aplica]

  Scenario: [Caso alternativo / edge case]
    Given [...]
    When [...]
    Then [...]
```

**Reglas de los escenarios Gherkin:**
- El nombre del escenario describe el comportamiento, no la implementación
- Cada `Then` debe ser verificable automáticamente
- Un escenario por comportamiento específico (no mega-escenarios)
- Los steps se reutilizan entre features cuando describen lo mismo

### TDD (Test Driven Development) — para lógica compleja
Aplicar cuando la funcionalidad incluye:
- Cálculo de tarifas, comisiones o penalizaciones
- Validación de estados del porte (máquina de estados)
- Sistema de códigos de recogida/entrega
- Timeouts y expiración de peticiones
- Reglas de negocio de cancelaciones
- Edge cases de concurrencia o race conditions

**NO aplicar TDD a:**
- Rendering de componentes simples sin lógica
- Estilos y variantes visuales
- Layouts y estructura de páginas

**Red → Green → Refactor:**
```
1. Escribir el test (Vitest) → ejecutar → FALLA (red — esperado)
2. Escribir la implementación mínima para que pase
3. Ejecutar → PASA (green)
4. Refactorizar sin romper tests
```

## Flujo completo por User Story

```
1. Leer User Story en el PRD (ID, descripción, criterios de aceptación)
2. Crear archivo .feature en /specs/features/[epic]/
3. Escribir escenarios Gherkin de los criterios de aceptación
4. Si hay lógica compleja → escribir test Vitest primero (Red)
5. Implementar funcionalidad
6. Tests en Green → la historia está implementada
7. Auditoría con Web Design Guidelines skill (accesibilidad + UX)
8. PR con referencia a la US-ID y los escenarios cubiertos
```

## Estructura de archivos de spec

```
/specs
  /features
    /auth/             → US-01 a US-10
    /modo-dual/        → US-02, US-03
    /modo-conduccion/  → US-20 a US-24
    /portes/           → US-30 a US-33
    /verificacion/     → US-50 a US-55
    /tracking/         → US-60, US-61
    /porte-activo/     → US-70 a US-73
    /cancelaciones/    → US-80 a US-83
    /valoraciones/     → US-90 a US-92
    /admin/            → US-100 a US-103
  /step-definitions/
    [implementación de los steps Gherkin]
/src/__tests__
  [tests unitarios Vitest — lógica de negocio]
```
