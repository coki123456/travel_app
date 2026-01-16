# 🚀 Guía de Despliegue - Travel App

Esta guía explica cómo desplegar la aplicación en Easypanel y otras plataformas.

---

## 📋 Requisitos Previos

- Node.js 20.11.1 o superior
- PostgreSQL 16
- Docker (para despliegue con contenedores)
- Git

---

## 🐳 Despliegue en Easypanel

### Paso 1: Crear Base de Datos PostgreSQL

1. En Easypanel, ve a **Services** → **Create Service**
2. Selecciona **PostgreSQL** (versión 16 recomendada)
3. Configura:
   - **Name**: `travel-app-db`
   - **Database**: `travel_app`
   - **User**: `travel_user`
   - **Password**: *genera una contraseña segura*
4. Guarda el servicio y espera a que esté `Running`
5. Copia la **Internal Connection String** (algo como: `postgresql://travel_user:password@travel-app-db:5432/travel_app`)

### Paso 2: Crear Aplicación

1. Ve a **Services** → **Create Service**
2. Selecciona **From Git Repository**
3. Configura:
   - **Repository URL**: Tu URL de Git
   - **Branch**: `main` (o la rama que uses)
   - **Build Type**: `Dockerfile`
   - **Dockerfile path**: `Dockerfile` (en la raíz)

### Paso 3: Configurar Variables de Entorno

En la sección **Environment Variables**, agrega:

```env
DATABASE_URL=postgresql://travel_user:TU_PASSWORD@travel-app-db:5432/travel_app?schema=public
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

⚠️ **IMPORTANTE**: Reemplaza `TU_PASSWORD` con la contraseña que configuraste en el Paso 1.

### Paso 4: Configurar Puerto

- **Container Port**: `3000`
- **Public Port**: `80` o `443` (según tu configuración)

### Paso 5: Configurar Volumen para Uploads (Opcional)

Si quieres persistir los archivos subidos:

1. En **Volumes**, agrega:
   - **Mount Path**: `/app/public/uploads`
   - **Size**: `1GB` (o lo que necesites)

### Paso 6: Build y Deploy

1. Haz clic en **Deploy**
2. Espera a que el build termine (puede tardar 5-10 minutos la primera vez)
3. Verifica el estado en los **Logs**
4. Una vez que veas "✅ Database connected successfully", la app está lista

### Paso 7: Verificar Funcionamiento

1. Abre la URL pública de tu app
2. Verifica el healthcheck: `https://tu-dominio.com/api/health`
3. Deberías ver: `{"status":"ok","database":"connected",...}`

---

## 🐋 Despliegue Local con Docker Compose

### Para desarrollo local:

```bash
# 1. Crear archivo .env
cp .env.example .env

# 2. Editar .env con tus valores (puedes usar los valores por defecto para local)

# 3. Iniciar servicios
npm run docker:up

# 4. Ver logs
npm run docker:logs

# 5. Acceder a la app
# http://localhost:3000
```

### Comandos útiles:

```bash
# Detener servicios
npm run docker:down

# Reconstruir imagen
npm run docker:build

# Ejecutar migraciones manualmente
docker-compose exec app npx prisma migrate deploy

# Ver logs de base de datos
docker-compose logs -f db

# Acceder a la shell del contenedor
docker exec -it travel_app sh
```

---

## ☁️ Otras Plataformas

### Vercel

⚠️ **Nota**: Vercel no soporta PostgreSQL nativo. Necesitas usar:
- Vercel Postgres
- Neon (PostgreSQL serverless)
- Supabase

```bash
# Instalar CLI de Vercel
npm install -g vercel

# Deploy
vercel

# Configurar variables de entorno en el dashboard de Vercel
```

### Railway

1. Ve a [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Selecciona tu repositorio
4. Railway detectará automáticamente el Dockerfile
5. Agrega servicio PostgreSQL desde el marketplace
6. Configura la variable `DATABASE_URL` con la URL interna de Railway

### Render

1. Ve a [render.com](https://render.com)
2. **New** → **Web Service**
3. Conecta tu repositorio
4. Configura:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run migrate:deploy && npm start`
5. Agrega PostgreSQL desde el dashboard
6. Configura `DATABASE_URL` en Environment Variables

---

## 🔧 Solución de Problemas

### Error: "DATABASE_URL environment variable not found"

✅ **Solución**: Verifica que la variable `DATABASE_URL` esté configurada correctamente.

```bash
# Formato correcto:
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Error: "Can't reach database server"

✅ **Solución**:
- Verifica que la base de datos esté corriendo
- Verifica que el host sea el correcto (para Easypanel usa el nombre interno del servicio)
- Verifica las credenciales

### Build falla en Dockerfile

✅ **Solución**:
- Verifica que tengas suficiente memoria (mínimo 2GB)
- Aumenta el timeout de build si es necesario
- Revisa los logs para ver el error específico

### La aplicación no responde

✅ **Solución**:
1. Verifica el healthcheck: `/api/health`
2. Revisa los logs del contenedor
3. Verifica que el puerto `3000` esté expuesto
4. Verifica que las migraciones se ejecutaron correctamente

### Archivos subidos se pierden después de redeploy

✅ **Solución**: Configura un volumen persistente montado en `/app/public/uploads`

---

## 📊 Monitoreo

### Healthcheck Endpoint

```bash
# Verificar estado de la aplicación
curl https://tu-dominio.com/api/health

# Respuesta esperada:
{
  "status": "ok",
  "timestamp": "2026-01-16T...",
  "database": "connected",
  "uptime": 1234.56
}
```

### Logs de Aplicación

```bash
# Easypanel
# Ve a Service → Logs

# Docker Compose local
docker-compose logs -f app

# Ver solo errores
docker-compose logs app | grep ERROR
```

### Base de Datos

```bash
# Conectarse a la base de datos (local)
docker-compose exec db psql -U travel_user -d travel_app

# Ver tablas
\dt

# Ver migraciones aplicadas
SELECT * FROM "_prisma_migrations";

# Salir
\q
```

---

## 🔒 Seguridad

### Recomendaciones de Producción:

1. **Cambia las contraseñas por defecto**
2. **Usa HTTPS** (Easypanel lo configura automáticamente)
3. **Configura backups automáticos** de la base de datos
4. **Limita el tamaño de uploads** si es necesario
5. **Considera agregar autenticación** si la app es privada

### Variables de Entorno Sensibles:

Nunca commitear:
- `.env`
- Contraseñas de base de datos
- Claves API
- Tokens de autenticación

---

## 📝 Mantenimiento

### Actualizar la aplicación:

```bash
# 1. Hacer cambios en el código
# 2. Commit y push
git add .
git commit -m "Update: ..."
git push

# 3. En Easypanel, el auto-deploy se activará
# O manualmente: Deploy → Redeploy
```

### Ejecutar migraciones:

```bash
# Crear nueva migración (desarrollo)
npm run migrate:dev

# Aplicar migraciones en producción (Easypanel)
# Se ejecutan automáticamente en el Dockerfile
# O manualmente:
docker-compose exec app npx prisma migrate deploy
```

### Hacer backup de base de datos:

```bash
# Easypanel
# Ve a Service → PostgreSQL → Backup

# Docker Compose local
docker-compose exec db pg_dump -U travel_user travel_app > backup.sql

# Restaurar backup
docker-compose exec -T db psql -U travel_user travel_app < backup.sql
```

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs primero
2. Verifica el healthcheck endpoint
3. Consulta esta documentación
4. Busca el error específico en Google/Stack Overflow

---

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando correctamente. Disfruta tu planificador de viajes.

**URL de ejemplo**: `https://tu-dominio.com`

**Healthcheck**: `https://tu-dominio.com/api/health`
