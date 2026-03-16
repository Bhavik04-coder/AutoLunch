import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';

// Supported languages
acceptLanguage.languages(['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'ko', 'zh']);

const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot',
  '/auth/activate',
  '/p/', // Preview routes
  '/uploads/', // Static uploads
  '/icons/', // Static icons
  '/oauth/', // OAuth callbacks
];

const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/forgot'];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle logout
  if (pathname === '/auth/logout') {
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('auth-token');
    response.cookies.delete('refresh-token');
    return response;
  }

  // 2. Language detection and persistence
  let language = request.cookies.get('language')?.value;
  
  if (!language) {
    language = acceptLanguage.get(request.headers.get('Accept-Language')) || 'en';
    const response = NextResponse.next();
    response.cookies.set('language', language, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
    });
  }

  // 3. Check authentication
  const authToken = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!authToken;

  // 4. Allow public routes
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  if (isPublicRoute && !AUTH_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 5. Handle organization invites
  if (pathname.startsWith('/invite/')) {
    if (!isAuthenticated) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 6. Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/launches', request.url));
  }

  // 7. Protect authenticated routes
  if (!isAuthenticated && !isPublicRoute) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
};
