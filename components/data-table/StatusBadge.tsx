"use client";

interface StatusBadgeProps {
  label: string;
  color?:
    | "green"
    | "red"
    | "yellow"
    | "blue"
    | "gray"
    | "purple";
}

const colors = {
  green:
    "bg-green-100 text-green-700 border border-green-200",

  red:
    "bg-red-100 text-red-700 border border-red-200",

  yellow:
    "bg-yellow-100 text-yellow-700 border border-yellow-200",

  blue:
    "bg-blue-100 text-blue-700 border border-blue-200",

  purple:
    "bg-purple-100 text-purple-700 border border-purple-200",

  gray:
    "bg-gray-100 text-gray-700 border border-gray-200",
};

export default function StatusBadge({
  label,
  color = "gray",
}: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        whitespace-nowrap
        ${colors[color]}
      `}
    >
      {label}
    </span>
  );
}