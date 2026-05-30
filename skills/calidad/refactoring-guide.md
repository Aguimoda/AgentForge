---
name: refactoring-guide
description: Activar cuando hay deuda técnica que limpiar o código que huele mal. Define cuándo refactorizar vs reescribir, los patrones de refactoring más útiles y cómo hacerlo de forma segura (sin romper nada en producción).
---

# Skill: Refactoring Guide

## Cuándo refactorizar vs cuándo reescribir

```
Refactorizar (mejorar sin cambiar comportamiento):
✅ El código funciona pero es difícil de leer o extender
✅ Hay duplicación clara que causa bugs cuando se actualiza en un sitio pero no en otro
✅ Una función hace demasiadas cosas (>50 líneas, múltiples responsabilidades)
✅ Tests cubren el comportamiento actual (red de seguridad)

Reescribir (sustituir completamente):
⚠️  Solo si el código es imposible de entender Y no hay tests
⚠️  Solo si la arquitectura impide añadir nuevas features
⚠️  Con presupuesto de tiempo explícito (las reescrituras siempre tardan el doble)
❌ Nunca reescribir solo porque "lo haría diferente hoy"
```

## Los 5 refactorings más valiosos

### 1. Extraer función (el más frecuente)

```typescript
// ❌ Función que hace demasiado
async function procesarPorTE(porteId: string) {
  const porte = await db.porte.findById(porteId)
  if (!porte) throw new Error('Porte not found')

  // Calcular precio con descuentos
  let precio = porte.precioBase
  if (porte.distanciaKm > 100) precio *= 0.95
  if (porte.usuario.esVIP) precio *= 0.90
  if (porte.fechaRecogida.getDay() === 0) precio *= 1.15  // domingo

  // Enviar notificaciones
  await sendEmail(porte.usuario.email, 'Porte confirmado', { precio })
  await sendSMS(porte.usuario.telefono, `Porte confirmado por ${precio}€`)
  await createPushNotification(porte.usuario.id, 'Porte confirmado')

  // Actualizar estado
  await db.porte.update({ where: { id: porteId }, data: { estado: 'confirmado', precio } })
}

// ✅ Responsabilidades separadas
function calcularPrecioFinal(porte: Porte): number {
  let precio = porte.precioBase
  if (porte.distanciaKm > 100) precio *= 0.95
  if (porte.usuario.esVIP) precio *= 0.90
  if (porte.fechaRecogida.getDay() === 0) precio *= 1.15
  return Math.round(precio * 100) / 100  // redondear a 2 decimales
}

async function notificarConfirmacion(porte: Porte, precio: number): Promise<void> {
  await Promise.all([
    sendEmail(porte.usuario.email, 'Porte confirmado', { precio }),
    sendSMS(porte.usuario.telefono, `Porte confirmado por ${precio}€`),
    createPushNotification(porte.usuario.id, 'Porte confirmado'),
  ])
}

async function procesarPorTE(porteId: string): Promise<void> {
  const porte = await db.porte.findById(porteId)
  if (!porte) throw new Error(`Porte ${porteId} not found`)

  const precio = calcularPrecioFinal(porte)
  await notificarConfirmacion(porte, precio)
  await db.porte.update({ where: { id: porteId }, data: { estado: 'confirmado', precio } })
}
```

### 2. Reemplazar condicionales con polimorfismo

```typescript
// ❌ Switch/if para tipos diferentes
function calcularComision(porte: Porte): number {
  if (porte.tipo === 'urgente') return porte.precio * 0.15
  if (porte.tipo === 'estandar') return porte.precio * 0.10
  if (porte.tipo === 'economico') return porte.precio * 0.07
  throw new Error(`Unknown tipo: ${porte.tipo}`)
}

// ✅ Tabla de configuración (más fácil de mantener y extender)
const COMISION_POR_TIPO: Record<TipoPorte, number> = {
  urgente: 0.15,
  estandar: 0.10,
  economico: 0.07,
}

function calcularComision(porte: Porte): number {
  const tasa = COMISION_POR_TIPO[porte.tipo]
  if (tasa === undefined) throw new Error(`Unknown tipo: ${porte.tipo}`)
  return porte.precio * tasa
}
```

### 3. Eliminar duplicación con abstracción

```typescript
// ❌ Misma lógica repetida en 3 sitios
// En portes.service.ts:
const portes = await db.porte.findMany({
  where: { usuarioId, deletedAt: null },
  orderBy: { createdAt: 'desc' },
  take: 20,
})

// En historial.service.ts:
const portes = await db.porte.findMany({
  where: { usuarioId, deletedAt: null },
  orderBy: { createdAt: 'desc' },
  take: 50,
})

// ✅ Abstracción con parámetros
async function findPortesByUsuario(
  usuarioId: string,
  options: { limit?: number } = {}
): Promise<Porte[]> {
  return db.porte.findMany({
    where: { usuarioId, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: options.limit ?? 20,
  })
}
```

### 4. Introducir objeto de parámetros

```typescript
// ❌ Demasiados parámetros (difícil de llamar, fácil de confundir el orden)
async function crearPorte(
  usuarioId: string,
  origenDireccion: string,
  origenLat: number,
  origenLng: number,
  destinoDireccion: string,
  destinoLat: number,
  destinoLng: number,
  descripcion: string,
  precioCentimos: number
): Promise<Porte>

// ✅ Objeto tipado
interface CrearPorteInput {
  usuarioId: string
  origen: { direccion: string; lat: number; lng: number }
  destino: { direccion: string; lat: number; lng: number }
  descripcion: string
  precioCentimos: number
}

async function crearPorte(input: CrearPorteInput): Promise<Porte>
```

### 5. Separar query de comando (CQRS light)

```typescript
// ❌ Función que lee Y escribe
async function getOrCreateUsuario(email: string): Promise<Usuario> {
  let usuario = await db.usuario.findByEmail(email)
  if (!usuario) {
    usuario = await db.usuario.create({ email })  // efecto secundario inesperado
  }
  return usuario
}

// ✅ Separar responsabilidades
async function findUsuarioByEmail(email: string): Promise<Usuario | null>
async function createUsuario(input: CreateUsuarioInput): Promise<Usuario>

// El caller decide si crea o no:
const usuario = await findUsuarioByEmail(email)
             ?? await createUsuario({ email })
```

## Cómo refactorizar de forma segura

```
1. Asegurar cobertura de tests ANTES de tocar el código
   → Si no hay tests, escribirlos primero (characterization tests)

2. Refactorizar en commits pequeños y atómicos
   → Cada commit: un solo refactoring, todos los tests en verde

3. Nunca mezclar refactoring con cambios de comportamiento
   → Si hay un bug, corregirlo en un commit separado

4. Verificar en CI que todos los tests pasan después de cada paso

5. Review del diff: si cambia la lógica → ya no es refactoring
```

## Code smells — señales de que algo necesita refactoring

```
Long Method (>50 líneas)         → extraer funciones
Large Class (>300 líneas)        → dividir responsabilidades
Duplicate Code                   → extraer abstracción
Long Parameter List (>4 params)  → objeto de parámetros
Feature Envy (clase que usa mucho los datos de otra) → mover método
Magic Numbers (0.15, 86400...)   → constantes con nombre
Deep Nesting (>3 niveles de if)  → early returns, extraer funciones
```
