"use client";

import { Search } from "lucide-react";

interface StaffAttendanceFiltersProps {
  search: string;

  employeeCount: number;

  onSearchChange: (
    value: string
  ) => void;
}

export default function StaffAttendanceFilters({
  search,
  employeeCount,
  onSearchChange,
}: StaffAttendanceFiltersProps) {

  return (

    <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">

      {/* Recherche */}

      <div className="relative">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          placeholder="Rechercher un employé..."
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
        />

      </div>

      {/* Résumé */}

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">

        <div className="text-gray-500">
          <span className="font-semibold text-gray-900">
            {employeeCount}
          </span>{" "}
          membre(s) du personnel affiché(s)
        </div>

        {search && (

          <div className="rounded-full bg-[#6214BE]/10 px-3 py-1 text-[#6214BE]">

            Recherche : <strong>{search}</strong>

          </div>

        )}

      </div>

    </div>

  );

}