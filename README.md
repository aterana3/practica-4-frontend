# Instalación rápida — CRUD de tareas (Login + OAuth Google)

Este README está centrado únicamente en cómo instalar y ejecutar la aplicación en tu entorno local.

## Requisitos previos

- Node.js v18+ (o LTS compatible)
- pnpm (recomendado) o npm/yarn

## Variables de entorno (ejemplo `.env.local`)

Crea un archivo `.env.local` en la raíz del proyecto con al menos las siguientes variables (ajusta nombres según tu implementación):

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Instalación y ejecución (desarrollo)

1. Instala dependencias (pnpm recomendado):

   ```powershell
   pnpm install
   ```

2. Añade el `.env.local` con las variables necesarias (ver arriba).

3. Ejecuta la aplicación en modo desarrollo:

   ```powershell
   pnpm dev
   ```

4. Abre en el navegador:

   http://localhost:3000

## Build y ejecución en producción

1. Construye la app:

   ```powershell
   pnpm build
   ```

2. Inicia el servidor de producción:

   ```powershell
   pnpm start
   ```