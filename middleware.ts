import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Zaštiti dashboard rutu
  if (pathname.startsWith('/dashboard')) {
    const adminSession = request.cookies.get('admin_session')
    
    if (!adminSession) {
      return NextResponse.redirect(new URL('/prijava', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*',
}

