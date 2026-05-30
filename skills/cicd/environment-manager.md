---
name: environment-manager
description: Activar cuando se definen o modifican los entornos del proyecto. Define qué va en cada entorno, cómo se gestionan los secrets, cómo se reproducen bugs de producción en local de forma segura y la estrategia de datos por entorno.
---

# Skill: Environment Manager

## Los 4 entornos y qué va en cada uno

| Aspecto | Local | CI/CD | Staging | Producción |
|---------|-------|-------|---------|------------|
| **BD** | Docker local | Docker efímero en CI | BD real (datos falsos) | BD real (datos reales) |
| **Secrets** | .env.local | CI/CD variables | CI/CD variables | Secret manager |
| **Deploy** | Manual (`npm run dev`) | Automático en cada commit | Automático en merge a develop | Manual o en tag |
| **Datos** | Seed de desarrollo | Seed de CI | Seed de staging | Datos reales |
| **Logging** | Console (verboso) | Console (mínimo) | Estructurado | Estructurado + alertas |
| **Error tracking** | No | No | Sentry (proyecto de staging) | Sentry (proyecto de producción) |
| **Stripe** | Test mode | Test mode | Test mode | Live mode |

## Gestión de variables de entorno

### .env.example (en git — sin valores reales)
```bash
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/proyecto_dev

# Autenticación
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+34600000000

# Sentry (vacío en desarrollo)
SENTRY_DSN=

# Feature flags
FF_MODO_CONDUCCION_V2=false
```

### Qué NO va nunca en git
- `.env.local`, `.env.production`, `.env.staging`
- Cualquier archivo con valores reales de secrets
- Claves de API, tokens, passwords

### Jerarquía de carga (Next.js)
```
.env                    ← valores por defecto (puede ir en git si no tiene secrets)
.env.local              ← override local (NUNCA en git)
.env.development        ← solo en desarrollo
.env.production         ← solo en producción (NUNCA en git)
```

## Reproducir bugs de producción en local

```bash
# 1. Dump anonimizado de producción (NUNCA datos reales directamente)
pg_dump $PROD_DB_URL | ./scripts/anonymize.sh > /tmp/prod_dump_anon.sql

# 2. Restaurar en local
psql $LOCAL_DB_URL < /tmp/prod_dump_anon.sql

# 3. Usar variables de entorno de producción en modo read-only
# Crear .env.prod-debug con secrets de staging que simulan producción
```

## Staging como "producción en miniatura"

- Staging debe ser lo más parecido a producción posible
- Mismo Dockerfile, misma configuración de servidor
- Diferentes: datos, secrets de test, dominio
- Los bugs que no aparecen en staging pero sí en producción = problema de datos o de escala

## Checklist de entornos

- [ ] .env.example está en git y actualizado
- [ ] .env.local está en .gitignore
- [ ] Todos los secrets están en CI/CD variables (no en el código)
- [ ] Staging usa test modes de todos los servicios externos (Stripe test, etc.)
- [ ] Hay un proceso documentado para añadir nuevas variables de entorno
- [ ] La BD de staging tiene datos que cubren los casos de uso principales
