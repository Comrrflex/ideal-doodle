import { NextResponse } from "next/server";
import { buildSessionValue, isValidAdmin, sessionCookieName } from "@/lib/auth";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!isValidAdmin(email, password)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.set(sessionCookieName, buildSessionValue(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
