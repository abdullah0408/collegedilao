"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useAuthModal } from "@/hooks/useAuthModel";

function AuthModalEffect() {
  const { openAuthModal } = useAuthModal();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams?.get("auth") === "true") {
      openAuthModal();
    }
  }, [pathname, searchParams, openAuthModal]);

  return null;
}

const AuthModalHandler = () => {
  return (
    <Suspense fallback={null}>
      <AuthModalEffect />
    </Suspense>
  );
};

export default AuthModalHandler;
