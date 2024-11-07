import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.text();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
