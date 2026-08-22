"use client";

import StudentRow from "./StudentRow";

import { Student } from "../types";

interface StudentTableProps {
  students: Student[];

  loading: boolean;

  selectedStudents: number[];

  onToggleSelection: (id: number) => void;

  onSelectAll: () => void;

  onView: (student: Student) => void;

  onEdit: (student: Student) => void;
}

export default function StudentTable({
  students,
  loading,
  selectedStudents,
  onToggleSelection,
  onSelectAll,
  onView,
  onEdit,
}: StudentTableProps) {
  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        Chargement des élèves...
      </div>
    );
  }

  // ==========================================================
  // AUCUN ÉLÈVE
  // ==========================================================

  if (!students.length) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">
        Aucun élève trouvé.
      </div>
    );
  }

  // ==========================================================
  // SÉLECTION
  // ==========================================================

  const allSelected =
    students.length > 0 &&
    selectedStudents.length === students.length;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <thead className="bg-gray-50">

            <tr>

              {/* CHECKBOX */}

              <th className="w-12 px-4 py-3">

                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="cursor-pointer"
                />

              </th>

              {/* ÉLÈVE */}

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Élève
              </th>

              {/* MATRICULE */}

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Matricule
              </th>

              {/* CLASSE */}

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Classe
              </th>

              {/* PARENT */}

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Parent
              </th>

              {/* SEXE */}

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Sexe
              </th>

              {/* AFFECTATION */}

              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Affectation
              </th>

              {/* REDOUBLANT */}

              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Redoublant
              </th>

              {/* ACTIONS */}

              <th className="w-36 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>

            </tr>

          </thead>

          {/* ================================================== */}
          {/* BODY */}
          {/* ================================================== */}

          <tbody>

            {students.map((student) => (

              <StudentRow
                key={student.id}
                student={student}
                selected={selectedStudents.includes(student.id)}
                onToggleSelection={() =>
                  onToggleSelection(student.id)
                }
                onView={() =>
                  onView(student)
                }
                onEdit={onEdit}
              />

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}