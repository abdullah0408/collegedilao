import CourseDetailView from "@/components/CourseDetailView";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ collegeSlug: string; courseId: string }>;
}) {
  const { collegeSlug, courseId } = await params;

  const course = await prisma.course.findFirst({
    where: {
      id: Number(courseId),
      entity: { slug: collegeSlug },
    },
    select: {
      id: true,
      duration: true,
      fee: true,
      info: true,
      applicationStartDate: true,
      applicationEndDate: true,
      tags: true,
      avgPackage: true,
      eligibility: true,
      entranceExams: { select: { name: true } },
      courseLookup: {
        select: {
          code: true,
          category: true,
          courseCodeCode: true,
          type: { select: { code: true } },
        },
      },
      entity: {
        select: { id: true, name: true, state: true, city: true, slug: true },
      },
    },
  });

  if (!course) return notFound();

  const currentCourse = {
    id: course.id,
    name: course.courseLookup.code,
    code: course.courseLookup.courseCodeCode,
    type: { code: course.courseLookup.type.code }, // keep as object because component expects type.code
    durationYears: course.duration ? course.duration / 12 : 0, // convert months to years
    totalFee: course.fee[0] ?? 0,
    info: course.info ?? "",
    entranceExams: course.entranceExams.map((e) => e.name),
    fees: course.fee.map((amt, idx) => ({
      id: idx + 1,
      year: idx + 1,
      amount: amt,
    })),
    placements: course.avgPackage
      ? [{ id: 1, avgPackage: course.avgPackage }]
      : [],
    eligibility: course.eligibility,
    applicationStart: course.applicationStartDate?.toISOString() ?? null,
    applicationEnd: course.applicationEndDate?.toISOString() ?? null,
    tags: course.tags,
  };

  const college = {
    id: course.entity.id,
    name: course.entity.name,
    state: course.entity.state.name,
    city: course.entity.city.name,
    slug: course.entity.slug,
  };

  console.log(college);
  return <CourseDetailView currentCourse={currentCourse} college={college} />;
}
