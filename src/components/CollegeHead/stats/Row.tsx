import { GraduationCap, Award, Calendar, Wallet } from "lucide-react";

type EntityWithStats = {
  courses: { courseLookup: { code: string } }[];
  nirfRank?: number | null;
  avgFee?: number | null;
  avgPackage?: number | null;
};

const CollegeStatsRow = ({ entity }: { entity: EntityWithStats }) => {
  // totalCourses is just the length of the courses array
  const totalCourses = Array.isArray(entity.courses)
    ? entity.courses.length
    : 0;

  const stats = [
    { label: "Total Courses", value: totalCourses, icon: GraduationCap },
    { label: "NIRF Rank", value: entity.nirfRank, icon: Award },
    { label: "Avg. Fees", value: entity.avgFee, icon: Calendar },
    { label: "Avg. Package", value: entity.avgPackage, icon: Wallet },
  ];

  return (
    <>
      {stats
        .filter((stat) => stat.value !== null && stat.value !== undefined)
        .map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 px-4 py-3 rounded-lg flex-1 min-w-32 flex items-center"
          >
            <stat.icon className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <div className="text-xs text-gray-500">{stat.label}</div>
              <div className="text-lg font-semibold">{stat.value}</div>
            </div>
          </div>
        ))}
    </>
  );
};

export default CollegeStatsRow;
