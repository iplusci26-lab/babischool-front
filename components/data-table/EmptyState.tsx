"use client";

import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  icon?: LucideIcon;
}

export default function EmptyState({
  title = "Aucune donnée",
  description = "Aucun élément n'est disponible pour le moment.",
  buttonLabel,
  onButtonClick,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-8 py-14 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <Icon
          size={36}
          className="text-gray-500"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-800">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        {description}
      </p>

      {buttonLabel && onButtonClick && (
        <button
          type="button"
          onClick={onButtonClick}
          className="mt-6 rounded-lg bg-[#6214BE] px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}