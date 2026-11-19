import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { success: true, logs: [] },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST() {
  return NextResponse.json({ success: true }, { status: 200 });
}
