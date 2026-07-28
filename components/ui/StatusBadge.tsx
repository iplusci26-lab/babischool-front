"use client";

interface StatusBadgeProps {
  /**
   * Mode simplifié
   */
  active?: boolean;

  /**
   * Mode personnalisé
   */
  label?: string;

  color?:
    | "green"
    | "red"
    | "yellow"
    | "blue"
    | "purple"
    | "pink"
    | "gray";

  size?: "sm" | "md";

  outlined?: boolean;
}

const COLORS = {
  green: {
    solid: "bg-green-100 text-green-700",
    outlined: "border border-green-300 text-green-700",
  },

  red: {
    solid: "bg-red-100 text-red-700",
    outlined: "border border-red-300 text-red-700",
  },

  yellow: {
    solid: "bg-yellow-100 text-yellow-700",
    outlined: "border border-yellow-300 text-yellow-700",
  },

  blue: {
    solid: "bg-blue-100 text-blue-700",
    outlined: "border border-blue-300 text-blue-700",
  },

  purple: {
    solid: "bg-violet-100 text-violet-700",
    outlined: "border border-violet-300 text-violet-700",
  },

  gray: {
    solid: "bg-gray-100 text-gray-700",
    outlined: "border border-gray-300 text-gray-700",
  },

  pink: {
    solid: "bg-pink-100 text-pink-700",
    outlined: "border border-pink-300 text-pink-700",
  },
};

const SIZES = {
  sm: "px-2 py-1 text-xs",

  md: "px-3 py-1 text-sm",
};

export default function StatusBadge({
  active,
  label,
  color,
  size = "sm",
  outlined = false,
}: StatusBadgeProps) {
  let finalLabel = label;
  let finalColor = color;

  /**
   * Mode automatique
   */

  if (typeof active === "boolean") {
    finalLabel = active ? "Actif" : "Inactif";
    finalColor = active ? "green" : "red";
  }

  /**
   * Sécurité
   */

  finalLabel ??= "";
  finalColor ??= "gray";

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        whitespace-nowrap
        font-medium

        ${SIZES[size]}

        ${
          outlined
            ? COLORS[finalColor].outlined
            : COLORS[finalColor].solid
        }
      `}
    >
      {finalLabel}
    </span>
  );
} 