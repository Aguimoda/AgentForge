---
description: Carga automática del contexto completo del proyecto. Activo en cualquier tarea sin excepción.
alwaysApply: true
---

# Contexto del proyecto — siempre activo

Lee `.claude/skills/[nombre-proyecto]-context/SKILL.md` **antes de cualquier tarea** en este proyecto.

> ⚠️ Sustituye `[nombre-proyecto]` con el nombre real de tu proyecto.
> El skill debe estar en `.claude/skills/[nombre-proyecto]-context/SKILL.md`

El skill debe contener: qué es el producto, las personas del producto, flujos críticos, requisitos funcionales clave, normas que son requisitos, modelo de negocio, y las decisiones de producto ya tomadas que NO se reabren sin motivo explícito.

---

## Por qué esta regla existe

Sin contexto del producto, Claude toma decisiones en el vacío:
- Implementa UX que no cuadra con las personas reales
- Sugiere arquitectura que choca con decisiones ya tomadas
- Escribe specs de Gherkin con actores genéricos en lugar de las personas del producto
- Propone soluciones que contradicen restricciones legales o de negocio

Esta regla garantiza que **todo agente, en cualquier tarea**, opera con el contexto correcto.

---

## Al configurar este repositorio en un nuevo proyecto

1. Copia `skills/project-context/SKILL.md` como base
2. Renómbrala a `skills/[tu-proyecto]-context/SKILL.md`
3. Rellena todos los campos `[entre corchetes]`
4. Actualiza este archivo reemplazando `[nombre-proyecto]` con el nombre real
5. Aprueba el skill con el equipo antes de empezar a implementar
