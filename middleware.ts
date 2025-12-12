import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/log', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Si la ruta es /portal o cualquier subruta y no hay token, redirigir a login
  if (pathname.startsWith('/portal') && !token) {
    return NextResponse.redirect(new URL('/log', request.url));
  }

  // Si está autenticado y intenta acceder a login/register, redirigir al portal
  if (token && (pathname === '/log' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/portal', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
