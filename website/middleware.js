import { NextResponse } from 'next/server';

const publicPaths = new Set(['/', '/login', '/register', '/admin-login']);

function isPublicAsset(pathname) {
  return pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public') ||
    pathname.includes('.');
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  if (isPublicAsset(pathname) || publicPaths.has(pathname)) {
    return NextResponse.next();
  }

  const isAuthed = request.cookies.get('wc_auth')?.value === '1';
  if (!isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '?next=' + encodeURIComponent(pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
