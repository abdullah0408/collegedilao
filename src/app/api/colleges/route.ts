// File: app/api/colleges/route.ts
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export const revalidate = 3600; // 1 hour

/**
 * GET /api/colleges?gender=GIRLS,BOYS&states=1,2&cities=5,12
 *            &entityTypes=UNIVERSITY,COLLEGE
 *            &ownershipTypes=GOVERNMENT,PRIVATE
 *            &courseCodes=MBA,B_TECH
 *            &courseCategories=ENGINEERING
 *            &courseTypes=UNDERGRADUATE
 *            &courseLookups=3,7,15
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Parse each param (if present) into an array of strings or numbers
  const genderFilter = searchParams.get("gender")?.split(",") ?? [];
  const stateFilter = searchParams
    .get("states")
    ?.split(",")
    .map((s) => Number(s))
    .filter((n) => !isNaN(n)) ?? [];
  const cityFilter = searchParams
    .get("cities")
    ?.split(",")
    .map((c) => Number(c))
    .filter((n) => !isNaN(n)) ?? [];
  const entityTypeFilter = searchParams.get("entityTypes")?.split(",") ?? [];
  const ownershipFilter = searchParams.get("ownershipTypes")?.split(",") ?? [];
  const courseCodeFilter = searchParams.get("courseCodes")?.split(",") ?? [];
  const courseCategoryFilter = searchParams.get("courseCategories")?.split(",") ?? [];
  const courseTypeFilter = searchParams.get("courseTypes")?.split(",") ?? [];
  const courseLookupFilter = searchParams
    .get("courseLookups")
    ?.split(",")
    .map((id) => Number(id))
    .filter((n) => !isNaN(n)) ?? [];

  try {
    // Build Prisma "where" clause incrementally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    // 1) Gender (enum stored as string in DB)
    if (genderFilter.length > 0) {
      whereClause.genderAccepted = { in: genderFilter };
    }

    // 2) State (entity.stateId is a foreign key)
    if (stateFilter.length > 0) {
      whereClause.stateId = { in: stateFilter };
    }

    // 3) City
    if (cityFilter.length > 0) {
      whereClause.cityId = { in: cityFilter };
    }

    // 4) Entity Type
    if (entityTypeFilter.length > 0) {
      whereClause.typeCode = { in: entityTypeFilter };
    }

    // 5) Ownership Type
    if (ownershipFilter.length > 0) {
      whereClause.ownershipTypeCode = { in: ownershipFilter };
    }

    // 6) Course‐related filters
    // We will filter by "courseLookups" first. If any courseLookup IDs were passed,
    // require that the Entity must have at least one Course whose courseLookupId is in that array.
    if (courseLookupFilter.length > 0) {
      whereClause.courses = {
        some: {
          courseLookupId: { in: courseLookupFilter },
        },
      };
    } else {
      // If no explicit courseLookup IDs, but there are filters on courseCode/courseCategory/courseType,
      // we must join through CourseLookup to filter appropriately.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subFilters: any = {};

      if (courseCodeFilter.length > 0) {
        subFilters.courseLookup = { courseCode: { in: courseCodeFilter } };
      }
      if (courseCategoryFilter.length > 0) {
        subFilters.courseLookup = {
          ...(subFilters.courseLookup ?? {}),
          categoryCode: { in: courseCategoryFilter },
        };
      }
      if (courseTypeFilter.length > 0) {
        subFilters.courseLookup = {
          ...(subFilters.courseLookup ?? {}),
          typeCode: { in: courseTypeFilter },
        };
      }

      if (Object.keys(subFilters).length > 0) {
        whereClause.courses = {
          some: subFilters,
        };
      }
    }

    // Fetch up to 50 matching entities, including relations
    const colleges = await prisma.entity.findMany({
      where: whereClause,
      include: {
        // Include the foreign‐key lookups to display details on the frontend
        type: {
          select: { code: true, /* you can include related fields if needed */ },
        },
        ownershipType: {
          select: { code: true },
        },
        state: {
          select: { id: true, name: true },
        },
        city: {
          select: { id: true, name: true, stateId: true },
        },
        courses: {
          select: {
            id: true,
            info: true,
            courseLookup: {
              select: {
                id: true,
                code: true,
                courseCode: true,
                categoryCode: true,
                typeCode: true,
              },
            },
          },
        },
      },
      take: 50,
    });

    return NextResponse.json(colleges);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}
