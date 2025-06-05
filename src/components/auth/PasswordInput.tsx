"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  showLabel?: boolean;
}

export const PasswordInput = ({
  value,
  onChange,
  placeholder = "Password",
  required = true,
  showLabel = true,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      {showLabel && (
        <Label className="block text-sm font-medium">Password</Label>
      )}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="pr-10 w-full"
        />
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-600" />
          ) : (
            <Eye className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};
