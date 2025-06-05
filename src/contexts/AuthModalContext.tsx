"use client";

import React, { createContext, useState, useCallback } from "react";

interface AuthModalContextValue {
  isAuthOpen: boolean;
  openAuthModal(): void;
  closeAuthModal(): void;
}

export const AuthModalContext = createContext<
  AuthModalContextValue | undefined
>(undefined);

/**
 * AuthModalProvider holds a single piece of state (`isAuthOpen`) and
 * exposes `openAuthModal` / `closeAuthModal` to any descendant via context.
 *
 * During the component lifecycle, children can call `openAuthModal()` or
 * `closeAuthModal()` to toggle the authentication modal’s visibility.
 */
export const AuthModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuthModal = useCallback(() => {
    setIsAuthOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{ isAuthOpen, openAuthModal, closeAuthModal }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};
