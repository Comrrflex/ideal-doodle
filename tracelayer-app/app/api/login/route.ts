import { NextResponse } from "next/server";
import { buildSessionValue, isValidAdmin, sessionCookieName } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  // x-forwarded-for can contain a comma-separated list; take the last value to
  // use the IP added by the nearest trusted proxy rather than a client-supplied one.
  // Ensure your reverse proxy (Nginx, Cloudflare, etc.) is configured to overwrite
  // this header so clients cannot inject arbitrary values.
  const forwarded = req.headers.get("x-forwarded-for");
  const ip =
    (forwarded ? forwarded.split(",").pop()?.trim() : undefined) ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, retryAfterMs } = checkRateLimit(`login:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas de login. Tente novamente mais tarde." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) }
      }
    );
  }

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
