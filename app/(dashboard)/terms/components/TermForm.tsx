"use client";

import { Save, X } from "lucide-react";

import { AcademicTermForm } from "../types";

interface TermFormProps {
    form: AcademicTermForm;
    editing: boolean;
    loading?: boolean;
  
    onChange: (
      field: keyof AcademicTermForm,
      value: string | boolean
    ) => void;
  
    onSubmit: () => void;
  
    onCancel: () => void;
  }

export default function TermForm({
  form,
  editing,
  loading = false,
  onChange,
  onSubmit,
  onCancel,
}: TermFormProps) {

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-lg font-semibold text-gray-900">
          {editing
            ? "Modifier une période"
            : "Nouvelle période"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configurez les périodes de votre année académique.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {/* Nom */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Nom
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              onChange("name", e.target.value)
            }
            placeholder="Ex : Trimestre 1"
            className="w-full rounded-xl border p-3 focus:border-purple-600 focus:outline-none"
          />

        </div>

        {/* Type */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Type
          </label>

          <select
            value={form.term_type}
            onChange={(e) =>
              onChange("term_type", e.target.value)
            }
            className="w-full rounded-xl border p-3 focus:border-purple-600 focus:outline-none"
          > 
            <option value="">
              Choisir une option
            </option>

            <option value="trimester">
              Trimestre
            </option>

            <option value="semester">
              Semestre
            </option>

            <option value="composition">
              Composition
            </option>

          </select>

        </div>

        {/* Début */}

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
            className="w-full rounded-xl border p-3 focus:border-purple-600 focus:outline-none"
          />

        </div>

        {/* Fin */}

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
            className="w-full rounded-xl border p-3 focus:border-purple-600 focus:outline-none"
          />

        </div>

        

        {/* Active */}

        <div className="md:col-span-2">

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
                Définir comme période active
              </p>

              <p className="text-sm text-gray-500">
                Une seule période peut être active dans une année académique.
              </p>

            </div>

          </label>

        </div>

      </div>

      <div className="mt-8 flex justify-end gap-3">

        {editing && (
          <button
            onClick={onCancel}
            className="flex items-center gap-2 rounded-xl border px-5 py-3 hover:bg-gray-50"
          >
            <X size={18} />

            Annuler

          </button>
        )}

        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex items-center gap-2 cursor-pointer rounded-xl bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
        >

          <Save size={18} />

          {loading
            ? "Enregistrement..."
            : editing
            ? "Mettre à jour"
            : "Créer la période"}

        </button>

      </div>

    </div>
  );
}