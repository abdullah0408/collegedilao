import CollegeBanner from "./Banner";
import CollegeLogo from "./Logo";
import CollegeInfo from "./Info";
import CollegeActions from "./Actions";
import PopularCourses from "./Courses";
import SocialLinks from "./SocialLinks";
import CollegeStatsCarousel from "./stats/Carousel";
import CollegeStatsRow from "./stats/Row";

type FullEntity = {
  name: string;
  logo?: string | null;
  banner?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  phone?: string[] | null;
  email?: string[] | null;
  city?: { name: string } | null;
  state?: { name: string } | null;
  nirfRank?: number | null;
  naacGrade?: string | null;
  establishedYear: number;
  typeCode: string;
  genderAccepted: "GIRLS" | "BOYS" | "COED";
  approvals: { approvalBodyCode: string; grade?: string | null }[];
  area?: number | null;

  courses: { courseLookup: { code: string } }[];

  avgFee?: number | null;
  avgPackage?: number | null;
};

const CollegeHead = ({ entity }: { entity: FullEntity }) => {
  return (
    <div className="relative">
      {/* Pass both banner and logo so Banner.tsx can choose a fallback */}
      <CollegeBanner bannerUrl={entity.banner} logoUrl={entity.logo} />

      <div className="container mx-auto px-4 relative -mt-24 md:-mt-32 pb-6">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <CollegeLogo logoUrl={entity.logo} />
            <div className="flex-grow">
              <CollegeInfo entity={entity} />
              <CollegeActions
                websiteUrl={entity.website}
                phone={entity.phone}
                email={entity.email}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center border-t pt-4">
            <PopularCourses courses={entity.courses} />
            <SocialLinks entity={entity} />
          </div>

          <div className="mt-5 md:hidden">
            <CollegeStatsCarousel entity={entity} />
          </div>

          <div className="mt-5 hidden md:flex gap-4 flex-wrap">
            <CollegeStatsRow entity={entity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeHead;
