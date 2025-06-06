import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

type CourseLookupType = { courseLookup: { code: string } };
const PopularCourses = ({ courses }: { courses: CourseLookupType[] }) => {
  const courseCodes = courses.map((c) => c.courseLookup.code);
  const visibleCourses = courseCodes.slice(0, 4);
  const remainingCount = courseCodes.length - visibleCourses.length;

  return (
    <div className="mb-4 md:mb-0">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Popular Courses
      </h3>
      <div className="flex flex-wrap gap-2">
        {visibleCourses.map((code) => (
          <Badge key={code} variant="secondary" className="px-3 py-1">
            {code}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge
            variant="outline"
            className="px-3 py-1 cursor-pointer flex items-center"
          >
            +{remainingCount} <ChevronDown size={14} className="ml-1" />
          </Badge>
        )}
      </div>
    </div>
  );
};

export default PopularCourses;
