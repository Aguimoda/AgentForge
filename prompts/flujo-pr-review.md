# Flujo: Revisión de Pull Request (UX/UI + Accesibilidad)

Usa este prompt para revisar un PR antes de mergearlo.

---

## Prompt

```
Revisa el Pull Request que cubre la User Story [US-ID].

Archivos modificados: [lista de archivos o "los del PR actual"]

Realiza la revisión en este orden:

1. CORRECCIÓN FUNCIONAL
   - ¿Los escenarios Gherkin de specs/features/.../[US-ID]-*.feature pasan?
   - ¿Los criterios de aceptación del PRD están cubiertos?

2. ACCESIBILIDAD (Web Design Guidelines skill)
   - ARIA attributes correctos
   - Semántica HTML
   - Focus states visibles
   - Tap targets mínimos (44x44px, 64x64px en Modo Conducción)
   - Contraste de colores
   - Navegación por teclado completa
   - Mensajes de error con aria-describedby

3. PERFORMANCE (React Best Practices skill)
   - ¿Hay waterfalls de requests evitables?
   - ¿Se usan Server Components donde corresponde?
   - ¿Hay re-renders innecesarios?
   - ¿Las imágenes usan next/image?

4. CALIDAD DE CÓDIGO
   - Props tipadas con TypeScript interface
   - Sin barrel imports
   - Compound components si hay >3 props booleanas
   - Estados empty/loading/error/success en componentes con datos

5. DISEÑO Y UX
   - ¿Es mobile-first? (verificar en 375px)
   - ¿Respeta la dirección visual del design system?
   - ¿Sin AI slop? (Inter por defecto, gradientes genéricos, etc.)
   - Si es Modo Conducción: botones ≥64px, info mínima, alto contraste

Prioriza los hallazgos:
🔴 CRÍTICO — bloquea el merge (bug funcional, fallo de accesibilidad grave)
🟡 IMPORTANTE — debe resolverse en este sprint
🟢 SUGERENCIA — mejora deseable, no bloquea
```

---

## Checklist rápido antes de pedir review

- [ ] Escenarios BDD de la US pasan en local
- [ ] Tests unitarios pasan (si aplica)
- [ ] Verificado en 375px (Chrome DevTools)
- [ ] Verificado en 1280px
- [ ] Navegación por teclado funciona
- [ ] No hay `console.log` en el código
- [ ] Commit referencia el ID de la User Story: `feat: [US-XX] descripción`
