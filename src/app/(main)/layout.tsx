"use client";

import { AuthModal } from "@/components/auth/AuthModal";
import AuthModalHandler from "@/components/auth/AuthModalHandler";
import { useAuthModal } from "@/hooks/useAuthModel";
import { SignedOut } from "@clerk/nextjs";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthOpen, closeAuthModal } = useAuthModal();

  return (
    <>
      {children}
      <AuthModalHandler />
      <SignedOut>
        <AuthModal isOpenAuth={isAuthOpen} onClose={closeAuthModal} />
      </SignedOut>
    </>)
}
