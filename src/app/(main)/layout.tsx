"use client";

import { AuthModal } from "@/components/auth/AuthModal";
import ProtectedButton from "@/components/ProtectedButton";
import { useAuthModal } from "@/hooks/useAuthModel";
import { SignedOut } from "@clerk/nextjs";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthOpen, openAuthModal, closeAuthModal } = useAuthModal();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Whenever the URL changes, if ?auth=true, open the modal.
  useEffect(() => {
    if (searchParams?.get("auth") === "true") {
      openAuthModal();
    }
  }, [pathname, searchParams, openAuthModal]);
  return (
    <>
      {children}
      <SignedOut>
        <AuthModal isOpenAuth={isAuthOpen} onClose={closeAuthModal} />
      </SignedOut>
    </>
  );
}
