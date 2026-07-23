# Especificación: Catálogo de Artesanías

## 1. Resumen

Sitio web para exhibir productos artesanales hechos a mano (madera, tejidos y
bordados) por los abuelos y la madre del dueño del proyecto. Funciona como
catálogo/vidriera digital: no hay compra ni pago en línea. El visitante ve los
productos y contacta por WhatsApp o formulario para coordinar la compra.

Incluye un panel de administración privado para cargar, editar y eliminar
productos, usado por una única cuenta compartida entre la familia.

## 2. Usuarios

- **Visitante (público, sin login):** navega el catálogo, filtra por
  categoría, ve el detalle de un producto y contacta al vendedor.
- **Admin (cuenta compartida, con login):** gestiona el catálogo completo
  (crear, editar, eliminar productos y categorías).

## 3. Alcance

### Incluido
- Catálogo público de productos con filtro por categoría/material.
- Página de detalle de producto con galería de fotos, descripción, precio,
  dimensiones y estado de disponibilidad.
- Contacto por WhatsApp (deep link con mensaje prellenado referenciando el
  producto) y por formulario de contacto (envía notificación al admin).
- Panel de admin con login (Supabase Auth) para CRUD de productos.
- Subida de imágenes de producto (Supabase Storage).

### Fuera de alcance (por ahora)
- Carrito de compras y pagos en línea.
- Cuentas de usuario para visitantes.
- Múltiples roles de admin o auditoría de quién publicó qué.
- Multi-idioma (el sitio es solo en español).
- Envíos, stock automatizado o inventario complejo.

## 4. Historias de usuario

1. **Como visitante**, quiero ver todos los productos organizados por
   categoría (madera, tejidos, bordados), para encontrar rápido lo que me
   interesa.
2. **Como visitante**, quiero ver el detalle de un producto (fotos, precio,
   medidas, disponibilidad), para decidir si quiero comprarlo.
3. **Como visitante**, quiero contactar al vendedor por WhatsApp con un
   mensaje que ya mencione el producto, para no tener que escribir todo de
   cero.
4. **Como visitante**, quiero poder enviar una consulta por un formulario si
   no uso WhatsApp, para tener una alternativa de contacto.
5. **Como admin**, quiero iniciar sesión de forma privada, para acceder al
   panel de gestión de productos.
6. **Como admin**, quiero crear un producto nuevo con fotos, descripción,
   precio, categoría, medidas y estado, para publicarlo en el catálogo.
7. **Como admin**, quiero editar o eliminar un producto existente, para
   mantener el catálogo actualizado (ej. marcar como vendido).
8. **Como admin**, quiero gestionar las categorías disponibles, para
   organizar el catálogo a medida que crece la variedad de productos.

## 5. Modelo de datos (borrador)

### `categories`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| name | text | ej. "Madera", "Tejidos", "Bordados" |
| slug | text | único, para URLs |

### `products`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| name | text | requerido |
| description | text | requerido |
| price | numeric | requerido, en CLP (peso chileno), sin decimales |
| dimensions | text | ej. "30x20x10 cm", texto libre |
| status | enum | `available` \| `sold` \| `made_to_order` |
| category_id | uuid | FK a `categories` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `product_images`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| product_id | uuid | FK a `products` |
| storage_path | text | ruta en Supabase Storage |
| position | int | orden de la galería |

### `contact_messages`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK |
| product_id | uuid nullable | producto referenciado, si aplica |
| name | text | requerido |
| email o teléfono | text | requerido |
| message | text | requerido |
| created_at | timestamptz | |

## 6. Requisitos no funcionales

- El catálogo público debe cargar rápido y ser indexable por buscadores
  (SEO), ya que es el principal canal de descubrimiento.
- Debe verse bien en mobile (la mayoría del tráfico esperado es celular).
- El panel de admin debe ser simple de usar para personas no técnicas.
- Las imágenes deben optimizarse/redimensionarse para no pesar demasiado.

## 7. Decisiones confirmadas

- **Moneda**: CLP (peso chileno). Los precios se muestran como enteros sin
  decimales (ej. "$15.000").
- **Contenido inicial**: el catálogo arranca vacío; los productos se cargan
  después desde el panel de admin.

## 8. Pendiente (bloquea despliegue, no bloquea desarrollo)

- **Nombre del sitio / marca**: aún no definido. Se puede desarrollar con un
  nombre placeholder y reemplazar después.
- **Número de WhatsApp y datos de contacto**: el usuario los proveerá más
  adelante. Se dejará como variable de entorno para configurarlo fácil sin
  tocar código.
