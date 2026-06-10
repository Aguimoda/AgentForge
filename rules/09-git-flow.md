# Regla: Git Flow — siempre activo, sin excepciones

> Esta regla NO tiene excepciones. Ni para hotfixes urgentes, ni para
> cambios de una línea, ni cuando "solo es un typo".

---

## FLUJO OBLIGATORIO — de principio a fin

```
1. RAMA NUEVA desde main
         git checkout -b tipo/descripcion-corta

2. DESARROLLAR EN LOCAL
         Tests siempre verdes antes de continuar

3. SI HAY MIGRACIÓN DE BD → aplicar primero en STAGING
         (ver protocolo de migraciones más abajo)

4. COMMIT ATÓMICO por cada scenario completado
         Prefijos: feat: fix: design: spec: test: docs: refactor: chore:

5. PUSH Y ABRIR PR
         git push origin nombre-de-la-rama
         Abrir PR en GitHub contra main

6. CI VERDE (automático — GitHub Actions)
         type-check → lint → unit tests → build → E2E
         Si falla algún gate → corregir antes de continuar

7. PREVIEW DEPLOYMENT (automático al abrir el PR)
         Conectado al entorno de STAGING
         Verificar manualmente que la feature funciona aquí

8. MERGE A MAIN (solo con CI verde + preview verificado)
         Deploy automático a producción
```

---

## NOMBRES DE RAMA

```
feat/us-XX-descripcion       → feature nueva
fix/descripcion-del-bug      → bug fix
design/descripcion            → cambio visual
refactor/descripcion          → refactor sin cambio de comportamiento
docs/descripcion              → solo documentación
chore/descripcion             → mantenimiento (deps, config)
```

**NUNCA:** `main`, `master`, `develop`, `hotfix-xxx`, nombres sin prefijo.

---

## GATES — comprobaciones obligatorias antes de cada paso

### Antes de hacer push

```
☐ type-check   → 0 errores
☐ lint         → 0 errores
☐ unit tests   → todos en verde
☐ build        → sin errores
```

Si alguno falla → no hacer push. Corregir primero.

### Antes de mergear el PR

```
☐ CI verde (todos los jobs)
☐ Preview deployment verificado manualmente
☐ Si había migración de BD → aplicada en staging y verificada
☐ Checklist de producción actualizado si hay algo que cambia en prod
```

---

## PROTOCOLO DE MIGRACIONES DE BD

Este es el punto más crítico. El orden es INAMOVIBLE:

```
1. Escribir la migración
   [carpeta de migraciones]/YYYYMMDDXXXXXX_descripcion.sql
   Nunca modificar migraciones ya aplicadas — crear una nueva.

2. Aplicar en STAGING
   [proyecto/BD de staging — definir en ENVIRONMENTS.md]

3. Verificar en staging
   La feature debe funcionar en el Preview deployment

4. Aplicar en PRODUCCIÓN (solo cuando el PR ya está listo para merge)
   [proyecto/BD de producción — definir en ENVIRONMENTS.md]

5. Mergear el PR
```

**Si mergeas antes de aplicar la migración en producción → el código
llega a prod con una BD que no tiene las columnas/tablas → error 500.**

---

## LO QUE ESTÁ PROHIBIDO

| Acción prohibida | Por qué |
|-----------------|---------|
| `git push origin main` (push directo) | Salta CI y branch protection |
| `git commit --amend` en commits ya pusheados | Reescribe historia pública |
| Modificar una migración ya aplicada en cualquier entorno | Rompe la historia de schema |
| Aplicar migración en producción sin haberla probado en staging | Riesgo de datos irrecuperables |
| Mergear con CI en rojo | El código roto llega a producción |
| Mergear sin verificar el Preview | Los errores de integración no se detectan |
| Secrets en el código o en git | Compromiso de seguridad |

---

## ENTORNOS — plantilla de referencia

> Rellenar por proyecto en `docs/ENVIRONMENTS.md` y referenciar aquí.

| Entorno | URL | BD | Se despliega cuando |
|---------|-----|----|---------------------|
| Local | localhost:[puerto] | [BD local o staging] | dev server |
| Staging/Preview | [URL preview] | [BD staging] | Al abrir PR |
| Producción | [URL producción] | [BD producción] | Al mergear a main |

---

## CUANDO EL CI FALLA

No mergear. No buscar workarounds. Corregir el problema:

1. Ver qué gate falló en GitHub Actions
2. Reproducir el error en local con el mismo comando
3. Corregir y hacer push a la misma rama
4. El CI vuelve a correr automáticamente

Si el fallo es un test flaky (falla aleatoriamente sin cambio de código):
→ Investigar la causa raíz, no añadir `continue-on-error`.

---

## CUANDO HAY UN BUG EN PRODUCCIÓN

Mismo flujo. Sin atajos:

```
1. Crear rama: fix/descripcion-del-bug
2. Reproducir en local
3. Fix + test que lo cubra (para que nunca vuelva)
4. PR → CI → Preview → Merge
5. Si el bug requiere migración de BD → protocolo de migraciones
```

Para rollback mientras se prepara el fix → `docs/runbooks/rollback.md`
