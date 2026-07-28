import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/search-liquor", "/cart", "/wishlist", "/checkout", "/order-confirmed", "/profile", "/orders", "/settings"];
const PROTECTED_ADMIN_PATH = "/admin";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has("auth_token");
  const hasAdminToken = request.cookies.has("admin_auth_token");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const isAdminProtected = pathname === PROTECTED_ADMIN_PATH || (pathname.startsWith(`${PROTECTED_ADMIN_PATH}/`) && pathname !== "/admin/login");
  if (isAdminProtected && !hasAdminToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isProtected = PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (isProtected && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
