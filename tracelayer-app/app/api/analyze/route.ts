import { NextResponse } from "next/server";

// This endpoint is discontinued. It has been superseded by /api/generate.
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint has been discontinued. Use /api/generate instead." },
    { status: 410 }
  );
}
