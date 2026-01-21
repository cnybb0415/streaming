import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET() {
  return NextResponse.json(
    { error: "Schedule feature disabled" },
    { status: 404, headers: { "cache-control": "no-store" } }
  );
}
