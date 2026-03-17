import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MOCK_TOKENS } from "@/lib/constants";

export async function GET() {
  try {
    const tokens = await prisma.token.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    // Merge with mock data for demo
    return NextResponse.json({ tokens: [...tokens, ...MOCK_TOKENS] });
  } catch {
    // DB not configured — return mock data
    return NextResponse.json({ tokens: MOCK_TOKENS });
  }
}
