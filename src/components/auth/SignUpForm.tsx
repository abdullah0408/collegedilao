"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { VerificationForm } from "@/components/auth/VerificationForm";
import { SignUpFormFields } from "@/components/auth/SignUpFormFields";

interface SignUpFormProps {
  // Callback to run once sign-up + verification are successful
  onAuthSuccess?: () => void;
}

export const SignUpForm = ({ onAuthSuccess }: SignUpFormProps) => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [pendingVerification, setPendingVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ClerkAPIError[] | null>(null);
  const [verificationCode, setVerificationCode] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    courseInterestedIn: "",
    levelLookingFor: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelect = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        unsafeMetadata: {
          fullName: formData.fullName,
          phoneNumber: `+91-${formData.phoneNumber}`,
          courseInterestedIn: formData.courseInterestedIn,
          levelLookingFor: formData.levelLookingFor,
        },
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors);
      } else {
        console.error("Unexpected error in signUp.create:", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        onAuthSuccess?.();
      }
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors);
      } else {
        console.error(
          "Unexpected error in attemptEmailAddressVerification:",
          err
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {pendingVerification ? (
        <VerificationForm
          onSubmit={handleVerification}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          isSubmitting={isSubmitting}
          error={error}
          buttonText="Verify Email"
          instructions="A code was sent to your email. Please enter it below."
        />
      ) : (
        <form onSubmit={handleSignUp} className="space-y-4">
          <SignUpFormFields
            formData={formData}
            handleChange={handleChange}
            handleSelect={handleSelect}
          />

          {error && error.length > 0 && (
            <Alert variant="destructive" className="space-y-1">
              {error.map((errItem, i) => (
                <AlertDescription key={i}>{errItem.message}</AlertDescription>
              ))}
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      )}
    </div>
  );
};
