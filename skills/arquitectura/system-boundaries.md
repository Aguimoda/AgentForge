---
name: system-boundaries
description: Activar cuando el sistema interactúa con servicios externos (Stripe, Twilio, Google Maps, APIs de terceros). Define cómo aislar las dependencias externas para que los tests no dependan de ellas, cómo manejar sus fallos, y cómo evitar el acoplamiento.
---

# Skill: System Boundaries

## El principio
El código de negocio no debe saber qué servicio externo se usa. Solo debe conocer una interfaz (port). La implementación concreta (adapter) es intercambiable.

```
Lógica de negocio → Port (interfaz) → Adapter (implementación) → Servicio externo
```

## Ejemplo: Servicio de SMS

```typescript
// ✅ Port — la interfaz que conoce el dominio
interface SMSService {
  enviar(destinatario: string, mensaje: string): Promise<void>
}

// ✅ Adapter de producción — usa Twilio
class TwilioSMSAdapter implements SMSService {
  async enviar(destinatario: string, mensaje: string): Promise<void> {
    await twilioClient.messages.create({ to: destinatario, body: mensaje, from: '+34...' })
  }
}

// ✅ Adapter de tests — no llama a Twilio
class FakeSMSAdapter implements SMSService {
  public mensajesEnviados: Array<{ destinatario: string, mensaje: string }> = []
  async enviar(destinatario: string, mensaje: string): Promise<void> {
    this.mensajesEnviados.push({ destinatario, mensaje })
  }
}
```

## Manejo de fallos de servicios externos

### Circuit Breaker (para servicios críticos)
```typescript
// Si Stripe falla 5 veces seguidas → dejar de intentarlo durante 30s
// Previene cascadas de fallos
```

### Timeouts explícitos
```typescript
// Nunca confiar en el timeout por defecto del servicio externo
const response = await stripe.charges.create(data, {
  timeout: 10000, // 10 segundos máximo
})
```

### Retries con backoff exponencial
```typescript
// Para operaciones idempotentes (GET, algunos POST)
// Reintentar: 1s → 2s → 4s → 8s → fallo definitivo
```

### Fallback graceful
```typescript
// Si el servicio de tracking de precio falla → mostrar "Precio no disponible"
// No romper el flujo principal por un servicio secundario
```

## Inventario de servicios externos (hacer por proyecto)

| Servicio | Para qué | Criticidad | ¿Tiene fallback? | Timeout |
|----------|----------|------------|------------------|---------|
| Stripe | Pagos | CRÍTICA | No (sin pago no hay porte) | 30s |
| Twilio | SMS código entrega | ALTA | Email alternativo | 10s |
| Google Maps | Deep link navegación | MEDIA | Waze como alternativa | 5s |
| Sentry | Error tracking | BAJA | El servicio sigue sin él | 2s |

## Tests con servicios externos

```typescript
// ✅ Tests unitarios — usar el FakeAdapter
describe('PorteService', () => {
  const smsFake = new FakeSMSAdapter()
  const service = new PorteService(smsFake)

  it('envía SMS al destinatario al generar código de entrega', async () => {
    await service.generarCodigoEntrega(porte, '+34600000000')
    expect(smsFake.mensajesEnviados).toHaveLength(1)
    expect(smsFake.mensajesEnviados[0].destinatario).toBe('+34600000000')
  })
})

// ✅ Tests de integración — usar sandbox/test mode del servicio real
// Stripe tiene modo test, Twilio tiene sandbox, etc.
// NUNCA usar credenciales de producción en tests
```
