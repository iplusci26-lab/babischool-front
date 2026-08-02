"use client";

import SearchSelect from "@/components/ui/SearchSelect";

import {
  AssessmentFormData,
  Classroom,
  Subject,
  Term,
  ASSESSMENT_TYPE_OPTIONS,
} from "../types";

interface AssessmentFormProps {

  form: AssessmentFormData;

  classrooms: Classroom[];

  subjects: Subject[];

  terms: Term[];

  loading?: boolean;

  onChange: (
    form: AssessmentFormData
  ) => void;

}

export default function AssessmentForm({

  form,

  classrooms,

  subjects,

  terms,

  loading = false,

  onChange,

}: AssessmentFormProps) {

  return (

    <div className="space-y-8">

      {/* Classe / Matière */}

      <div className="grid gap-6 md:grid-cols-2">

        <SearchSelect
          label="Classe"
          placeholder="Sélectionner une classe"
          value={form.classroom}
          disabled={loading}
          options={classrooms.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          onChange={(value) =>
            onChange({
              ...form,
              classroom: value,
            })
          }
        />

        <SearchSelect
          label="Matière"
          placeholder="Sélectionner une matière"
          value={form.subject}
          disabled={loading}
          options={subjects.map((s) => ({
            value: s.id,
            label: s.name,
          }))}
          onChange={(value) =>
            onChange({
              ...form,
              subject: value,
            })
          }
        />

      </div>

      {/* Période / Type */}

      <div className="grid gap-6 md:grid-cols-2">

        <SearchSelect
          label="Période"
          placeholder="Sélectionner une période"
          value={form.term}
          disabled={loading}
          options={terms.map((t) => ({
            value: t.id,
            label: t.name,
          }))}
          onChange={(value) =>
            onChange({
              ...form,
              term: value,
            })
          }
        />

        <SearchSelect
          label="Type d'évaluation"
          placeholder="Choisir un type"
          value={form.assessment_type}
          disabled={loading}
          options={ASSESSMENT_TYPE_OPTIONS}
          onChange={(value) =>
            onChange({
              ...form,
              assessment_type: value as any,
            })
          }
        />

      </div>

      {/* Titre */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">

          Titre <span className="text-red-500">*</span>

        </label>

        <input
          required
          disabled={loading}
          value={form.title}
          onChange={(e) =>
            onChange({
              ...form,
              title: e.target.value,
            })
          }
          placeholder="Ex : Interrogation Chapitre 4"
          className="
            w-full
            rounded-2xl
            border
            px-4
            py-3
            outline-none
            transition
            focus:border-[#6214BE]
            disabled:bg-gray-100
          "
        />

      </div>

      {/* Note / Coefficient / Date */}

      <div className="grid gap-6 md:grid-cols-3">

        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700">

            Note maximale

          </label>

          <input
            type="number"
            min={1}
            step="0.5"
            required
            disabled={loading}
            value={form.max_score}
            onChange={(e) =>
              onChange({
                ...form,
                max_score: Number(e.target.value),
              })
            }
            className="
              w-full
              rounded-2xl
              border
              px-4
              py-3
              outline-none
              focus:border-[#6214BE]
              disabled:bg-gray-100
            "
          />

          <p className="mt-2 text-xs text-gray-400">

            Généralement sur 20.

          </p>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700">

            Coefficient

          </label>

          <input
            type="number"
            min={1}
            step="1"
            required
            disabled={loading}
            value={form.weight}
            onChange={(e) =>
              onChange({
                ...form,
                weight: Number(e.target.value),
              })
            }
            className="
              w-full
              rounded-2xl
              border
              px-4
              py-3
              outline-none
              focus:border-[#6214BE]
              disabled:bg-gray-100
            "
          />

          <p className="mt-2 text-xs text-gray-400">

            Utilisé dans le calcul de la moyenne.

          </p>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700">

            Date de l'évaluation

          </label>

          <input
            type="date"
            required
            disabled={loading}
            value={form.date_assessment}
            onChange={(e) =>
              onChange({
                ...form,
                date_assessment: e.target.value,
              })
            }
            className="
              w-full
              rounded-2xl
              border
              px-4
              py-3
              outline-none
              focus:border-[#6214BE]
              disabled:bg-gray-100
            "
          />

          <p className="mt-2 text-xs text-gray-400">

            Date prévue de l'évaluation.

          </p>

        </div>

      </div>

    </div>

  );

}