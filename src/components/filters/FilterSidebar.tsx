// File: components/filters/FilterSidebar.tsx
"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SlidersHorizontal, X } from "lucide-react";
import { Lookups } from "@/lib/lookups";

interface FilterSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
  onApply?: () => void;
  lookups: Lookups;
  filters: {
    gender: string[];
    states: number[];
    cities: number[];
    entityTypes: string[];
    ownershipTypes: string[];
    courseTypes: string[];
    courseCategories: string[];
    courseCodes: string[];
    courseLookups: number[];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (newFilters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isMobile = false,
  onClose,
  onApply,
  lookups,
  filters,
  onFilterChange,
}) => {
  // Destructure existing filter arrays (with defaults)
  const {
    gender: genderArr = [],
    states: statesArr = [],
    cities: citiesArr = [],
    entityTypes: entityTypesArr = [],
    ownershipTypes: ownershipTypesArr = [],
    courseTypes: courseTypesArr = [],
    courseCategories: courseCategoriesArr = [],
    courseCodes: courseCodesArr = [],
    courseLookups: courseLookupsArr = [],
  } = filters || {};

  // Pull everything from the lookups prop:
  const {
    genders,
    states,
    entityTypes,
    ownershipTypes,
    courseTypes,
    courseCategories,
    courseCodes,
    courseLookups,
  } = lookups;

  // Utility to rebuild a “full” filters object, preserving unchanged keys
  const buildFullFilters = (overrides: Partial<typeof filters>) => ({
    gender: genderArr,
    states: statesArr,
    cities: citiesArr,
    entityTypes: entityTypesArr,
    ownershipTypes: ownershipTypesArr,
    courseTypes: courseTypesArr,
    courseCategories: courseCategoriesArr,
    courseCodes: courseCodesArr,
    courseLookups: courseLookupsArr,
    ...overrides,
  });

  // ─── GENDER ─────────────────────────────────────────────────────────────────
  const toggleGender = (value: string) => {
    const newGender = genderArr.includes(value)
      ? genderArr.filter((g) => g !== value)
      : [...genderArr, value];
    onFilterChange(buildFullFilters({ gender: newGender }));
  };

  // ─── STATE & CITY ────────────────────────────────────────────────────────────
const toggleState = (stateId: number) => {
  const newStates = statesArr.includes(stateId)
    ? statesArr.filter((s) => s !== stateId)
    : [...statesArr, stateId];

  // Keep only those previously-selected cities whose parent state is still in newStates
  const survivingCities = citiesArr.filter((cityId) => {
    // find the state that has this city
    const parentState = states.find((st) =>
      st.cities.some((c) => c.id === cityId)
    );
    return parentState && newStates.includes(parentState.id);
  });

  onFilterChange(
    buildFullFilters({
      states: newStates,
      cities: survivingCities,
    })
  );
};

  // AvailableCities = all cities in the chosen states
const availableCities = useMemo(() => {
  return states
    .filter((st) => statesArr.includes(st.id))
    .flatMap((st) =>
      st.cities.map((ct) => ({
        ...ct,
        stateId: st.id,
      }))
    );
}, [statesArr]);
  const toggleCity = (cityId: number) => {
    const newCities = citiesArr.includes(cityId)
      ? citiesArr.filter((c) => c !== cityId)
      : [...citiesArr, cityId];
    onFilterChange(buildFullFilters({ cities: newCities }));
  };

  // ─── ENTITY TYPE ─────────────────────────────────────────────────────────────
  const toggleEntityType = (code: string) => {
    const newEntityTypes = entityTypesArr.includes(code)
      ? entityTypesArr.filter((e) => e !== code)
      : [...entityTypesArr, code];
    onFilterChange(buildFullFilters({ entityTypes: newEntityTypes }));
  };

  // ─── OWNERSHIP TYPE ─────────────────────────────────────────────────────────
  const toggleOwnershipType = (code: string) => {
    const newOwnershipTypes = ownershipTypesArr.includes(code)
      ? ownershipTypesArr.filter((o) => o !== code)
      : [...ownershipTypesArr, code];
    onFilterChange(buildFullFilters({ ownershipTypes: newOwnershipTypes }));
  };

  // ─── COURSE TYPE ────────────────────────────────────────────────────────────
  const toggleCourseType = (code: string) => {
    const newTypes = courseTypesArr.includes(code)
      ? courseTypesArr.filter((c) => c !== code)
      : [...courseTypesArr, code];

    // If courseTypes change, drop any categories/codes/lookup IDs that no longer match
    const survivingCategories = courseCategoriesArr.filter((cat) => {
      return courseLookups.some(
        (cL) =>
          cL.categoryCode === cat && newTypes.includes(cL.typeCode)
      );
    });
    const survivingCodes = courseCodesArr.filter((cd) => {
      return courseLookups.some(
        (cL) =>
          cL.courseCode === cd && newTypes.includes(cL.typeCode)
      );
    });
    const survivingLookups = courseLookupsArr.filter((lId) => {
      const cl = courseLookups.find((x) => x.id === lId);
      return cl && newTypes.includes(cl.typeCode);
    });

    onFilterChange(
      buildFullFilters({
        courseTypes: newTypes,
        courseCategories: survivingCategories,
        courseCodes: survivingCodes,
        courseLookups: survivingLookups,
      })
    );
  };

  // ─── COURSE CATEGORY ────────────────────────────────────────────────────────
  const toggleCourseCategory = (code: string) => {
    const newCats = courseCategoriesArr.includes(code)
      ? courseCategoriesArr.filter((c) => c !== code)
      : [...courseCategoriesArr, code];

    // Drop any codes/lookups that no longer match (given current types+categories)
    const survivingCodes = courseCodesArr.filter((cd) => {
      return courseLookups.some(
        (cL) =>
          cL.courseCode === cd &&
          (courseTypesArr.length === 0 || courseTypesArr.includes(cL.typeCode)) &&
          newCats.includes(cL.categoryCode)
      );
    });
    const survivingLookups = courseLookupsArr.filter((lId) => {
      const cl = courseLookups.find((x) => x.id === lId);
      return (
        cl &&
        (courseTypesArr.length === 0 || courseTypesArr.includes(cl.typeCode)) &&
        newCats.includes(cl.categoryCode)
      );
    });

    onFilterChange(
      buildFullFilters({
        courseCategories: newCats,
        courseCodes: survivingCodes,
        courseLookups: survivingLookups,
      })
    );
  };

  // ─── COURSE CODE ────────────────────────────────────────────────────────────
  const toggleCourseCode = (code: string) => {
    const newCodes = courseCodesArr.includes(code)
      ? courseCodesArr.filter((c) => c !== code)
      : [...courseCodesArr, code];

    // Drop any lookups that no longer match
    const survivingLookups = courseLookupsArr.filter((lId) => {
      const cl = courseLookups.find((x) => x.id === lId);
      return (
        cl &&
        (courseTypesArr.length === 0 || courseTypesArr.includes(cl.typeCode)) &&
        (courseCategoriesArr.length === 0 ||
          courseCategoriesArr.includes(cl.categoryCode)) &&
        newCodes.includes(cl.courseCode)
      );
    });

    onFilterChange(
      buildFullFilters({
        courseCodes: newCodes,
        courseLookups: survivingLookups,
      })
    );
  };

  // ─── COURSE LOOKUP (NAME) ────────────────────────────────────────────────────
  const toggleCourseLookup = (lookupId: number) => {
    const newLookups = courseLookupsArr.includes(lookupId)
      ? courseLookupsArr.filter((l) => l !== lookupId)
      : [...courseLookupsArr, lookupId];
    onFilterChange(buildFullFilters({ courseLookups: newLookups }));
  };

  // ─── RESET ALL ───────────────────────────────────────────────────────────────
  const resetFilters = () => {
    onFilterChange({
      gender: [],
      states: [],
      cities: [],
      entityTypes: [],
      ownershipTypes: [],
      courseTypes: [],
      courseCategories: [],
      courseCodes: [],
      courseLookups: [],
    });
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={`bg-white rounded-lg ${
        isMobile ? "h-full flex flex-col" : "shadow p-4"
      }`}
    >
      {/* Header w/ Reset & Close */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <SlidersHorizontal size={18} className="mr-2" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>

          {/* Show "Reset All" if ANY filter has a non-empty array */}
          {(
            genderArr.length > 0 ||
            statesArr.length > 0 ||
            citiesArr.length > 0 ||
            entityTypesArr.length > 0 ||
            ownershipTypesArr.length > 0 ||
            courseTypesArr.length > 0 ||
            courseCategoriesArr.length > 0 ||
            courseCodesArr.length > 0 ||
            courseLookupsArr.length > 0
          ) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              Reset All
            </Button>
          )}

          {/* Close button on mobile */}
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto"
            >
              <X size={18} />
            </Button>
          )}
        </div>
      </div>

      <div className={`${isMobile ? "flex-1 overflow-y-auto px-4" : ""}`}>
        <Accordion
          type="multiple"
          defaultValue={[
            "gender",
            "state",
            "entityType",
            "ownershipType",
            "courseType",
            "courseCategory",
            "courseCode",
            "courseLookup",
          ]}
        >
          {/* ─── GENDER ───────────────────────────────────────────────────────────── */}
          <AccordionItem value="gender">
            <AccordionTrigger className="py-3">
              <span className="text-sm font-medium">Gender</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {genders.map((g) => (
                  <div key={g.value} className="flex items-center">
                    <Checkbox
                      id={`gender-${g.value}`}
                      checked={genderArr.includes(g.value)}
                      onCheckedChange={() => toggleGender(g.value)}
                    />
                    <Label
                      htmlFor={`gender-${g.value}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {g.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── STATE ────────────────────────────────────────────────────────────── */}
          <AccordionItem value="state">
            <AccordionTrigger className="py-3">
              <span className="text-sm font-medium">State</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {states.map((st) => (
                  <div key={st.id} className="flex items-center">
                    <Checkbox
                      id={`state-${st.id}`}
                      checked={statesArr.includes(st.id)}
                      onCheckedChange={() => toggleState(st.id)}
                    />
                    <Label
                      htmlFor={`state-${st.id}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {st.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── CITY (only if at least one state is selected) ─────────────────── */}
          {statesArr.length > 0 && (
            <AccordionItem value="city">
              <AccordionTrigger className="py-3">
                <span className="text-sm font-medium">City</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableCities.map((ct) => (
                    <div key={ct.id} className="flex items-center">
                      <Checkbox
                        id={`city-${ct.id}`}
                        checked={citiesArr.includes(ct.id)}
                        onCheckedChange={() => toggleCity(ct.id)}
                      />
                      <Label
                        htmlFor={`city-${ct.id}`}
                        className="ml-2 text-sm font-normal cursor-pointer"
                      >
                        {ct.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* ─── ENTITY TYPE ──────────────────────────────────────────────────────── */}
          <AccordionItem value="entityType">
            <AccordionTrigger className="py-3">
              <span className="text-sm font-medium">Entity Type</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {entityTypes.map((et) => (
                  <div key={et.code} className="flex items-center">
                    <Checkbox
                      id={`entityType-${et.code}`}
                      checked={entityTypesArr.includes(et.code)}
                      onCheckedChange={() => toggleEntityType(et.code)}
                    />
                    <Label
                      htmlFor={`entityType-${et.code}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {et.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── OWNERSHIP TYPE ───────────────────────────────────────────────────── */}
          <AccordionItem value="ownershipType">
            <AccordionTrigger className="py-3">
              <span className="text-sm font-medium">Ownership Type</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {ownershipTypes.map((ot) => (
                  <div key={ot.code} className="flex items-center">
                    <Checkbox
                      id={`ownershipType-${ot.code}`}
                      checked={ownershipTypesArr.includes(ot.code)}
                      onCheckedChange={() => toggleOwnershipType(ot.code)}
                    />
                    <Label
                      htmlFor={`ownershipType-${ot.code}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {ot.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── COURSE TYPE ───────────────────────────────────────────────────────── */}
          <AccordionItem value="courseType">
            <AccordionTrigger className="py-3">
              <span className="text-sm font-medium">Course Type</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {courseTypes.map((ct) => (
                  <div key={ct.code} className="flex items-center">
                    <Checkbox
                      id={`courseType-${ct.code}`}
                      checked={courseTypesArr.includes(ct.code)}
                      onCheckedChange={() => toggleCourseType(ct.code)}
                    />
                    <Label
                      htmlFor={`courseType-${ct.code}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {ct.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── COURSE CATEGORY ──────────────────────────────────────────────────── */}
          <AccordionItem value="courseCategory">
            <AccordionTrigger className="py-3">
              <span className="text-sm font-medium">Course Category</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                { // If user has selected any courseTypes, filter categories by those types.
                  (courseTypesArr.length > 0
                    ? courseCategories.filter((cat) =>
                        courseLookups.some(
                          (cL) =>
                            cL.categoryCode === cat.code &&
                            courseTypesArr.includes(cL.typeCode)
                        )
                      )
                    : courseCategories
                  ).map((cat) => (
                    <div key={cat.code} className="flex items-center">
                      <Checkbox
                        id={`courseCategory-${cat.code}`}
                        checked={courseCategoriesArr.includes(cat.code)}
                        onCheckedChange={() => toggleCourseCategory(cat.code)}
                      />
                      <Label
                        htmlFor={`courseCategory-${cat.code}`}
                        className="ml-2 text-sm font-normal cursor-pointer"
                      >
                        {cat.label}
                      </Label>
                    </div>
                  ))
                }
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── COURSE CODE ───────────────────────────────────────────────────────── */}
          <AccordionItem value="courseCode">
            <AccordionTrigger className="py-3">
              <span className="text-sm font-medium">Course Code</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                { // Filter codes by selected type/category, or show all if none chosen
                  (courseTypesArr.length > 0 || courseCategoriesArr.length > 0
                    ? courseCodes.filter((cc) =>
                        courseLookups.some((cL) => {
                          return (
                            cL.courseCode === cc.code &&
                            (courseTypesArr.length === 0 ||
                              courseTypesArr.includes(cL.typeCode)) &&
                            (courseCategoriesArr.length === 0 ||
                              courseCategoriesArr.includes(cL.categoryCode))
                          );
                        })
                      )
                    : courseCodes
                  ).map((cc) => (
                    <div key={cc.code} className="flex items-center">
                      <Checkbox
                        id={`courseCode-${cc.code}`}
                        checked={courseCodesArr.includes(cc.code)}
                        onCheckedChange={() => toggleCourseCode(cc.code)}
                      />
                      <Label
                        htmlFor={`courseCode-${cc.code}`}
                        className="ml-2 text-sm font-normal cursor-pointer"
                      >
                        {cc.label}
                      </Label>
                    </div>
                  ))
                }
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ─── COURSE LOOKUP (NAME) ─────────────────────────────────────────────── */}
          <AccordionItem value="courseLookup">
            <AccordionTrigger className="py-3">
              <span className="text-sm font-medium">Course Name</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                { // Filter the final courseLookups by all selected parents,
                  // or show all if nothing is selected.
                  (courseTypesArr.length > 0 ||
                  courseCategoriesArr.length > 0 ||
                  courseCodesArr.length > 0
                    ? courseLookups.filter((cl) => {
                        return (
                          (courseTypesArr.length === 0 ||
                            courseTypesArr.includes(cl.typeCode)) &&
                          (courseCategoriesArr.length === 0 ||
                            courseCategoriesArr.includes(cl.categoryCode)) &&
                          (courseCodesArr.length === 0 ||
                            courseCodesArr.includes(cl.courseCode))
                        );
                      })
                    : courseLookups
                  ).map((cl) => (
                    <div key={cl.id} className="flex items-center">
                      <Checkbox
                        id={`courseLookup-${cl.id}`}
                        checked={courseLookupsArr.includes(cl.id)}
                        onCheckedChange={() => toggleCourseLookup(cl.id)}
                      />
                      <Label
                        htmlFor={`courseLookup-${cl.id}`}
                        className="ml-2 text-sm font-normal cursor-pointer"
                      >
                        {cl.name}
                      </Label>
                    </div>
                  ))}
                { // If after filtering there are none, show a “no matching” message
                  (courseTypesArr.length > 0 ||
                  courseCategoriesArr.length > 0 ||
                  courseCodesArr.length > 0) &&
                  courseLookups.filter((cl) => {
                    return (
                      (courseTypesArr.length === 0 ||
                        courseTypesArr.includes(cl.typeCode)) &&
                      (courseCategoriesArr.length === 0 ||
                        courseCategoriesArr.includes(cl.categoryCode)) &&
                      (courseCodesArr.length === 0 ||
                        courseCodesArr.includes(cl.courseCode))
                    );
                  }).length === 0 && (
                    <p className="text-xs text-gray-500">No matching courses.</p>
                  )
                }
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ─── APPLY BUTTON ───────────────────────────────────────────────────────── */}
      {!isMobile && (
        <div className="pt-4 mt-4 border-t">
          <Button className="w-full" onClick={onApply}>
            Apply Filters
          </Button>
        </div>
      )}

      {isMobile && onApply && (
        <div className="p-4 border-t">
          <Button className="w-full" onClick={onApply}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
