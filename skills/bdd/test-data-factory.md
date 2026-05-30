---
name: test-data-factory
description: Activar cuando se definen fixtures o datos de prueba para tests BDD o unitarios. Los datos de prueba deben ser mínimos, reproducibles y cubrir los casos de borde. El patrón factory permite crear variantes sin duplicar código.
---

# Skill: Test Data Factory

## El patrón Factory

```typescript
// ✅ Factory con valores por defecto y overrides
function crearUsuario(overrides: Partial<Usuario> = {}): Usuario {
  return {
    id: 'test-user-' + Math.random().toString(36).slice(2),
    email: 'test@example.com',
    nombre: 'Usuario Test',
    rol: 'remitente',
    verificado: true,
    creadoEn: new Date('2026-01-01'),
    ...overrides  // permite sobreescribir solo lo que necesita el test
  }
}

// Uso en tests
const usuarioPremium = crearUsuario({ rol: 'transportista', verificado: true })
const usuarioNoVerificado = crearUsuario({ verificado: false })
const usuarioNuevo = crearUsuario({ creadoEn: new Date() })
```

## Datos para casos de borde (siempre incluir)

```typescript
export const CASOS_BORDE = {
  strings: {
    vacio: '',
    soloEspacios: '   ',
    muyLargo: 'a'.repeat(256),
    caracteresEspeciales: '<script>alert("xss")</script>',
    unicode: '用户名',
    emoji: '🎉',
    sqlInjection: "'; DROP TABLE users; --",
    htmlInjection: '<img src=x onerror=alert(1)>',
  },
  numeros: {
    cero: 0,
    negativo: -1,
    muyGrande: Number.MAX_SAFE_INTEGER,
    decimal: 0.1 + 0.2, // 0.30000000000000004 — el clásico
  },
  fechas: {
    pasado: new Date('2000-01-01'),
    futuro: new Date('2099-12-31'),
    añoBisiesto: new Date('2024-02-29'),
    cambioHorario: new Date('2026-03-29T02:00:00'), // hora de verano
  },
  emails: {
    valido: 'test@example.com',
    conSubdominio: 'test@mail.example.com',
    invalido: 'no-es-email',
    sinDominio: 'test@',
    sinArroba: 'testexample.com',
  }
}
```

## Seed de base de datos para tests de integración

```typescript
// specs/fixtures/seed.ts
export async function seedTestDatabase(db: Database) {
  // Limpiar en orden inverso a las foreign keys
  await db.execute('DELETE FROM valoraciones')
  await db.execute('DELETE FROM portes')
  await db.execute('DELETE FROM usuarios')

  // Insertar datos base
  await db.usuarios.create(crearUsuario({ id: 'user-remitente', rol: 'remitente' }))
  await db.usuarios.create(crearUsuario({ id: 'user-transportista', rol: 'transportista', verificado: true }))
}
```

## Reglas de datos de prueba

- **Mínimos:** solo los campos que necesita el test — no rellenar todo por defecto
- **Deterministas:** los mismos fixtures producen siempre los mismos resultados (no `Math.random()` sin seed)
- **Aislados:** cada test limpia sus datos antes de empezar (no depender del orden de ejecución)
- **Realistas:** datos con formato correcto — no `"test"` como email, usar `"test@example.com"`
- **Sin datos reales:** nunca datos de producción en fixtures, aunque estén anonimizados
