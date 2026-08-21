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

  /**
   * Classe actuellement sélectionnée
   */
  const selectedClassroom =
    classrooms.find(
      (classroom) =>
        classroom.id === form.classroom
    );

  /**
   * Groupes actifs de la classe
   */
  const groups =
    selectedClassroom?.groups?.filter(
      (group) =>
        group.is_active !== false
    ) ?? [];

  /**
   * La classe possède-t-elle des groupes ?
   */
  const hasGroups =
    groups.length > 0;

  return (

    <div className="space-y-8">

      {/* ====================================================== */}
      {/* CLASSE / GROUPE */}
      {/* ====================================================== */}

      <div
        className={`
          grid
          gap-6
          ${
            hasGroups
              ? "md:grid-cols-2"
              : "md:grid-cols-1"
          }
        `}
      >

        {/* ================================================== */}
        {/* CLASSE */}
        {/* ================================================== */}

        <SearchSelect

          label="Classe"

          placeholder="Sélectionner une classe"

          value={form.classroom}

          disabled={loading}

          options={classrooms.map(
            (classroom) => ({

              value: classroom.id,

              label: classroom.name,

            })
          )}

          onChange={(value) => {

            /**
             * Lorsqu'on change de classe,
             * le groupe précédent n'est plus valide.
             *
             * On le réinitialise.
             */

            onChange({

              ...form,

              classroom: value,

              classroom_group: "",

            });

          }}

        />

        {/* ================================================== */}
        {/* GROUPE */}
        {/* ================================================== */}

        {hasGroups && (

          <SearchSelect

            label="Groupe"

            placeholder="Toute la classe"

            value={form.classroom_group}

            disabled={loading}

            options={[

              {
                value: "",
                label: "Toute la classe",
              },

              ...groups.map(
                (group) => ({

                  value: group.id,

                  label: group.name,

                })
              ),

            ]}

            onChange={(value) =>

              onChange({

                ...form,

                classroom_group: value,

              })

            }

          />

        )}

      </div>

      {/* ====================================================== */}
      {/* MATIÈRE / PÉRIODE */}
      {/* ====================================================== */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* ================================================== */}
        {/* MATIÈRE */}
        {/* ================================================== */}

        <SearchSelect

          label="Matière"

          placeholder="Sélectionner une matière"

          value={form.subject}

          disabled={loading}

          options={subjects.map(
            (subject) => ({

              value: subject.id,

              label: subject.name,

            })
          )}

          onChange={(value) =>

            onChange({

              ...form,

              subject: value,

            })

          }

        />

        {/* ================================================== */}
        {/* PÉRIODE */}
        {/* ================================================== */}

        <SearchSelect

          label="Période"

          placeholder="Sélectionner une période"

          value={form.term}

          disabled={loading}

          options={terms.map(
            (term) => ({

              value: term.id,

              label: term.name,

            })
          )}

          onChange={(value) =>

            onChange({

              ...form,

              term: value,

            })

          }

        />

      </div>

      {/* ====================================================== */}
      {/* TYPE */}
      {/* ====================================================== */}

      <div>

        <SearchSelect

          label="Type d'évaluation"

          placeholder="Choisir un type"

          value={form.assessment_type}

          disabled={loading}

          options={ASSESSMENT_TYPE_OPTIONS}

          onChange={(value) =>

            onChange({

              ...form,

              assessment_type:
                value as AssessmentFormData[
                  "assessment_type"
                ],

            })

          }

        />

      </div>

      {/* ====================================================== */}
      {/* TITRE */}
      {/* ====================================================== */}

      <div>

        <label className="
          mb-2
          block
          text-sm
          font-medium
          text-gray-700
        ">

          Titre{" "}

          <span className="text-red-500">
            *
          </span>

        </label>

        <input

          required

          disabled={loading}

          value={form.title}

          onChange={(e) =>

            onChange({

              ...form,

              title:
                e.target.value,

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

      {/* ====================================================== */}
      {/* NOTE / POIDS / DATE */}
      {/* ====================================================== */}

      <div className="grid gap-6 md:grid-cols-3">

        {/* ================================================== */}
        {/* NOTE MAXIMALE */}
        {/* ================================================== */}

        <div>

          <label className="
            mb-2
            block
            text-sm
            font-medium
            text-gray-700
          ">

            Note maximale

          </label>

          <input

            type="number"

            min="1"

            step="0.5"

            required

            disabled={loading}

            value={
              form.max_score ?? ""
            }

            onChange={(e) => {

              const value =
                e.target.value;

              onChange({

                ...form,

                max_score:
                  value === ""
                    ? ""
                    : Number(value),

              });

            }}

            placeholder="Ex : 20"

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

          <p className="
            mt-2
            text-xs
            text-gray-400
          ">

            Généralement sur 20.

          </p>

        </div>

        {/* ================================================== */}
        {/* POIDS */}
        {/* ================================================== */}

        <div>

          <label className="
            mb-2
            block
            text-sm
            font-medium
            text-gray-700
          ">

            Poids de l'évaluation

          </label>

          <input

            type="number"

            min="0.01"

            step="0.01"

            inputMode="decimal"

            required

            disabled={loading}

            value={

              form.weight === null ||
              form.weight === undefined

                ? ""

                : String(
                    form.weight
                  )

            }

            onChange={(e) => {

              const value =
                e.target.value;

              onChange({

                ...form,

                weight:
                  value === ""
                    ? ""
                    : value,

              });

            }}

            placeholder="Ex : 0.5"

            className="
              w-full
              rounded-2xl
              border
              px-4
              py-3
              outline-none
              transition
              focus:border-[#6214BE]
              focus:ring-2
              focus:ring-[#6214BE]/20
              disabled:bg-gray-100
            "

          />

          <p className="
            mt-2
            text-xs
            text-gray-400
          ">

            Exemples : 0.5, 1, 1.5, 2.

          </p>

        </div>

        {/* ================================================== */}
        {/* DATE */}
        {/* ================================================== */}

        <div>

          <label className="
            mb-2
            block
            text-sm
            font-medium
            text-gray-700
          ">

            Date de l'évaluation

          </label>

          <input

            type="date"

            required

            disabled={loading}

            value={
              form.date_assessment
            }

            onChange={(e) =>

              onChange({

                ...form,

                date_assessment:
                  e.target.value,

              })

            }

            className="
              w-full
              rounded-2xl
              border
              px-4
              py-3
              outline-none
              transition
              focus:border-[#6214BE]
              focus:ring-2
              focus:ring-[#6214BE]/20
              disabled:bg-gray-100
            "

          />

          <p className="
            mt-2
            text-xs
            text-gray-400
          ">

            Date prévue de l'évaluation.

          </p>

        </div>

      </div>

    </div>

  );

}