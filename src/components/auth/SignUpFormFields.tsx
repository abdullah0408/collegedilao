import { User, Mail, BookOpen, GraduationCap, Phone, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { FormField } from "@/components/auth/FormField";
import { interestedInCourses, targetedEducationLevel } from "@/data";

interface SignUpFormFieldsProps {
  formData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    courseInterestedIn: string;
    levelLookingFor: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelect: (name: string, value: string) => void;
}

export const SignUpFormFields = ({
  formData,
  handleChange,
  handleSelect,
}: SignUpFormFieldsProps) => (
  <div className="space-y-4">
    {/* Full Name */}
    <FormField
      label="Full Name"
      icon={<User className="h-4 w-4 text-gray-600" />}
    >
      <Input
        name="fullName"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={handleChange}
        required
        className="w-full"
      />
    </FormField>

    {/* Email Address */}
    <FormField
      label="Email Address"
      icon={<Mail className="h-4 w-4 text-gray-600" />}
    >
      <Input
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full"
      />
    </FormField>

    {/* Phone Number (+91) */}
    <FormField
      label="Phone Number (+91)"
      icon={<Phone className="h-4 w-4 text-gray-600" />}
    >
      <Input
        name="phoneNumber"
        type="tel"
        placeholder="Enter 10-digit number"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
        maxLength={10}
        pattern="^[1-9][0-9]{9}$"
        className="w-full"
      />
      <p className="mt-1 text-xs text-gray-500">
        10 digits, cannot start with 0
      </p>
    </FormField>

    {/* Course Interested In + Level Looking For (side-by-side) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Course Interested In"
        icon={<BookOpen className="h-4 w-4 text-gray-600" />}
      >
        <Select
          value={formData.courseInterestedIn}
          onValueChange={(value) => handleSelect("courseInterestedIn", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            {interestedInCourses.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label="Targeted Level"
        icon={<GraduationCap className="h-4 w-4 text-gray-600" />}
      >
        <Select
          value={formData.levelLookingFor}
          onValueChange={(value) => handleSelect("levelLookingFor", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {targetedEducationLevel.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </div>

    {/* Password */}
    <FormField
      label="Password"
      icon={<Lock className="h-4 w-4 text-gray-600" />}
    >
      <PasswordInput
        value={formData.password}
        onChange={handleChange}
        placeholder="Create password"
        required
        showLabel={false}
      />
    </FormField>
  </div>
);
