---
name: i18n-designer
description: Activar cuando el proyecto necesita soporte multiidioma o cuando hay texto hardcoded en el código que debería estar en archivos de traducción. Define la arquitectura de i18n, los patrones correctos y los casos edge que siempre se olvidan.
---

# Skill: i18n Designer

## Cuándo implementar i18n

```
✅ Si el producto se va a lanzar en más de 1 idioma desde el principio
✅ Si hay inversores o mercados extranjeros en el roadmap próximo
⚠️  Si es solo 1 idioma por ahora: preparar la arquitectura pero no extraer las traducciones aún
   (usar constantes en vez de strings hardcoded facilita la extracción después)
❌ No implementar i18n completo si no hay un segundo idioma planificado — over-engineering
```

## Stack recomendado (Next.js)

```bash
npm install next-intl
```

## Estructura de archivos

```
messages/
  es.json          # español (idioma base)
  en.json          # inglés
  fr.json          # francés
  ...

app/
  [locale]/        # segmento de ruta para el idioma
    layout.tsx
    page.tsx
```

## Formato de los archivos de traducción

```json
// messages/es.json
{
  "common": {
    "loading": "Cargando...",
    "error": "Ha ocurrido un error",
    "retry": "Intentar de nuevo",
    "cancel": "Cancelar",
    "confirm": "Confirmar",
    "save": "Guardar",
    "delete": "Eliminar"
  },
  "auth": {
    "login": "Iniciar sesión",
    "logout": "Cerrar sesión",
    "email": "Correo electrónico",
    "password": "Contraseña",
    "forgotPassword": "¿Olvidaste tu contraseña?"
  },
  "portes": {
    "title": "Mis portes",
    "empty": "No tienes portes publicados",
    "create": "Publicar porte",
    "status": {
      "pendiente": "Pendiente",
      "asignado": "Asignado",
      "recogido": "Recogido",
      "entregado": "Entregado",
      "cancelado": "Cancelado"
    },
    "precio": "{precio, number, currency}",
    "distancia": "{km, number} km"
  }
}
```

## Uso en componentes

```typescript
// ✅ Con next-intl
import { useTranslations } from 'next-intl'

function PorteCard({ porte }: { porte: Porte }) {
  const t = useTranslations('portes')

  return (
    <div>
      <h3>{t('title')}</h3>
      <span>{t('status.' + porte.estado)}</span>
      <span>{t('precio', { precio: porte.precioCentimos / 100 })}</span>
    </div>
  )
}

// ✅ Pluralización (no concatenar strings)
// messages/es.json:
// "resultados": "{count, plural, =0 {Sin resultados} one {# resultado} other {# resultados}}"

const t = useTranslations('busqueda')
t('resultados', { count: portes.length })
// → "Sin resultados" | "1 resultado" | "5 resultados"

// ✅ Para texto en server components
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'metadata' })
  return { title: t('portes.title') }
}
```

## Los casos edge que siempre se olvidan

### 1. Fechas y horas

```typescript
// ❌ Formatear fechas manualmente
const fecha = new Date(porte.createdAt).toLocaleDateString('es-ES')

// ✅ Dejar que next-intl use la locale correcta
import { useFormatter } from 'next-intl'

function FechaPorte({ date }: { date: Date }) {
  const format = useFormatter()
  return (
    <time dateTime={date.toISOString()}>
      {format.dateTime(date, { dateStyle: 'long', timeStyle: 'short' })}
    </time>
  )
}
// → "15 de marzo de 2024, 14:30" en español
// → "March 15, 2024, 2:30 PM" en inglés
```

### 2. Números y moneda

```typescript
// ❌ Formatear moneda manualmente
`${(precio / 100).toFixed(2)}€`

// ✅ Con Intl (respeta el formato local)
const format = useFormatter()
format.number(precio / 100, { style: 'currency', currency: 'EUR' })
// → "45,00 €" en español
// → "€45.00" en inglés
```

### 3. Dirección de texto (RTL)

```typescript
// Si se añade árabe, hebreo, persa → necesita RTL support
// En layout.tsx:
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>

// En Tailwind: usar logical properties
// ❌ ml-4 (margin-left — no funciona bien en RTL)
// ✅ ms-4 (margin-start — se invierte automáticamente en RTL)
```

### 4. Contenido dinámico con variables

```typescript
// ❌ Concatenar strings traduccibles
t('hola') + ' ' + usuario.nombre  // el orden puede cambiar según el idioma

// ✅ Variables dentro de la traducción
// messages/es.json: "saludo": "Hola, {nombre}"
// messages/ar.json: "saludo": "{nombre}، مرحباً"  // orden diferente en árabe
t('saludo', { nombre: usuario.nombre })
```

### 5. URLs y slugs

```typescript
// Las rutas pueden necesitar traducción también
// /portes vs /shipments vs /envois

// Con next-intl pathnames:
const pathnames = {
  '/portes': {
    es: '/portes',
    en: '/shipments',
    fr: '/envois',
  }
}
```

## Checklist de i18n

- [ ] No hay strings hardcoded en español dentro de componentes (todo en messages/)
- [ ] Los archivos de traducción tienen la misma estructura en todos los idiomas
- [ ] Las fechas y monedas usan el formatter de next-intl (no toLocaleDateString manual)
- [ ] Las pluralizaciones usan el formato ICU (no condiciones if/else)
- [ ] Los metadatos (title, description) están traducidos
- [ ] Los mensajes de error de validación están en los archivos de traducción
- [ ] Los textos de email y notificaciones push están traducidos
- [ ] Se ha verificado que el layout no se rompe con textos más largos (alemán es ~30% más largo que inglés)
