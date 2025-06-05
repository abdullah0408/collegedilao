"use client";

import Link from "next/link";
import { LayoutDashboard, User, Heart, Settings, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const AccountLinks = () => {
  const { signOut } = useClerk();

  return (
    <div className="pb-4">
      <h3 className="font-medium mb-3">Your Account</h3>
      <div className="space-y-2">
        <Link
          href="/dashboard/overview"
          className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded"
        >
          <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
        </Link>
        <Link
          href="/profile"
          className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded"
        >
          <User className="h-4 w-4 mr-2" /> Profile
        </Link>
        <Link
          href="/saved-colleges"
          className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded"
        >
          <Heart className="h-4 w-4 mr-2" /> Saved Colleges
        </Link>
        <Link
          href="/settings"
          className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded"
        >
          <Settings className="h-4 w-4 mr-2" /> Settings
        </Link>
        <Button
          variant="ghost"
          className="flex items-center px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded"
          onClick={() =>
            // Clerk’s signOut method
            signOut().then(() => {
              window.location.reload();
            })
          }
          asChild
        >
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default AccountLinks;
