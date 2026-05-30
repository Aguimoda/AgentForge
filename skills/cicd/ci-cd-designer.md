---
name: ci-cd-designer
description: Activar para diseñar o modificar pipelines de CI/CD. El pipeline es el sistema nervioso del proyecto — valida que cada cambio cumple la spec antes de llegar a producción. Cubre diseño de stages, caché, paralelización, self-healing loop, estrategia de entornos y feature flags.
---

# Skill: CI/CD Designer

## El pipeline ideal — stages en orden

```
Commit → [Type Check] → [Lint] → [Unit Tests] → [Build] → [BDD Tests] → [Security Audit] → Deploy
```

Cada stage bloquea el siguiente si falla. Tiempo objetivo total: <5 minutos.

## Optimización de velocidad

### Caché de dependencias
```yaml
- name: Cache node_modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: ${{ runner.os }}-node-
```

### Paralelización
```yaml
jobs:
  type-check:        # ~30s
    runs-on: ubuntu-latest
    steps: [...]

  lint:              # ~20s — en paralelo con type-check
    runs-on: ubuntu-latest
    steps: [...]

  unit-tests:        # ~1min — en paralelo
    runs-on: ubuntu-latest
    steps: [...]

  bdd-tests:         # ~3min — espera a que pasen los anteriores
    needs: [type-check, lint, unit-tests]
    runs-on: ubuntu-latest
    steps: [...]
```

## Self-Healing Loop

Cuando el CI falla, capturar el error y enviarlo al agente para corrección:

```yaml
- name: Run BDD tests
  id: bdd
  run: npm run test:bdd
  continue-on-error: true

- name: Send failure to Claude Code
  if: steps.bdd.outcome == 'failure'
  run: |
    # Capturar el output del test fallido
    echo "Tests fallaron. Output:"
    cat test-results/report.json
    # En un sistema con Claude Code API, aquí se enviaría al agente
    # claude "Los tests BDD fallaron con este error: $(cat test-results/report.json). Corrígelo."
```

## Estrategia de entornos y deploys

```yaml
# Deploy a staging: automático en cada merge a develop
on:
  push:
    branches: [develop]

# Deploy a producción: manual con aprobación
on:
  workflow_dispatch:
    inputs:
      confirm:
        description: 'Escribe "deploy" para confirmar'
        required: true
```

## Feature Flags para deploys seguros

```typescript
// Desplegar código sin activarlo hasta estar seguros
const FEATURE_FLAGS = {
  MODO_CONDUCCION_V2: process.env.FF_MODO_CONDUCCION_V2 === 'true',
  NUEVO_SISTEMA_PAGOS: process.env.FF_NUEVO_PAGOS === 'true',
}

// En el código
if (FEATURE_FLAGS.MODO_CONDUCCION_V2) {
  return <ModoConduccionV2 />
}
return <ModoConduccion />
```

## Branch Protection Rules (GitHub)

```
Rama main:
✅ Require PR before merging
✅ Require CI to pass
✅ Require at least 1 approval
✅ Require branches to be up to date
❌ Allow force pushes
✅ Delete branch after merge
```

## Checklist de un pipeline bien diseñado

- [ ] Todos los stages tienen timeout definido
- [ ] Las dependencias están cacheadas
- [ ] Los stages independientes corren en paralelo
- [ ] El total no supera 5-8 minutos
- [ ] Los errores de test producen un reporte legible
- [ ] Los secrets están en CI/CD variables, no en el código
- [ ] El deploy a producción requiere aprobación manual
- [ ] Hay notificación cuando el pipeline falla en `main`
