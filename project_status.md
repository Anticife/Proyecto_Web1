# Estado del Proyecto — Plataforma de Propiedades

## 🏗️ Arquitectura General

| Parte | Stack | Repositorio | Despliegue |
|---|---|---|---|
| **Backend** | Strapi v4 + PostgreSQL | `Anticife/Proyecto_Web1` | Render (Web Service Node) |
| **Frontend** | React + Vite + TypeScript | `Anticife/Proyecto_Web2` | Render (Static Site) |

---

## 🔙 BACKEND (`Proyecto_Web1`)

### Variables de Entorno requeridas en Render

> [!IMPORTANT]
> Estas variables deben estar configuradas manualmente en el Dashboard de Render bajo **Environment → Environment Variables** del servicio del backend.

| Variable | Descripción | ¿Auto-generada? |
|---|---|---|
| `NODE_VERSION` | `18.x` (Strapi v4 requiere Node ≤ 20) | ❌ Configura `18.x` |
| `DATABASE_URL` | Connection string de PostgreSQL (ej: Neon/Render DB) | ❌ Debes pegar la URL |
| `DATABASE_SSL` | `true` (Neon y Render requieren SSL) | ❌ Valor: `true` |
| `CLOUDINARY_NAME` | Nombre de tu cuenta en Cloudinary | ❌ Desde cloudinary.com |
| `CLOUDINARY_KEY` | API Key de Cloudinary | ❌ Desde cloudinary.com |
| `CLOUDINARY_SECRET` | API Secret de Cloudinary | ❌ Desde cloudinary.com |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de acceso de MercadoPago | ❌ Desde developers.mercadopago.com |
| `ADMIN_JWT_SECRET` | Secret para tokens del panel admin | ✅ `generateValue: true` en render.yaml |
| `API_TOKEN_SALT` | Salt para los API Tokens de Strapi | ✅ `generateValue: true` en render.yaml |
| `APP_KEYS` | Claves de cifrado de la app | ✅ `generateValue: true` en render.yaml |
| `TRANSFER_TOKEN_SALT` | Salt para transferencias de datos | ✅ `generateValue: true` en render.yaml |
| `JWT_SECRET` | Secret para tokens JWT de usuarios | ✅ `generateValue: true` en render.yaml |

### Modelos de Datos (Content Types)

#### `Property` (`api::property.property`)
| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `title` | String | ✅ | Título |
| `price` | Decimal | ✅ | Precio |
| `area` | Float | ❌ | m² |
| `location` | String | ❌ | Dirección |
| `isFeatured` | Boolean | ❌ | Default `false`. El backend lo pone en `true` al aprobar un pago |
| `category` | Relation ManyToOne → Category | ❌ | ID de la categoría |
| `owner` | Relation ManyToOne → User | Auto | **El backend lo asigna automáticamente.** El frontend NO debe enviarlo |

#### `Category` (`api::category.category`)
| Campo | Tipo | Requerido |
|---|---|---|
| `name` | String | ✅ |
| `properties` | Relation OneToMany → Property | Auto |

### Lógica del Backend

#### Crear Propiedad — `POST /api/properties`
- El controlador custom intercepta la solicitud.
- Extrae `ctx.state.user` (usuario del JWT) e inyecta automáticamente `owner: user.id`.
- **El frontend solo manda: `title`, `price`, `area`, `location`, `category`.**

#### Actualizar/Eliminar — `PUT/DELETE /api/properties/:id`
- Protegidas por la política `is-owner`.
- Verifica que `property.owner.id === user.id`. Si no coincide → `403 Forbidden`.
- Los roles `admin`/`administrator` bypasean la verificación.

#### Pagos MercadoPago
- `POST /api/payments/create-preference` → **Público**, retorna `{ init_point, preferenceId }`.
- `POST /api/payments/webhook` → **Público**, si el pago se aprueba pone `isFeatured: true` en la propiedad.

---

## 🖥️ FRONTEND (`Proyecto_Web2/frontend`)

### Variables de Entorno

> [!IMPORTANT]
> Al ser Vite, **deben llevar el prefijo `VITE_`**. Configúralas en Render bajo el servicio del frontend.

| Variable | Valor Local | Valor Producción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:1337` | URL del backend en Render (ej: `https://strapi-backend.onrender.com`) |
| `VITE_MERCADOPAGO_PUBLIC_KEY` | `TEST-xxxx` | Tu clave pública de MercadoPago |

### Estado de las Páginas

| Ruta | Archivo | Estado |
|---|---|---|
| `/` | `Home.tsx` | 🟡 Esqueleto vacío |
| `/properties` | `Properties.tsx` | 🟡 Esqueleto vacío |
| `/login` | `Login.tsx` | ✅ Implementado — `POST /api/auth/local` |
| `/register` | `Register.tsx` | ✅ Implementado — `POST /api/auth/local/register` |
| `/dashboard` | `Dashboard.tsx` | 🟡 Parcial — lista propiedades, Edit/Promote sin lógica |

### Estado de los Componentes

| Componente | Estado | Notas |
|---|---|---|
| `Navbar.tsx` | ✅ | |
| `Footer.tsx` | ✅ | |
| `Hero.tsx` | ✅ | |
| `PropertyCard.tsx` | ✅ | |
| `PropertyList.tsx` | ✅ Conectado | Transforma respuesta Strapi v4, ordena destacados primero |

### Capa de API (`src/api/`)

| Archivo | Responsabilidad |
|---|---|
| `axios.ts` | Cliente base, inyecta `Authorization: Bearer <jwt>` desde `localStorage` automáticamente |
| `auth.ts` | `login()`, `register()` |
| `properties.ts` | `getAll()`, `getById()`, `getMyProperties()`, `create()`, `update()`, `delete()`, `uploadImages()` |
| `payments.ts` | `createPreference()` |
| `index.ts` | Re-exporta todo |

### Cómo transformar la respuesta de Strapi v4

En Strapi v4 los datos vienen en `{ data: [ { id, attributes: {...} } ] }`:

```typescript
const attrs = item.attributes;
return {
  id: item.id,
  title: attrs.title,
  price: attrs.price,
  location: attrs.location,
  area: attrs.area,
  isFeatured: attrs.isFeatured,
  category: attrs.category?.data?.attributes?.name || 'Uncategorized',
  // IMPORTANTE: Cloudinary devuelve URL absoluta, no hace falta prefixar con API_URL
  image: attrs.images?.data?.[0]?.attributes?.url || 'https://fallback.com/img.jpg'
};
```

---

## ⚠️ Issues Conocidos

> [!CAUTION]
> **Bug de imágenes en producción:** el código actual prefixea la URL de imagen con `${API_URL}`, pero Cloudinary ya devuelve URLs absolutas. En producción las imágenes se romperán. Fix: usar la URL directamente si empieza con `http`.

> [!WARNING]
> **Páginas vacías:** `Home.tsx` y `Properties.tsx` no tienen contenido implementado.

> [!WARNING]
> **Botones sin lógica:** Edit y Promote en el Dashboard no tienen acciones conectadas al backend.

> [!NOTE]
> `PropertyList.tsx` y `Dashboard.tsx` usan `axios` directamente en lugar de la capa `src/api/`. Migrarlos eliminaría código duplicado.

---

## ✅ Checklist de Despliegue

### Backend (Render)
- [ ] Configurar `DATABASE_URL` (PostgreSQL — Neon es gratis y compatible)
- [ ] Configurar `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`
- [ ] Configurar `MERCADOPAGO_ACCESS_TOKEN`
- [ ] En panel Admin Strapi → **Settings → Roles → Public**: habilitar `find` y `findOne` para `property` y `category`
- [ ] En panel Admin → **Roles → Authenticated**: habilitar `create`, `update`, `delete` para `property`

### Frontend (Render)
- [ ] Configurar `VITE_API_URL` con la URL del backend en producción
- [ ] Configurar `VITE_MERCADOPAGO_PUBLIC_KEY`
- [ ] Implementar `Home.tsx` y `Properties.tsx`
- [ ] Conectar botones Edit y Promote en el Dashboard
- [ ] Corregir lógica de URL de imágenes para Cloudinary
