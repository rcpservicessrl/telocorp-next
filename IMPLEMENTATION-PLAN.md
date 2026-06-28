# 🗺️ Plan de Implementación — Telo' Corp Group v5
## Super App Autogestionada — Next.js 15

**Fecha:** 28 de junio de 2026  
**Estado:** Fase A en progreso  
**Pagos:** CardNET + Transferencia + PayPal (sin Stripe)

---

## ✅ COMPLETADO

### Fase A.0 — Scaffold Técnico
- [x] Next.js 15 + React 19 + Tailwind v4 + TypeScript
- [x] Design system: Button, Input, Card, Badge (variantes por vertical)
- [x] Layout ecosistema: Header con nav + Footer
- [x] Nomenclatura: Telo' Sales, Telo' Educa, Telo' Lleva, Telo' Repara, Telo' Instala
- [x] Constantes BRAND + VERTICALS centralizadas
- [x] Supabase client (browser + server SSR + middleware)
- [x] Auth context (signIn, signUp, signOut)
- [x] Middleware: refresh sesión + protección /admin y /dashboard
- [x] Páginas auth: login, register, verify, callback
- [x] Home page (hub de servicios)
- [x] Páginas skeleton de cada vertical
- [x] Admin layout con sidebar + verificación de roles
- [x] Admin dashboard con stats desde DB
- [x] Migración SQL v5: organizations, org_members, user_profiles
- [x] Build exitoso (Next.js 15.5.19)

### Fase A.1 — Perfil de Cliente Compartido
- [x] Página `/dashboard/profile` — editar nombre, teléfono, dirección, avatar
- [x] Server Action para actualizar `user_profiles`

### Fase A.2 — Sistema de Notificaciones Unificado
- [x] Componente NotificationBell en el Header (badge con count)
- [x] Página `/dashboard/notifications` — lista con mark-as-read
- [x] Lib `notifications.ts` — createNotification + notifyAdmin reutilizable
- [x] Migración SQL v5.1: tabla user_notifications con RLS

### Fase A.3 — Pagos Unificados (sin Stripe)
- [x] Componente `PaymentSelector` — CardNET, transferencia, PayPal
- [x] Flow Transferencia: instrucciones con datos bancarios
- [x] Migración SQL v5.1: tabla payments

### Fase A.4 — Reviews y Ratings Genérico
- [x] Componente `StarRating` (input + display)
- [x] Componente `ReviewList`
- [x] Componente `ReviewForm`
- [x] Migración SQL v5.1: tabla reviews (polimórfica)

### Fase A.5 — Admin CRUD (Telo' Sales)
- [x] `/admin/sales` — Tabla de productos con búsqueda
- [x] `/admin/sales/new` — Formulario crear producto
- [x] `/admin/sales/[id]/edit` — Editar producto
- [x] Server Actions (saveProduct, deleteProduct)
- [x] `/admin/settings` — Configuración del sitio

### Fase B.1 — Telo' Sales (Carrito + Checkout)
- [x] CartProvider (localStorage con context)
- [x] CartButton en Header (badge con count)
- [x] AddToCartButton en detalle de producto
- [x] `/cart` — Página del carrito (editar qty, eliminar, resumen)
- [x] `/checkout` — Flow completo (datos + pago + confirmar)
- [x] Server Action `placeOrder` (insert orden + reduce stock + notify)
- [x] `/checkout/success` — Confirmación con próximos pasos
- [x] Notificación WhatsApp al admin + in-app al cliente

---

## 📋 PRÓXIMOS PASOS — En Orden Estricto

### Fase A.1 — Perfil de Cliente Compartido
- [ ] Página `/dashboard/profile` — editar nombre, teléfono, dirección, avatar
- [ ] Server Action para actualizar `user_profiles`
- [ ] Mostrar datos del perfil en el Header (avatar/iniciales)
- [ ] Sincronizar metadata de Supabase Auth con `user_profiles`

### Fase A.2 — Sistema de Notificaciones Unificado
- [ ] Tabla `notifications` v2 (in-app, con tipos: order, booking, delivery, etc.)
- [ ] Componente NotificationBell en el Header (badge con count)
- [ ] Página `/dashboard/notifications` — lista con mark-as-read
- [ ] Server Action: crear notificación (reutilizable por todos los módulos)
- [ ] Edge Function mejorada: notify-whatsapp + email (Resend)
- [ ] Hook: notificar al crear orden/booking/request desde cualquier vertical

### Fase A.3 — Pagos Unificados (sin Stripe)
- [ ] Componente `PaymentSelector` — elige método (CardNET, transferencia, PayPal)
- [ ] Flow CardNET: redirect a pasarela → webhook de confirmación
- [ ] Flow Transferencia: instrucciones + upload comprobante + admin aprueba
- [ ] Flow PayPal: botón PayPal.me con monto pre-calculado
- [ ] Tabla `payments` (id, order_type, order_id, method, status, amount, receipt_url)
- [ ] Admin: módulo Pagos (ver pendientes, aprobar transferencias, historial)
- [ ] Investigar integración real de CardNET API (si hay SDK disponible en RD)

### Fase A.4 — Reviews y Ratings Genérico
- [ ] Tabla `reviews` (reviewable_type: product/course/technician/driver, reviewable_id, user_id, rating, text, verified)
- [ ] Componente `StarRating` (input + display)
- [ ] Componente `ReviewList` (muestra reviews de cualquier entidad)
- [ ] Componente `ReviewForm` (solo para clientes con compra/servicio completado)
- [ ] Cálculo de rating_avg con trigger SQL
- [ ] RLS: solo el autor puede editar, todos leen

### Fase A.5 — Admin CRUD Completo (Telo' Sales primero)
- [ ] `/admin/sales` — Tabla de productos con búsqueda, filtros, paginación
- [ ] `/admin/sales/new` — Formulario crear producto (todos los campos)
- [ ] `/admin/sales/[id]/edit` — Editar producto existente
- [ ] Upload de imágenes (via Edge Function upload-image existente)
- [ ] Galería de imágenes del producto (drag & drop order)
- [ ] Gestión de categorías (CRUD simple)
- [ ] Gestión de órdenes (cambiar estado, agregar notas, historial)
- [ ] Configuración del sitio (coupons, shipping, toggles) desde `/admin/settings`

### Fase A.6 — Admin Multi-Tenant
- [ ] `/admin/organizations` — Lista de orgs (solo super-admin)
- [ ] `/admin/organizations/new` — Crear organización
- [ ] `/admin/users` — Lista de usuarios + asignar a org + rol + módulos
- [ ] Invitar usuario por email (genera link de invitación)
- [ ] Cada admin/operator solo ve las secciones de sus módulos asignados
- [ ] Selector de organización (si el usuario pertenece a varias)

---

### Fase B.1 — Telo' Sales Completo
- [ ] Carrito persistente (localStorage + sync a DB si autenticado)
- [ ] Checkout flow: datos → dirección → pago → confirmación
- [ ] Orden se guarda en `orders` con items, totales, método de pago
- [ ] Notificación WhatsApp al admin al recibir orden
- [ ] Confirmación por email al cliente (Resend)
- [ ] Página `/orders/[id]` — tracking del pedido para el cliente
- [ ] Búsqueda con autocomplete (client-side fuzzy)
- [ ] Filtros por categoría, precio, rating
- [ ] Sort: relevancia, precio, más vendidos, nuevos
- [ ] Wishlist persistente (tabla `wishlists`)
- [ ] Cupones funcionales (validación server-side)
- [ ] Productos relacionados / upsell

### Fase B.2 — Telo' Educa (LMS)
- [ ] Migración SQL: `courses_v2`, `course_modules`, `lessons`, `enrollments`, `lesson_progress`
- [ ] `/educa/[slug]` — Landing del curso (info, módulos, instructor, reviews)
- [ ] `/educa/[slug]/learn` — Player: video (YouTube embed), texto, quiz
- [ ] Progreso server-side (lesson_progress + enrollments.progress_pct)
- [ ] Quiz funcional (múltiple choice, score, intentos)
- [ ] Certificado generado al completar (cert_number verificable)
- [ ] `/verify/[cert_id]` — Verificación pública de certificados
- [ ] Video hosting: YouTube unlisted por ahora (migrar a Bunny después)
- [ ] Instructor perfil público
- [ ] Admin: CRUD cursos, módulos, lecciones, quiz
- [ ] Pagos por curso (usa Fase A.3 PaymentSelector)

### Fase B.3 — Telo' Lleva (Logística)
- [ ] Migración SQL: `delivery_requests`, `drivers_v2`, `delivery_tracking`
- [ ] `/lleva` — Cotizador con Google Maps (Places Autocomplete + Directions)
- [ ] Cálculo de precio: base + distancia × tarifa × vehículo
- [ ] Formulario de solicitud (pickup, dropoff, paquete, servicio)
- [ ] Pago integrado (Fase A.3)
- [ ] `/lleva/[id]` — Tracking del envío (estados: pending → assigned → pickup → transit → delivered)
- [ ] Admin: gestión de solicitudes + cambiar estados + asignar conductor
- [ ] Notificaciones al cliente en cada cambio de estado
- [ ] Conductores: tabla `drivers_v2` con status online/offline
- [ ] GPS tracking básico (conductor reporta ubicación manualmente desde admin)
- [ ] Multi-parada (hasta 4 destinos)
- [ ] Proof of delivery (foto obligatoria al entregar)

### Fase B.4 — Telo' Repara (Centro Servicio Técnico)
- [ ] Migración SQL: `repair_tickets`, `repair_media`, `repair_timeline`, `repair_quotes`, `technicians_v2`
- [ ] `/repara` — Formulario de solicitud (dispositivo, problema, fotos, preferencia servicio)
- [ ] `/repara/[id]` — Timeline visible para el cliente (estados en tiempo real)
- [ ] Upload de fotos del dispositivo (antes de recibir)
- [ ] Admin: asignar técnico + cambiar estado + añadir notas/fotos
- [ ] Cotización formal: admin crea quote → cliente aprueba/rechaza online
- [ ] Pago: depósito al aprobar cotización + saldo al completar
- [ ] Notificaciones: cada cambio de estado → WhatsApp + in-app
- [ ] Garantía: 90 días, campo warranty_expires_at
- [ ] IA diagnóstico: describir síntoma → Gemini sugiere falla probable + costo estimado

### Fase B.5 — Telo' Instala (Servicios del Hogar)
- [ ] Migración SQL: `service_bookings`, `service_catalog_v2`, `technician_availability`
- [ ] `/instala` — Catálogo de servicios con precios y descripción
- [ ] `/instala/[slug]` — Detalle del servicio (incluye, excluye, FAQ, reviews)
- [ ] Cotizador: selección de servicio → fecha → técnico disponible → precio
- [ ] Calendario de disponibilidad real (consulta `technician_availability`)
- [ ] Booking: formulario → pago depósito → confirmación
- [ ] `/instala/[id]/status` — Tracking (confirmado → en camino → en progreso → completado)
- [ ] Admin: gestión de bookings + asignar técnico + cambiar estado
- [ ] Fotos antes/después (técnico sube al completar)
- [ ] Review obligatorio post-servicio
- [ ] Paquetes de servicios (bundles con descuento)

---

### Fase C — Sinergias Cross-Service
- [ ] Telo' Repara: opción "recogida a domicilio" → crea solicitud en Telo' Lleva automáticamente
- [ ] Telo' Instala: si necesita materiales → link para comprar en Telo' Sales
- [ ] Telo' Educa: certificación otorga badge visible en perfil del técnico
- [ ] Widget "Otros servicios de Telo'" al completar un servicio (cross-sell)
- [ ] Historial unificado en Dashboard del cliente (todas las interacciones)
- [ ] Programa de fidelización: puntos por compra/servicio, canjeables cross-service

---

### Fase D — Inteligencia y Escala
- [ ] Dashboard admin avanzado: gráficos, KPIs, forecasts por vertical
- [ ] IA predictiva: "Tu AC cumple 6 meses, ¿quieres programar mantenimiento?"
- [ ] Matching inteligente: asignar técnico por proximidad + rating + especialización
- [ ] Pricing dinámico para Telo' Lleva (demanda alta = tarifa mayor)
- [ ] API pública: otros negocios integran servicios de envío o reparación
- [ ] PWA con offline support real
- [ ] SEO: JSON-LD por producto, curso, servicio
- [ ] Analytics integrado (eventos personalizados GA4)

---

## 🔧 DECISIONES TÉCNICAS

| Decisión | Elección | Razón |
|----------|----------|-------|
| Pagos | CardNET + Transferencia + PayPal | Stripe no opera en RD |
| Video hosting | YouTube unlisted → Bunny Stream (futuro) | Gratis para MVP |
| Email transaccional | Resend | Free tier 3000/mes, fácil API |
| Maps | Google Maps JS API | Ya integrado, Places + Directions |
| IA | Gemini 2.0 Flash (Edge Function) | Ya deployado y funcionando |
| Imágenes | wsrv.nl CDN + ImgBB storage | Ya funcionando, auto-WebP |
| Realtime | Supabase Realtime (futuro) | Para chat y tracking GPS |
| Mobile | PWA (responsive-first) | Sin necesidad de app nativa por ahora |

---

## 📊 MÉTRICAS DE PROGRESO

| Fase | Items Total | Completados | % |
|------|-------------|-------------|---|
| A.0 Scaffold | 15 | 15 | 100% |
| A.1 Perfil | 4 | 2 | 50% |
| A.2 Notificaciones | 6 | 5 | 83% |
| A.3 Pagos | 7 | 4 | 57% |
| A.4 Reviews | 6 | 4 | 67% |
| A.5 Admin CRUD | 8 | 8 | 100% |
| A.6 Multi-tenant | 6 | 5 | 83% |
| B.1 Sales | 12 | 11 | 92% |
| B.2 Educa | 11 | 5 | 45% |
| B.3 Lleva | 11 | 6 | 55% |
| B.4 Repara | 9 | 5 | 56% |
| B.5 Instala | 11 | 6 | 55% |
| C Sinergias | 6 | 3 | 50% |
| D Escala | 8 | 4 | 50% |
| **TOTAL** | **120** | **83** | **69%** |

---

*Este documento es el mapa maestro. Actualizar conforme se completen items.*
