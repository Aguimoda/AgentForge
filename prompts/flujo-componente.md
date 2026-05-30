# Flujo: Diseño e implementación de componente

Usa este prompt cuando vayas a crear un nuevo componente frontend.

---

## Prompt

```
Voy a implementar el componente [NombreComponente] para la User Story [US-ID].

Antes de escribir código:
1. Lee la User Story [US-ID] del PRD para entender el comportamiento esperado
2. Define la dirección visual del componente (no AI slop — justifica las decisiones):
   - Sensación que debe transmitir
   - Fuentes y escala tipográfica
   - Paleta de colores
   - Espaciado y border-radius

Implementación:
- Framework: Next.js 15 App Router + TypeScript
- Estilos: Tailwind CSS v4
- Accesibilidad WCAG 2.1 AA (comprobar con Web Design Guidelines skill)
- Mobile-first (375px → 768px → 1280px)
- Props tipadas con TypeScript interface
- Estados obligatorios: empty | loading | error | success (si aplica)
- Compound components si tiene más de 3 variantes booleanas
- aria-label en botones icon-only

Contexto adicional: [descripción del contexto de uso, qué datos muestra, cómo se usa]

Después de implementar:
- Audita el componente con la Web Design Guidelines skill
- Verifica que es navegable por teclado
- Verifica mobile en 375px y desktop en 1280px
```

---

## Variante: Modo Conducción

```
Voy a implementar la pantalla/componente [Nombre] para el Modo Conducción de De Vacío.

IMPORTANTE — Modo Conducción tiene requisitos especiales de UX/seguridad:
- El transportista lo usa mientras conduce con el móvil en el salpicadero
- Botones mínimo 64x64px (más grande que el estándar WCAG)
- Texto mínimo 24px en información clave
- Máximo 2 acciones visibles a la vez
- Alto contraste siempre (puede haber luz solar directa)
- Alerta sonora + vibración para peticiones entrantes
- Confirmaciones en un solo tap sin zonas pequeñas

User Story: [US-ID]
Funcionalidad: [descripción]
```

---

## Checklist de PR para componentes

Antes de hacer el PR de un componente:
- [ ] Tests Playwright BDD pasan (escenarios Gherkin de la User Story)
- [ ] Tests unitarios Vitest pasan (si hay lógica compleja)
- [ ] Auditado con Web Design Guidelines skill
- [ ] Navegable por teclado (Tab, Enter, Escape)
- [ ] Verificado en 375px (mobile) y 1280px (desktop)
- [ ] Dark mode funciona (si aplica al design system)
- [ ] `aria-label` en todos los botones icon-only
- [ ] Estados empty/loading/error/success implementados (si aplica)
- [ ] Sin barrel imports
- [ ] Props tipadas con interface TypeScript
