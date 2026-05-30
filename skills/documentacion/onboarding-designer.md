---
name: onboarding-designer
description: Activar al diseñar el onboarding de nuevos usuarios o de nuevos desarrolladores al proyecto. El onboarding es el momento de mayor abandono. Este skill define los principios que lo hacen funcionar y la estructura técnica para implementarlo.
---

# Skill: Onboarding Designer

## Onboarding de usuarios — los principios

### El momento "aha"
Cada producto tiene un momento en que el usuario entiende el valor real. El onboarding debe llevar al usuario a ese momento lo antes posible.

```
De Vacío: el momento "aha" es ver su primer porte con un transportista asignado
→ Todo el onboarding debe acortar el camino a ese momento

Mal onboarding: registro largo → tutorial de 5 pantallas → rellena perfil completo → publica porte
Buen onboarding: registro mínimo → publica porte → (perfil completo cuando sea necesario)
```

### Progressive disclosure — pedir solo lo necesario, cuando es necesario

```typescript
// ❌ Registro largo que pide todo de entrada
// Nombre, email, teléfono, dirección, foto, tipo de usuario (remitente/transportista),
// método de pago, verificación de identidad...

// ✅ Registro mínimo → completar perfil en contexto
// Paso 1 (siempre): email + contraseña (o Google OAuth)
// Paso 2 (cuando publica un porte): dirección de origen
// Paso 3 (cuando acepta un porte): teléfono de contacto
// Paso 4 (cuando va a cobrar): datos de Stripe para payouts

// Completar el perfil en el momento en que el dato es necesario
// tiene una tasa de conversión mucho mayor que pedirlo de entrada
```

### Checklist de activación (en vez de tutorial)

```typescript
// En vez de un tutorial de pantallas que el usuario cierra sin leer:
// Una checklist de activación que el usuario completa a su ritmo

const PASOS_ACTIVACION = [
  {
    id: 'publicar_porte',
    titulo: 'Publica tu primer porte',
    descripcion: 'Describe qué quieres enviar y desde dónde',
    completado: usuario.portesCount > 0,
    cta: 'Publicar porte',
    href: '/portes/nuevo',
  },
  {
    id: 'completar_perfil',
    titulo: 'Añade tu foto de perfil',
    descripcion: 'Los transportistas confían más en remitentes con foto',
    completado: !!usuario.avatarUrl,
    cta: 'Añadir foto',
    href: '/perfil/editar',
  },
  {
    id: 'verificar_telefono',
    titulo: 'Verifica tu teléfono',
    descripcion: 'Para coordinarte con el transportista',
    completado: usuario.telefonoVerificado,
    cta: 'Verificar',
    href: '/perfil/verificar-telefono',
  },
]
```

## Flujo de onboarding técnico

```typescript
// hooks/useOnboarding.ts
export function useOnboarding() {
  const { usuario } = useAuth()

  const pasos = PASOS_ACTIVACION.map(paso => ({
    ...paso,
    completado: evaluarPaso(paso.id, usuario),
  }))

  const progreso = pasos.filter(p => p.completado).length / pasos.length
  const siguiente = pasos.find(p => !p.completado)
  const completado = pasos.every(p => p.completado)

  return { pasos, progreso, siguiente, completado }
}

// Mostrar el onboarding solo cuando es relevante (no en todas las pantallas)
// Ocultarlo permanentemente cuando el usuario lo completa o lo descarta
```

## Empty states como parte del onboarding

```typescript
// El estado vacío de cada sección ES parte del onboarding
// No es "no tienes portes aún" — es una invitación a la acción

// ❌ Empty state genérico
<EmptyState message="No tienes portes" />

// ✅ Empty state con contexto y CTA claro
function EmptyStatePortes() {
  return (
    <div className="text-center py-12 px-4">
      <PackageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Publica tu primer porte
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Describe qué quieres enviar, dónde está y adónde va.
        Los transportistas cercanos verán tu porte y te harán una oferta.
      </p>
      <Button href="/portes/nuevo" size="lg">
        Publicar porte
      </Button>
    </div>
  )
}
```

## Onboarding de desarrolladores — Developer Experience

### El objetivo: de cero a primera contribución en < 1 hora

```markdown
# Guía de onboarding para desarrolladores

## Requisitos (instala esto primero)
- Node.js 20+ → https://nodejs.org
- Docker Desktop → https://docker.com/desktop
- Git configurado con tu email

## Setup en 5 minutos

\```bash
git clone https://github.com/org/proyecto && cd proyecto
cp .env.example .env.local  # ver ENVIRONMENTS.md para los valores
docker compose up -d         # arranca PostgreSQL + Redis local
npm install
npm run db:migrate           # crea las tablas
npm run db:seed              # datos de prueba
npm run dev                  # http://localhost:3000
\```

## Tu primera tarea
1. Mira los issues con label "good first issue" en GitHub
2. Lee CONTRIBUTING.md para las convenciones de PR
3. El flujo es: rama feature → PR → CI debe pasar → review → merge

## Cómo están organizados los archivos
→ Ver ARCHITECTURE.md para el mapa del proyecto
```

### CONTRIBUTING.md mínimo

```markdown
# Contribuir al proyecto

## Flujo de trabajo
1. Crea una rama desde `main`: `git checkout -b feat/nombre-descriptivo`
2. Haz commits pequeños y descriptivos (Conventional Commits)
3. Abre un PR contra `main` con descripción de qué y por qué
4. Espera a que el CI pase y a que haya al menos 1 aprobación

## Commits (Conventional Commits)
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
refactor: mejora de código sin cambio de comportamiento
test: añadir o corregir tests

## Tests
\```bash
npm run test        # unit tests
npm run test:bdd    # integration tests (requiere BD corriendo)
\```
Los PRs sin tests para nuevas funcionalidades no se aprueban.
```

## Checklist de onboarding

**Usuarios:**
- [ ] El registro pide solo email (o permite OAuth) — el resto se pide después
- [ ] Hay empty states con CTA claros en las secciones principales
- [ ] El primer valor del producto es alcanzable en < 5 minutos
- [ ] Hay una forma de descartar/posponer el onboarding (respeta la autonomía)

**Desarrolladores:**
- [ ] El README tiene instrucciones de setup que funcionan en máquina limpia
- [ ] `npm install && npm run dev` funciona sin pasos manuales adicionales
- [ ] Hay datos de prueba con `npm run db:seed`
- [ ] Hay al menos 1 issue etiquetado como "good first issue"
- [ ] CONTRIBUTING.md explica el flujo de PR
