// File: lib/lookups.ts
import {prisma} from "./prisma";

export interface Lookups {
  genders: { value: string; label: string }[];

  // Each state now includes its array of cities
  states: {
    id: number;
    name: string;
    cities: { id: number; name: string }[];
  }[];

  entityTypes: { code: string; label: string }[];
  ownershipTypes: { code: string; label: string }[];

  // We only fetch CourseLookup; derive the rest from it:
  courseTypes: { code: string; label: string }[];
  courseCategories: { code: string; label: string }[];
  courseCodes: { code: string; label: string }[];
  courseLookups: {
    id: number;
    name: string;       // e.g. "MBA (Business Administration)"
    courseCode: string; // FK code
    categoryCode: string; // FK code
    typeCode: string;     // FK code
  }[];
}

/**
 * Fetch all the lookup tables in one shot.
 * - Each StateLookup includes its CityLookup[].
 * - CourseLookup[] is fetched once; from that we derive distinct courseTypes,
 *   courseCategories, and courseCodes.
 */
export async function getLookups(): Promise<Lookups> {
  // 1) Genders (hardcode since it’s a fixed enum)
  const genders = [
    { value: "GIRLS", label: "Girls" },
    { value: "BOYS", label: "Boys" },
    { value: "COED", label: "Co-Ed" },
  ];

  // 2) States + nested Cities
  const statesRaw = await prisma.stateLookup.findMany({
    orderBy: { name: "asc" },
    include: {
      cities: {
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      },
    },
  });

  const states = statesRaw.map((s) => ({
    id: s.id,
    name: s.name,
    cities: s.cities.map((c) => ({ id: c.id, name: c.name })),
  }));

  // 3) EntityTypes & OwnershipTypes
  const entityTypesRaw = await prisma.entityTypeLookup.findMany({
    orderBy: { code: "asc" },
  });
  const ownershipTypesRaw = await prisma.ownershipTypeLookup.findMany({
    orderBy: { code: "asc" },
  });

  const entityTypes = entityTypesRaw.map((et) => ({
    code: et.code,
    label: et.code[0] + et.code.slice(1).toLowerCase(),
  }));
  const ownershipTypes = ownershipTypesRaw.map((ot) => ({
    code: ot.code,
    label: ot.code[0] + ot.code.slice(1).toLowerCase(),
  }));

  // 4) Fetch CourseLookup once (it already contains courseCodeCode, categoryCode, typeCode)
  const courseLookupsRaw = await prisma.courseLookup.findMany({
    orderBy: { code: "asc" },
    select: {
      id: true,
      code: true,
      courseCodeCode: true,
      categoryCode: true,
      typeCode: true,
    },
  });

const courseLookups = courseLookupsRaw.map((cl) => {
  // 1) Replace all % → . and _ → space in the raw name
  const cleaned = cl.code.replace(/%/g, ".").replace(/_/g, " ");

  // 2) Prefix with the courseCode itself
  const displayName = `${cl.courseCodeCode} - ${cleaned}`;

  return {
    id: cl.id,
    name: displayName,
    courseCode: cl.courseCodeCode,
    categoryCode: cl.categoryCode,
    typeCode: cl.typeCode,
  };
});

  // Derive distinct courseTypes, courseCategories, courseCodes
  const uniqueTypes = new Set<string>();
  const uniqueCategories = new Set<string>();
  const uniqueCodes = new Set<string>();

  courseLookups.forEach((cl) => {
    uniqueTypes.add(cl.typeCode);
    uniqueCategories.add(cl.categoryCode);
    uniqueCodes.add(cl.courseCode);
  });

  const courseTypes = Array.from(uniqueTypes)
    .sort()
    .map((code) => ({
      code,
      label: code[0] + code.slice(1).toLowerCase(),
    }));

  const courseCategories = Array.from(uniqueCategories)
    .sort()
    .map((code) => ({
      code,
      label: code[0] + code.slice(1).toLowerCase(),
    }));

  const courseCodes = Array.from(uniqueCodes)
    .sort()
    .map((code) => ({
      code,
      label: code,
    }));

  return {
    genders,
    states,
    entityTypes,
    ownershipTypes,
    courseTypes,
    courseCategories,
    courseCodes,
    courseLookups,
  };
}
