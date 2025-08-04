import { db } from "@/lib/prisma";
import { error500, success200 } from "@/lib/utils";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET() {
  try {
    const offers = await db.marqueeOffers.findMany();
    return success200({ offers });
  } catch (error) {
    return error500({});
  }
}
