"use client";

import SearchSelect from "@/components/ui/SearchSelect";

import {
  HomeworkFormData,
  Classroom,
  Subject,
} from "../types";

interface HomeworkFormProps {

  form: HomeworkFormData;

  classrooms: Classroom[];

  subjects: Subject[];

  onChange: (
    form: HomeworkFormData
  ) => void;

}

export default function HomeworkForm({

  form,

  classrooms,

  subjects,

  onChange,

}: HomeworkFormProps) {

  return (

    <div className="space-y-8">

      {/* Classe / Matière */}

      <div className="grid gap-6 md:grid-cols-2">

        <SearchSelect
          label="Classe"
          value={form.classroom}
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
          value={form.subject}
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

      {/* Titre */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">

          Titre de l'exercice

        </label>

        <input
          value={form.title}
          onChange={(e) =>
            onChange({
              ...form,
              title: e.target.value,
            })
          }
          placeholder="Ex : Exercices Chapitre 5"
          className="
            w-full
            rounded-2xl
            border
            px-4
            py-3
            outline-none
            transition
            focus:border-[#6214BE]
          "
        />

      </div>

      {/* Description */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">

          Description

        </label>

        <textarea
          rows={6}
          value={form.description}
          onChange={(e) =>
            onChange({
              ...form,
              description: e.target.value,
            })
          }
          placeholder="Décrivez le travail demandé aux élèves..."
          className="
            w-full
            resize-none
            rounded-2xl
            border
            px-4
            py-3
            outline-none
            transition
            focus:border-[#6214BE]
          "
        />

        <p className="mt-2 text-xs text-gray-400">

          Cette description sera visible par les élèves et leurs parents.

        </p>

      </div>

      {/* Date limite / Publication */}

      <div className="grid gap-6 md:grid-cols-2">

        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700">

            Date limite

          </label>

          <input
            type="date"
            value={form.due_date}
            onChange={(e) =>
              onChange({
                ...form,
                due_date: e.target.value,
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
            "
          />

          <p className="mt-2 text-xs text-gray-400">

            Date à laquelle les élèves devront rendre l'exercice.

          </p>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700">

            Publication

          </label>

          <SearchSelect
            value={form.is_published ? "published" : "draft"}
            options={[
              {
                value: "draft",
                label: "Brouillon",
              },
              {
                value: "published",
                label: "Publier immédiatement",
              },
            ]}
            onChange={(value) =>
              onChange({
                ...form,
                is_published:
                  value === "published",
              })
            }
          />

          <p className="mt-2 text-xs text-gray-400">

            Si l'exercice est publié, les élèves et les parents recevront une notification.

          </p>

        </div>

      </div>

    </div>

  );

}