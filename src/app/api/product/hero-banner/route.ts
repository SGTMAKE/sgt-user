import { db } from "@/lib/prisma";
import { error500, success200 } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const banners = await db.heroBanner.findMany();

    const response = banners?.length !== 0
      ? success200({ banners })
      : error500({ banners: null });

    // Add no-cache headers
    return new NextResponse(response.body, {
      ...response,
      headers: {
        ...response.headers,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    const response = error500({ banners: null });
    return new NextResponse(response.body, {
      ...response,
      headers: {
        ...response.headers,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  }
}
