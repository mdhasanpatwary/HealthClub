import { NextResponse } from "next/server";
import { generateLlmsTxt } from "@/lib/seo/llmsGenerator";
import { logger } from "@/lib/logger";

export const dynamic = "force-static"; // Pre-rendered static route (zero ISR writes)
export const revalidate = false;

export async function GET() {
  try {
    const markdown = await generateLlmsTxt();
    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        "X-Robots-Tag": "index, follow",
      },
    });
  } catch (error) {
    logger.error("[LLMS] Error generating /llms.txt:", error);
    return new NextResponse("# Health Club Feni\nKnowledge base temporarily unavailable.", {
      status: 500,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }
}
