---
name: design-system-builder
description: Activar al inicio del proyecto para definir el sistema de diseño. Los design tokens (colores, tipografía, espaciado) deben definirse una sola vez y usarse en todos los componentes. Sin este sistema, el diseño se vuelve inconsistente con el tiempo.
---

# Skill: Design System Builder

## La estructura mínima de un design system

```
tokens/          → valores primitivos (colores, tamaños, radios)
components/      → componentes UI que usan los tokens
patterns/        → combinaciones de componentes para casos frecuentes
guidelines/      → cuándo usar qué componente
```

## Design Tokens — la base de todo

```typescript
// lib/design-tokens.ts — definir una sola vez, usar en todas partes

export const tokens = {
  // Colores — usar nombres semánticos, no de color
  colors: {
    // Brand
    primary: '#2563EB',       // azul — acción principal
    primaryHover: '#1D4ED8',
    primaryLight: '#DBEAFE',  // fondo de elementos primarios

    // Semantic
    success: '#16A34A',
    successLight: '#DCFCE7',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    error: '#DC2626',
    errorLight: '#FEE2E2',

    // Neutrals
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
      inverse: '#FFFFFF',
    },
    bg: {
      page: '#F9FAFB',
      card: '#FFFFFF',
      subtle: '#F3F4F6',
    },
    border: {
      default: '#E5E7EB',
      focus: '#2563EB',
    },
  },

  // Tipografía
  typography: {
    fonts: {
      body: "'Inter', -apple-system, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    sizes: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px — base
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: '1.25',
      base: '1.5',
      relaxed: '1.75',
    },
  },

  // Espaciado — escala de 4px
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
  },

  // Border radius
  radii: {
    sm: '0.25rem',   // 4px — badges, tags
    md: '0.5rem',    // 8px — inputs, buttons
    lg: '0.75rem',   // 12px — cards
    xl: '1rem',      // 16px — modals, sheets
    full: '9999px',  // pills, avatars
  },

  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const
```

## Componentes base con variantes

```typescript
// components/ui/Button.tsx — un componente, todas las variantes
import { tokens } from '@/lib/design-tokens'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  children: React.ReactNode
  onClick?: () => void
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  ghost: 'text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-150
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {loading && <Spinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  )
}
```

## Catálogo de componentes mínimo

```
Atoms (elementos básicos):
  Button (primary, secondary, ghost, danger, loading, disabled)
  Input (text, email, tel, password, con error, con icono)
  Select
  Checkbox / Radio
  Badge / Tag
  Avatar
  Spinner / Skeleton

Molecules (combinaciones):
  FormField (label + input + error message)
  SearchBar
  Card
  Modal / Sheet
  Toast / Snackbar
  EmptyState
  ErrorState

Organisms (secciones):
  Navbar
  BottomNavigation (mobile)
  PageHeader
  List (con skeletons para loading)
```

## Cómo documentar los componentes

```typescript
// Cada componente debe tener:
// 1. Props tipadas con TypeScript
// 2. Storybook story (o al menos un ejemplo en comentarios)
// 3. Estado de accesibilidad (qué atributos ARIA incluye)

/**
 * Button — acción principal de la interfaz
 *
 * @example
 * // Acción principal
 * <Button variant="primary" onClick={handleSubmit}>Publicar porte</Button>
 *
 * // Estado de carga
 * <Button variant="primary" loading>Publicando...</Button>
 *
 * // Acción destructiva
 * <Button variant="danger" onClick={handleDelete}>Cancelar porte</Button>
 *
 * @accessibility
 * - Incluye focus ring visible para navegación por teclado
 * - Estado disabled accesible con aria-disabled
 * - Loading state con aria-busy y aria-label descriptivo
 */
```

## Checklist de design system

- [ ] Los colores están definidos como tokens semánticos (no valores hardcoded)
- [ ] La escala de espaciado es consistente (múltiplos de 4px)
- [ ] Los componentes base tienen todas las variantes de estado (default, hover, focus, disabled, error)
- [ ] Los componentes tienen sus props tipadas
- [ ] No hay valores mágicos en los componentes (todo referencia tokens)
- [ ] El sistema de colores cumple WCAG AA (ratio de contraste ≥ 4.5:1)
