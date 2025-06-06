import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Award, Calendar, Wallet } from "lucide-react";

type EntityWithStats = {
  courses: { courseLookup: { code: string } }[];
  nirfRank?: number | null;
  avgFee?: number | null;
  avgPackage?: number | null;
};

const CollegeStatsCarousel = ({ entity }: { entity: EntityWithStats }) => {
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
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent>
        {stats
          .filter((stat) => stat.value !== null && stat.value !== undefined)
          .map((stat, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <stat.icon className="h-5 w-5 text-blue-600 mb-2" />
                  <div className="text-sm font-medium text-center">
                    {stat.label}
                  </div>
                  <div className="text-lg font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious
        aria-label="Previous Stat"
        className="absolute -left-3 top-1/2"
      />
      <CarouselNext
        aria-label="Next Stat"
        className="absolute -right-3 top-1/2"
      />
    </Carousel>
  );
};

export default CollegeStatsCarousel;
