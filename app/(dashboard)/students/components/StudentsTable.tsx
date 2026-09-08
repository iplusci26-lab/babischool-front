"use client";

import StudentRow from "./StudentRow";

import type {
  Student,
  UUID,
} from "../types";

// ==========================================================
// PROPS
// ==========================================================

interface StudentTableProps {
  students: Student[];

  loading: boolean;

  selectedStudents: UUID[];

  onToggleSelection: (
    id: UUID
  ) => void;

  onSelectAll: () => void;

  onView: (
    student: Student
  ) => void;

  onEdit: (
    student: Student
  ) => void;
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function StudentTable({
  students,
  loading,
  selectedStudents,
  onToggleSelection,
  onSelectAll,
  onView,
  onEdit,
}: StudentTableProps) {

  // ========================================================
  // ALL SELECTED
  // ========================================================

  const allSelected =
    students.length > 0 &&
    students.every(
      (student) =>
        selectedStudents.includes(
          student.id
        )
    );

  // ========================================================
  // LOADING
  // ========================================================

  if (loading) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-8
          text-center
          shadow-sm
        "
      >
        Chargement des élèves...
      </div>
    );
  }

  // ========================================================
  // EMPTY STATE
  // ========================================================

  if (students.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-8
          text-center
          text-gray-500
          shadow-sm
        "
      >
        Aucun élève trouvé.
      </div>
    );
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div
      className="
        w-full
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      <div className="w-full overflow-x-auto">

        <table className="min-w-[1200px] border-collapse">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <thead className="bg-gray-50">
            <tr>

              {/* SELECTION */}

              <th className="w-12 px-4 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="cursor-pointer"
                  aria-label="Sélectionner tous les élèves"
                />
              </th>

              {/* STUDENT */}

              <th
                className="
                  min-w-[220px]
                  px-4
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Élève
              </th>

              {/* DATE OF BIRTH */}

              <th
                className="
                  min-w-[130px]
                  px-4
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Date de naissance
              </th>

              {/* STUDENT NUMBER */}

              <th
                className="
                  min-w-[120px]
                  px-4
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Matricule
              </th>

              {/* CLASSROOM */}

              <th
                className="
                  min-w-[140px]
                  px-4
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Classe
              </th>

              {/* GROUPS */}

              <th
                className="
                  min-w-[140px]
                  px-4
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Groupes
              </th>

              {/* PARENT */}

              <th
                className="
                  min-w-[180px]
                  px-4
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Parent
              </th>

              {/* GENDER */}

              <th
                className="
                  min-w-[90px]
                  px-4
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Sexe
              </th>

              {/* ASSIGNMENT */}

              <th
                className="
                  min-w-[120px]
                  px-4
                  py-4
                  text-center
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Affectation
              </th>

              {/* REPEATING */}

              <th
                className="
                  min-w-[120px]
                  px-4
                  py-4
                  text-center
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Redoublant
              </th>

              {/* ACTIONS */}

              <th
                className="
                  min-w-[120px]
                  px-4
                  py-4
                  text-center
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Actions
              </th>

            </tr>
          </thead>

          {/* ================================================= */}
          {/* BODY */}
          {/* ================================================= */}

          <tbody>
            {students.map(
              (student) => {

                const isSelected =
                  selectedStudents.includes(
                    student.id
                  );

                return (
                  <StudentRow
                    key={student.id}

                    student={student}

                    selected={isSelected}

                    onToggleSelection={() =>
                      onToggleSelection(
                        student.id
                      )
                    }

                    onView={() =>
                      onView(
                        student
                      )
                    }

                    onEdit={onEdit}
                  />
                );
              }
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}