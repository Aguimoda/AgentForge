---
name: user-story-writer
description: Activar cuando se escribe o refina una historia de usuario. Sabe el formato INVEST correcto, cómo escribir criterios de aceptación medibles, cómo dividir historias demasiado grandes, y cómo detectar anti-patrones como historias técnicas disfrazadas de negocio.
---

# Skill: User Story Writer

## Formato correcto de una User Story

```
Como [persona concreta del USER_PERSONAS.md]
Quiero [acción específica que puedo realizar]
Para [beneficio de negocio real y medible]

Criterios de aceptación:
- DADO [contexto/estado inicial]
  CUANDO [acción del usuario]
  ENTONCES [resultado observable y verificable]
```

## Principios INVEST

Cada historia debe cumplir:
- **I**ndependiente — puede implementarse sin esperar a otra
- **N**egociable — los detalles se pueden ajustar
- **V**aliosa — aporta valor al usuario, no solo a la técnica
- **E**stimable — se puede estimar el esfuerzo
- **S**mall — cabe en un sprint (max 5-8 días)
- **T**esteable — se puede verificar automáticamente

## Cómo dividir historias grandes (Story Splitting)

**Por flujo de trabajo:** divide por pasos del proceso
**Por reglas de negocio:** implementa primero el caso simple, luego los casos complejos
**Por variaciones de datos:** implementa para un tipo de dato, luego los demás
**Por roles de usuario:** implementa para un rol, luego los demás
**Por operaciones CRUD:** Leer → Crear → Actualizar → Eliminar (en ese orden de valor)

## Anti-patrones a detectar y corregir

❌ **Historia técnica disfrazada:** "Como desarrollador, quiero refactorizar el módulo de auth"
→ Pregunta: ¿qué valor de negocio aporta esto al usuario? Si no hay respuesta clara, no es una historia.

❌ **Historia sin criterio verificable:** "Como usuario, quiero que la app sea rápida"
→ Reescribe: "Como usuario, quiero que la lista de portes cargue en menos de 2 segundos en conexión 4G"

❌ **Historia con AND:** "Como usuario, quiero registrarme Y verificar mi email Y configurar mi perfil"
→ Divide en 3 historias independientes.

❌ **Historia sin persona real:** "Como usuario del sistema..."
→ Especifica: "Como transportista verificado..." o "Como remitente nuevo..."

## Estimación de complejidad

S (1-2 días): una pantalla simple, sin lógica de negocio compleja, sin integraciones externas
M (3-5 días): lógica de negocio moderada o integración con un servicio externo
L (1-2 semanas): flujo complejo con múltiples estados, varias integraciones, o mucha lógica de negocio
XL: dividir en sub-historias antes de estimar
