"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/hooks/useAuthModel";

interface ProtectedButtonProps {
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * Renders a <Button>. If the user is already signed in (Clerk), it calls `onClick()`.
 * Otherwise, it calls `openAuthModal()` to open the single modal in our layout.
 *
 * Usage example:
 * <ProtectedButton
 *   onClick={doSomethingProtected}
 *   className="bg-indigo-600 text-white px-4 py-2 rounded"
 * >
 *   Do Protected Action
 * </ProtectedButton>
 */
export default function ProtectedButton({
  size = "default",
  onClick,
  className,
  children,
}: ProtectedButtonProps) {
  const { isLoaded, isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();

  const handleClick = () => {
    if (isLoaded && isSignedIn) {
      onClick?.();
    } else {
      openAuthModal();
    }
  };

  return (
    <Button size={size} onClick={handleClick} className={className}>
      {children}
    </Button>
  );
}
