"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { FormField } from "@/components/auth/FormField";
import { VerificationForm } from "@/components/auth/VerificationForm";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

interface SignInFormProps {
  // Callback to run once sign-in is successful (e.g. close modal)
  onAuthSuccess?: () => void;
}

export const SignInForm = ({ onAuthSuccess }: SignInFormProps) => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ClerkAPIError[] | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        onAuthSuccess?.();
      } else if (result.status === "needs_first_factor") {
        setPendingVerification(true);
      }
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors);
      } else {
        console.error("Unexpected error in signIn:", err);
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
      const result = await signIn.attemptFirstFactor({
        strategy: "email_code",
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
        console.error("Unexpected error in attemptFirstFactor:", err);
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
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Email Address"
            icon={<Mail className="h-4 w-4 text-gray-600" />}
          >
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full"
            />
          </FormField>

          <FormField
            label="Password"
            icon={<Lock className="h-4 w-4 text-gray-600" />}
          >
            <PasswordInput
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              required
              showLabel={false}
            />
          </FormField>

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
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      )}
    </div>
  );
};
