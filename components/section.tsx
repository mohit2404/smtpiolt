import type { HTMLAttributes } from "react";
import { ReactNode, forwardRef } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <section ref={ref} className={`px-5 py-16 ${className}`} {...props}>
        {children}
      </section>
    );
  },
);

Section.displayName = "Section";
