---
name: gherkin-writer
description: Activar cuando se escriben o revisan escenarios BDD en Gherkin. Cubre el formato correcto, cobertura completa (feliz + errores + accesibilidad + estados de UI), steps reutilizables, y anti-patrones a evitar.
---

# Skill: Gherkin Writer

## Formato correcto

```gherkin
Feature: [Nombre de la funcionalidad — sustantivo]
  Como [persona del USER_PERSONAS — específica, no "usuario"]
  Quiero [acción concreta]
  Para [beneficio de negocio medible]

  Background:
    Given [estado común a TODOS los escenarios de este feature]
    And [otro estado común si aplica]

  @happy-path
  Scenario: [Descripción concisa en presente — qué ocurre]
    Given [estado inicial específico de este escenario]
    When [acción concreta del actor]
    Then [resultado observable y verificable automáticamente]
    And [resultado adicional]

  @edge-case
  Scenario Outline: [Descripción parametrizada]
    Given [contexto con <variable>]
    When el usuario introduce "<input>"
    Then se muestra "<error_esperado>"

    Examples:
      | input         | error_esperado              |
      | ""            | "El campo es obligatorio"   |
      | "no@es@email" | "El email no es válido"     |
      | "a@b"         | "El email no es válido"     |
```

## Cobertura obligatoria por historia

Para cada historia con UI, verificar que existen escenarios para:

| Tipo | Tag | Obligatorio |
|------|-----|-------------|
| Caso feliz completo | `@happy-path` | ✅ Siempre |
| Estado vacío (sin datos) | `@empty-state` | ✅ Si lista o contenido cargado |
| Estado de carga | `@loading-state` | ✅ Si hay llamada async |
| Error de red / servidor | `@error-state` | ✅ Siempre con datos remotos |
| Validación de inputs | `@validation` | ✅ Siempre en formularios |
| Sin permisos | `@authorization` | ✅ Si hay roles |
| Sesión expirada | `@auth` | ✅ Si requiere login |
| Accesibilidad teclado | `@a11y` | ✅ Siempre con UI |
| Flujo alternativo | `@alternative` | ✅ Si hay caminos secundarios |
| Caso de borde | `@edge-case` | ✅ Para inputs críticos |

## Reglas de escritura

### Los Given describen estado, no acciones
```gherkin
# ❌ Mal — acción en el Given
Given el usuario hace clic en "Iniciar sesión"

# ✅ Bien — estado del sistema
Given el usuario está autenticado como transportista verificado
```

### Los Then son verificables automáticamente
```gherkin
# ❌ Mal — subjetivo, no automatizable
Then la página se ve bien

# ✅ Bien — observable y verificable con Playwright
Then el texto "Porte aceptado" es visible en pantalla
And el estado del porte muestra "Aceptado"
And se envía una notificación push al remitente
```

### Los steps son reutilizables
```gherkin
# ✅ Step genérico reutilizable en múltiples features
Given el usuario "carlos@test.com" está autenticado
# vs.
Given Carlos está logueado como transportista  # ❌ Específico, no reutilizable
```

### Sin detalles de implementación en los pasos
```gherkin
# ❌ Mal — acoplado a la implementación
When el usuario hace POST a /api/portes con body {...}

# ✅ Bien — comportamiento del usuario
When el usuario publica un nuevo porte con origen "Madrid" y destino "Barcelona"
```

## Anti-patrones comunes

**El feature-dios:** un único .feature con 40 escenarios → dividir por funcionalidad
**El step-novela:** "When el usuario hace clic en el botón azul grande que está a la derecha del campo de email" → "When el usuario envía el formulario"
**El Given-acción:** usar Given para acciones del usuario → usar Given solo para estado
**Ignorar los errores:** solo escribir el caso feliz → los errores son tan importantes como el éxito
**Testar la UI, no el comportamiento:** verificar colores, posiciones, CSS → verificar que el usuario puede hacer lo que necesita hacer
