"use client";

import SearchSelect from "@/components/ui/SearchSelect";

import {
  ClassroomOption,
  ScheduleFilter,
  TeacherOption,
} from "@/types/classSchedule";

interface ScheduleFiltersProps {

  filters: ScheduleFilter;

  classrooms: ClassroomOption[];

  teachers: TeacherOption[];

  onChange: (
    filters: ScheduleFilter
  ) => void;

}

export default function ScheduleFilters({

  filters,

  classrooms,

  teachers,

  onChange,

}: ScheduleFiltersProps) {

  return (

    <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">

      <div className="grid gap-4 md:grid-cols-2">

        <SearchSelect

          label="Classe"

          placeholder="Toutes les classes"

          value={filters.classroom ?? ""}

          options={[

            {

              value: "",

              label: "Toutes les classes",

            },

            ...classrooms.map((classroom) => ({

              value: classroom.id,

              label: classroom.name,

            })),

          ]}

          onChange={(value) =>

            onChange({

              ...filters,

              classroom: value || undefined,

            })

          }

        />

        <SearchSelect

          label="Enseignant"

          placeholder="Tous les enseignants"

          value={filters.teacher ?? ""}

          options={[

            {

              value: "",

              label: "Tous les enseignants",

            },

            ...teachers.map((teacher) => ({

              value: teacher.id,

              label: teacher.full_name,

            })),

          ]}

          onChange={(value) =>

            onChange({

              ...filters,

              teacher: value || undefined,

            })

          }

        />

      </div>

    </div>

  );

}