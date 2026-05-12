# Backend (Strapi) - (Smart Estate)

Resumen rápido de cómo configurar y arrancar el backend Strapi (Fase 1).

Prerequisitos
- Node.js 18.x o 20.x (Strapi v4 recomienda 18-20)
- MySQL (o MariaDB) corriendo y accesible
- Variables de entorno (usar `.env` local) — copia `.env.example` y rellena valores

Pasos para configurar
1. Copiar ejemplo de env:
   cp .env.example .env
2. Ajustar variables de conexión a la base de datos en `.env`.
3. Instalar dependencias:
   npm install
4. Ejecutar Strapi en modo desarrollo:
   npm run develop

Notas importantes
- Node 24 puede provocar warnings o incompatibilidades con algunas versiones de Strapi; usar Node 18/20 para desarrollo estable.
- Las rutas de pagos están creadas como placeholders en `src/api/payments` — implementarán MercadoPago en Fase 3.

Endpoints placeholders
- POST /api/payments/create-preference  — recibe { propertyId } y debe devolver el init_point (placeholder implementado).
- POST /api/payments/webhook  — webhook para recibir notificaciones de pago (placeholder implementado).

Siguientes pasos (Fase 2/3)
- Configurar Cloudinary variables y comprobación de upload
- Implementar la integración con MercadoPago en el controller `createPreference` y `webhook` usando `strapi.entityService` para leer y mutar propiedades
- Añadir pruebas de integración para flujos de pago


