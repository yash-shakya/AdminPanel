import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // const token = request.cookies.get('firebaseAuthToken')?.value
  // const pathname = request.nextUrl.pathname
  // const superAdminRoutes = [
  //   '/panel/view/admins', 
  //   '/panel/add/admins'
  // ]
  // const isProtectedRoute = pathname.startsWith('/panel')

  // if (isProtectedRoute) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/', request.url))
  //   }

  //   const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route))
  //   if (isSuperAdminRoute) {
  //     const isSuperAdmin = request.cookies.get('isSuperAdmin')?.value === 'true'
  //     if (!isSuperAdmin) {
  //       return NextResponse.redirect(new URL('/', request.url))
  //     }
  //   }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/panel/:path*']
}