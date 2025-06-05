"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

interface AuthModalProps {
  isOpenAuth: boolean;
  // Callback when modal should close (e.g. after successful login)
  onClose: () => void;
}

export const AuthModal = ({ isOpenAuth, onClose }: AuthModalProps) => {
  const [open, setOpen] = useState(isOpenAuth);
  const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">("sign-in");

  // Keep local `open` in sync with parent prop
  useEffect(() => {
    setOpen(isOpenAuth);
  }, [isOpenAuth]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md px-6 py-5">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {activeTab === "sign-in" ? "Sign In" : "Create Account"}
          </DialogTitle>
          <DialogClose className="absolute top-3 right-3" />
        </DialogHeader>
        <div>
          <div className="mt-4">
            {activeTab === "sign-in" ? (
              <SignInForm onAuthSuccess={() => handleOpenChange(false)} />
            ) : (
              <SignUpForm onAuthSuccess={() => handleOpenChange(false)} />
            )}
          </div>

          {/* When in "sign-up" mode, show the T&C / Privacy line below toggle */}
          {activeTab === "sign-up" && (
            <p className="mt-3 text-center text-xs text-gray-500">
              By signing up, you accept our{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          )}

          {/* Toggle link at bottom, centered */}
          <div className="mt-3 text-center text-sm text-gray-600">
            {activeTab === "sign-in" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:underline"
                  onClick={() => setActiveTab("sign-up")}
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:underline"
                  onClick={() => setActiveTab("sign-in")}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
