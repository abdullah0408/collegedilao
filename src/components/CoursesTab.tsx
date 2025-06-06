"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CourseCard from "./CourseCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Course {
  id: number;
  name: string;
  code: string;
  category: string;
  type: string;
  durationYears: number;
  totalFee: number;
  entranceExams: string[];
  eligibility: string[];
  applicationPeriod: string;
  avgPackage: number | string;
}

interface CoursesTabProps {
  courses: Course[];
}

const CoursesTab: React.FC<CoursesTabProps> = ({ courses }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Normalize a string by lowercasing and stripping out non-alphanumeric chars
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Build a list of all unique `code` values for filter buttons
  const allCodes = useMemo(() => {
    const codeSet = new Set<string>();
    courses.forEach((course) => {
      if (course.code) {
        codeSet.add(course.code);
      }
    });
    return Array.from(codeSet);
  }, [courses]);

  // Filter courses by searchQuery (against name, code, category, type)
  // and then by the selected `activeFilter` which now corresponds to a `code` value.
  const filteredCourses = useMemo(() => {
    const queryNorm = normalize(searchQuery);

    return courses.filter((course) => {
      // If the user has typed something, check normalized fields
      const matchesSearch =
        queryNorm.length > 0
          ? ["name", "code", "category", "type"].some((key) => {
              const fieldValue = (course as any)[key] as string;
              return normalize(fieldValue).includes(queryNorm);
            })
          : true;

      // If a code‐filter button is active, only include courses with that exact code
      const matchesFilter = activeFilter ? course.code === activeFilter : true;

      return matchesSearch && matchesFilter;
    });
  }, [courses, searchQuery, activeFilter]);

  // Group the filtered courses by `course.code`
  const groupedCourses = useMemo(() => {
    const groups: Record<string, Course[]> = {};
    filteredCourses.forEach((course) => {
      const key = course.code || "Other";
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(course);
    });
    return groups;
  }, [filteredCourses]);

  return (
    <div className="py-4">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Courses & Fees</h2>

        {courses.length === 0 ? (
          <p className="text-gray-500 mb-4">
            No courses information available.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Filters + Search */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className={
                    activeFilter === null
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-600 hover:text-white"
                  }
                  variant={activeFilter === null ? "default" : "outline"}
                  onClick={() => setActiveFilter(null)}
                >
                  All Codes
                </Button>
                {allCodes.map((code) => (
                  <Button
                    key={code}
                    size="sm"
                    className={
                      activeFilter === code
                        ? "bg-blue-600 text-white hover:bg-blue-600"
                        : "hover:bg-blue-600 hover:text-white"
                    }
                    variant={activeFilter === code ? "default" : "outline"}
                    onClick={() => setActiveFilter(code)}
                  >
                    {code}
                  </Button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Accordion (grouped by code) */}
            {Object.keys(groupedCourses).length > 0 ? (
              <Accordion
                type="multiple"
                className="space-y-4"
                defaultValue={Object.keys(groupedCourses)}
              >
                {Object.entries(groupedCourses).map(
                  ([courseCode, coursesInGroup]) => (
                    <AccordionItem
                      key={courseCode}
                      value={courseCode}
                      className="border rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium">
                            {courseCode} Courses
                          </h3>
                          <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {coursesInGroup.length}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 pt-2">
                        <div className="space-y-4">
                          {coursesInGroup.map((course) => (
                            <CourseCard key={course.id} course={course} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                )}
              </Accordion>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  No courses found matching “{searchQuery}”
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesTab;
