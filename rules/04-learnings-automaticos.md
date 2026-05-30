---
description: Learnings automáticos — registrar hallazgos en estado.md al final de cada sesión. Siempre activo.
alwaysApply: true
---
# Regla: Learnings automáticos

> Al final de cualquier sesión donde se haya usado una skill, descubierto un patrón útil, o encontrado una limitación importante, añadir una entrada en el learnings.md correspondiente.

## Cuándo añadir un learning

- Una skill no funcionó como se esperaba → documentar qué falló y cómo resolverlo
- Un patrón de código funcionó especialmente bien → documentar para reutilizarlo
- Un enfoque de diseño generó el resultado esperado → documentar la dirección
- Un escenario Gherkin fue difícil de implementar → documentar la solución
- Una decisión de producto generó consecuencias inesperadas → documentar

## Formato obligatorio

```markdown
## [Fecha YYYY-MM-DD] — [Título descriptivo breve]

**Contexto:** [Qué se estaba haciendo — User Story, componente, flujo]
**Hallazgo:** [Qué aprendiste — problema, solución, patrón]
**Aplicar en:** [Cuándo/dónde aplicar este aprendizaje en el futuro]
```

## Dónde guardar los learnings

- **Skills específicas:** dentro de la carpeta de la skill → `.claude/skills/[skill-name]/learnings.md`
- **Proyecto general:** `.claude/learnings.md`
- **Specs y BDD:** `.claude/learnings-specs.md`

## Ejemplo

```markdown
## 2026-05-17 — GPS en iOS web no funciona en segundo plano

**Contexto:** Implementando el tracking en tiempo real para el Modo Conducción Express.
**Hallazgo:** En iOS, la API de Geolocalización web deja de enviar posiciones cuando la pantalla se apaga o el usuario cambia de app. Afecta directamente al tracking del conductor y al Modo Conducción. Posible solución: PWA con background fetch o wrapper nativo mínimo (Capacitor/Expo) solo para esta funcionalidad.
**Aplicar en:** Antes de Sprint 2, definir con el socio técnico la solución para GPS en iOS antes de empezar a implementar el Modo Conducción.
```
