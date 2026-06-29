import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Refreshes the Supabase auth session on every request.
 * Separates admin and client auth flows completely.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // === ADMIN ROUTES ===
  // /admin/login is public (the hidden gate)
  if (pathname === '/admin/login') {
    // If already logged in as admin, skip login page
    if (user) {
      const isAdmin = user.email?.endsWith('@telocg.com') ||
        user.user_metadata?.role === 'admin' ||
        user.user_metadata?.role === 'owner'
      if (isAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
    }
    return supabaseResponse
  }

  // All other /admin/* routes require admin auth
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    const isAdmin = user.email?.endsWith('@telocg.com') ||
      user.user_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'owner'

    if (!isAdmin) {
      // Not an admin — send to client dashboard, not admin login
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // === CLIENT ROUTES ===
  // /dashboard requires any authenticated user
  if (pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
