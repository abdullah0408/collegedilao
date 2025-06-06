"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Award, GraduationCap, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface CourseCardProps {
  course: {
    id: number;
    code: string;
    name: string;
    category: string;
    type: string;
    programType?: string;
    durationYears: number | string;
    totalFee: number;
    entranceExams?: string[];
    applicationPeriod?: string;
    avgPackage?: number | string;
    eligibility?: string[];
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { collegeSlug } = useParams();

  // Helper to truncate long text
  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "…" : text;

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
              {course.code} in {course.name}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                <GraduationCap size={12} className="mr-1" />
                {course.programType || course.type}
              </span>
              <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                <Calendar size={12} className="mr-1" />
                {course.durationYears}{" "}
                {typeof course.durationYears === "number"
                  ? course.durationYears > 1
                    ? "years"
                    : "year"
                  : ""}
              </span>
              <span className="text-xs hover:text-sm text-gray-600 flex items-center">
                <Award size={14} className="mr-1" />
                {course.entranceExams && course.entranceExams.length > 0
                  ? course.entranceExams.join(", ")
                  : "-"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end mt-3 md:mt-0">
            <span className="text-xs text-gray-500">Total Fee</span>
            <span className="text-lg sm:text-xl font-semibold text-blue-600">
              ₹
              {typeof course.totalFee === "number"
                ? (course.totalFee / 100000).toFixed(2)
                : "0.00"}{" "}
              Lakhs
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Eligibility */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
              Eligibility
            </h4>
            <p className="text-xs sm:text-sm line-clamp-2">
              {course.eligibility && course.eligibility.length > 0
                ? truncate(course.eligibility[0], 40)
                : "-"}
            </p>
          </div>

          {/* Application Period */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
              Application Period
            </h4>
            <p className="text-xs sm:text-sm">
              {course.applicationPeriod || "-"}
            </p>
          </div>

          {/* Avg. Package */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
              Avg. Package
            </h4>
            <p className="text-xs sm:text-sm font-medium">
              {typeof course.avgPackage === "number"
                ? `₹${(course.avgPackage / 100000).toFixed(2)} Lakhs`
                : course.avgPackage || "-"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
          <Button
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
          >
            Apply Now
          </Button>
          <Button size="sm" variant="outline" className="w-full sm:w-auto">
            Download Brochure
          </Button>
          <Button
            size="sm"
            variant="link"
            className="w-full sm:w-auto text-primary-600 hover:text-primary-700 text-sm flex items-center justify-center sm:justify-start sm:ml-auto"
          >
            <Link
              href={`/colleges/${collegeSlug}/courses/${course.id}`}
              className="flex text-blue-600 items-center w-full justify-center sm:justify-start"
            >
              View Details <ExternalLink size={14} className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
