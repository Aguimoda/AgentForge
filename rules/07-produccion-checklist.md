---
description: >
  Regla permanente: cualquier cosa que difiera entre local y producción se apunta en
  .claude/produccion.md en el momento de implementarla. Siempre activa.
alwaysApply: true
---

# Regla: Checklist Pre-Producción — siempre activa

## Cuándo añadir un item al checklist

Añadir entrada en `.claude/produccion.md` **en el mismo momento** en que se implementa cualquiera de estas situaciones:

| Situación | Ejemplo |
|-----------|---------|
| Configuración de servicio externo diferente en local | Email confirmation desactivada en Supabase |
| Variable de entorno que cambiará en producción | `STRIPE_SECRET_KEY` test → live |
| URL hardcodeada a localhost | Redirect URL de OAuth |
| Feature desactivada para dev | Rate limiting, webhooks |
| Mock o datos de prueba que no deben ir a prod | Seed data, usuarios demo |
| Política de seguridad relajada para dev | CORS permisivo, RLS con bypass |
| Credencial o clave en formato trial/test | Twilio trial, Stripe test |
| Configuración de email/SMS no funcional en local | SMTP de Supabase con límites |

## Formato de cada item

```markdown
- [ ] **Título descriptivo**
  - Actualmente: [cómo está configurado ahora, por qué]
  - Producción: [qué hay que hacer, dónde, cómo]
  - Archivos afectados: [si aplica]
```

## Cuándo revisar el checklist

- Antes de cualquier deploy a staging o producción
- Al iniciar un sprint de "preparación para lanzamiento"
- Cuando el usuario pregunta "¿estamos listos para producción?"

## Lo que NO va en el checklist

- Bugs o features pendientes → van en `.claude/plan.md`
- Decisiones de arquitectura → van en `docs/adr/`
- Lecciones aprendidas → van en `.claude/learnings.md`

Solo va aquí lo que **funciona correctamente en local pero necesita cambiarse para producción**.
