import { NextResponse } from "next/server";
import { createAmmWithToken } from "@/lib/xrpl/createAmm";

export async function GET() {
  try {
    const result = await createAmmWithToken();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || err }, { status: 500 });
  }
}
