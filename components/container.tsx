import type { HTMLAttributes } from "react";
import { ReactNode, forwardRef } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`container mx-auto p-4 sm:p-10 max-w-6xl ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = "Div";
