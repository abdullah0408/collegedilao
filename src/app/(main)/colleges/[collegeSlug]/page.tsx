import React from "react";
import { prisma } from "@/lib/prisma";

const OverviewTab = async ({
  params,
}: {
  params: Promise<{ collegeSlug: string }>;
}) => {
  const { collegeSlug } = await params;

  const entity = await prisma.entity.findUnique({
    where: {
      slug: collegeSlug.trim().toLowerCase(),
    },
    select: {
      name: true,
      info: true,
    },
  });

  if (!entity) {
    throw new Error("NotFound");
  }

  return (
    <div className="py-4">
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-3">About {entity.name}</h2>
        <p className="text-gray-700 mb-4">{entity.info}</p>

        {/* <h3 className="text-lg font-semibold mb-2">Courses Offered</h3>
        <div className="flex flex-wrap gap-2">
          {college.coursesOffered.map((course) => (
            <span 
              key={course} 
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
            >
              {course}
            </span>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default OverviewTab;
