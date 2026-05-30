---
name: brand-identity
description: Activar después del visual research para traducir la identidad del producto en decisiones visuales concretas. Define la paleta de color con justificación psicológica, elige la tipografía correcta para el contexto, establece el tono visual y genera los design tokens fundamentales.
---

# Skill: Brand Identity

## El principio

> Cada decisión visual tiene una razón. No "me gusta el azul" — sino "el azul comunica confianza y es el color dominante en el sector logístico, pero usamos un matiz más saturado y cálido para diferenciarnos de los competidores que usan azules corporativos fríos".

---

## Paso 1: Definir la personalidad visual (atributos de marca)

Antes de elegir ningún color, definir 3-5 adjetivos que describan cómo debe sentirse el producto:

```
Ejercicio: "Si nuestro producto fuera una persona, sería..."

Ejemplos por tipo de producto:
Fintech premium:   Confiable, Sofisticado, Eficiente, Claro
App de salud:      Tranquilizador, Empático, Limpio, Motivador
Marketplace P2P:   Cercano, Dinámico, Transparente, Accesible
App de productividad: Enfocado, Potente, Rápido, Sin distracciones
Gaming/entretenimiento: Emocionante, Vibrante, Social, Divertido
```

---

## Paso 2: Psicología del color — elegir la paleta

### Colores principales por emoción/contexto

```
AZUL (distintas tonalidades):
→ Azul frío + claro (#2563EB, #3B82F6): confianza, tecnología, profesionalidad
   Usado en: Stripe, PayPal, Twitter, LinkedIn, Notion
→ Azul marino (#1E3A5F): autoridad, seriedad, premium
   Usado en: American Express, Booking.com
→ Azul cyan (#06B6D4): moderno, digital, accesible
   Usado en: Vercel, Tailwind docs

VERDE:
→ Verde esmeralda (#10B981, #059669): éxito, salud, sostenibilidad, crecimiento
   Usado en: Robinhood, Spotify (dark), WhatsApp
→ Verde lima (#84CC16): energía, frescura, naturaleza
   Usado en: apps de fitness, comida saludable

MORADO:
→ Morado medio (#7C3AED, #8B5CF6): creatividad, premium, innovación, magia
   Usado en: Figma, Twitch, Duolingo, Notion (accents)

NARANJA:
→ Naranja cálido (#F97316, #EA580C): energía, urgencia, acción, movimiento
   Usado en: Amazon, Airbnb, Bumble, apps de transporte/delivery

ROJO:
→ Rojo vivo (#DC2626, #EF4444): urgencia, pasión, alertas. Cuidado: agresivo en exceso
   Mejor como color de acento/error que como primario

NEGRO / NEUTROS OSCUROS:
→ Negro/gris oscuro: sofisticación, premium, minimalismo
   Usado en: Apple, Vercel, Linear, Arc Browser

BLANCO / NEUTROS CLAROS:
→ Limpio, abierto, espacio para respirar
→ El fondo por defecto de los productos más exitosos
```

### Estructura de la paleta

```typescript
// Una paleta bien estructurada para un producto digital:

// 1. Color primario — la acción principal, el CTA, el botón más importante
//    Debe destacar sobre el fondo. Debe ser memorable.
primary: '#[hex]'
primaryHover: '[versión 10-15% más oscura]'
primaryLight: '[versión 90% más clara — para fondos de elementos primarios]'

// 2. Color secundario (opcional) — para CTAs secundarios o elementos de apoyo
//    Complementario al primario. No competir en prominencia.

// 3. Semánticos — universales, no tocar (solo ajustar el matiz)
success: '#16A34A'   // verde — confirmaciones, éxito
warning: '#D97706'   // ámbar — advertencias
error: '#DC2626'     // rojo — errores, destrucción
info: '#2563EB'      // azul — información neutral

// 4. Neutros — el 80% de la interfaz
text.primary: '#111827'    // texto principal
text.secondary: '#6B7280'  // texto secundario
text.disabled: '#9CA3AF'   // texto deshabilitado
bg.page: '#F9FAFB'         // fondo de página (muy ligeramente gris es más descansado que blanco puro)
bg.card: '#FFFFFF'         // fondo de tarjetas
border.default: '#E5E7EB'  // bordes sutiles
```

---

## Paso 3: Tipografía — elegir con criterio

### Categorías y cuándo usarlas

```
SANS-SERIF GEOMÉTRICAS (la elección segura para producto digital):
→ Inter: la fuente más usada en SaaS moderno. Excelente legibilidad. Neutral.
→ DM Sans: ligeramente más personalidad que Inter. Moderna, limpia.
→ Plus Jakarta Sans: algo más expresiva, buena para productos con carácter propio.
→ Geist (Vercel): muy técnica, para productos dev-tools / técnicos.

SANS-SERIF HUMANISTAS (más cálidas, personales):
→ Nunito: redondeada, amigable. Buena para apps consumer, salud, bienestar.
→ Poppins: geométrica pero con carácter. Buena para startups con personalidad.
→ Lato: neutral, profesional. Similar a Inter pero ligeramente más cálida.

SERIF (proyectan autoridad, editorial, premium):
→ Playfair Display: elegante, editorial. Para headings en productos premium.
→ Lora: legible en cuerpo de texto, cálida. Medios, publicaciones, startups con historia.
→ NOTA: rara vez un serif como cuerpo de texto en producto digital — fatiga visual.

MONOSPACE (para productos técnicos / developer tools):
→ JetBrains Mono: excelente legibilidad en código.
→ Fira Code: ligaduras para código, popular entre developers.
→ IBM Plex Mono: más corporativa, usada en products más formales.
```

### Escala tipográfica

```
Basada en una raíz de 1rem (16px base):
xs:   0.75rem  (12px)  — labels, badges, metadata muy secundaria
sm:   0.875rem (14px)  — texto secundario, descripciones
base: 1rem     (16px)  — cuerpo de texto (MÍNIMO en mobile — no reducir)
lg:   1.125rem (18px)  — texto ligeramente destacado
xl:   1.25rem  (20px)  — subtítulos pequeños
2xl:  1.5rem   (24px)  — subtítulos
3xl:  1.875rem (30px)  — títulos de sección
4xl:  2.25rem  (36px)  — títulos de página (mobile)
5xl:  3rem     (48px)  — títulos hero (desktop)
```

---

## Paso 4: Verificación WCAG (obligatoria antes de aprobar)

```
Ratios de contraste mínimos (WCAG 2.1 AA):
→ Texto normal (<18px): 4.5:1
→ Texto grande (≥18px o ≥14px bold): 3:1
→ Elementos UI (botones, inputs, iconos): 3:1

Herramienta: https://webaim.org/resources/contrastchecker/
O en código: npm install wcag-contrast

Pares a verificar siempre:
- Texto primario sobre fondo de página
- Texto en botón primario sobre color primario
- Texto secundario sobre fondo de página (el más problemático)
- Texto de placeholder sobre fondo de input
- Iconos sobre su fondo
```

---

## Paso 5: Output — VISUAL-BRIEF.md

```markdown
# Visual Brief — [Nombre del Proyecto]

## Personalidad visual
[3-5 adjetivos que definen cómo se siente el producto]

## Referentes de diseño
[Los 3 productos cuyo estilo visual más se acerca a lo que queremos]

## Decisiones de color

### Color primario: [hex] — [nombre descriptivo]
**Por qué**: [justificación basada en psicología + sector + diferenciación]
**Contraste sobre blanco**: [ratio]:1 ✅ / ❌
**Uso**: CTAs principales, elementos activos, acento de navegación

### Color de fondo: [hex]
**Por qué**: [...]

### Paleta completa
[Tabla con todos los tokens de color, hex y uso]

## Tipografía

### Fuente principal: [nombre]
**Por qué**: [legibilidad + carácter + connotaciones]
**Pesos usados**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
**Fuente**: Google Fonts / Fontshare / comercial

### Escala tipográfica
[Tabla con todas las medidas]

## Estilo visual
[Descripción del look and feel en 1 párrafo: sombras, radios, densidad, color de modo oscuro si aplica]

## Lo que este diseño comunica
[Cómo las decisiones visuales evocan los atributos de marca definidos]

## Lo que este diseño NO es
[Los estilos o referencias que conscientemente evitamos y por qué]
```

## Checklist de identidad visual completa

- [ ] Personalidad visual definida con 3-5 adjetivos
- [ ] Color primario elegido con justificación psicológica y sectorial
- [ ] Paleta semántica completa (success, warning, error, info)
- [ ] Escala de neutros completa
- [ ] Todos los pares de contraste verificados con WCAG AA ✅
- [ ] Tipografía elegida con justificación de legibilidad y connotaciones
- [ ] Escala tipográfica completa
- [ ] Visual Brief aprobado antes de implementar el design system
- [ ] Design tokens generados en `lib/design-tokens.ts`
