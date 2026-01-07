import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Obtener el refresh token de las cookies
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Rutas que requieren autenticación
    const protectedRoutes = ['/profile', '/admin'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Si es una ruta protegida y no hay refresh token, redirigir a login
    if (isProtectedRoute && !refreshToken) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Rutas que solo admins pueden acceder
    const adminRoutes = ['/admin'];
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    if (isAdminRoute && refreshToken) {
        // Aquí deberíamos verificar el rol del usuario
        // Pero como el refresh token es HttpOnly, no podemos leerlo desde el middleware
        // La verificación real se hará en el componente RequireAdmin
        // Este middleware solo verifica que haya un token

        // TODO: Implementar verificación de rol en el servidor
        // Por ahora, dejamos pasar y RequireAdmin hará la verificación
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
    ],
};
