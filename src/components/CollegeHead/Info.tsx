import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Users, Award } from "lucide-react";

type EntityInfoType = {
  name: string;
  city?: { name: string } | null;
  state?: { name: string } | null;
  nirfRank?: number | null;
  naacGrade?: string | null;
  establishedYear: number;
  typeCode: string;
  genderAccepted: "GIRLS" | "BOYS" | "COED";
  approvals: { approvalBodyCode: string; grade?: string | null }[];
  area?: number | null;
};

const CollegeInfo = ({ entity }: { entity: EntityInfoType }) => {
  const approvalCodes = entity.approvals.map((a) => a.approvalBodyCode);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {entity.name}
          </h1>
          <div className="flex items-center text-gray-600 mt-1">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">
              {entity.city?.name}, {entity.state?.name}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {entity.nirfRank != null && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              NIRF #{entity.nirfRank}
            </Badge>
          )}
          {entity.naacGrade && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              NAAC {entity.naacGrade}
            </Badge>
          )}
          {entity.establishedYear && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200"
            >
              Est. {entity.establishedYear}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mb-4 text-gray-700">
        <div className="flex items-center">
          <Building size={16} className="mr-2 text-gray-500" />
          Type:{" "}
          <span className="font-medium ml-1">
            {entity.typeCode.charAt(0).toUpperCase() +
              entity.typeCode.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="flex items-center">
          <Users size={16} className="mr-2 text-gray-500" />
          Gender:{" "}
          <span className="font-medium ml-1">
            {entity.genderAccepted === "GIRLS"
              ? "Girls only"
              : entity.genderAccepted === "BOYS"
              ? "Boys only"
              : "Co-educational"}
          </span>
        </div>

        <div className="flex items-center">
          <Award size={16} className="mr-2 text-gray-500" />
          Approvals:{" "}
          <span className="font-medium ml-1">{approvalCodes.join(", ")}</span>
        </div>

        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-gray-500" />
          Campus Area:{" "}
          <span className="font-medium ml-1">
            {entity.area != null ? `${entity.area} acres` : "N/A"}
          </span>
        </div>
      </div>
    </>
  );
};

export default CollegeInfo;
