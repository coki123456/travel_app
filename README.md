# Travel App - Planificador de Viajes

Aplicación web para planificar y organizar viajes, creada con Next.js 16, React 19, Prisma y PostgreSQL.

## Características

- Gestión de múltiples viajes
- Calendario visual con vista mensual
- Organización por días con bloques (mañana, tarde, noche, todo el día)
- Diferentes tipos de items (hotel, vuelo, atracción, comida, transporte, notas)
- Adjuntar archivos por día o por item
- Generación de libro de viaje para imprimir
- Resúmenes y diarios por día

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Base de datos**: PostgreSQL + Prisma ORM
- **Deployment**: Docker, Easypanel

## Inicio Rápido

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL

# Ejecutar migraciones
npm run migrate:dev

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Despliegue en Producción

Ver [DEPLOY.md](./DEPLOY.md) para instrucciones detalladas de despliegue en:
- Easypanel
- Vercel
- Railway
- Render

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm start` - Iniciar servidor de producción
- `npm run migrate:dev` - Crear y aplicar migraciones (desarrollo)
- `npm run migrate:deploy` - Aplicar migraciones (producción)
- `npm run studio` - Abrir Prisma Studio
- `npm run docker:build` - Construir imagen Docker

## Estructura del Proyecto

```
travel_app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── day/[date]/        # Vista de día individual
│   ├── setup/             # Configuración de viajes
│   ├── book/              # Libro de viaje
│   └── page.tsx           # Página principal (calendario)
├── prisma/                # Schema y migraciones de Prisma
├── lib/                   # Utilidades y configuración
├── public/                # Archivos estáticos
│   └── uploads/          # Archivos subidos por usuarios
├── Dockerfile             # Configuración Docker para Easypanel
└── DEPLOY.md             # Guía de despliegue

```

## Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/travel_app?schema=public"
NODE_ENV="production"
PORT=3000
```

## Healthcheck

La aplicación expone un endpoint de healthcheck en `/api/health`

## Licencia

Privado
