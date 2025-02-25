import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Option = {
  label: string;
  value: string;
};

interface SingleSelectProps {
  options: Option[];
  value?: string;
  onChange: (values: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SingleSelect = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}: SingleSelectProps) => {
  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={(value) => onChange(value)}
    >
      <SelectTrigger className="w-full justify-between bg-primary h-full py-2 text-secondary-foreground font-light focus:ring-0 shadow-md mx-3">
        <SelectValue placeholder={placeholder || "Select"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-secondary-foreground hover:py-4 transition-all ease-in-out duration-300">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
