import type { LabelHTMLAttributes } from "react";
import { ReactNode, forwardRef } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  text: string;
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", text, required = false, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`mb-1 block text-sm font-medium text-gray-700 ${className}`}
        {...props}
      >
        {text}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    );
  },
);

Label.displayName = "Label";
