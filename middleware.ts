import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); 
  const { pathname } = req.nextUrl; 

  if (pathname.startsWith("/auth/sign-in") || pathname.startsWith("/auth/sign-up")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon\\.ico).*)"], 
};
