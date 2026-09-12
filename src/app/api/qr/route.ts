import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get("data");
  const size = searchParams.get("size") || "150x150";
  const color = searchParams.get("color") || "0f172a";
  const bgcolor = searchParams.get("bgcolor") || "ffffff";

  if (!data) {
    return new NextResponse("Missing data parameter", { status: 400 });
  }

  // Sanitize size and color to prevent abuse
  const safeSize = /^\d{2,3}x\d{2,3}$/.test(size) ? size : "150x150";
  const safeColor = /^[0-9a-fA-F]{3,8}$/.test(color) ? color : "0f172a";
  const safeBgcolor = /^[0-9a-fA-F]{3,8}$/.test(bgcolor) ? bgcolor : "ffffff";

  const targetUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${encodeURIComponent(
    safeSize
  )}&data=${encodeURIComponent(data)}&color=${encodeURIComponent(
    safeColor
  )}&bgcolor=${encodeURIComponent(safeBgcolor)}`;

  try {
    const res = await fetch(targetUrl, {
      next: { revalidate: 31536000 }, // 1 year revalidation on edge/server
    });

    if (!res.ok) {
      return new NextResponse("Failed to generate QR code", { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/png";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Error fetching QR code", { status: 500 });
  }
}
