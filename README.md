# TeloCorp Next — Plataforma eCommerce v5.0

> Migración de telocg.com a Next.js 15 con App Router, SSR, y funcionalidades avanzadas.

## Stack

- **Framework:** Next.js 15 (App Router, RSC, SSR/ISR)
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Backend:** Supabase (reutiliza la misma instancia de producción)
- **Auth:** Supabase Auth (@supabase/ssr)
- **Hosting:** Vercel
- **Dominio:** telocg.com (se migrará de GitHub Pages a Vercel)

## Setup

```bash
cd telocorp-next
npm install
cp .env.example .env.local
# Editar .env.local con las credenciales de Supabase
npm run dev
```

## Estructura

```
telocorp-next/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (header, footer, providers)
│   ├── page.tsx            # Home page (hero, services, featured)
│   ├── products/
│   │   ├── page.tsx        # Catalog grid (SSR + filters)
│   │   └── [slug]/
│   │       └── page.tsx    # Product detail page (SSR, SEO)
│   ├── cart/
│   │   └── page.tsx        # Cart + Checkout
│   ├── educa/
│   │   ├── page.tsx        # Courses listing
│   │   └── [id]/
│   │       └── page.tsx    # Course detail + classroom
│   ├── lleva/
│   │   └── page.tsx        # Delivery request
│   ├── repara/
│   │   └── page.tsx        # Repair booking
│   ├── instala/
│   │   └── page.tsx        # Installation booking
│   ├── profile/
│   │   └── page.tsx        # User profile + history
│   ├── admin/
│   │   └── ...             # Admin panel (separate layout)
│   └── api/                # API routes (if needed)
├── components/             # Shared UI components
├── lib/                    # Utilities (supabase client, helpers)
├── public/                 # Static assets
├── supabase/               # Edge Functions (copied from original)
└── docs/                   # Audit documents
```

## Migration Plan

1. ✅ Scaffold Next.js project
2. Create Supabase client (SSR + client)
3. Implement product pages (SSR with dynamic meta tags)
4. Migrate catalog UI to React components
5. Implement auth flow (login/register/profile)
6. Cart with server-side persistence
7. Checkout with CardNET flow
8. Deploy to Vercel + migrate domain
