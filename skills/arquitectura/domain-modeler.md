---
name: domain-modeler
description: Activar cuando se diseña o modifica el modelo de datos, las entidades del dominio o las relaciones entre ellas. Aplica principios DDD para separar la lógica de negocio pura de la infraestructura. Define entidades, value objects, agregados y repositorios.
---

# Skill: Domain Modeler

## Conceptos DDD aplicados

### Entidad
Tiene identidad propia (un ID único). Su identidad persiste aunque sus atributos cambien.
```typescript
// ✅ Entidad — tiene ID, puede cambiar su estado
interface Porte {
  id: string          // identidad
  estado: EstadoPorte // puede cambiar
  remitente: UsuarioId
  transportista: UsuarioId | null
  // ...
}
```

### Value Object
No tiene identidad — dos Value Objects con los mismos valores son iguales. Son inmutables.
```typescript
// ✅ Value Object — sin ID, inmutable, igualdad por valor
interface Coordenadas {
  latitud: number
  longitud: number
}

interface CodigoVerificacion {
  valor: string      // 6 dígitos
  creadoEn: Date
  usadoEn: Date | null
  esValido(): boolean
}
```

### Agregado
Un grupo de entidades y value objects que se tratan como una unidad.
Las modificaciones siempre entran por la raíz del agregado (Aggregate Root).
```typescript
// ✅ Porte es el Aggregate Root
// Solo se puede modificar el porte a través de sus métodos
class Porte {
  private estado: EstadoPorte
  private codigoRecogida: CodigoVerificacion

  aceptar(transportistaId: string): void { /* ... */ }
  registrarRecogida(codigo: string, foto: Foto): void { /* ... */ }
  registrarEntrega(codigo: string, foto: Foto): void { /* ... */ }
}
```

## Diseño del esquema de BD

### Reglas
- Una tabla por entidad principal
- Los Value Objects simples → columnas en la tabla de la entidad
- Los Value Objects complejos → tablas propias si tienen múltiples campos
- Las relaciones N:M → tabla de unión explícita con sus propios campos
- Los eventos de dominio → tabla de eventos (event sourcing lite)

### Tipos de datos
```sql
-- IDs: UUID v4 (no autoincrement — los UUIDs son portables y no revelan volumen)
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- Timestamps: siempre en UTC, siempre with timezone
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

-- Enums: definirlos explícitamente
estado_porte VARCHAR(20) CHECK (estado_porte IN ('publicado', 'aceptado', 'recogido', 'entregado', 'disputado', 'cancelado'))

-- Dinero: NUNCA float — usar integer (céntimos) o NUMERIC(10,2)
importe_centimos INTEGER NOT NULL  -- 1000 = 10.00€
```

### Índices
```sql
-- Índice en foreign keys siempre
CREATE INDEX idx_portes_remitente ON portes(remitente_id)
CREATE INDEX idx_portes_transportista ON portes(transportista_id)

-- Índice en campos de filtrado frecuente
CREATE INDEX idx_portes_estado ON portes(estado)
CREATE INDEX idx_portes_created_at ON portes(created_at DESC)

-- Índice compuesto cuando siempre se filtra por ambos
CREATE INDEX idx_portes_estado_created ON portes(estado, created_at DESC)
```

## Checklist de un buen modelo
- [ ] Cada entidad tiene un ID único (UUID)
- [ ] Todos los timestamps son TIMESTAMPTZ (con zona horaria)
- [ ] No hay `float` para dinero
- [ ] Las foreign keys tienen índice
- [ ] Los enums están definidos explícitamente (no strings libres)
- [ ] Los datos personales están identificados y marcados para RGPD
- [ ] Hay soft delete si los datos no se pueden borrar realmente (auditoría)
- [ ] El modelo soporta los casos de borde del dominio (¿qué pasa si X es null?)
