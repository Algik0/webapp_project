import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Liste der geschützten Routen
  const protectedRoutes = ["/dashboard", "/dashboard/myday", "/dashboard/important", "/dashboard/category"];

  // Überprüfe, ob die aktuelle Route geschützt ist
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const userId = request.cookies.get("userId")?.value;

    // Wenn kein userId-Cookie vorhanden ist, leite zur Login-Seite weiter
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