// Middleware: Schützt Dashboard-Routen, prüft ob User eingeloggt ist (userId-Cookie)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Liste der geschützten Routen
  const protectedRoutes = ["/dashboard", "/dashboard/myday", "/dashboard/important", "/dashboard/category"];

  // Überprüfe, ob die aktuelle Route geschützt ist
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Prüfe ALLE Cookies auf userId (auch mit anderen Attributen)
    const allCookies = request.headers.get('cookie') || '';
    const userId = allCookies.match(/userId=([^;]+)/)?.[1];
    if (!userId) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Erlaube den Zugriff auf die Seite
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Middleware wird auf alle Dashboard-Routen angewendet
};
