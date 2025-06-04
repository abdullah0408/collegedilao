"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBarMobile = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/colleges?search=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for colleges..."
        aria-label="Search"
        className="rounded-r-none h-8 text-sm"
      />
      <Button
        onClick={handleSearch}
        className="bg-blue-600 rounded-l-none h-8 flex items-center justify-center px-2"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchBarMobile;
