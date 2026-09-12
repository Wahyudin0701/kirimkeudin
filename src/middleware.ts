import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Cek apakah ada cookie token dari Supabase
  const token = request.cookies.get('sb-access-token')?.value

  // Jika user mencoba mengakses halaman dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Jika tidak ada token (belum login), lempar kembali ke halaman login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Jika mencoba ke halaman login tapi sudah punya token, arahkan ke dashboard
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Hanya jalankan middleware ini pada rute-rute berikut
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
