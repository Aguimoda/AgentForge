---
name: technical-writer
description: Activar al crear o actualizar documentación técnica. La buena documentación responde preguntas concretas, no describe el código que ya existe. Este skill define qué documentar, cómo estructurarlo y cómo mantenerlo actualizado.
---

# Skill: Technical Writer

## Los 4 tipos de documentación (Diátaxis)

```
Tutoriales  → aprender haciendo (orientado al principiante)
How-to      → resolver un problema específico (orientado a la tarea)
Referencia  → información exacta (orientado a la precisión)
Explicación → entender el contexto (orientado al concepto)
```

Cada documento es solo uno de estos tipos. Mezclarlos genera confusión.

## README — la puerta de entrada

```markdown
# Nombre del Proyecto

Una línea que explica qué hace el proyecto y para quién.

## Instalación rápida

\```bash
git clone https://github.com/org/proyecto
cd proyecto
cp .env.example .env.local  # rellenar los valores
npm install
npm run dev
\```

Abre http://localhost:3000

## Requisitos previos

- Node.js 20+
- PostgreSQL 15+ (o Docker)
- Cuenta de Stripe (modo test)

## Primeros pasos

→ [Guía de configuración completa](docs/setup.md)
→ [Arquitectura del proyecto](docs/architecture.md)
→ [Cómo contribuir](CONTRIBUTING.md)

## Stack principal

- **Framework**: Next.js 14 (App Router)
- **BD**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Pagos**: Stripe Connect
- **Deploy**: Vercel + Neon

## Comandos frecuentes

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Servidor de desarrollo |
| `npm run test` | Unit tests |
| `npm run test:bdd` | Tests de integración BDD |
| `npm run db:migrate` | Ejecutar migraciones pendientes |
| `npm run db:studio` | Abrir Prisma Studio (explorador de BD) |
```

## CHANGELOG — registro de cambios para humanos

```markdown
# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com)
Versiones: [Semantic Versioning](https://semver.org)

## [Unreleased]

### Added
- Funcionalidad X pendiente de release

## [1.2.0] - 2024-03-15

### Added
- Sistema de valoraciones para transportistas
- Notificaciones push para nuevos portes

### Changed
- Mejorada la estimación de precios con ML básico
- Rediseñada la pantalla de historial de portes

### Fixed
- Corregido bug donde los portes cancelados aparecían en "activos"
- Solucionado error de timezone en fechas de recogida

## [1.1.0] - 2024-02-28
...
```

**Reglas del CHANGELOG:**
- Escrito para usuarios/desarrolladores, no para el sistema de CI
- Agrupa por tipo: Added, Changed, Fixed, Removed, Security
- Cada release tiene fecha
- Los links de versión apuntan al diff en GitHub

## Documentar decisiones técnicas (ADR)

Ver `skills/arquitectura/adr-writer.md` — las decisiones arquitecturales van ahí.

## Comentarios en el código — el qué vs el por qué

```typescript
// ❌ Comenta el QUÉ (ya lo dice el código)
// Incrementar contador
contador++

// ❌ Código muerto comentado
// const oldCalculo = precio * 0.1
// await sendEmail(email, oldTemplate)

// ✅ Comenta el POR QUÉ — el contexto que el código no puede expresar
// Redondeamos a 2 decimales para evitar errores de coma flotante
// en la comparación posterior con el precio de Stripe (que trabaja en céntimos)
const precioFinal = Math.round(precio * 100) / 100

// ✅ Documenta el caso no obvio
// Stripe requiere que el amount sea en céntimos (entero)
// y rechaza valores menores a 50 (50 céntimos = 0.50€)
const stripAmount = Math.round(precio * 100)
if (stripeAmount < 50) throw new PaymentError('Amount below Stripe minimum')

// ✅ JSDoc para funciones públicas de librerías/servicios
/**
 * Calcula el precio final del porte aplicando descuentos según el perfil del usuario.
 *
 * @param porte - El porte con precio base ya calculado
 * @returns Precio en céntimos de euro (entero)
 * @throws {PrecioInvalidoError} Si el precio calculado cae por debajo del mínimo
 */
export function calcularPrecioFinal(porte: Porte): number
```

## Documentación de API — OpenAPI como fuente de verdad

```yaml
# openapi.yaml — se genera o se mantiene a mano, pero es la fuente de verdad
# Los comentarios de código son complementarios, no la fuente principal

paths:
  /api/portes:
    post:
      summary: Crear un nuevo porte
      description: |
        Crea un porte en estado 'pendiente'. Dispara notificaciones push
        a transportistas cercanos al origen en un radio de 25km.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CrearPorteInput'
            example:
              origen:
                direccion: "Calle Mayor 1, Madrid"
                lat: 40.4168
                lng: -3.7038
              destino:
                direccion: "Gran Vía 10, Barcelona"
                lat: 41.3851
                lng: 2.1734
              descripcion: "Caja de mudanza, frágil"
              precioCentimos: 4500
      responses:
        '201':
          description: Porte creado exitosamente
        '400':
          description: Datos de entrada inválidos
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProblemDetails'
```

## Checklist de documentación antes de un release

- [ ] README tiene instrucciones de instalación que funcionan (verificado en máquina limpia)
- [ ] CHANGELOG actualizado con todos los cambios desde el último release
- [ ] Las decisiones arquitecturales relevantes tienen ADR
- [ ] Los endpoints nuevos están en el OpenAPI spec
- [ ] El .env.example está actualizado con las nuevas variables
- [ ] Los comentarios de código explican el por qué, no el qué
- [ ] No hay código comentado en el diff (eliminarlo o convertir en TODO con ticket)
