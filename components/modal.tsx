"use client";

import type React from "react";
import { forwardRef } from "react";
import { useBodyOverflow } from "@/hooks/useBodyOverflow";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, children }, ref) => {
    useBodyOverflow(isOpen, onClose);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-4 sm:inset-10 z-50 flex items-center justify-center">
        <div
          className="bg-opacity-50 fixed inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        />
        <div
          ref={ref}
          className="relative h-full max-h-[75vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl"
        >
          {children}
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";
