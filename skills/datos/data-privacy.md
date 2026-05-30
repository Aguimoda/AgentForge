---
name: data-privacy
description: Activar cuando se diseñan modelos de datos que contienen información personal (PII). Define qué datos recoger, cómo protegerlos, cómo anonimizarlos para tests y cómo implementar el derecho al olvido de forma técnicamente correcta.
---

# Skill: Data Privacy

## Qué es PII (Personally Identifiable Information)

```
PII directa (siempre sensible):
- Nombre completo
- Email
- Teléfono
- DNI/Pasaporte
- Dirección postal
- IP de origen (en muchas jurisdicciones)
- Datos bancarios (IBAN, número de tarjeta)

PII indirecta (sensible en contexto):
- Historial de ubicaciones (trayectorias revelan domicilio y trabajo)
- Historial de compras detallado
- Combinación de fecha de nacimiento + código postal + género (re-identificable)
```

## Minimización de datos — recoger solo lo necesario

```typescript
// Antes de añadir un campo a la BD, responder:
// 1. ¿Para qué funcionalidad específica necesitamos este dato?
// 2. ¿Podemos cumplir esa funcionalidad sin este dato?
// 3. ¿Cuánto tiempo lo necesitamos?

// ❌ Recoger por "si acaso"
CREATE TABLE usuarios (
  ...
  fecha_nacimiento DATE,  -- ¿para qué? si no hay restricción de edad
  genero TEXT,            -- ¿para qué? si no personaliza la experiencia
  ciudad TEXT,            -- ¿para qué? si solo necesitamos el código postal para los envíos
)

// ✅ Solo lo necesario para el producto
CREATE TABLE usuarios (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,       -- necesario para autenticación y comunicación
  nombre TEXT NOT NULL,      -- necesario para personalización y valoraciones
  telefono TEXT,             -- necesario para coordinación de entregas
  -- NO hay más PII innecesaria
)
```

## Cifrado en tránsito y en reposo

```typescript
// En tránsito: HTTPS siempre (no negociable)
// En reposo: la BD debe estar cifrada (activar en el proveedor cloud)

// Para datos especialmente sensibles: cifrado a nivel de campo
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

function encryptField(value: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-gcm', process.env.ENCRYPTION_KEY!, iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${encrypted.toString('hex')}:${authTag.toString('hex')}`
}

// Cuándo cifrar a nivel de campo: IBAN, documentos de identidad, datos médicos
// El email normalmente NO necesita cifrado a nivel de campo (se usa en queries)
```

## Anonimización para tests y staging

```bash
# NUNCA usar datos reales de producción en staging o local
# Script de anonimización:

# scripts/anonymize-dump.sh
psql $STAGING_DB_URL <<EOF
-- Anonimizar usuarios
UPDATE usuarios SET
  nombre = 'Usuario ' || SUBSTRING(id::text, 1, 8),
  email = 'user_' || SUBSTRING(id::text, 1, 8) || '@test.example.com',
  telefono = '+34600' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
  stripe_customer_id = 'cus_test_' || SUBSTRING(id::text, 1, 16)
WHERE true;

-- Anonimizar direcciones (mantener solo la ciudad)
UPDATE portes SET
  origen_direccion = 'Calle Test, ' || SPLIT_PART(origen_direccion, ',', -1),
  destino_direccion = 'Calle Test, ' || SPLIT_PART(destino_direccion, ',', -1)
WHERE true;
EOF
```

## Derecho al olvido — implementación técnica correcta

El RGPD exige eliminar O anonimizar los datos personales. La clave: **algunos datos no se pueden borrar** (requisitos fiscales, integridad referencial) — deben **anonimizarse**.

```typescript
// service/usuario-deletion.service.ts
export async function deleteUserAccount(usuarioId: string): Promise<void> {
  await db.transaction().execute(async (trx) => {

    // 1. Anonimizar datos de usuario (no borrar — hay portes asociados con implicaciones fiscales)
    await trx
      .updateTable('usuarios')
      .set({
        nombre: '[Usuario eliminado]',
        email: `deleted_${usuarioId}@eliminado.local`,
        telefono: null,
        avatar_url: null,
        stripe_customer_id: null,
        deleted_at: new Date(),
      })
      .where('id', '=', usuarioId)
      .execute()

    // 2. Revocar tokens activos
    await trx.deleteFrom('sessions').where('usuario_id', '=', usuarioId).execute()
    await trx.deleteFrom('refresh_tokens').where('usuario_id', '=', usuarioId).execute()

    // 3. Marcar portes pendientes como cancelados (los completados se conservan anonimizados)
    await trx
      .updateTable('portes')
      .set({ estado: 'cancelado' })
      .where('usuario_id', '=', usuarioId)
      .where('estado', 'in', ['pendiente', 'asignado'])
      .execute()

    // 4. Borrar datos que SÍ se pueden borrar completamente
    await trx.deleteFrom('push_tokens').where('usuario_id', '=', usuarioId).execute()
    await trx.deleteFrom('preferencias_notificacion').where('usuario_id', '=', usuarioId).execute()

    // 5. Registrar la eliminación (para auditoría — sin datos personales)
    await trx
      .insertInto('audit_log')
      .values({
        evento: 'usuario.eliminado',
        usuario_id: usuarioId,  // solo el ID, no datos personales
        created_at: new Date(),
      })
      .execute()
  })
}
```

## Retención de datos — cuánto tiempo guardar cada tipo

```typescript
// Definir en una constante centralizada
export const DATA_RETENTION = {
  SESIONES: 30 * 24 * 60 * 60 * 1000,         // 30 días
  LOGS_GPS: 90 * 24 * 60 * 60 * 1000,          // 90 días
  MENSAJES_CHAT: 365 * 24 * 60 * 60 * 1000,    // 1 año
  PORTES_COMPLETADOS: 7 * 365 * 24 * 60 * 60 * 1000, // 7 años (obligación fiscal)
  PUSH_TOKENS_INACTIVOS: 60 * 24 * 60 * 60 * 1000,   // 60 días sin actividad
} as const

// Job de limpieza automática (ejecutar diariamente)
async function dataRetentionJob() {
  const now = Date.now()

  await db.deleteFrom('sessions')
    .where('updated_at', '<', new Date(now - DATA_RETENTION.SESIONES))
    .execute()

  await db.deleteFrom('ubicaciones_log')
    .where('created_at', '<', new Date(now - DATA_RETENTION.LOGS_GPS))
    .execute()
}
```

## Checklist de privacy by design

- [ ] Se han identificado todos los campos PII en el schema
- [ ] Cada campo PII tiene justificación de negocio documentada
- [ ] Los datos de staging/local son anonimizados (no reales)
- [ ] Hay implementación del derecho al olvido
- [ ] Los períodos de retención están definidos y automatizados
- [ ] Los logs no contienen PII innecesaria (emails, IPs en producción)
- [ ] Los backups tienen la misma protección que la BD principal
- [ ] Hay DPA firmado con el proveedor cloud
