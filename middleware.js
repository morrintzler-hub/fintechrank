import { NextResponse } from 'next/server'

export function middleware(request) {
  const theme = request.cookies.get('tfr_theme')?.value || 'dark'
  const response = NextResponse.next()
  // Pass theme to the page via header
  response.headers.set('x-theme', theme)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
