---
name: dependency-manager
description: Activar cuando se añade, actualiza o audita una dependencia. Evalúa si una dependencia merece añadirse, define la política de actualizaciones y gestiona las vulnerabilidades de seguridad.
---

# Skill: Dependency Manager

## Antes de añadir una dependencia — 5 preguntas

1. **¿Es realmente necesaria?** ¿Puedo hacer esto con 10 líneas de código o con una API nativa del runtime?
2. **¿Está mantenida?** Último commit hace >12 meses → buscar alternativa
3. **¿Cuánto pesa?** `bundlephobia.com` — ¿el bundle size justifica el valor?
4. **¿Qué licencia tiene?** MIT/Apache-2.0 = OK. GPL = cuidado. Sin licencia = no usar.
5. **¿Tiene vulnerabilidades conocidas?** `npm audit` antes de instalar

## Política de actualizaciones

```
Patch (1.0.X): Actualizar automáticamente — fixes de bugs y seguridad
Minor (1.X.0): Revisar changelog, actualizar semanalmente — nuevas features retrocompatibles
Major (X.0.0): Analizar breaking changes, planificar como tarea de sprint
Seguridad crítica: Parchear en <24h independientemente del tipo de versión
```

## Configurar Dependabot/Renovate

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
    ignore:
      # No actualizar automáticamente majors
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
```

## Auditoría de seguridad

```bash
# En local antes de cualquier PR con dependencias nuevas
npm audit

# Solo errores de alta severidad (lo que bloquea el CI)
npm audit --audit-level=high

# Ver qué dependencias están desactualizadas
npm outdated

# Actualizar todo a la última versión compatible
npm update
```

## Eliminar dependencias innecesarias

```bash
# Encontrar dependencias que no se usan
npx depcheck

# Analizar qué aporta cada dependencia al bundle
npx webpack-bundle-analyzer (o equivalente del stack)
```

## Dependencias que merecen evaluación especial

- **Momentjs/dayjs/date-fns:** evaluar si la API nativa `Intl` es suficiente
- **Lodash:** evaluar si los métodos nativos de ES2020+ son suficientes
- **Axios:** evaluar si `fetch` nativo es suficiente
- **jQuery:** no en proyectos nuevos con framework moderno
- **node-fetch:** no en Node 18+ (fetch ya es nativo)
