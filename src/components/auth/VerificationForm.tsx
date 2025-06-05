"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClerkAPIError } from "@clerk/types";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface VerificationFormProps {
  // Called when the user submits the verification code (e.g. form submit)
  onSubmit: (e: React.FormEvent) => void;
  // Current 6-digit (or however long) code value
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isSubmitting: boolean;
  error: ClerkAPIError[] | null;
  buttonText?: string;
  // Instructions to show above/below input (defaults to “Check your email…”)
  instructions?: string;
}

export const VerificationForm = ({
  onSubmit,
  verificationCode,
  setVerificationCode,
  isSubmitting,
  error,
  buttonText = "Verify Email",
  instructions = "Check your email for a verification code",
}: VerificationFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="flex flex-col justify-center items-center">
      <Label className="block text-sm font-medium">Verification Code</Label>
      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        value={verificationCode}
        onChange={setVerificationCode}
        disabled={isSubmitting}
      >
        <InputOTPGroup className="mt-2">
          {[...Array(6)].map((_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {instructions && (
        <p className="mt-2 text-xs text-gray-500">{instructions}</p>
      )}
    </div>

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
      {isSubmitting ? "Verifying..." : buttonText}
    </Button>
  </form>
);
