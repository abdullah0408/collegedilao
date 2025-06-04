"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import UserHeaderMoblie from "./UserHeaderMoblie";
import SearchBarMobile from "./SearchBarMobile";
import FlatNavList from "./FlatNavList";
import AccordionNavSections from "./AccordionNavSections";
import AccountLinks from "./AccountLinks";
import { flatNavItems, navSections } from "@/data";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const MobileNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[80%] max-w-md overflow-y-auto max-h-screen px-4 pt-6"
      >
        <SignedIn>
          <UserHeaderMoblie />
        </SignedIn>

        <SignedOut>
          <div className="pt-4" />
          <Button
            variant="outline"
            className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white md:inline-flex"
          >
            Sign In
          </Button>
        </SignedOut>
        <SearchBarMobile />
        <FlatNavList items={flatNavItems} />

        <AccordionNavSections sections={navSections} />

        <SignedIn>
          <AccountLinks />
        </SignedIn>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
