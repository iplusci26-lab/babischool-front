"use client";

import { X } from "lucide-react";

import {
  AcademicYearForm,
} from "../types";

interface AcademicYearModalProps {
  open: boolean;
  loading?: boolean;
  editing: boolean;
  form: AcademicYearForm;

  onClose: () => void;

  onSubmit: () => void;

  onChange: (
    field: keyof AcademicYearForm,
    value: string | boolean
  ) => void;
}

export default function AcademicYearModal({
  open,
  loading = false,
  editing,
  form,
  onClose,
  onSubmit,
  onChange,
}: AcademicYearModalProps) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-xl font-semibold">

              {editing
                ? "Modifier une année académique"
                : "Nouvelle année académique"}

            </h2>

            <p className="mt-1 text-sm text-gray-500">

              Configurez une année académique pour votre établissement.

            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-5 p-6">

          <div>

            <label className="mb-2 block text-sm font-medium">

              Nom

            </label>

            <input
              type="text"
              value={form.name}
              placeholder="Ex : 2026-2027"
              onChange={(e) =>
                onChange("name", e.target.value)
              }
              className="w-full rounded-xl border p-3 outline-none focus:border-purple-600"
            />

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="mb-2 block text-sm font-medium">

                Date de début

              </label>

              <input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  onChange("start_date", e.target.value)
                }
                className="w-full rounded-xl border p-3 outline-none focus:border-purple-600"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">

                Date de fin

              </label>

              <input
                type="date"
                value={form.end_date}
                onChange={(e) =>
                  onChange("end_date", e.target.value)
                }
                className="w-full rounded-xl border p-3 outline-none focus:border-purple-600"
              />

            </div>

          </div>

          <label className="flex items-center gap-3 rounded-xl border p-4">

            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                onChange(
                  "is_active",
                  e.target.checked
                )
              }
            />

            <div>

              <p className="font-medium">

                Définir comme année active

              </p>

              <p className="text-sm text-gray-500">

                Les nouvelles inscriptions et les périodes utiliseront cette année.

              </p>

            </div>

          </label>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border px-5 py-3 hover:bg-gray-50"
          >
            Annuler
          </button>

          <button
            onClick={onSubmit}
            disabled={loading}
            className="rounded-xl bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {loading
              ? "Enregistrement..."
              : editing
              ? "Mettre à jour"
              : "Créer l'année"}
          </button>

        </div>

      </div>

    </div>

  );

}