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
        className={`container mx-auto max-w-5xl ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = "Div";
