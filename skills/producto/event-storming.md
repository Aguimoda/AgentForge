---
name: event-storming
description: Activar cuando se modela el dominio de negocio por primera vez o cuando el dominio es complejo. Event Storming identifica los eventos del sistema, los comandos que los provocan, los actores y los bounded contexts. Es la base para un buen modelo de datos y una arquitectura limpia.
---

# Skill: Event Storming

## Qué es
Event Storming es un taller de modelado colaborativo que parte de los **eventos de dominio** (cosas que ocurren en el sistema) para descubrir la lógica de negocio, las dependencias y los límites naturales del sistema.

## Los elementos

| Color (convención) | Elemento | Ejemplo |
|---------------------|----------|---------|
| 🟠 Naranja | **Evento de dominio** — algo que ocurrió en pasado | `PorteAceptado`, `PagoLiberado` |
| 🔵 Azul | **Comando** — acción que dispara el evento | `AceptarPorte`, `LiberarPago` |
| 🟡 Amarillo | **Actor** — quién ejecuta el comando | Transportista, Sistema, Cron job |
| 🟣 Morado | **Política** — regla que conecta evento con comando | "Cuando PorteEntregado → LiberarPago" |
| 🟢 Verde | **Read Model** — vista que el actor necesita para decidir | Lista de portes disponibles |
| Rosa | **Agregado** — entidad que maneja el estado | Porte, Usuario, Pago |

## Proceso

### Paso 1 — Lluvia de eventos (sin orden)
Pide al usuario: "¿Qué cosas importantes ocurren en el sistema? Nómbralas en pasado."
Ejemplos para De Vacío: `UsuarioRegistrado`, `PortePublicado`, `PorteAceptado`, `CodigoRecogidaGenerado`, `FotoSubida`, `PorteRecogido`, `PorteEntregado`, `PagoLiberado`, `DisputaAbierta`

### Paso 2 — Ordenar en el tiempo
Coloca los eventos en línea temporal de izquierda a derecha.

### Paso 3 — Identificar los comandos y actores
Para cada evento: ¿qué acción lo provocó? ¿quién la ejecutó?

### Paso 4 — Identificar políticas
Busca patrones "Cuando [evento] ocurre → se ejecuta automáticamente [comando]"
Estas son reglas de negocio críticas que deben ser explícitas en el código.

### Paso 5 — Identificar Bounded Contexts
Agrupa los eventos/comandos/actores que forman un dominio cohesionado.
Los límites entre grupos son los Bounded Contexts — potenciales módulos o servicios.

## Ejemplo aplicado

```
[Remitente]     [Sistema]              [Transportista]
    |               |                       |
    |--PublicarPorte→|                       |
    |           PortePublicado               |
    |               |---NotificarConductores→|
    |               |                  PorteVisto
    |               |                       |--AceptarPorte→|
    |               |              PorteAceptado             |
    |           CodigoRecogidaGenerado                       |
    |←SMS/Push------|                                        |
    |               |                       |--LlegarRecogida→|
    |               |               CodigoIntroducido        |
    |               |                  CodigoVerificado      |
    |               |                       |--SubirFoto→|   |
    |               |                   FotoRecogidaSubida   |
    |               |               PorteEnRuta              |
    |←TrackingActivo|                                        |
```

## Qué descubre Event Storming
- **Comandos sin actor claro** → gap en los requisitos
- **Eventos sin comando** → algo pasa "mágicamente" → buscar la regla de negocio oculta
- **Políticas complejas** → lógica de negocio que necesitará tests unitarios
- **Bounded Contexts** → límites naturales para módulos o microservicios
- **Vocabulario del dominio** → el lenguaje ubicuo (DDD) que deben usar el código y la documentación
