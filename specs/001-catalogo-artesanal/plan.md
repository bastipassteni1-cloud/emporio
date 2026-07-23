# Plan técnico: Catálogo de Artesanías

Basado en [spec.md](./spec.md). Traduce las historias de usuario en
arquitectura concreta.

## 1. Stack

| Capa | Elección | Motivo |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR/RSC para SEO del catálogo público, deploy nativo en Vercel |
| Estilos/UI | Tailwind CSS + shadcn/ui | Componentes rápidos de armar, buen look por defecto |
| Datos | Supabase (Postgres) | Ya definido por el usuario |
| Archivos | Supabase Storage | Fotos de producto |
| Auth | Supabase Auth (email/password) | Un solo usuario admin, no hace falta más |
| Hosting | Vercel | Ya definido por el usuario |
| Validación de forms | Zod + Server Actions | Validación consistente cliente/servidor sin API routes separadas |

No se usa un backend propio: toda la lógica de servidor va en Server
Components / Server Actions de Next.js, hablando directo con Supabase.

## 2. Estructura de rutas

```
app/
  page.tsx                        # Catálogo público (home), lista productos, filtro por categoría (?categoria=slug)
  productos/[slug]/page.tsx       # Detalle de producto: galería, precio, medidas, estado, CTA WhatsApp + form contacto
  contacto/page.tsx               # Formulario de contacto general (sin producto asociado)
  admin/
    login/page.tsx                # Login (Supabase Auth)
    (protected)/
      layout.tsx                  # Verifica sesión, redirige a /admin/login si no hay
      page.tsx                    # Dashboard: resumen, accesos rápidos
      productos/page.tsx          # Listado admin con acciones editar/eliminar
      productos/nuevo/page.tsx    # Form de creación
      productos/[id]/editar/page.tsx  # Form de edición
      categorias/page.tsx         # CRUD simple de categorías
      mensajes/page.tsx           # Ver mensajes recibidos del form de contacto
```

Los productos se identifican por `slug` en la URL pública (mejor para SEO
que un uuid); internamente todo se referencia por `id`.

## 3. Esquema SQL (Supabase)

```sql
create type product_status as enum ('available', 'sold', 'made_to_order');

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  price integer not null check (price >= 0), -- CLP, sin decimales
  dimensions text,
  status product_status not null default 'available',
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  position integer not null default 0
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  name text not null,
  contact_info text not null, -- email o teléfono
  message text not null,
  created_at timestamptz not null default now()
);
```

### RLS (Row Level Security)

- `categories`, `products`, `product_images`: **lectura pública** (`select`
  para `anon`), **escritura solo autenticado** (admin).
- `contact_messages`: **insert público** (cualquiera puede enviar un
  mensaje), **select solo autenticado** (solo el admin los lee).

```sql
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table contact_messages enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "admin write categories" on categories for all using (auth.role() = 'authenticated');

create policy "public read products" on products for select using (true);
create policy "admin write products" on products for all using (auth.role() = 'authenticated');

create policy "public read product_images" on product_images for select using (true);
create policy "admin write product_images" on product_images for all using (auth.role() = 'authenticated');

create policy "public insert contact_messages" on contact_messages for insert with check (true);
create policy "admin read contact_messages" on contact_messages for select using (auth.role() = 'authenticated');
```

### Storage

- Bucket `product-images`, público para lectura, escritura restringida a
  usuarios autenticados.

## 4. Autenticación admin

- Un único usuario se crea manualmente en Supabase Auth (no hay flujo de
  registro público).
- `app/admin/(protected)/layout.tsx` valida la sesión en el servidor con el
  cliente de Supabase para Server Components; si no hay sesión, redirige a
  `/admin/login`.
- Login vía Server Action con `supabase.auth.signInWithPassword`.

## 5. Contacto (WhatsApp + formulario)

- **WhatsApp**: link `https://wa.me/<NUMERO>?text=<mensaje prellenado con nombre del producto>`, número desde variable de entorno `NEXT_PUBLIC_WHATSAPP_NUMBER` (placeholder hasta que el usuario lo confirme).
- **Formulario**: Server Action que inserta en `contact_messages`. Sin envío
  de email en el MVP — el admin revisa los mensajes en `/admin/mensajes`.
  (Se puede agregar notificación por email más adelante si hace falta, pero
  queda fuera del alcance inicial.)

## 6. Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=        # placeholder hasta que el usuario lo confirme
NEXT_PUBLIC_SITE_NAME=              # placeholder hasta definir nombre
```

No se usa `service_role` key: todas las operaciones de escritura pasan por
un usuario autenticado respetando RLS, no hace falta bypassear seguridad
desde el servidor.

## 7. Manejo de imágenes

- Subida desde el form de admin directo a Supabase Storage (bucket
  `product-images`), usando el cliente de Supabase en el navegador con la
  sesión del admin.
- Se usa `next/image` con el dominio de Supabase Storage habilitado en
  `next.config.js` para optimización automática.

## 8. Testing

| Tipo | Herramienta | Qué cubre |
|---|---|---|
| Unit | Vitest + React Testing Library | Funciones puras (formateo de precio CLP, generación de slug, schemas de Zod) y componentes de UI aislados (tarjeta de producto, badge de estado, etc.) |

No se hacen pruebas de integración contra Supabase (ni local con Docker ni
un proyecto de prueba en la nube) — se descartó por simplicidad, dado que no
hay Docker disponible en el entorno de desarrollo y el foco de testing es la
lógica propia del código (funciones y componentes), no el comportamiento de
Supabase en sí. El esquema SQL (sección 3) se guarda igual como migración
versionada (`supabase/migrations/`) para poder aplicarlo de forma
reproducible al proyecto real con `supabase db push`.

- Yo (el agente) corro los tests como parte de la implementación de cada
  fase, no queda como tarea manual del usuario.

## 9. Fuera de alcance del plan (igual que la spec)

Carrito, pagos, multi-rol, multi-idioma, notificaciones por email —
confirmado que no aplican para esta versión.

## 10. Siguiente paso

Desglosar este plan en tareas concretas y ordenadas (`tasks.md`) para
empezar a implementar.
