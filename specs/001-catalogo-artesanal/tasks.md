# Tareas: Catálogo de Artesanías

Basado en [plan.md](./plan.md). Orden pensado para tener algo funcional
end-to-end lo antes posible (catálogo vacío navegable) y luego ir sumando
funcionalidad.

## Fase 0 — Setup del proyecto

- [x] Crear proyecto Next.js (TypeScript, App Router, Tailwind).
- [x] Instalar y configurar shadcn/ui.
- [ ] Crear proyecto en Supabase, obtener URL y anon key. **(pendiente del
      usuario — ver sección de datos pendientes)**
- [x] Configurar variables de entorno (`.env.local` + `.env.example`,
      con placeholders hasta tener el proyecto Supabase real).
- [x] Cliente de Supabase para Server Components y otro para Client
      Components (`lib/supabase/server.ts`, `lib/supabase/client.ts`), más
      `src/proxy.ts` para refresco de sesión (convención Next.js 16).
- [x] Instalar y configurar Vitest + React Testing Library (unit tests).

## Fase 1 — Base de datos

- [x] Escribir migración SQL versionada (`supabase/migrations/`) con
      `categories`, `products`, `product_images`, `contact_messages`.
- [x] Aplicar políticas RLS de lectura pública / escritura autenticada.
- [x] Crear bucket `product-images` en Storage con acceso público de
      lectura.
- [x] Aplicar migración al proyecto de Supabase real (pegado en SQL
      editor). Verificado: lectura pública OK, escritura anónima
      rechazada por RLS.
- [x] Crear usuario admin manualmente en Supabase Auth y deshabilitar
      registro público.

## Fase 2 — Catálogo público (sin admin todavía)

- [x] Layout base del sitio (header, footer, nombre placeholder).
- [x] Página `/` : grilla de productos desde Supabase, estado vacío
      ("aún no hay productos") para cuando no hay datos.
- [x] Filtro por categoría (query param `?categoria=slug`).
- [x] Página `/productos/[slug]`: galería de imágenes, nombre, descripción,
      precio (formateado en CLP), medidas, estado de disponibilidad.
- [x] Botón de WhatsApp con mensaje prellenado (usa
      `NEXT_PUBLIC_WHATSAPP_NUMBER`; oculto si no está configurado).
- [x] Formulario de contacto en la página de producto (Server Action que
      inserta en `contact_messages`).
- [x] Página `/contacto` con formulario general (sin producto asociado).
- [x] Unit tests: formateo de precio CLP, generación de deep link de
      WhatsApp, schema de contacto (11 tests, todos pasando).

## Fase 3 — Autenticación admin

- [x] Página `/admin/login` con formulario de email/password.
- [x] Server Action de login (`signInWithPassword`) + manejo de error de
      credenciales inválidas.
- [x] Layout protegido `/admin/(protected)/layout.tsx` que verifica sesión
      y redirige si no hay (verificado: `/admin` sin sesión → 307 a
      `/admin/login`).
- [x] Botón de logout. Login real probado por el usuario: funciona.

## Fase 4 — Admin: productos

- [x] Listado `/admin/productos`: tabla con nombre, categoría, precio,
      estado, acciones editar/eliminar.
- [x] Form de creación `/admin/productos/nuevo`: campos + subida de
      múltiples imágenes a Storage, generación de `slug` desde el nombre.
- [x] Form de edición `/admin/productos/[id]/editar`: mismo form
      precargado, permite agregar/quitar imágenes.
- [x] Acción de eliminar producto (con confirmación) — borra imágenes
      asociadas en Storage también.
- [x] Validación de formularios con Zod (nombre, descripción, precio > 0,
      categoría requerida).
- [x] Unit tests: schemas de Zod (casos válidos/inválidos) y generación de
      slug único (12 tests entre slug y producto).
- [x] Probado en el navegador por el usuario. Se encontraron y corrigieron
      3 bugs: Select de categoría/estado mostraba valor crudo en vez de
      etiqueta (Base UI requiere función `children` en `SelectValue`), y
      el campo de medidas no soportaba tallas de tejidos (se agregó
      `MeasurementField` con modo Dimensiones/Talla).

## Fase 5 — Admin: categorías y mensajes

- [x] `/admin/categorias`: listar, crear, eliminar categorías (evitar borrar
      una categoría con productos asociados, o pedir confirmación).
- [x] `/admin/mensajes`: listado de mensajes de `contact_messages`, más
      recientes primero, mostrando a qué producto refieren si aplica.
- [x] Probado en el navegador por el usuario, funciona.

## Fase 6 — Pulido y despliegue

- [x] Responsive check en mobile (catálogo, detalle, admin). Se corrigió
      el nav del admin para que no desborde en pantallas chicas; la tabla
      de productos ya scrollea horizontal si hace falta.
- [x] Metadata SEO básica (title con template `%s | nombre del sitio`,
      description, og:image por producto usando su primera foto,
      `noindex` en todo `/admin`).
- [x] Optimización de imágenes (`next/image` + dominio de Supabase
      Storage en `next.config.js`).
- [ ] Deploy a Vercel, variables de entorno configuradas ahí. **(pendiente
      — ver mensaje sobre cómo quieres manejar el repo/deploy)**
- [ ] Reemplazar placeholders (nombre del sitio, número de WhatsApp) cuando
      el usuario los confirme. **(pendiente de datos del usuario)**

## Notas de secuencia

- Fase 2 se puede probar con datos de prueba cargados a mano en Supabase
  Table Editor, sin esperar a Fase 4.
- Fase 3 y 4 dependen entre sí (no hay admin de productos sin login).
- Fase 6 es continua, no estrictamente "al final" — el responsive y SEO
  conviene revisarlos a medida que se construye cada página.
- No hay pruebas de integración ni E2E contra Supabase (decisión del
  usuario) — el testing se limita a unit tests de funciones y componentes
  puros con Vitest.
