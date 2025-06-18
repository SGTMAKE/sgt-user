import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Attach current pathname as x-url header
  response.headers.set("x-url", request.nextUrl.pathname + request.nextUrl.search);

  return response;
}


export const config = {
  matcher: ["/orders/:path*", "/checkout/:path*", "/account/:path*", "/service/:path*"],
};
