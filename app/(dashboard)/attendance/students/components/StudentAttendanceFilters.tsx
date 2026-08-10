"use client";

import SearchSelect from "@/components/ui/SearchSelect";

interface Classroom {
  id: string;
  name: string;
}

interface AttendanceOption {
  type: "schedule" | "period";
  value: string;
  label: string;
}

interface StudentAttendanceFiltersProps {
  classrooms: Classroom[];

  attendanceOptions: AttendanceOption[];

  selectedClassroom: string;
  selectedDate: string;
  selectedOption: string;

  sessionCount: number;

  onClassroomChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onOptionChange: (value: string) => void;
}

export default function StudentAttendanceFilters({

  classrooms,

  attendanceOptions,

  selectedClassroom,

  selectedDate,

  selectedOption,

  sessionCount,

  onClassroomChange,

  onDateChange,

  onOptionChange,

}: StudentAttendanceFiltersProps) {

  const selectedClass = classrooms.find(
    (c) => c.id === selectedClassroom
  );

  const selectedAttendance = attendanceOptions.find(
    (o) => o.value === selectedOption
  );

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString(
        "fr-FR",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Aujourd'hui";

  return (

    <div className="rounded-xl border bg-white shadow-sm">

      {/* ===========================
            FILTRES
      =========================== */}

      <div className="border-b p-5">

        <div className="grid gap-5 md:grid-cols-3">

          {/* Classe */}

          <SearchSelect

            label="Classe"

            placeholder="Sélectionnez une classe"

            value={selectedClassroom}

            options={classrooms.map((classroom) => ({

              value: classroom.id,

              label: classroom.name,

            }))}

            onChange={onClassroomChange}

          />

          {/* Date */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">

              Date

            </label>

            <input

              type="date"

              value={selectedDate}

              onChange={(e) =>
                onDateChange(e.target.value)
              }

              className="
                w-full
                rounded-lg
                border
                border-gray-300
                px-4
                py-2.5
                text-sm
                shadow-sm
                transition
                focus:border-[#6214BE]
                focus:ring-2
                focus:ring-[#6214BE]/20
              "

            />

          </div>

          {/* Séance / Période */}

          <SearchSelect

            label="Période de la journée"

            placeholder="Sélectionnez une séance"

            value={selectedOption}

            options={attendanceOptions.map((option) => ({

              value: option.value,

              label: option.label,

            }))}

            onChange={onOptionChange}

            disabled={!selectedClassroom}

          />

        </div>

      </div>

      {/* ===========================
            CONTEXTE
      =========================== */}

      {selectedClassroom && (

        <div className="grid gap-4 bg-gradient-to-r from-violet-50 to-white p-5 md:grid-cols-4">

          {/* Classe */}

          <div className="rounded-lg border border-violet-100 bg-white p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">

              Classe

            </p>

            <p className="mt-2 text-lg font-semibold text-[#6214BE]">

              {selectedClass?.name}

            </p>

          </div>

          {/* Date */}

          <div className="rounded-lg border border-violet-100 bg-white p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">

              Date

            </p>

            <p className="mt-2 text-lg font-semibold capitalize text-[#6214BE]">

              {formattedDate}

            </p>

          </div>

          {/* Appel */}

          <div className="rounded-lg border border-violet-100 bg-white p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">

              Période de la journée

            </p>

            <p className="mt-2 text-lg font-semibold text-[#6214BE]">

              {selectedAttendance?.label ?? "-"}

            </p>

          </div>

          {/* Nombre */}

          <div className="rounded-lg border border-violet-100 bg-white p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">

              Sessions du jour

            </p>

            <p className="mt-2 text-lg font-semibold text-[#6214BE]">

              {sessionCount}

            </p>

          </div>

        </div>

      )}

    </div>

  );

}