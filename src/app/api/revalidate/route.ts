import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");
  const tag = searchParams.get("tag");
  const type = searchParams.get("type") as "page" | "layout" | null;

  const validSecret = process.env.SESSION_SECRET;
  if (!validSecret || secret !== validSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const results: Record<string, boolean> = {};

  if (tag) {
    revalidateTag(tag, "max");
    results[`tag:${tag}`] = true;
  }

  if (path) {
    if (type) {
      revalidatePath(path, type);
    } else {
      revalidatePath(path);
    }
    results[`path:${path}`] = true;
  }

  if (!path && !tag) {
    // Default broad refresh if none specified
    revalidateTag("partners", "max");
    revalidateTag("doctors", "max");
    revalidatePath("/partner-hospitals");
    revalidatePath("/partner-hospitals/[slug]", "page");
    revalidatePath("/consultants");
    results["default_purge"] = true;
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    results,
  });
}
