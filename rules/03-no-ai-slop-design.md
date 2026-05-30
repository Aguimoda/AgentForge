---
description: Anti-AI Slop — diseño con intención, nunca genérico. Siempre activo en tareas de diseño y componentes.
alwaysApply: true
---
# Regla: Anti-AI Slop — Diseño con intención

> Esta regla se aplica a cualquier tarea de diseño, generación de componentes o decisiones visuales.

## Qué es "AI slop" y por qué evitarlo

AI slop es el output visual genérico que producen los modelos de IA sin dirección estética intencional. Se reconoce porque:
- Usa Inter o Roboto como fuente principal
- Tiene un gradiente de azul a púrpura en el hero
- Muestra exactamente 3 cards iguales en fila con sombra idéntica
- El CTA principal es un botón azul redondeado con fondo blanco
- No tiene personalidad ni punto de vista visual

**Regla:** Antes de generar cualquier componente visual, definir la dirección estética. Si el usuario no la especifica, preguntar o tomar una decisión justificada.

## Proceso antes de generar UI

Responder estas preguntas ANTES de escribir una línea de CSS:

1. **¿Cuál es la dirección visual?** (minimalista funcional / editorial / brutalista / cálido / técnico / etc.)
2. **¿Cuáles son las fuentes?** (no Inter por defecto — justificar la elección)
3. **¿Cuál es la paleta?** (definir al menos primario, neutros y estado de error)
4. **¿Cuál es el espaciado base?** (4px, 8px, 16px — sistema)
5. **¿Qué sensación debe transmitir este componente?** (confianza, urgencia, calma, etc.)

## Para De Vacío — dirección visual a definir

> ⚠️ El design system de De Vacío está pendiente de definirse en la Fase 4.
> Hasta entonces, usar estas guías de dirección como punto de partida:

**Sensación objetivo:** Confianza + Simplicidad + Movilidad
- Transmitir seguridad (el usuario confía sus objetos y su dinero a la plataforma)
- Claridad inmediata (el transportista usa la app mientras conduce)
- Velocidad y acción (Express on the go — sin fricciones)

**Referentes visuales:**
- Linear.app — claridad funcional, datos densos sin abrumador
- Uber Driver — interfaz de conducción que funciona en cualquier condición
- Stripe — transmitir confianza en operaciones financieras

**Lo que NO queremos:**
- ❌ Gradientes azul-púrpura en nada
- ❌ Cards con sombra enorme como único elemento de elevación
- ❌ Inter como fuente principal sin más consideración
- ❌ Hero con imagen de stock de fondo
- ❌ 3 features iguales en fila como única forma de presentar propuesta de valor
- ❌ Botones primarios azules sin más

## Tipografía — principios

- **No usar Inter como primera opción.** Explorar alternativas de calidad: Geist (Vercel), DM Sans, Plus Jakarta Sans, Instrument Sans, Syne, Outfit.
- **Fontshare** para fuentes de calidad sin cargo comercial.
- **Display vs Body:** usar fuentes distintas para headings y body text cuando la jerarquía lo requiera.
- **Tamaño mínimo legible:** 16px en body (no 14px para ahorrar espacio).

## Color — principios

- Usar **OKLCH** para definir paletas (mejor percepción humana que HSL)
- Los colores de estado (éxito, error, advertencia, info) deben ser distinguibles sin depender solo del color (añadir icono + texto siempre)
- Dark mode: nunca negro puro (#000) — usar grises oscuros tonalmente neutros o cálidos

## Componentes — principios

- **Compound components** para cualquier elemento con más de 3 variantes booleanas
- **4 estados obligatorios** en componentes con datos: empty, loading, error, success
- **Animaciones con propósito** — no animar porque sí. Cada animación debe tener un motivo (feedback, jerarquía, orientación)
- **Reduced motion** siempre respetado

## Modo Conducción — diseño crítico de seguridad

El Modo Conducción requiere una dirección visual diferente al resto de la app:
- Alto contraste siempre (el conductor puede estar bajo el sol)
- Información extremadamente reducida — solo lo esencial
- Botones enormes y bien separados (evitar taps erróneos mientras se conduce)
- Verde/rojo para Aceptar/Rechazar — sin ambigüedad cromática
- Tipografía muy grande para lectura rápida con un vistazo
