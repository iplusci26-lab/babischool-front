"use client";

import {
  Eye,
  Pencil,
  User,
} from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";

import { Student } from "../types";

interface StudentRowProps {
  student: Student;

  selected: boolean;

  
  onToggleSelection: () =>void;

  onView: () => void;

  onEdit: (student: Student) => void;
}

export default function StudentRow({
  student,
  selected,
  onToggleSelection,
  onView,
  onEdit,
}: StudentRowProps) {
  const initials = `${student.first_name.charAt(0)}${student.last_name.charAt(0)}`;
  
  return (
    <tr className="border-t transition hover:bg-gray-50">

      {/* Checkbox */}

      <td className="px-4 py-3">

        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelection}
        />

      </td>

      {/* Élève */}

      <td className="px-4 py-3">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">

            {student.photo ? (
              <img
                src={student.photo}
                alt={student.first_name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials
            )}

          </div>

          <div>

            <div className="font-semibold text-gray-900">
              {student.display_name}
            </div>

            {student.date_of_birth && (
              <div className="text-sm text-gray-500">
                {student.date_of_birth}
              </div>
            )}

          </div>

        </div>

      </td>

      {/* Matricule */}

      <td className="px-4 py-3">
        <span className="font-medium">
          {student.student_number}
        </span>
      </td>

      {/* Classe */}

      <td className="px-4 py-3">

        <StatusBadge
          label={student.classroom_name}
          color="purple"
        />

      </td>

      {/* Parent */}

      <td className="px-4 py-3">

        <div className="flex items-center gap-2">

          <User size={16} />

          <span>
            {student.parent_phone || "-"}
          </span>

        </div>

      </td>

      {/* Sexe */}

      <td className="px-4 py-3">

        <StatusBadge
          label={
            student.gender === "M"
              ? "Garçon"
              : "Fille"
          }
          color={
            student.gender === "M"
              ? "blue"
              : "pink"
          }
        />

      </td>

      {/* Actions */}

      <td className="px-4 py-3">

        <div className="flex justify-center gap-2">

          <button
            onClick={onView}
            className="rounded-lg cursor-pointer p-2 text-blue-600 transition hover:bg-blue-50"
            title="Voir"
          >
            <Eye size={18} />
          </button>

          <button
           onClick={() => onEdit(student)}
            className="rounded-lg cursor-pointer p-2 text-amber-600 transition hover:bg-amber-50"
            title="Modifier"
          >
            <Pencil size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
}