import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/gallery/[entitySlug]
 *
 * Retrieves all gallery entries associated with the given entitySlug.
 * Each gallery record includes:
 *   - src    (using `src` as a unique identifier)
 *   - caption (optional descriptive text)
 *
 * Expected query parameter:
 *   - entitySlug: string (e.g., "example-university")
 *
 * Returns:
 *   200: { images: Array<{ src: string; caption: string }> }
 *   400: { error: "Invalid entitySlug" }           — if entitySlug is missing or not a string
 *   500: { error: "Database error" }               — on any unexpected failure
 */
export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ collegeSlug: string }>;
  }
) {
  // Extract the entitySlug from the URL (e.g., /api/gallery/bennett-university)
  const { collegeSlug } = await params;

  // Validate that `collegeSlug` is a non-empty string
  if (!collegeSlug || typeof collegeSlug !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing collegeSlug" },
      { status: 400 }
    );
  }
  try {
    //
    // Fetch all Gallery records for this entitySlug, ordering by `src` ascending.
    //
    const records = await prisma.gallery.findMany({
      where: { entitySlug: collegeSlug },
    });

    // Transform into the desired JSON shape:
    //    { images: [ { src: "src-value", caption: "..." }, … ] }
    const payload = records.map((g) => ({
      src: g.src,
      caption: g.caption ?? "",
    }));

    return NextResponse.json({ images: payload }, { status: 200 });
  } catch (err) {
    // If anything goes wrong (e.g., database connectivity), log and return 500.
    console.error("Error fetching gallery for", collegeSlug, err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
