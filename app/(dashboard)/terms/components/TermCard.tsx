"use client";

import {
  Calendar,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import { AcademicTerm } from "../types";

interface TermCardProps {
  term: AcademicTerm;
  onEdit: (term: AcademicTerm) => void;
  onDelete: (term: AcademicTerm) => void;
}

export default function TermCard({
  term,
  onEdit,
  onDelete,
}: TermCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2">

            <Calendar
              size={18}
              className="text-purple-600"
            />

            <h3 className="text-lg font-semibold text-gray-900">
              {term.name}
            </h3>

          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">

            <span className="rounded-full bg-gray-100 px-3 py-1">
              {term.term_type === "trimester"
                ? "Trimestre"
                : "Semestre"}
            </span>

            {term.is_active && (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-green-700">

                <CheckCircle2 size={14} />

                Active

              </span>
            )}

          </div>

          <p className="mt-3 text-sm text-gray-600">

            {term.start_date}

            <span className="mx-2">
              →
            </span>

            {term.end_date}

          </p>

        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onEdit(term);

            }}
            className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
            title="Modifier"
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onDelete(term);
            }}
            className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}