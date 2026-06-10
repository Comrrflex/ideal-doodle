import { NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/auth";

export async function POST(req: Request) {
  const response = NextResponse.redirect(new URL("/login", req.url));
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}
