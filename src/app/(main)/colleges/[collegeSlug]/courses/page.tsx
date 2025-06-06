import { prisma } from "@/lib/prisma";
import CoursesTab from "@/components/CoursesTab";

interface Params {
  collegeSlug: string;
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { collegeSlug } = await params;

  const entity = await prisma.entity.findUnique({
    where: { slug: collegeSlug.trim().toLowerCase() },
    select: {
      courses: {
        select: {
          id: true,
          duration: true, // in months
          fee: true, // Int[]
          info: true,
          tags: true,
          eligibility: true, // string[]
          applicationStartDate: true,
          applicationEndDate: true,
          avgPackage: true, // number | null
          entranceExams: {
            select: { name: true },
          },
          courseLookup: {
            select: {
              code: true, // e.g. "B.Tech"
              courseCodeCode: true, // e.g. "CSE101"
              categoryCode: true, // e.g. "Engineering"
              typeCode: true, // e.g. "Undergraduate"
            },
          },
        },
      },
    },
  });

  if (!entity) {
    return (
      <div className="px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold">College Not Found</h1>
        <p className="mt-2 text-gray-600">
          We couldn’t find any college with slug “{collegeSlug}”.
        </p>
      </div>
    );
  }

  const courses = entity.courses.map((c) => {
    const lookup = c.courseLookup!;

    // Convert duration (months) → years
    const durationYears = c.duration / 12;

    // Sum up totalFee from the array of Int[]
    const totalFeeInr = c.fee.reduce((sum, amt) => sum + amt, 0);

    // Flatten entranceExam names
    const examNames = c.entranceExams.map((e) => e.name);

    // Build applicationPeriod or “-”
    let applicationPeriod: string;
    if (c.applicationStartDate && c.applicationEndDate) {
      const s = new Date(c.applicationStartDate).toLocaleDateString("en-IN");
      const e = new Date(c.applicationEndDate).toLocaleDateString("en-IN");
      applicationPeriod = `${s} – ${e}`;
    } else {
      applicationPeriod = "-";
    }

    // avgPackage or “-”
    const avgPackageOrDash = c.avgPackage != null ? c.avgPackage : "-";

    // eligibility array (string[])
    const eligibilityArray = c.eligibility; // maybe []

    return {
      id: c.id,
      name: lookup.code,
      code: lookup.courseCodeCode,
      category: lookup.categoryCode,
      type: lookup.typeCode,
      durationYears: durationYears, // number
      totalFee: totalFeeInr, // number
      entranceExams: examNames, // string[]
      applicationPeriod, // string or "-"
      avgPackage: avgPackageOrDash, // number or "-"
      eligibility: eligibilityArray, // string[]
    };
  });

  return <CoursesTab courses={courses} />;
}
