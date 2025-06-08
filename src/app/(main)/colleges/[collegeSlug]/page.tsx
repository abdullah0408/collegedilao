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
      </div>
    </div>
  );
};

export default OverviewTab;
