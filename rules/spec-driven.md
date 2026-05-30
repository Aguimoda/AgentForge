---
description: Reglas de Spec-Driven Development — siempre activas
alwaysApply: true
---

# Reglas fundamentales del proyecto

## El spec va antes que el código
SIEMPRE que vayas a implementar una feature:
1. El archivo .feature debe existir y estar aprobado
2. Si no existe → invocar al Spec Writer para crearlo
3. NUNCA implementar behavior que no está en el .feature

## Red → Green → Refactor
Para CADA scenario del .feature:
1. Escribir el test que falla (RED)
2. Escribir el mínimo código para que pase (GREEN)
3. Refactorizar sin romper los tests (REFACTOR)
4. Commit atómico

## Una tarea a la vez
- Implementar UN scenario a la vez
- Hacer commit antes de pasar al siguiente
- NO implementar features "de más" que no están en el spec

## Mínimo contexto necesario
Leer SOLO los archivos necesarios para la tarea actual.
No leer todo el proyecto para cada tarea pequeña.
