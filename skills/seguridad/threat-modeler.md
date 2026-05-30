---
name: threat-modeler
description: Activar en Fase 0 y cuando se diseña cualquier flujo con datos sensibles, pagos o autenticación. STRIDE aplicado a los flujos críticos del sistema para identificar amenazas antes de implementar.
---

# Skill: Threat Modeler

## STRIDE por flujo crítico

Para cada flujo crítico del sistema, evalúa las 6 categorías:

| Letra | Amenaza | Pregunta |
|-------|---------|----------|
| **S** | Spoofing | ¿Puede alguien hacerse pasar por otro usuario/sistema? |
| **T** | Tampering | ¿Puede alguien modificar datos en tránsito o en reposo? |
| **R** | Repudiation | ¿Puede alguien negar haber realizado una acción? |
| **I** | Info Disclosure | ¿Puede alguien acceder a datos que no le corresponden? |
| **D** | Denial of Service | ¿Puede alguien hacer el sistema inaccesible? |
| **E** | Elevation of Privilege | ¿Puede alguien obtener más permisos de los que tiene? |

## Ejemplo: Flujo de verificación con códigos (De Vacío)

```
Flujo: Transportista introduce código de recogida

S — Spoofing:
  Amenaza: Alguien intercepta el código SMS y lo introduce antes que el destinatario real
  Mitigación: El código es de un solo uso, expira en 30 min, requiere estar geolocalizando en el porte activo

T — Tampering:
  Amenaza: El código en tránsito (SMS) es interceptado y modificado
  Mitigación: HTTPS para la API; el SMS es texto plano (riesgo aceptado, documentado)

R — Repudiation:
  Amenaza: El transportista niega haber introducido el código
  Mitigación: El evento "CodigoIntroducido" se registra con timestamp, IP y userId en log inmutable

I — Info Disclosure:
  Amenaza: El código de otro usuario se filtra por error de lógica
  Mitigación: El código se genera y se envía al teléfono del destinatario, nunca al transportista directamente

D — Denial of Service:
  Amenaza: Automatizar intentos de código para bloquear un porte
  Mitigación: Rate limiting de 5 intentos por código; bloqueo de 15 min tras fallos

E — Elevation of Privilege:
  Amenaza: Un remitente intenta introducir el código de recogida haciéndose pasar por transportista
  Mitigación: El endpoint verifica que el userId autenticado coincide con el transportistaId del porte
```

## Output del threat modeling

Para cada flujo crítico, producir:

```markdown
## Análisis de amenazas: [Nombre del flujo]

### Amenazas identificadas

| ID | Categoría | Descripción | Probabilidad | Impacto | Mitigación | Estado |
|----|-----------|-------------|-------------|---------|------------|--------|
| T01 | Spoofing | ... | Media | Alto | ... | Mitigado |
| T02 | Tampering | ... | Baja | Alto | ... | Riesgo aceptado |

### Decisiones de diseño derivadas
- [Qué cambios en la arquitectura o implementación resultan del análisis]

### Riesgos aceptados
- [Qué amenazas se aceptan conscientemente y por qué]
```

## Flujos que siempre necesitan threat modeling
- Autenticación y registro
- Pagos y datos financieros
- Cualquier flujo con datos personales (DNI, IBAN, ubicación)
- APIs públicas o webhooks
- Subida de archivos
- Cambio de contraseña / recuperación de cuenta
