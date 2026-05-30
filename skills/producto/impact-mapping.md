---
name: impact-mapping
description: Activar cuando hay que priorizar el backlog, definir el MVP, o conectar funcionalidades con objetivos de negocio reales. Usa la técnica de Impact Mapping para separar lo que tiene impacto real de lo que es "nice to have".
---

# Skill: Impact Mapping

## Qué es y cuándo usarlo
Impact Mapping conecta cada funcionalidad con el objetivo de negocio que sirve.
Úsalo cuando: el backlog tiene demasiadas historias y hay que priorizar, el cliente pide funcionalidades sin que quede claro para qué, hay que definir el MVP, o hay debate sobre qué entra en el próximo sprint.

## El mapa

```
¿POR QUÉ?          ¿QUIÉN?           ¿CÓMO?              ¿QUÉ?
[Objetivo]    →    [Actor]     →    [Impacto]      →    [Funcionalidad]

Ej:
Aumentar          Transportistas    Más viajes            Sistema de ratings
retención         verificados       completados           visibles
30% en 6 meses
                  Remitentes        Más confianza         Tracking GPS
                  nuevos            en el servicio        en tiempo real
```

## Cómo priorizar con este mapa

1. Para cada funcionalidad del backlog, pregunta: ¿a qué objetivo sirve?
2. Si no sirve a ningún objetivo → candidato a eliminar o posponer
3. Las funcionalidades que sirven al objetivo más importante → MVP
4. Las demás → backlog ordenado por impacto

## La técnica del "¿por qué?" iterativo

Cuando un cliente pide una funcionalidad, pregunta "¿por qué?" hasta llegar a la necesidad real:

- "Quiero un botón para exportar a PDF" → ¿por qué? → "Para compartir informes" → ¿por qué? → "Mis clientes no tienen acceso al sistema" → necesidad real: **acceso para clientes externos**. La solución puede no ser un PDF.

## MoSCoW para el MVP

**Must Have:** sin esto el producto no funciona o no tiene valor
**Should Have:** añade valor significativo, pero el MVP puede vivir sin ello
**Could Have:** mejoras deseables para versiones posteriores
**Won't Have (now):** explícitamente fuera del alcance del MVP
