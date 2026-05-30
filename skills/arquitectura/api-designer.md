---
name: api-designer
description: Activar cuando se diseña o modifica la API. Define endpoints RESTful correctos, contratos OpenAPI 3.1, manejo consistente de errores (RFC 7807), versionado y estrategia de mocking. La API es un contrato — cambiarla sin versionar es romper el contrato.
---

# Skill: API Designer

## Principios REST aplicados

### Nomenclatura de endpoints
```
GET    /portes              → listar portes
GET    /portes/:id          → obtener un porte
POST   /portes              → crear un porte
PATCH  /portes/:id          → actualizar parcialmente
DELETE /portes/:id          → eliminar

# Acciones que no son CRUD → sub-recursos o verbos
POST   /portes/:id/aceptar  → aceptar un porte
POST   /portes/:id/cancelar → cancelar un porte
POST   /portes/:id/disputas → abrir una disputa
GET    /portes/:id/tracking → obtener el tracking GPS
```

### Códigos HTTP correctos
```
200 OK              → GET exitoso, PATCH exitoso
201 Created         → POST exitoso (incluir Location header con la URL del recurso creado)
204 No Content      → DELETE exitoso
400 Bad Request     → Validación fallida (cuerpo con detalles del error)
401 Unauthorized    → No autenticado (no hay token o es inválido)
403 Forbidden       → Autenticado pero sin permisos
404 Not Found       → El recurso no existe
409 Conflict        → El estado actual no permite la operación (ej: aceptar un porte ya aceptado)
422 Unprocessable   → Semánticamente incorrecto (datos válidos pero violación de regla de negocio)
429 Too Many Reqs   → Rate limiting
500 Internal Error  → Error del servidor (nunca exponer detalles internos)
```

### Errores con RFC 7807 (Problem Details)
```json
{
  "type": "https://api.devacio.com/errors/porte-ya-aceptado",
  "title": "El porte ya fue aceptado por otro transportista",
  "status": 409,
  "detail": "El porte con ID abc123 fue aceptado por otro transportista hace 2 minutos.",
  "instance": "/portes/abc123"
}
```

## Estructura OpenAPI 3.1

```yaml
openapi: 3.1.0
info:
  title: De Vacío API
  version: 1.0.0

paths:
  /portes:
    post:
      summary: Publicar un nuevo porte
      tags: [Portes]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CrearPorteRequest'
      responses:
        '201':
          description: Porte creado
          headers:
            Location:
              schema:
                type: string
              description: URL del porte creado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Porte'
        '400':
          $ref: '#/components/responses/ValidationError'
        '401':
          $ref: '#/components/responses/Unauthorized'

components:
  schemas:
    Porte:
      type: object
      required: [id, estado, remitente, origen, destino, creadoEn]
      properties:
        id:
          type: string
          format: uuid
        estado:
          type: string
          enum: [publicado, aceptado, recogido, entregado, disputado, cancelado]
        # ...

  responses:
    ValidationError:
      description: Error de validación
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/ProblemDetails'
    Unauthorized:
      description: No autenticado

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## Versionado de la API
- Versión en la URL: `/api/v1/portes` (simple y explícito)
- Mantener la versión anterior activa durante al menos 3 meses al deprecar
- Documentar los breaking changes en el CHANGELOG

## Mocking con Prism
```bash
# Levantar servidor mock desde el openapi.yaml
npx @stoplight/prism-cli mock docs/specs/openapi.yaml

# El frontend puede desarrollar contra este mock
# sin esperar a que el backend esté implementado
```

## Checklist de un buen endpoint
- [ ] El método HTTP es semánticamente correcto
- [ ] La URL usa sustantivos en plural, no verbos
- [ ] Los códigos de respuesta son los correctos para cada caso
- [ ] Los errores siguen RFC 7807
- [ ] Está documentado en openapi.yaml con todos los posibles responses
- [ ] Está protegido con autenticación si maneja datos privados
- [ ] Tiene rate limiting si puede ser abusado
- [ ] No expone más datos de los necesarios (principle of least privilege)
