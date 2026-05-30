---
name: compliance-checker
description: Activar cuando hay datos personales, pagos o requisitos legales. Traduce RGPD/LOPD y PCI-DSS básico a requisitos funcionales concretos — historias de usuario reales en el backlog, no solo cláusulas legales.
---

# Skill: Compliance Checker

## RGPD como requisitos funcionales

El RGPD no es solo política de privacidad — genera historias de usuario obligatorias:

### Derechos del usuario que son funcionalidades

| Derecho RGPD | Historia de usuario | Complejidad |
|--------------|---------------------|-------------|
| Derecho de acceso | "Como usuario, quiero descargar todos mis datos en formato legible" | M |
| Derecho al olvido | "Como usuario, quiero eliminar mi cuenta y todos mis datos en ≤30 días" | L |
| Portabilidad | "Como usuario, quiero exportar mis datos en formato JSON/CSV" | M |
| Rectificación | "Como usuario, quiero corregir mis datos personales" | S |
| Oposición al tratamiento | "Como usuario, quiero desactivar el uso de mis datos para marketing" | S |

### Implicaciones técnicas del RGPD

**Consentimiento:**
- Checkbox explícito (no pre-marcado) en registro
- Separar consentimiento de uso del servicio del consentimiento de marketing
- Registrar cuándo y cómo se dio el consentimiento (timestamp + versión de los T&C)

**Minimización de datos:**
- Solo recoger los datos estrictamente necesarios
- Preguntar: ¿necesitamos este campo o es "por si acaso"?

**Retención:**
- Definir cuánto tiempo se guardan los datos de cada tipo
- Borrado automático cuando expira el período de retención
- Ejemplo: logs de GPS → 90 días; datos de cuenta → hasta que el usuario elimina la cuenta

**Portabilidad técnica:**
- El endpoint de exportación debe devolver datos en formato estructurado (JSON)
- Incluir: datos del perfil, historial de portes, valoraciones, mensajes

**Eliminación en cascada:**
- Eliminar la cuenta debe borrar o anonimizar TODOS los datos relacionados
- Datos que no se pueden borrar (requerimientos legales/fiscales): anonimizar
- Ejemplo: los portes completados deben conservarse por obligación fiscal → anonimizar el usuario

## PCI-DSS básico (si hay pagos con tarjeta)

**Regla principal: nunca almacenar datos de tarjeta**

```typescript
// ❌ NUNCA almacenar en tu BD
{ numero_tarjeta: '4242424242424242', cvv: '123', caducidad: '12/28' }

// ✅ Solo almacenar el token del proveedor de pagos
{ stripe_customer_id: 'cus_xxxxx', stripe_payment_method_id: 'pm_xxxxx' }
```

**Con Stripe Connect:**
- El usuario introduce datos de tarjeta directamente en el formulario de Stripe (Stripe.js)
- Tu servidor nunca ve los datos de tarjeta — solo recibe un paymentMethodId
- Para payouts a transportistas: Stripe Connect maneja el KYC y los datos bancarios
- Tu servidor almacena: el stripe_account_id del transportista, nunca el IBAN directamente

## Checklist de compliance por proyecto

- [ ] ¿Se recopilan datos de usuarios de la UE? → RGPD aplica
- [ ] ¿Hay política de privacidad visible y actualizada?
- [ ] ¿El consentimiento es explícito y separado por finalidad?
- [ ] ¿Existe funcionalidad de eliminación de cuenta?
- [ ] ¿Existe funcionalidad de exportación de datos?
- [ ] ¿Están definidos los períodos de retención de datos?
- [ ] ¿Los logs no contienen datos personales sin necesidad?
- [ ] ¿Los datos de tarjeta los maneja solo Stripe/proveedor de pagos?
- [ ] ¿Hay un DPA (Data Processing Agreement) con los proveedores cloud?
