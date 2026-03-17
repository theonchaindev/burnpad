import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MOCK_TOKENS } from "@/lib/constants";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ mint: string }> }
) {
  const { mint } = await params;
  try {
    const token = await prisma.token.findUnique({ where: { mint } });
    if (token) return NextResponse.json(token);
  } catch {
    // DB not configured
  }

  // Fallback to mock
  const mock = MOCK_TOKENS.find((t) => t.mint === mint);
  if (mock) return NextResponse.json(mock);

  return NextResponse.json({ error: "Token not found" }, { status: 404 });
}
