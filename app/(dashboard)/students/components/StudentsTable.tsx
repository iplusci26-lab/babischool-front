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
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        Chargement des élèves...
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm text-gray-500">
        Aucun élève trouvé.
      </div>
    );
  }

  const allSelected =
    students.length > 0 &&
    selectedStudents.length === students.length;

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="w-12 px-4 py-3">

                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                />

              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Élève
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Matricule
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Classe
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Parent
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Sexe
              </th>

              <th className="w-36 px-4 py-3 text-center text-sm font-semibold">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {students.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                selected={selectedStudents.includes(student.id)}
                onToggleSelection={() =>
                  onToggleSelection(student.id)
                }
                onView={() => onView(student)}
                onEdit={onEdit}
              />
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}