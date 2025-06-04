"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/colleges?search=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-4">
      <div className="container mx-auto px-4">
        <div className="relative max-w-3xl mx-auto">
          <div className="flex">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for colleges..."
              aria-label="Search"
              className="w-full py-3 bg-white pl-12 pr-4 rounded-l-lg rounded-r-none focus:ring-2 focus:ring-primary-300 border-none"
            />
            <Button
              onClick={handleSearch}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-r-lg rounded-l-none"
            >
              <Search className="h-4 w-4 mr-1" /> Search
            </Button>
          </div>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
