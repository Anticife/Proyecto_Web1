# Property backend design (Strapi Phase 1)
Fecha: 2026-05-12

Problema:
Construir la capa de datos y seguridad para Property/Category en Strapi, configurar uploads y pagos.

Propuesta (recomendada):
- Schema: añadir campo "owner" (relation manyToOne → plugin::users-permissions.user).
- Controladores: crear controllers/api::property overrides:
  - create: asignar owner = ctx.state.user.id cuando esté autenticado.
  - update/delete: verificar que ctx.state.user.id === entity.owner.id o que sea admin.
- RBAC: Public → find/findOne; Authenticated → create; update/delete vía verificación de ownership; Admin full access.
- Cloudinary: configurar plugins.js con CLOUDINARY_NAME/KEY/SECRET.
- MercadoPago:
  - POST /payments/create-preference: crea preferencia con property info, retorna init_point.
  - POST /payments/webhook: verificar firma, si pago aprobado → set property.isFeatured = true.

Tareas:
1. Re-agregar owner en schema (schema.json).
2. Añadir controllers/property.js con lógica de owner.
3. Reusar src/policies/is-owner.js o comprobar inline en controller.
4. Configurar plugins.js (Cloudinary) y .env.example.
5. Implementar payments controller y pruebas locales (usando MP test token).
6. Ajustar RBAC desde admin (documentar pasos).

Variables de entorno:
- DATABASE_URL (ya configurada)
- CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET
- MERCADOPAGO_ACCESS_TOKEN, MERCADOPAGO_WEBHOOK_KEY
- ADMIN_JWT_SECRET

Criterios de aceptación:
- Strapi arranca y migraciones aplicadas.
- Owner asignado al crear propiedades por usuarios autenticados.
- Update/Delete protegidos por ownership.
- Subida de imágenes funciona con Cloudinary.
- Pago simulado marca property.isFeatured=true.

