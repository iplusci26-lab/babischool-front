"use client";

import { ReactNode } from "react";
import { Plus } from "lucide-react";

interface EntityColumnProps {
  title: string;
  count: number;

  children: ReactNode;

  onAdd: () => void;

  emptyMessage?: string;

  loading?: boolean;
}

export default function EntityColumn({
  title,
  count,
  children,
  onAdd,
  emptyMessage = "Aucune donnée",
  loading = false,
}: EntityColumnProps) {
  const isEmpty = !loading && count === 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          <p className="text-sm text-gray-500">
            {count} élément{count > 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={onAdd}
          className="
            rounded-lg
            bg-violet-600
            p-2
            text-white
            transition
            hover:bg-violet-700
          "
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Content */}

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="py-10 text-center text-gray-500">
            Chargement...
          </div>
        ) : isEmpty ? (
          <div className="py-10 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}