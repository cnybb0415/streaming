import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const blockedPaths = new Set([
  "/wordpress/wp-admin/setup-config.php",
  "/wp-admin/setup-config.php",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (blockedPaths.has(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/wordpress/wp-admin/setup-config.php", "/wp-admin/setup-config.php"],
};
