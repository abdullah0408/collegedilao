"use client";

import Link from "next/link";
import { Heart, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import MobileNav from "./MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useAuthModal } from "@/hooks/useAuthModel";

const HeaderRight = () => {
  const isMobile = useIsMobile();
  const { openAuthModal } = useAuthModal();

  return (
    <div className="flex items-center justify-end p-4 gap-3">
      {!!isMobile && <MobileNav />}

      <SignedIn>
        <UserMenu className={isMobile ? "md:hidden" : ""} />
      </SignedIn>

      <SignedOut>
        <Button
          onClick={openAuthModal}
          variant="outline"
          className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white md:inline-flex"
        >
          Sign In
        </Button>
      </SignedOut>

      {!isMobile && (
        <>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart
              className="h-5 w-5 text-pink-400 transition-colors"
              fill="currentColor"
            />
          </Button>
          <Link href="/submit-review">
            <Button variant="outline" className="flex items-center">
              <Star className="mr-2 h-4 w-4" /> Write a Review
            </Button>
          </Link>
          <Link href="/scholarships">
            <Button
              variant="default"
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Award className="mr-2 h-4 w-4" /> Get Scholarships
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default HeaderRight;
