// File: components/college/CollegeCard.tsx
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { College } from "@/lib/types";
import Link from "next/link";

interface CollegeCardProps {
  college: College;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college }) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Banner Image */}
      <div className="h-40 w-full overflow-hidden rounded-t-lg">
        <img
          src={college.bannerImage ?? "/placeholder-banner.png"}
          alt={`${college.name} banner`}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="p-4">
        {/* College Name */}
        <h3 className="text-lg font-semibold truncate">{college.name}</h3>

        {/* Location */}
        <p className="text-sm text-gray-500 mt-1">
          {college.city.name}, {college.state.name}
        </p>

        {/* Type & Ownership */}
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {college.type.code.charAt(0) + college.type.code.slice(1).toLowerCase()}
          </span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {college.ownershipType.code.charAt(0) + college.ownershipType.code.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Established Year & Gender */}
        <div className="mt-2 text-sm text-gray-600">
          <p>
            <strong>Established:</strong> {college.establishedYear}
          </p>
          <p>
            <strong>Gender:</strong>{" "}
            {college.genderAccepted === "COED"
              ? "Co-Ed"
              : college.genderAccepted === "GIRLS"
              ? "Girls"
              : "Boys"}
          </p>
        </div>

        {/* “View Details” Link */}
        <div className="mt-4">
          <Link
            href={`/colleges/${college.slug}`}
            className="inline-block text-sm text-blue-600 hover:underline"
          >
            View details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollegeCard;
