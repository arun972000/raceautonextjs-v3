import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Import `jwtVerify` from jose

async function verifyToken(token:any) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_KEY) // Use a TextEncoder to convert the secret to a Uint8Array
    );
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  // if (req.nextUrl.pathname.startsWith('/public')) {

  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }


  // Retrieve the token from cookies
  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    // No token, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const decoded = await verifyToken(token);

  if (!decoded || decoded.role !== "admin") {
    // If verification fails or role is not "admin", deny access
    return NextResponse.json(
      { message: "Access Denied: Admins only" },
      { status: 403 }
    );
  }

  // If verified and role is admin, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", // Apply to admin routes
    "/user/:path*", // Apply to user routes
  ],
};