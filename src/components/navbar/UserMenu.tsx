"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  User as UserIcon,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useAuth } from "@/hooks/useAuth";

interface UserMenuProps {
  className?: string;
}

const menuItems = [
  {
    href: "/dashboard/overview",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserIcon,
  },
  {
    href: "/saved-colleges",
    label: "Saved Colleges",
    icon: Heart,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function UserMenu({ className = "" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { userDetails, isSignedIn, isLoaded, isLoading } = useAuth();
  const { signOut } = useClerk();

  if (!isLoaded || isLoading || !isSignedIn || !userDetails) return null;

  const imageUrl = userDetails.profilePictureUrl || "/user.png";
  const fullName = userDetails.fullName || "User";
  const email = userDetails.email || "";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${className}`}
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={imageUrl} alt="User" />
            <AvatarFallback>{fullName[0] ?? "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={5}
        className="w-[min(16rem,90vw)]"
      >
        <div className="flex items-center gap-3 p-3 border-b">
          <Avatar className="h-9 w-9">
            <AvatarImage src={imageUrl} alt="User" />
            <AvatarFallback>{fullName[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-sm font-medium">{fullName}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
        </div>

        {menuItems.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem asChild key={href}>
            <Link href={href} className="flex items-center gap-2">
              <Icon className="h-4 w-4" /> {label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="text-red-600 w-full flex justify-start items-center gap-2"
            onClick={() => signOut().then(() => window.location.reload())}
          >
            <LogOut className="h-4 w-4 text-red-600" /> Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
