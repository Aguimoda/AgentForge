---
name: security-reviewer
description: Activar en revisiones de PR con autenticación, inputs de usuario, datos sensibles o endpoints públicos. Cubre OWASP Top 10, gestión de secrets, validación de inputs, autorización, headers de seguridad y auditoría de dependencias.
---

# Skill: Security Reviewer

## OWASP Top 10 — checklist por categoría

### 1. Broken Access Control
```typescript
// ❌ Mal — asume que el usuario es dueño del recurso
GET /api/portes/:id  // cualquiera puede ver cualquier porte

// ✅ Bien — verifica que el usuario tiene acceso
async function getPorte(porteId: string, userId: string) {
  const porte = await db.portes.findById(porteId)
  if (porte.remitenteId !== userId && porte.transportistaId !== userId) {
    throw new ForbiddenError('No tienes acceso a este porte')
  }
  return porte
}
```

### 2. Cryptographic Failures
- Passwords: NUNCA almacenar en texto plano → bcrypt/argon2 con salt
- Datos sensibles en reposo: encriptar DNI, IBAN, coordenadas GPS
- HTTPS obligatorio en todos los entornos (incluso staging)
- Tokens JWT: usar algoritmo RS256 o ES256 (no HS256 con secreto débil)

### 3. Injection (SQL, XSS, etc.)
```typescript
// ❌ SQL Injection
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✅ Parametrizado
const user = await db.query('SELECT * FROM users WHERE email = $1', [email])

// ❌ XSS — render de HTML sin escapar
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ React escapa automáticamente — pero cuidado con innerHTML
<div>{userContent}</div>
```

### 4. Insecure Design
- Modelado de amenazas antes de implementar flujos críticos (pagos, auth, datos médicos)
- Rate limiting en todos los endpoints de autenticación
- Límites de intentos en códigos de verificación

### 5. Security Misconfiguration
```typescript
// Headers de seguridad obligatorios
'Content-Security-Policy': "default-src 'self'"
'X-Frame-Options': 'DENY'
'X-Content-Type-Options': 'nosniff'
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
'Referrer-Policy': 'strict-origin-when-cross-origin'
```

### 6. Vulnerable Components
```bash
# En cada PR y en CI
npm audit --audit-level=high
```

### 7. Authentication Failures
- Tokens de sesión con expiración razonable (24h inactividad)
- Invalidar tokens en logout
- Proteger contra fuerza bruta (rate limiting + lockout temporal)
- 2FA para cuentas con acceso a datos financieros

### 8. Integrity Failures
- Verificar firmas de webhooks (Stripe, Twilio envían firma en headers)
- Lockfile en git para dependencias
- No deserializar datos no confiables

### 9. Logging Failures
```typescript
// ❌ Log con datos sensibles
logger.info(`Login: user=${email} password=${password}`)

// ✅ Log sin datos sensibles
logger.info({ userId, action: 'login', success: true }, 'Login attempt')

// Qué SÍ loggear: acción, userId, timestamp, IP, resultado
// Qué NO loggear: passwords, tokens, PII, datos de tarjeta
```

### 10. SSRF
- Validar URLs antes de hacer fetch (no permitir URLs internas como localhost, 169.254.x.x)
- Whitelist de dominios permitidos para integraciones externas

## Gestión de Secrets

```bash
# ❌ NUNCA en git
API_KEY=sk_live_xxxxxxxxxxxx

# ✅ En CI/CD como secrets cifrados
# ✅ En producción: Doppler, Vault, o secret manager del cloud

# .env.example va en git — sin valores reales
STRIPE_SECRET_KEY=sk_live_your_key_here
```

## Checklist de revisión de seguridad

- [ ] No hay secrets en el código ni en los commits
- [ ] Los inputs del usuario están validados con zod/joi antes de usarse
- [ ] Los endpoints verifican que el usuario tiene acceso al recurso solicitado
- [ ] Las queries a BD son parametrizadas (no concatenación)
- [ ] Los errores no exponen información interna (stack traces, rutas de archivos)
- [ ] Las dependencias nuevas no tienen vulnerabilidades conocidas
- [ ] Los webhooks externos verifican la firma
- [ ] Los logs no contienen datos sensibles
