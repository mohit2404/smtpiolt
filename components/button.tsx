import type React from "react";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "md",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      default:
        "bg-black text-white hover:bg-black/70 focus:ring-black disabled:bg-gray-300",
      outline:
        "border bg-white text-gray-700 hover:bg-gray-50 focus:ring-black disabled:bg-gray-100",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-black",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        } ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";