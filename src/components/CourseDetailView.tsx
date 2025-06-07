"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Building,
  GraduationCap,
  Calendar,
  Download,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

type CourseDetailViewProps = {
  currentCourse: {
    id: number;
    name: string;
    code: string;
    type: { code: string };
    durationYears: number;
    totalFee: number;
    info?: string;
    entranceExams: string[];
    fees: {
      id: number;
      year: number;
      amount: number;
    }[];
    placements: {
      id: number;
      avgPackage?: number;
    }[];
    eligibility: string[];
    applicationStart: string | null;
    applicationEnd: string | null;
  };
  college: {
    id: number;
    name: string;
    state: string;
    city: string;
    slug: string;
  };
};

const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  currentCourse,
  college,
}) => {
  return (
    <div className="min-h-screen p-4 space-y-6">
      <Link href={`/colleges/${college.slug}/courses`}>
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-blue-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to courses
        </Button>
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold">
          {currentCourse.code} in {currentCourse.name}
        </h1>
        <p className="text-gray-600">{college.name}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-gray-600">
          <span className="inline-flex items-center">
            <Building size={14} className="mr-1" />
            {college.city}, {college.state}
          </span>
          <span className="inline-flex items-center">
            <GraduationCap size={14} className="mr-1" />
            {currentCourse.type.code}
          </span>
          <span className="inline-flex items-center">
            <Calendar size={14} className="mr-1" />
            {currentCourse.durationYears}{" "}
            {currentCourse.durationYears > 1 ? "years" : "year"}
          </span>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="text-gray-600 text-sm">Total Fee</div>
          <div className="text-2xl font-bold text-blue-600 mb-3">
            ₹{(currentCourse.totalFee / 100000).toFixed(2)} Lakhs
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
            Apply Now
          </Button>
        </div>
      </div>

      <div className="lg:flex lg:space-x-8">
        {/* Main */}
        <div className="lg:flex-2 space-y-6">
          {/* Overview */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-3">Course Overview</h2>
            <p className="text-gray-700">
              {currentCourse.info || "No detailed information available."}
            </p>

            {currentCourse.entranceExams.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Entrance Exams</h3>
                <div className="flex flex-wrap gap-2">
                  {currentCourse.entranceExams.map((exam) => (
                    <Badge key={exam} variant="outline">
                      {exam}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Fee Structure */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-3">Fee Structure</h2>
            {currentCourse.fees.length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCourse.fees.map((fee) => (
                      <TableRow key={fee.id}>
                        <TableCell>Year {fee.year}</TableCell>
                        <TableCell>
                          ₹{fee.amount.toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500">No fee details available.</p>
            )}
          </section>

          {/* Placement */}
          {currentCourse.placements.length > 0 && (
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-3">
                Placement Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Average Package</div>
                  <div className="text-lg font-medium">
                    ₹
                    {(currentCourse.placements[0].avgPackage! / 100000).toFixed(
                      1
                    )}
                    L
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3 space-y-6 mt-6 lg:mt-0">
          {/* Eligibility */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-3">Eligibility</h2>
            <ul className="space-y-2">
              {currentCourse.eligibility.map((rule, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2
                    className="text-green-500 mt-1 mr-2"
                    size={16}
                  />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Application Timeline */}
          {currentCourse.applicationStart && currentCourse.applicationEnd && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-3">
                Application Timeline
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Start Date</div>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-primary-600 mr-2" />
                    <span>
                      {new Date(
                        currentCourse.applicationStart
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">End Date</div>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-primary-600 mr-2" />
                    <span>
                      {new Date(
                        currentCourse.applicationEnd
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  Apply Now
                </Button>
              </div>
            </div>
          )}

          {/* Brochure */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Course Brochure</h3>
              <p className="text-sm text-gray-500">Download full brochure</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex bg-blue-600 hover:bg-blue-700 hover:text-white text-white items-center"
            >
              <Download size={14} className="mr-1" />
              Download
            </Button>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Still have questions? Reach out to admissions.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full text-sm">
              Contact Office
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetailView;
