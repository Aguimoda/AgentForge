---
name: adr-writer
description: Activar cuando se va a tomar una decisión tecnológica importante. Un ADR (Architecture Decision Record) documenta el contexto, la decisión tomada, las alternativas consideradas y las consecuencias. Sin ADR, las decisiones se olvidan y se repiten debates.
---

# Skill: ADR Writer

## Formato de un ADR

```markdown
# ADR-[NNN]: [Título de la decisión — verbo + sustantivo]

## Estado
Propuesto | Aprobado | Rechazado | Deprecado | Supersedido por ADR-NNN

## Fecha
YYYY-MM-DD

## Contexto
[Por qué hay que tomar esta decisión ahora.
Qué restricciones la condicionan (NFRs, tiempo, equipo, presupuesto).
Qué pasaría si no se decide.]

## Decisión
[Qué se ha decidido. Una sola frase clara.
Por ejemplo: "Usamos Supabase como base de datos y proveedor de autenticación."]

## Justificación
[Por qué esta opción y no las demás.
Conectar con los requisitos y restricciones del contexto.]

## Alternativas consideradas

| Opción | Pros | Contras | Por qué se descartó |
|--------|------|---------|---------------------|
| [Opción A] | | | |
| [Opción B] | | | |

## Consecuencias

### Positivas
- [Qué se facilita con esta decisión]

### Negativas / Trade-offs
- [Qué se complica o qué se renuncia]

### Riesgos
- [Qué puede salir mal y cómo se mitigará]

## Revisión
[Cuándo tiene sentido reconsiderar esta decisión.
Por ejemplo: "Si el proyecto supera 100.000 usuarios activos mensuales"
o "Si el equipo backend crece a más de 3 personas"]
```

## Cuándo crear un ADR

**Siempre:**
- Elección de stack principal (frontend, backend, BD, auth)
- Elección de proveedor cloud o de servicios externos
- Decisión de arquitectura (monolito vs microservicios, SSR vs SPA)
- Estrategia de autenticación y autorización
- Estrategia de deploy e infraestructura

**Cuando hay debate o duda:**
- Cuando dos o más personas tienen opiniones distintas
- Cuando la decisión es difícil de revertir
- Cuando la decisión tiene implicaciones de coste o seguridad

**No es necesario para:**
- Decisiones de implementación que no afectan a la arquitectura
- Elección de librerías pequeñas y fácilmente reemplazables
- Convenciones de estilo de código (para eso está el linter)

## Numeración
ADR-001, ADR-002... en orden cronológico.
Nunca renuméres ni elimines ADRs — si una decisión cambia, crea un nuevo ADR que supersede al anterior.
