"use client";

import {
  ReactNode,
  useEffect,
} from "react";

interface DrawerProps {

  open: boolean;

  onClose: () => void;

  children: ReactNode;

  size?: "sm" | "md" | "lg";

}

export default function Drawer({

  open,

  onClose,

  children,

  size = "md",

}: DrawerProps) {

  useEffect(() => {

    function handleKeyDown(
      e: KeyboardEvent
    ) {

      if (e.key === "Escape") {

        onClose();

      }

    }

    if (open) {

      document.addEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "hidden";

    }

    return () => {

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "auto";

    };

  }, [
    open,
    onClose,
  ]);

  if (!open) {

    return null;

  }

  const width = {

    sm: "max-w-md",

    md: "max-w-xl",

    lg: "max-w-3xl",

  };

  return (

    <div
      className="
        fixed
        inset-0
        z-50
      "
    >

      {/* Overlay */}

      <div

        onClick={onClose}

        className="
          absolute
          inset-0
          bg-black/40
          backdrop-blur-sm
        "
      />

      {/* Panel */}

      <div
        className={`
          absolute
          right-0
          top-0
          h-full
          w-full
          ${width[size]}
          bg-white
          shadow-2xl
          flex
          flex-col
          animate-slide-left
        `}
      >

        {children}

      </div>

    </div>

  );

}