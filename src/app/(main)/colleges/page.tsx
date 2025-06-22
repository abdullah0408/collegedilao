// File: app/colleges/page.tsx
import React from "react";
import { getLookups } from "@/lib/lookups";
import CollegeList from "@/components/CollegeList";
import { Lookups } from "@/lib/lookups";
export const revalidate = 3600; // 1 hour

export default async function CollegesPage() {
  // Fetch all lookup data (genders, states, cities, etc.) on the server
  const lookups: Lookups = await getLookups();
  return <CollegeList lookups={lookups} />;
}
