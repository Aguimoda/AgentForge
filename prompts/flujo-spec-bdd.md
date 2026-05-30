# Flujo: Escribir especificación Gherkin desde User Story

Usa este prompt cuando quieras traducir una User Story del PRD a escenarios Gherkin ejecutables.

---

## Prompt

```
Quiero escribir la especificación BDD para la User Story [US-ID] del PRD.

Antes de escribir los escenarios:
1. Lee la User Story completa del PRD (docs/fase2_definicion_requisitos.md), incluyendo criterios de aceptación
2. Identifica todos los escenarios posibles: caso feliz, casos alternativos y edge cases
3. Para cada escenario, asegúrate de que el "Then" es verificable automáticamente con Playwright

Genera el archivo .feature con:
- Feature con el título de la épica
- Historia en formato "Como / Quiero / Para"
- Background si hay estado común
- Scenario para cada criterio de aceptación y edge case relevante
- Steps reutilizables cuando sea posible

Ruta del archivo: specs/features/[epic]/[US-ID]-[nombre-kebab-case].feature

Escenarios que quiero cubrir en esta sesión: [lista o "todos los de la US"]
```

---

## Ejemplo de uso

```
Quiero escribir la especificación BDD para la User Story US-53 del PRD
(código de entrega al destinatario distinto al remitente).

Genera el archivo .feature con todos los escenarios: 
- Caso feliz: destinatario introduce código correcto
- Edge case: código incorrecto
- Edge case: destinatario no tiene la app (código por SMS)
- Edge case: conductor intenta marcar entregado sin código
```

---

## Estructura de carpetas de specs

```
specs/features/
  auth/              → US-01 a US-10
  modo-dual/         → US-02, US-03
  modo-conduccion/   → US-20 a US-24
  portes/            → US-30 a US-33
  verificacion/      → US-50 a US-55
  tracking/          → US-60, US-61
  porte-activo/      → US-70 a US-73
  cancelaciones/     → US-80 a US-83
  valoraciones/      → US-90 a US-92
  admin/             → US-100 a US-103
```
