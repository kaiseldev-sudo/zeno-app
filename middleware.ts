import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if maintenance mode is enabled via environment variable
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  
  if (isMaintenanceMode) {
    // Allow access to maintenance page and static assets
    if (request.nextUrl.pathname === '/maintenance' || 
        request.nextUrl.pathname.startsWith('/_next/') ||
        request.nextUrl.pathname.startsWith('/favicon') ||
        request.nextUrl.pathname.startsWith('/icons') ||
        request.nextUrl.pathname.startsWith('/manifest') ||
        request.nextUrl.pathname.startsWith('/sw-custom') ||
        request.nextUrl.pathname.startsWith('/zeno-logo')) {
      return NextResponse.next();
    }
    
    // Redirect all other requests to maintenance page
    return NextResponse.redirect(new URL('/maintenance', request.url));
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
