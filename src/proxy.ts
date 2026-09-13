import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value
  const pathname = request.nextUrl.pathname;

  // Protect Dashboard pages
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect away from login if already logged in
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect sensitive API routes (Vault and Inbox)
  if (pathname.startsWith('/api/vault') || pathname.startsWith('/api/inbox')) {
    // Allow public access to POST /api/inbox (for contact form)
    if (pathname === '/api/inbox' && request.method === 'POST') {
      return NextResponse.next();
    }
    
    // Everything else in these routes requires auth
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/api/vault/:path*', '/api/inbox/:path*'],
}
