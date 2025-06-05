import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}

export const FormField = ({ label, icon, children }: FormFieldProps) => (
  <div className="space-y-1">
    <Label className="flex items-center gap-2 text-sm font-medium">
      {icon}
      {label}
    </Label>
    {children}
  </div>
);
