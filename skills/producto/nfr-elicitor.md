---
name: nfr-elicitor
description: Activar en Fase 0 para identificar y hacer medibles todos los requisitos no funcionales. Un NFR ambiguo ("la app debe ser rápida") no sirve — cada NFR debe ser medible y verificable. Los NFRs condicionan la arquitectura y deben estar definidos antes de cualquier decisión técnica.
---

# Skill: NFR Elicitor

## Categorías de NFRs y preguntas clave

### Rendimiento
- ¿Cuál es el tiempo máximo de carga aceptable para la pantalla principal? (medido con LCP)
- ¿Hay operaciones que deben completarse en <X segundos bajo carga?
- ¿Cuántos usuarios concurrentes en el peor caso del MVP?
- ¿Hay páginas que deben tener LCP <2.5s para SEO?

**Formato medible:**
```
NFR-PERF-01: La lista de portes disponibles debe cargar con LCP < 2.5s
             medido con Lighthouse en conexión 4G simulada.
NFR-PERF-02: El endpoint /api/portes debe responder en < 500ms en el P95
             con 100 usuarios concurrentes.
```

### Disponibilidad
- ¿Puede el sistema estar caído? ¿Cuánto tiempo al mes es aceptable?
- ¿Hay operaciones críticas que no pueden fallar nunca? (pagos, datos de emergencia)
- ¿Se necesita modo offline en alguna parte?

**Formato medible:**
```
NFR-DISP-01: Disponibilidad mínima del 99.5% mensual (= max 3.6h de downtime/mes).
NFR-DISP-02: El endpoint de pago debe tener disponibilidad del 99.9%.
```

### Seguridad
- ¿Hay datos sensibles? ¿De qué tipo? (PII, financieros, médicos, credenciales)
- ¿Qué nivel de autenticación se necesita?
- ¿Hay requisitos de auditoría o trazabilidad de acciones?

**Formato medible:**
```
NFR-SEG-01: Todos los datos de usuarios (DNI, IBAN, teléfono) deben estar
            encriptados en reposo con AES-256.
NFR-SEG-02: Las sesiones expiran después de 24h de inactividad.
NFR-SEG-03: Todos los accesos a datos de pago quedan registrados en audit log.
```

### Accesibilidad
- ¿Hay usuarios con discapacidades visuales, motoras o cognitivas?
- ¿Es un servicio público o tiene usuarios de edad avanzada?
- ¿Hay requisitos legales de accesibilidad?

**Formato medible:**
```
NFR-ACC-01: La aplicación cumple WCAG 2.1 nivel AA en todas las pantallas.
NFR-ACC-02: Todas las funcionalidades son utilizables solo con teclado.
NFR-ACC-03: El contraste mínimo es 4.5:1 para texto normal, 3:1 para texto grande.
```

### Internacionalización
- ¿Puede el producto crecer a otros idiomas en los próximos 12 meses?
- ¿Hay usuarios en zonas horarias diferentes?
- ¿Hay monedas, formatos de fecha o unidades que varían por país?

**Formato medible:**
```
NFR-I18N-01: La arquitectura del frontend debe soportar i18n desde el inicio,
             aunque solo se implemente español en el MVP.
NFR-I18N-02: Todas las fechas se almacenan en UTC y se muestran en la zona
             horaria del usuario.
```

### Privacidad y Legal
- ¿El producto recoge datos personales de usuarios de la UE? → RGPD obligatorio
- ¿Hay menores de edad como usuarios?
- ¿Hay requisitos de retención o eliminación de datos?

**Formato medible:**
```
NFR-PRIV-01: El usuario puede eliminar su cuenta y todos sus datos en < 30 días
             (derecho al olvido RGPD). Esto es un requisito funcional.
NFR-PRIV-02: Los datos de GPS solo se conservan durante el porte activo + 90 días
             (según política legal).
```

### Escalabilidad
- ¿El sistema debe escalar automáticamente ante picos de tráfico?
- ¿Cuánto puede crecer la base de datos en el primer año?

**Formato medible:**
```
NFR-ESC-01: El sistema debe soportar 10x el tráfico del MVP sin cambios
            de arquitectura (solo añadiendo instancias).
```

## Cómo los NFRs condicionan la arquitectura

| NFR | Implicación arquitectónica |
|-----|---------------------------|
| LCP < 2.5s | Server-Side Rendering o Static Generation — no SPA pura |
| 99.9% disponibilidad | BD replicada, load balancer, no single point of failure |
| RGPD derecho al olvido | Borrado en cascada en el modelo de datos desde el diseño |
| i18n desde el inicio | Ningún string hardcodeado en los componentes |
| Modo offline | Service Worker + estrategia de sincronización |
| Usuarios con discapacidad | shadcn/ui + Radix (accesibles por defecto) en lugar de componentes custom |
