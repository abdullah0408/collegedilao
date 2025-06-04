"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAuth } from "@/hooks/useAuth";

const UserHeader = () => {
  const { userDetails, isLoaded, isSignedIn, isLoading } = useAuth();

  if (!isLoaded || isLoading || !isSignedIn || !userDetails) return null;

  const fullName = userDetails.fullName || "User";
  const email = userDetails.email || "user@example.com";
  const imageUrl = userDetails.profilePictureUrl || "/user.png";

  return (
    <>
      <DialogTitle>
        <VisuallyHidden>Mobile Navigation Menu</VisuallyHidden>
      </DialogTitle>
      <div className="pt-4">
        <div>
          <div className="flex justify-between items-center pb-4 border-b">
            <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={imageUrl} alt="User" />
                <AvatarFallback>{fullName[0] ?? "U"}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{fullName}</p>
                <p className="text-xs text-gray-500">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserHeader;
