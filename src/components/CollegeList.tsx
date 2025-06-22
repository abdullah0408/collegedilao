// File: components/CollegeList.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FilterIcon, X } from "lucide-react";
import FilterSidebar from "@/components/filters/FilterSidebar";
import CollegeGrid from "@/components/CollegeGrid";
import { College } from "@/lib/types";
import { Lookups } from "@/lib/lookups";

interface CollegeListProps {
  lookups: Lookups;
}

const CollegeList: React.FC<CollegeListProps> = ({ lookups }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1) State for fetched colleges, loading, error
  const [collegesData, setCollegesData] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 2) Filters state
  const [filters, setFilters] = useState<{
    gender: string[];
    states: number[];
    cities: number[];
    entityTypes: string[];
    ownershipTypes: string[];
    courseTypes: string[];
    courseCategories: string[];
    courseCodes: string[];
    courseLookups: number[];
  }>({
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

  // 3) Whenever URL params change, parse & fetch
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const parsedFilters = {
      gender: params.get("gender")?.split(",") || [],
      states: params
        .get("states")
        ?.split(",")
        .map((s) => Number(s))
        .filter((n) => !isNaN(n)) || [],
      cities: params
        .get("cities")
        ?.split(",")
        .map((c) => Number(c))
        .filter((n) => !isNaN(n)) || [],
      entityTypes: params.get("entityTypes")?.split(",") || [],
      ownershipTypes: params.get("ownershipTypes")?.split(",") || [],
      courseTypes: params.get("courseTypes")?.split(",") || [],
      courseCategories: params.get("courseCategories")?.split(",") || [],
      courseCodes: params.get("courseCodes")?.split(",") || [],
      courseLookups: params
        .get("courseLookups")
        ?.split(",")
        .map((cl) => Number(cl))
        .filter((n) => !isNaN(n)) || [],
    };

    setFilters(parsedFilters);

    // Build fetch URL
    const fetchParams = new URLSearchParams();
    if (parsedFilters.gender.length > 0)
      fetchParams.set("gender", parsedFilters.gender.join(","));
    if (parsedFilters.states.length > 0)
      fetchParams.set("states", parsedFilters.states.join(","));
    if (parsedFilters.cities.length > 0)
      fetchParams.set("cities", parsedFilters.cities.join(","));
    if (parsedFilters.entityTypes.length > 0)
      fetchParams.set("entityTypes", parsedFilters.entityTypes.join(","));
    if (parsedFilters.ownershipTypes.length > 0)
      fetchParams.set("ownershipTypes", parsedFilters.ownershipTypes.join(","));
    if (parsedFilters.courseTypes.length > 0)
      fetchParams.set("courseTypes", parsedFilters.courseTypes.join(","));
    if (parsedFilters.courseCategories.length > 0)
      fetchParams.set(
        "courseCategories",
        parsedFilters.courseCategories.join(",")
      );
    if (parsedFilters.courseCodes.length > 0)
      fetchParams.set("courseCodes", parsedFilters.courseCodes.join(","));
    if (parsedFilters.courseLookups.length > 0)
      fetchParams.set(
        "courseLookups",
        parsedFilters.courseLookups.join(",")
      );

    const fetchUrl = `/api/colleges?${fetchParams.toString()}`;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(fetchUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        return res.json() as Promise<College[]>;
      })
      .then((data) => {
        setCollegesData(data);
        setLoading(false);
      })
      .catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((err as any).name !== "AbortError") {
          console.error(err);
          setError("Unable to load colleges.");
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [searchParams]);

  // 4) When filters change, push new URL params
  const applyFilters = (newFilters = filters) => {
    const params = new URLSearchParams();
    if (newFilters.gender.length > 0)
      params.set("gender", newFilters.gender.join(","));
    if (newFilters.states.length > 0)
      params.set("states", newFilters.states.join(","));
    if (newFilters.cities.length > 0)
      params.set("cities", newFilters.cities.join(","));
    if (newFilters.entityTypes.length > 0)
      params.set("entityTypes", newFilters.entityTypes.join(","));
    if (newFilters.ownershipTypes.length > 0)
      params.set("ownershipTypes", newFilters.ownershipTypes.join(","));
    if (newFilters.courseTypes.length > 0)
      params.set("courseTypes", newFilters.courseTypes.join(","));
    if (newFilters.courseCategories.length > 0)
      params.set("courseCategories", newFilters.courseCategories.join(","));
    if (newFilters.courseCodes.length > 0)
      params.set("courseCodes", newFilters.courseCodes.join(","));
    if (newFilters.courseLookups.length > 0)
      params.set("courseLookups", newFilters.courseLookups.join(","));

    router.push(`/colleges?${params.toString()}`);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      gender: [] as string[],
      states: [] as number[],
      cities: [] as number[],
      entityTypes: [] as string[],
      ownershipTypes: [] as string[],
      courseTypes: [] as string[],
      courseCategories: [] as string[],
      courseCodes: [] as string[],
      courseLookups: [] as number[],
    };
    setFilters(emptyFilters);
    router.push(`/colleges`);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => setIsFilterOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Browse Colleges</h1>
            <p className="text-gray-600">
              Find and compare the best colleges and universities in India
            </p>
          </div>

          {/* Mobile “Filters” toggle */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="md:hidden"
                onClick={toggleFilter}
              >
                <FilterIcon size={18} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
              <div className="absolute inset-0 bg-white flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg">Filters</h2>
                    <Button variant="ghost" size="icon" onClick={toggleFilter}>
                      <X size={18} />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <FilterSidebar
                    isMobile
                    lookups={lookups}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onApply={() => {
                      applyFilters(filters);
                      toggleFilter();
                    }}
                    onClose={toggleFilter}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar (desktop) */}
            <div className="hidden md:block w-full md:w-72 shrink-0">
              <FilterSidebar
                lookups={lookups}
                filters={filters}
                onFilterChange={handleFilterChange}
                onApply={() => applyFilters(filters)}
              />
            </div>

            {/* College Grid */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="font-semibold">All Colleges</h2>
                    {!loading && !error && (
                      <p className="text-sm text-gray-500">
                        {collegesData.length} colleges found
                      </p>
                    )}
                    {loading && (
                      <p className="text-sm text-gray-500">Loading...</p>
                    )}
                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {(
                      filters.gender.length > 0 ||
                      filters.states.length > 0 ||
                      filters.cities.length > 0 ||
                      filters.entityTypes.length > 0 ||
                      filters.ownershipTypes.length > 0 ||
                      filters.courseTypes.length > 0 ||
                      filters.courseCategories.length > 0 ||
                      filters.courseCodes.length > 0 ||
                      filters.courseLookups.length > 0
                    ) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-xs"
                      >
                        Clear Filters
                      </Button>
                    )}
                    {!loading && !error && (
                      <div className="text-sm text-gray-500">
                        Showing 1 – {collegesData.length} of {collegesData.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <CollegeGrid colleges={collegesData} loading={loading} />

              {/* Pagination stub */}
              {!loading && !error && collegesData.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" disabled>
                      &lt;
                    </Button>
                    <Button variant="default" size="icon">
                      1
                    </Button>
                    <Button variant="outline" size="icon">
                      2
                    </Button>
                    <Button variant="outline" size="icon">
                      3
                    </Button>
                    <Button variant="outline" size="icon">
                      &gt;
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollegeList;
