---
name: project-context
description: >
  Activar automáticamente en cualquier tarea del proyecto.
  Carga el contexto completo del producto: qué es, para quién, flujos críticos,
  decisiones de producto tomadas, normas relevantes y el approach SDD+BDD+TDD.
---

# Contexto del proyecto — [NOMBRE DEL PROYECTO]

> ⚠️ Este archivo es una PLANTILLA. Reemplaza todos los `[campos]` con la información de tu proyecto.
> Guárdalo en `.claude/skills/[nombre-proyecto]-context/SKILL.md`

---

## Qué es el producto

**[Nombre]** es [descripción en 1-2 frases: qué hace, para quién, en qué se diferencia].

**Diferencial clave:**
- [Qué hace que ninguna alternativa hace igual]
- [Por qué alguien lo preferiría]

**Estado del proyecto:** [Fase actual]. PRD en `docs/[nombre-del-prd].md`.

---

## Las N personas del producto

### [Nombre Persona 1] — [Arquetipo]
- [Edad, contexto, situación]
- **Quiere:** [objetivo principal]
- **Le preocupa:** [fricción o miedo principal]
- **Usa:** [qué partes del producto]

### [Nombre Persona 2] — [Arquetipo]
- …

---

## Arquitectura de experiencia

```
[Flujo principal de la app — cómo navega el usuario]
[Usa ASCII si es útil para visualizar modos/flujos]
```

---

## Flujo crítico: [nombre del flujo principal]

```
[ACTOR 1]
1. [Acción]
   └─ [Condición o detalle]

[ACTOR 2]
2. [Acción]

[SISTEMA]
3. [Qué pasa automáticamente]
```

---

## Requisitos más críticos (resumen)

### [Módulo 1]
- RF-01: [Requisito]
- RF-02: [Requisito]

### [Módulo 2]
- RF-10: [Requisito]

---

## Normas o restricciones que son requisitos funcionales

1. **[Norma 1]** — [qué implica en el código/UX]
2. **[Norma 2]** — [qué implica]

---

## Modelo de negocio (si aplica)

- **Monetización:** [cómo gana dinero el producto]
- **Comisiones/precios:** [modelo actual]

---

## Decisiones de producto tomadas (no reabrir sin motivo)

| Decisión | Valor acordado |
|----------|----------------|
| [Decisión 1] | [Valor] |
| [Decisión 2] | [Valor] |

---

## Decisiones pendientes (no implementar hasta confirmar)

| Decisión | Urgencia |
|----------|----------|
| [Decisión pendiente] | 🔴 Alta / 🟡 Media |

---

## Referencia rápida de User Stories por Épica

| Épica | IDs de US |
|-------|-----------|
| [Épica 1] | US-01 a US-10 |
| [Épica 2] | US-20 a US-29 |

**PRD completo:** `docs/[nombre-del-prd].md`
