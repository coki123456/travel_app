# 📱 Travel App - Documentación del Sistema

## 🎯 Descripción General

**Travel App** es una aplicación web moderna para planificar y gestionar viajes de manera detallada. Permite a los usuarios crear viajes, definir fechas, agregar destinos y organizar actividades día por día en un calendario interactivo.

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

#### **Frontend**
- **Framework**: Next.js 16.1.1 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4 (con CSS personalizado)
- **UI**: Componentes React con Server Components y Client Components
- **Renderizado**: SSR (Server-Side Rendering) + CSR (Client-Side Rendering)

#### **Backend**
- **Runtime**: Next.js API Routes (Node.js)
- **Base de datos**: PostgreSQL
- **ORM**: Prisma 6.19.2
- **Autenticación**: NextAuth.js (Auth.js) con credenciales

#### **Deployment**
- **Plataforma**: Easypanel (Docker containers)
- **CI/CD**: Git push → Easypanel auto-deploy
- **Repositorio**: GitHub

---

## 📁 Estructura del Proyecto

```
travel_app/
├── app/                          # Directorio principal de Next.js (App Router)
│   ├── api/                      # API Routes (backend endpoints)
│   │   ├── auth/[...nextauth]/   # Autenticación (NextAuth)
│   │   ├── register/             # Registro de usuarios
│   │   ├── trip/                 # CRUD de viajes
│   │   │   ├── [id]/            # Operaciones por ID
│   │   │   │   └── share/       # Compartir viajes
│   │   │   └── active/          # Gestión de viaje activo
│   │   ├── days/                 # Gestión de días
│   │   ├── items/                # Items de actividades
│   │   └── attachments/          # Subida de archivos
│   │
│   ├── login/                    # Página de inicio de sesión
│   │   └── page.tsx
│   ├── register/                 # Página de registro
│   │   └── page.tsx
│   ├── setup/                    # Configuración de viajes
│   │   ├── page.tsx             # Lista y creación de viajes
│   │   ├── SetupForm.tsx        # Formulario de viaje
│   │   ├── TripList.tsx         # Lista de viajes
│   │   └── ShareTripModal.tsx   # Modal para compartir
│   ├── day/[date]/              # Vista de día individual
│   │   └── page.tsx
│   ├── book/                     # Libro del viaje (vista imprimible)
│   │   ├── page.tsx
│   │   └── PrintButton.tsx
│   │
│   ├── page.tsx                  # Página principal (calendario)
│   ├── layout.tsx                # Layout raíz
│   ├── globals.css               # Estilos globales y sistema de diseño
│   ├── TripSelector.tsx          # Selector de viaje activo
│   └── LogoutButton.tsx          # Botón de cerrar sesión
│
├── lib/                          # Librerías y utilidades
│   ├── auth.ts                   # Configuración de NextAuth
│   └── prisma.ts                 # Cliente de Prisma
│
├── prisma/                       # Configuración de base de datos
│   ├── schema.prisma            # Schema de la base de datos
│   └── migrations/              # Migraciones
│
├── types/                        # Tipos TypeScript personalizados
│   └── next-auth.d.ts
│
├── middleware.ts                 # Middleware de Next.js (autenticación)
├── tailwind.config.ts            # Configuración de Tailwind CSS
├── tsconfig.json                 # Configuración de TypeScript
├── package.json                  # Dependencias del proyecto
├── .env                          # Variables de entorno
└── Dockerfile                    # Configuración de Docker

```

---

## 🗄️ Base de Datos (Schema Prisma)

### **Modelos Principales**

#### **User** (Usuario)
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  createdAt     DateTime  @default(now())
  trips         Trip[]    @relation("TripOwner")
  sharedTrips   TripShare[]
}
```

#### **Trip** (Viaje)
```prisma
model Trip {
  id            String    @id @default(cuid())
  name          String
  destinations  String
  startDate     DateTime
  endDate       DateTime
  ownerId       String
  owner         User      @relation("TripOwner")
  sharedWith    TripShare[]
  createdAt     DateTime  @default(now())
}
```

#### **TripShare** (Compartir Viaje)
```prisma
model TripShare {
  id        String   @id @default(cuid())
  tripId    String
  trip      Trip     @relation(...)
  userId    String
  user      User     @relation(...)
  createdAt DateTime @default(now())
}
```

#### **Day** (Día del Viaje)
```prisma
model Day {
  id        String   @id @default(cuid())
  date      DateTime @unique
  city      String?
  summary   String?
  items     Item[]
  createdAt DateTime @default(now())
}
```

#### **Item** (Actividad/Bloque del Día)
```prisma
model Item {
  id          String       @id @default(cuid())
  dayId       String
  day         Day          @relation(...)
  timeOfDay   String       # "morning" | "afternoon" | "evening" | "full_day"
  description String
  attachments Attachment[]
  createdAt   DateTime     @default(now())
}
```

#### **Attachment** (Archivo Adjunto)
```prisma
model Attachment {
  id       String @id @default(cuid())
  itemId   String
  item     Item   @relation(...)
  filename String
  filepath String
}
```

---

## 🎨 Sistema de Diseño

### **Paleta de Colores**

```css
:root {
  /* Background */
  --background: #0f172a;           /* Slate 900 */
  --background-secondary: #1e293b;  /* Slate 800 */

  /* Foreground */
  --foreground: #f1f5f9;           /* Slate 100 */
  --foreground-muted: #cbd5e1;     /* Slate 300 */

  /* Brand Colors (Blue-Cyan Gradient) */
  --primary: #3b82f6;              /* Blue 500 */
  --primary-hover: #2563eb;        /* Blue 600 */
  --secondary: #8b5cf6;            /* Purple 500 */
  --accent: #06b6d4;               /* Cyan 500 */

  /* Status Colors */
  --success: #10b981;              /* Emerald 500 */
  --warning: #f59e0b;              /* Amber 500 */
  --error: #ef4444;                /* Red 500 */
}
```

### **Componentes de UI Reutilizables**

#### **Botones**
- `.btn-primary`: Botón principal con gradiente azul-cian
- `.btn-secondary`: Botón secundario con fondo slate
- `.btn-ghost`: Botón sin fondo
- `.btn-icon`: Botón con icono + texto

#### **Cards**
- `.card`: Card básico con backdrop blur
- `.card-elevated`: Card elevado con gradiente y mayor sombra

#### **Inputs**
- `.input`: Input de texto
- `.textarea`: Textarea
- `.select`: Select dropdown

#### **Badges**
- `.badge-primary`: Badge azul
- `.badge-success`: Badge verde (emerald)
- `.badge-warning`: Badge amarillo (amber)

---

## 🔐 Autenticación y Autorización

### **Sistema de Autenticación**
- **Provider**: Credentials (email + password)
- **Librería**: NextAuth.js (Auth.js)
- **Hashing**: bcryptjs
- **Sesión**: JWT (JSON Web Token)

### **Flujo de Autenticación**

1. **Registro** (`/register`)
   - Usuario ingresa email y contraseña
   - Password hasheado con bcryptjs
   - Usuario creado en DB

2. **Login** (`/login`)
   - Usuario ingresa credenciales
   - NextAuth valida contra DB
   - JWT creado y guardado en cookie

3. **Middleware** (`middleware.ts`)
   - Protege rutas privadas
   - Redirige a `/login` si no autenticado

4. **Logout**
   - Componente `LogoutButton`
   - Llama a `signOut()` de NextAuth

### **Rutas Protegidas**
- `/` (calendario principal)
- `/setup` (configuración de viajes)
- `/day/[date]` (detalle de día)
- `/book` (libro del viaje)

### **Rutas Públicas**
- `/login`
- `/register`
- `/api/register`

---

## 📱 Funcionalidades Principales

### **1. Gestión de Viajes**

#### **Crear Viaje** (`/setup`)
- Formulario con:
  - Nombre del viaje
  - Fecha de inicio
  - Fecha de fin
  - Destinos (texto libre)

#### **Editar Viaje**
- Query param: `/setup?edit={tripId}`
- Prellenado del formulario con datos existentes

#### **Cambiar Viaje Activo**
- Cookie `activeTripId`
- Selector de viajes: `TripSelector.tsx`

#### **Compartir Viaje**
- Modal: `ShareTripModal.tsx`
- Ingreso de email del usuario a compartir
- Creación de relación `TripShare` en DB

#### **Eliminar Viaje**
- Botón en `TripList`
- Confirmación con `window.confirm`
- DELETE a `/api/trip/[id]`

---

### **2. Calendario Interactivo** (`/`)

#### **Vista del Calendario**
- Grid de 7 columnas (días de la semana)
- Múltiples meses si el viaje es largo
- Estados visuales:
  - **Día pasado**: Fondo emerald con checkmark ✓
  - **Día actual**: Ring azul con shadow
  - **Día futuro**: Fondo slate
  - **Día con resumen**: Indicador ping animado (punto azul)

#### **Navegación**
- Click en día → `/day/[date]`
- Formato de fecha: `YYYY-MM-DD`

---

### **3. Detalle del Día** (`/day/[date]`)

#### **Información del Día**
- Ciudad (campo opcional)
- Resumen del día (textarea)
- Fecha formateada en español

#### **Bloques de Actividades (Items)**
Cada día puede tener múltiples bloques:
- **Mañana** (`morning`)
- **Tarde** (`afternoon`)
- **Noche** (`evening`)
- **Todo el día** (`full_day`)

Cada bloque contiene:
- Descripción (textarea)
- Archivos adjuntos (imágenes, PDFs, etc.)

#### **Gestión de Archivos**
- Subida de archivos → `/api/attachments`
- Almacenamiento en carpeta `uploads/`
- Visualización inline (imágenes)
- Descarga de archivos

---

### **4. Libro del Viaje** (`/book`)

Vista imprimible con:
- Resumen completo del viaje
- Todos los días con sus actividades
- Archivos adjuntos
- Botón de impresión (`PrintButton.tsx`)
- CSS específico para impresión (`@media print`)

---

## 🌐 API Endpoints

### **Autenticación**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/register` | Registrar nuevo usuario |
| POST | `/api/auth/[...nextauth]` | Login/Logout (NextAuth) |

### **Viajes (Trips)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/trip` | Listar viajes del usuario |
| POST | `/api/trip` | Crear nuevo viaje |
| PUT | `/api/trip/[id]` | Actualizar viaje |
| DELETE | `/api/trip/[id]` | Eliminar viaje |
| POST | `/api/trip/active` | Establecer viaje activo |
| POST | `/api/trip/[id]/share` | Compartir viaje |

### **Días (Days)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/days?date=YYYY-MM-DD` | Obtener día específico |
| POST | `/api/days` | Crear/actualizar día |

### **Items (Actividades)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/items` | Crear item |
| PUT | `/api/items/[id]` | Actualizar item |
| DELETE | `/api/items/[id]` | Eliminar item |

### **Attachments (Archivos)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/attachments` | Subir archivo |
| DELETE | `/api/attachments?id={id}` | Eliminar archivo |

---

## 📱 Responsive Design

La aplicación es **completamente responsive** con breakpoints:

| Breakpoint | Tamaño | Dispositivo |
|------------|--------|-------------|
| (default) | 320px+ | Móvil pequeño |
| `sm:` | 640px+ | Móvil grande / Tablet pequeña |
| `md:` | 768px+ | Tablet |
| `lg:` | 1024px+ | Laptop |
| `xl:` | 1280px+ | Desktop grande |

### **Optimizaciones Mobile**
- Touch targets de 40px mínimo
- Textos abreviados en móvil ("Viaje" → "Cambiar viaje" en desktop)
- Grid adaptativo (7 columnas → 2 columnas en aside)
- Paddings reducidos en móvil
- `active:scale` para feedback táctil

---

## 🚀 Deployment (Easypanel)

### **Configuración**

#### **Variables de Entorno** (`.env`)
```bash
# Base de datos
DATABASE_URL="postgres://user:pass@host:5432/db?sslmode=disable"

# NextAuth
AUTH_SECRET="tu-secret-aqui"
AUTH_URL="https://tu-dominio.com"

# Next.js
NODE_ENV="production"
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

#### **Dockerfile**
```dockerfile
FROM node:20.11.1-alpine
WORKDIR /app

# Dependencias del sistema
RUN apk add --no-cache libc6-compat openssl

# Instalación de dependencias
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --include=dev

# Generación de Prisma Client
RUN npx prisma generate

# Build de Next.js
COPY . .
RUN npm run build

# Producción
EXPOSE 3000
CMD ["npm", "start"]
```

### **Proceso de Deploy**

1. **Git Push** → GitHub
2. **Easypanel Webhook** → Detecta cambios
3. **Docker Build** → Construye imagen
4. **Prisma Generate** → Genera cliente
5. **Next.js Build** → Compila aplicación
6. **Container Start** → Inicia servidor
7. **Health Check** → `/api/health`

### **Logs de Deploy**
- Build logs: Easypanel dashboard
- Runtime logs: `docker logs [container-id]`
- Errores: Panel de errores en Easypanel

---

## 🧪 Testing y Desarrollo

### **Comandos de Desarrollo**

```bash
# Instalar dependencias
npm install

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Modo desarrollo (puerto 3000)
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start
```

### **Scripts Disponibles**

```json
{
  "dev": "next dev --turbopack",
  "build": "prisma generate && next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## 📊 Performance y Optimización

### **Next.js Optimizaciones**

#### **Server Components**
- Renderizado en servidor por defecto
- Reducción de JavaScript en el cliente
- Ejemplos: `page.tsx`, `layout.tsx`

#### **Client Components**
- Solo cuando se necesita interactividad
- Marcados con `"use client"`
- Ejemplos: `SetupForm.tsx`, `TripSelector.tsx`

#### **Image Optimization**
- Next.js Image component (si se usa)
- Lazy loading automático
- Responsive images

#### **Code Splitting**
- Automático con App Router
- Lazy imports con `dynamic()`

### **Database Optimizations**

#### **Prisma Queries**
- Uso de `select` para campos específicos
- `include` para relaciones necesarias
- Evitar N+1 queries

#### **Indexing**
```prisma
@@index([userId])
@@index([tripId])
@@index([date])
```

---

## 🔧 Mantenimiento

### **Actualizar Dependencias**

```bash
# Verificar actualizaciones
npm outdated

# Actualizar Next.js
npm install next@latest react@latest react-dom@latest

# Actualizar Prisma
npm install prisma@latest @prisma/client@latest
npx prisma migrate dev
```

### **Prisma Studio**

```bash
# Abrir GUI de base de datos
npx prisma studio
```

### **Regenerar Prisma Client**

```bash
npx prisma generate
```

---

## 📝 Notas de Desarrollo

### **Convenciones de Código**

#### **Nombres de Componentes**
- PascalCase: `TripSelector.tsx`, `SetupForm.tsx`
- Server Components: No usan `"use client"`
- Client Components: Incluyen `"use client"` al inicio

#### **Nombres de API Routes**
- Archivos: `route.ts`
- Path: `/api/[resource]/route.ts`

#### **Nombres de Variables**
- camelCase: `activeTripId`, `userEmail`
- SCREAMING_SNAKE_CASE: Variables de entorno

#### **Estilos CSS**
- Tailwind classes prioritarias
- Clases custom en `globals.css`
- No inline styles (excepto casos especiales)

### **Git Workflow**

```bash
# Commits con Co-Authored
git commit -m "Feature: Add trip sharing

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🐛 Troubleshooting Común

### **Error: Prisma Client no generado**
```bash
npx prisma generate
```

### **Error: Database connection failed**
- Verificar `DATABASE_URL` en `.env`
- Comprobar que PostgreSQL esté corriendo
- Verificar credenciales de DB

### **Error: NextAuth session undefined**
- Verificar `AUTH_SECRET` y `AUTH_URL`
- Revisar cookies en navegador
- Comprobar middleware configuration

### **Error: Build failed (Tailwind)**
- No usar `@apply` con gradientes
- Usar CSS puro para propiedades complejas
- Verificar sintaxis de Tailwind v4

---

## 📞 Recursos y Enlaces

### **Documentación Oficial**
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Tailwind CSS v4](https://tailwindcss.com)

### **Herramientas de Desarrollo**
- [Prisma Studio](https://www.prisma.io/studio)
- [Easypanel Dashboard](https://easypanel.io)

---

## 🎉 Créditos

**Desarrollado con:**
- Next.js 16
- TypeScript
- Tailwind CSS v4
- Prisma ORM
- PostgreSQL
- NextAuth.js

**Co-Authored-By:**
- Claude Sonnet 4.5 (Anthropic)

---

## 📄 Licencia

Este proyecto es privado y de uso personal.
