"use client";

import { AcademicYear } from "../types";

interface AcademicYearCardProps {
  year: AcademicYear;
  selected?: boolean;
  onSelect: (year: AcademicYear) => void;
  onEdit: (year: AcademicYear) => void;
  onDelete: (year: AcademicYear) => void;
}

export default function AcademicYearCard({
  year,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
}: AcademicYearCardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border
        p-5
        shadow-sm
        transition-all
        cursor-pointer
        ${
          selected
            ? "border-purple-600 bg-purple-50"
            : "border-gray-200 bg-white hover:border-purple-300"
        }
      `}
      onClick={() => onSelect(year)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {year.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {year.start_date} → {year.end_date}
          </p>
        </div>

        {year.is_active && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Active
          </span>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(year);
          }}
          className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
        >
          Modifier
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(year);
          }}
          className="rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}