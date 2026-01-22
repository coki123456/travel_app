# 🎨 Sistema de Diseño Minimalista Moderno

## Filosofía de Diseño

Este sistema de diseño se basa en principios minimalistas:
- **Espacios amplios**: Respiro visual con padding y márgenes generosos
- **Tipografía clara**: Font Inter con letter-spacing optimizado
- **Colores sutiles**: Paleta neutral con acento azul sereno
- **Sombras ligeras**: Elevación sutil para jerarquía
- **Transiciones suaves**: Animaciones de 150-300ms

---

## 🎨 Paleta de Colores

### Fondos
```css
--color-bg-primary: rgb(250 250 250)     /* Off-white principal */
--color-bg-secondary: rgb(255 255 255)   /* Blanco puro para cards */
--color-bg-tertiary: rgb(247 247 247)    /* Gris muy claro para contraste */
```

### Textos
```css
--color-text-primary: rgb(23 23 23)      /* Negro suave */
--color-text-secondary: rgb(82 82 82)    /* Gris medio */
--color-text-tertiary: rgb(140 140 140)  /* Gris claro */
```

### Bordes
```css
--color-border-light: rgb(235 235 235)   /* Bordes sutiles */
--color-border-medium: rgb(220 220 220)  /* Bordes normales */
```

### Acento (Azul Sereno)
```css
--color-accent: rgb(59 130 246)          /* Azul principal */
--color-accent-hover: rgb(37 99 235)     /* Azul hover */
--color-accent-light: rgb(239 246 255)   /* Azul muy claro */
```

### Estados
```css
--color-success: rgb(34 197 94)          /* Verde */
--color-warning: rgb(251 146 60)         /* Naranja */
--color-error: rgb(239 68 68)            /* Rojo */
```

---

## 📦 Componentes

### Botones

#### Uso de clases CSS
```tsx
// Botón primario
<button className="btn-primary">
  Guardar
</button>

// Botón secundario
<button className="btn-secondary">
  Cancelar
</button>

// Botón ghost (transparente)
<button className="btn-ghost">
  Ver más
</button>
```

#### Uso del componente
```tsx
import LoadingButton from "@/app/components/ui/LoadingButton";

<LoadingButton
  variant="primary"
  isLoading={isSubmitting}
  loadingText="Guardando..."
>
  Guardar cambios
</LoadingButton>
```

---

### Cards

#### Uso de clases CSS
```tsx
// Card básico
<div className="card p-6">
  Contenido
</div>

// Card con hover effect
<div className="card-hover p-6">
  Contenido interactivo
</div>

// Card plano (sin borde)
<div className="card-flat p-6">
  Contenido flat
</div>
```

#### Uso del componente
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/components/ui/Card";

<Card variant="default" padding="md">
  <CardHeader>
    <CardTitle as="h3">Título</CardTitle>
    <CardDescription>Descripción opcional</CardDescription>
  </CardHeader>

  <CardContent>
    Contenido principal
  </CardContent>

  <CardFooter>
    <button className="btn-primary">Acción</button>
  </CardFooter>
</Card>
```

---

### Inputs y Formularios

```tsx
import { FormInput, FormTextarea, FormSelect } from "@/app/components/ui/FormInput";

// Input básico
<FormInput
  label="Nombre"
  placeholder="Ingresá tu nombre"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={error}
  helper="Este campo es obligatorio"
  required
/>

// Textarea
<FormTextarea
  label="Descripción"
  rows={4}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

// Select
<FormSelect
  label="Categoría"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  options={[
    { value: "a", label: "Opción A" },
    { value: "b", label: "Opción B" },
  ]}
/>
```

---

### Alerts

```tsx
import ErrorAlert from "@/app/components/ui/ErrorAlert";

// Error simple
<ErrorAlert error="Algo salió mal" />

// Múltiples errores
<ErrorAlert
  error={[
    "El email es inválido",
    "La contraseña es muy corta"
  ]}
/>
```

---

### Badges

```tsx
// Badge normal
<span className="badge">
  Nuevo
</span>

// Badge con acento
<span className="badge-accent">
  Activo
</span>
```

---

## 📐 Espaciado

### Layout Classes
```tsx
// Contenedores
<div className="container-narrow">  {/* max-w-4xl */}
<div className="container-wide">    {/* max-w-7xl */}

// Spacing
<section className="section-spacing">  {/* py-12 */}
<div className="content-spacing">      {/* space-y-6 */}
```

### Dividers
```tsx
<div className="divider" />        {/* Divisor sutil */}
<div className="divider-strong" /> {/* Divisor más visible */}
```

---

## 🎭 Animaciones

### Fade In
```tsx
<div className="animate-fade-in">
  Aparece con fade
</div>
```

### Slide In Right
```tsx
<div className="animate-slide-in-right">
  Desliza desde la derecha
</div>
```

### Scale In
```tsx
<div className="animate-scale-in">
  Escala desde 95% a 100%
</div>
```

### Hover Lift
```tsx
<div className="hover-lift">
  Se eleva al hacer hover
</div>
```

### Skeleton Loading
```tsx
<div className="skeleton w-full h-4 rounded" />
```

---

## 📱 Layout de Aplicación

### Estructura base
```tsx
<div className="app-layout">
  {/* Sidebar */}
  <aside className="app-sidebar">
    {/* Contenido sidebar */}
  </aside>

  {/* Main content */}
  <main className="app-main">
    {/* Header */}
    <header className="app-header">
      {/* Contenido header */}
    </header>

    {/* Content */}
    <div className="app-content">
      {/* Contenido principal */}
    </div>
  </main>
</div>
```

---

## 🎯 Border Radius

```css
--radius-sm: 0.375rem  /* 6px - inputs pequeños */
--radius-md: 0.5rem    /* 8px - botones, inputs */
--radius-lg: 0.75rem   /* 12px - cards */
--radius-xl: 1rem      /* 16px - modales */
```

---

## ⚡ Transiciones

```css
--transition-fast: 150ms  /* Hover states */
--transition-base: 200ms  /* Interacciones normales */
--transition-slow: 300ms  /* Animaciones complejas */
```

Uso:
```tsx
<button className="transition-all duration-[var(--transition-base)]">
  Botón
</button>
```

---

## 🎨 Sombras

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.03)    /* Sutil */
--shadow-md: 0 2px 8px 0 rgb(0 0 0 / 0.04)    /* Media */
--shadow-lg: 0 4px 16px 0 rgb(0 0 0 / 0.06)   /* Grande */
--shadow-hover: 0 8px 24px 0 rgb(0 0 0 / 0.08) /* Hover */
```

Uso:
```tsx
<div className="shadow-[var(--shadow-md)]">
  Card con sombra
</div>
```

---

## 📝 Tipografía

### Headings
```tsx
<h1 className="text-4xl">Título H1</h1>
<h2 className="text-3xl">Título H2</h2>
<h3 className="text-2xl">Título H3</h3>
<h4 className="text-xl">Título H4</h4>
<h5 className="text-lg">Título H5</h5>
<h6 className="text-base">Título H6</h6>
```

### Text Colors
```tsx
<p className="text-[rgb(var(--color-text-primary))]">Texto principal</p>
<p className="text-[rgb(var(--color-text-secondary))]">Texto secundario</p>
<p className="text-[rgb(var(--color-text-tertiary))]">Texto terciario</p>
```

### Text Utilities
```tsx
<p className="text-balance">  {/* Balance de texto */}
<p className="text-pretty">   {/* Texto pretty */}
```

---

## ✅ Ejemplos de Uso

### Card con formulario completo
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/components/ui/Card";
import { FormInput, FormTextarea } from "@/app/components/ui/FormInput";
import LoadingButton from "@/app/components/ui/LoadingButton";
import ErrorAlert from "@/app/components/ui/ErrorAlert";

export default function ExampleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card variant="default" padding="lg">
      <CardHeader>
        <CardTitle as="h2">Crear Nuevo Item</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <FormInput
            label="Título"
            placeholder="Ingresá un título"
            required
          />

          <FormTextarea
            label="Descripción"
            placeholder="Descripción opcional"
            rows={4}
          />

          <ErrorAlert error={error} />
        </div>
      </CardContent>

      <CardFooter>
        <LoadingButton
          variant="primary"
          isLoading={isSubmitting}
        >
          Guardar
        </LoadingButton>

        <button className="btn-secondary">
          Cancelar
        </button>
      </CardFooter>
    </Card>
  );
}
```

---

## 🚀 Best Practices

1. **Espaciado Consistente**: Usa múltiplos de 4px (space-unit)
2. **Jerarquía Visual**: Usa sombras y tamaños para crear jerarquía
3. **Colores Semánticos**: Usa los colores de estados apropiadamente
4. **Accesibilidad**: Todos los componentes tienen roles ARIA
5. **Performance**: Las animaciones usan `transform` y `opacity`
6. **Responsive**: Mobile-first approach
7. **Focus States**: Todos los elementos interactivos tienen focus visible

---

## 🎨 Paleta Extendida (Para Referencia)

### Blues (Accent)
- `bg-[rgb(var(--color-accent-light))]` - Azul muy claro
- `bg-[rgb(var(--color-accent))]` - Azul principal
- `bg-[rgb(var(--color-accent-hover))]` - Azul hover

### Success
- `text-[rgb(var(--color-success))]`
- `bg-[rgb(var(--color-success))]/10` - 10% opacity
- `border-[rgb(var(--color-success))]/20` - 20% opacity

### Warning
- `text-[rgb(var(--color-warning))]`
- `bg-[rgb(var(--color-warning))]/10`

### Error
- `text-[rgb(var(--color-error))]`
- `bg-[rgb(var(--color-error))]/5`

---

**Fecha de creación:** 2026-01-22
**Versión:** 1.0
**Estilo:** Minimalista Moderno
