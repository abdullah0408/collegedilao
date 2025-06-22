// File: components/college/CollegeGrid.tsx
"use client";

import React from "react";
import { College } from "@/lib/types";
import CollegeCard from "./CollegeCard";

interface CollegeGridProps {
  colleges: College[];
  loading: boolean;
}

const CollegeGrid: React.FC<CollegeGridProps> = ({ colleges, loading }) => {
  if (loading) {
    return <p className="text-center p-4">Loading colleges...</p>;
  }
  if (colleges.length === 0) {
    return <p className="text-center p-4">No colleges found.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {colleges.map((col) => (
        <CollegeCard key={col.id} college={col} />
      ))}
    </div>
  );
};

export default CollegeGrid;
