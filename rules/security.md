---
description: Reglas de seguridad — siempre activas
alwaysApply: true
---

## Seguridad no negociable
- NUNCA almacenar secretos en el código
- NUNCA hardcodear API keys, passwords, tokens
- TODO endpoint que accede a datos de usuario requiere:
  1. Verificación de autenticación
  2. Verificación de autorización (el recurso pertenece al usuario)
- Los inputs del usuario SIEMPRE se validan antes de usar
- Las queries SQL NUNCA usan interpolación de strings (siempre parámetros)
