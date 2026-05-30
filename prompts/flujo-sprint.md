# Flujo: Inicio de Sprint

Usa este prompt al inicio de cada sprint para planificar la implementación.

---

## Prompt de inicio de sprint

```
Vamos a planificar el Sprint [número]. Las User Stories de este sprint son:
[lista de IDs: US-XX, US-XX, US-XX]

Para cada User Story:
1. Lee la User Story completa del PRD (docs/fase2_definicion_requisitos.md)
2. Identifica los archivos que habrá que crear o modificar
3. Estima la complejidad: S (1-2 días) / M (3-5 días) / L (1-2 semanas)
4. Identifica dependencias entre historias (cuál debe ir antes)
5. Genera el plan de implementación en .claude/plan.md

Para cada historia, el plan debe incluir:
- Escenarios BDD a escribir primero
- Tests unitarios si hay lógica compleja
- Componentes a crear
- API calls / integraciones
- Criterio de DONE: "Esta historia está completa cuando los escenarios Gherkin [US-XX] pasan"

Genera también el .claude/todo.md actualizado con el estado inicial del sprint.
```

---

## Prompt de cierre de historia

```
La User Story [US-ID] está implementada.

Verifica que está realmente completa:
1. Ejecuta los escenarios Gherkin de specs/features/[...]/[US-ID]-*.feature
2. Verifica que todos los criterios de aceptación del PRD están cubiertos
3. Ejecuta la auditoría de accesibilidad del componente afectado
4. Actualiza .claude/todo.md: marca [x] la tarea

¿Algo que documentar en learnings.md de esta implementación?
```

---

## Orden recomendado de implementación por sprint

### Sprint 0 (POC)
Orden: registro básico → roles → publicar porte → publicar viaje → negociación básica → valoraciones

### Sprint 1 (Auth completo)
Orden: recuperar contraseña → perfil → verificación carnet → Stripe KYC → GDPR (eliminación + exportación)

### Sprint 2 (Modo Conducción)
Orden: toggle modo online → Modo Conducción UI → overlay petición (60s) → pop-up custodia directa → un porte activo a la vez → deep link Maps → timeout Express

### Sprint 3 (Verificación y pagos)
Orden: código de recogida → foto obligatoria recogida → código de entrega (+ SMS) → foto obligatoria entrega → Stripe escrow → aviso aseguradora

### Sprint 4 (Tracking y porte en curso)
Orden: GPS tracking tiempo real → confirmación remitente + timeout 24h → mensajería interna → botón incidencia → cancelaciones completas

### Sprint 5 (Admin y cierre MVP)
Orden: flujo disputa → valoraciones bidireccionales → panel admin (verificaciones, incidencias, disputas, reembolsos)
