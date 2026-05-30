---
name: code-reviewer
description: Activar al revisar pull requests o antes de mergear código. Define el protocolo de revisión en orden de importancia, los anti-patrones más frecuentes y los criterios de aprobación / rechazo. Complementa al agente revisor con profundidad técnica específica por lenguaje.
---

# Skill: Code Reviewer

## Protocolo de revisión — orden estricto

```
1. Corrección funcional    → ¿hace lo que debe hacer?
2. Seguridad               → ¿introduce vulnerabilidades?
3. Manejo de errores       → ¿qué pasa cuando algo falla?
4. Rendimiento             → ¿hay cuellos de botella obvios?
5. Legibilidad             → ¿se puede entender sin preguntar?
6. Tests                   → ¿están los casos importantes cubiertos?
7. Estilo y convenciones   → ¿sigue las convenciones del proyecto?
```

## Criterios de bloqueo (no mergear con esto)

```
🔴 CRÍTICO — bloquea el merge:
- Datos de usuario accesibles sin autenticación
- Secretos o credenciales en el código
- SQL injection posible (interpolación de strings en queries)
- Datos de usuario devueltos sin sanitizar
- Race conditions en operaciones financieras
- Pérdida de datos silenciosa (errores capturados y descartados)

🟡 IMPORTANTE — corrección antes del siguiente PR:
- Falta de manejo de errores en operaciones I/O
- N+1 queries en endpoints de alta frecuencia
- Funciones >50 líneas sin dividir
- Lógica de negocio compleja sin tests
- Parámetros sin validar en endpoints públicos

🟢 SUGERENCIA — mejoraría el código pero no bloquea:
- Nombres de variables que podrían ser más descriptivos
- Comentarios que explican el qué en vez del por qué
- Oportunidad de extraer función reutilizable
```

## Anti-patrones TypeScript/JavaScript más frecuentes

### Manejo de errores

```typescript
// ❌ Silenciar errores
try {
  await processPayment()
} catch (e) {
  // TODO: handle this
}

// ❌ Tipos de error demasiado amplios sin información útil
throw new Error('Something went wrong')

// ✅ Errores específicos con contexto
class PaymentError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly porteId: string
  ) {
    super(message)
    this.name = 'PaymentError'
  }
}

throw new PaymentError(
  'Stripe declined the charge',
  stripeError.code,
  porteId
)
```

### Async/await

```typescript
// ❌ Promise sin await — fire and forget silencioso
sendNotification(userId, message)  // error ignorado

// ✅ Await explícito o error handling
await sendNotification(userId, message)
// o si realmente es fire-and-forget:
sendNotification(userId, message).catch(err =>
  logger.error({ err, userId }, 'Notification failed (non-critical)')
)

// ❌ N+1 con awaits en loop
for (const porte of portes) {
  porte.usuario = await db.usuario.findById(porte.usuarioId)  // N queries
}

// ✅ Parallel con Promise.all
const usuarios = await Promise.all(
  portes.map(p => db.usuario.findById(p.usuarioId))
)
// o mejor: un solo JOIN en la query
```

### Seguridad en API routes

```typescript
// ❌ Sin verificar autenticación
export async function GET(req: Request) {
  const portes = await db.porte.findMany()  // devuelve portes de todos
  return Response.json(portes)
}

// ❌ Sin verificar autorización (autenticado != autorizado)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  // FALTA: verificar que el porte pertenece al usuario de la sesión
  await db.porte.delete({ where: { id: params.id } })
}

// ✅ Autenticación + autorización
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const porte = await db.porte.findUnique({ where: { id: params.id } })
  if (!porte) return Response.json({ error: 'Not found' }, { status: 404 })
  if (porte.usuarioId !== session.user.id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  await db.porte.delete({ where: { id: params.id } })
  return Response.json({ success: true })
}
```

### Inmutabilidad y efectos secundarios

```typescript
// ❌ Mutar parámetros — causa bugs difíciles de rastrear
function processPorte(porte: Porte) {
  porte.estado = 'procesado'  // mutación del parámetro
  return porte
}

// ✅ Retornar nuevo objeto
function processPorte(porte: Porte): Porte {
  return { ...porte, estado: 'procesado' }
}
```

## Checklist de code review

### Funcionalidad
- [ ] El código hace lo que la historia de usuario / spec describe
- [ ] Los edge cases del spec están manejados
- [ ] No hay comportamiento no especificado que podría ser un bug

### Seguridad
- [ ] Los endpoints verifican autenticación Y autorización
- [ ] Los inputs del usuario están validados (no se confía en el cliente)
- [ ] No hay interpolación de variables en queries SQL
- [ ] No hay secretos hardcoded

### Calidad
- [ ] Los errores se manejan (no se silencian)
- [ ] Los errores incluyen contexto útil para debugging
- [ ] No hay N+1 queries en rutas de alta frecuencia
- [ ] Las funciones tienen responsabilidad única (no hacen 3 cosas a la vez)
- [ ] Los nombres describen la intención (no el tipo)

### Tests
- [ ] El camino feliz está testeado
- [ ] Los casos de error principales están testeados
- [ ] Los tests no comprueban la implementación (solo el comportamiento)
