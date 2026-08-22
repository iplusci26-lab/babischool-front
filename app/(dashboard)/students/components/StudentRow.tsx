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
  onToggleSelection: () => void;
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
  const initials = `${student.first_name?.charAt(0) ?? ""}${student.last_name?.charAt(0) ?? ""}`;

  return (
    <tr className="border-t transition hover:bg-gray-50">

      {/* ================================================== */}
      {/* CHECKBOX */}
      {/* ================================================== */}

      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelection}
          className="cursor-pointer"
        />
      </td>

      {/* ================================================== */}
      {/* ÉLÈVE */}
      {/* ================================================== */}

      <td className="px-4 py-3">

        <div className="flex items-center gap-3">

          {/* PHOTO / INITIALES */}

          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 font-semibold text-violet-700">

            {student.photo ? (
              <img
                src={student.photo}
                alt={student.display_name}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}

          </div>

          {/* NOM + INFORMATIONS */}

          <div className="min-w-0">

            <div className="font-semibold text-gray-900">
              {student.display_name}
            </div>

            <div className="mt-1 text-xs text-gray-500">

              {student.birth_place ? (
                <>
                  Né(e) à{" "}
                  <span className="font-medium text-gray-600">
                    {student.birth_place}
                  </span>
                </>
              ) : (
                "Lieu de naissance non renseigné"
              )}

            </div>

          </div>

        </div>

      </td>

      {/* ================================================== */}
      {/* MATRICULE */}
      {/* ================================================== */}

      <td className="px-4 py-3">
        <span className="font-medium text-gray-700">
          {student.student_number}
        </span>
      </td>

      {/* ================================================== */}
      {/* CLASSE */}
      {/* ================================================== */}

      <td className="px-4 py-3">

        {student.classroom_name ? (
          <StatusBadge
            label={student.classroom_name}
            color="purple"
          />
        ) : (
          <span className="text-sm text-gray-400">
            Non affectée
          </span>
        )}

      </td>

      {/* ================================================== */}
      {/* PARENT */}
      {/* ================================================== */}

      <td className="px-4 py-3">

        <div className="flex items-center gap-2">

          <User
            size={16}
            className="shrink-0 text-gray-500"
          />

          <span className="text-gray-700">
            {student.parent_phone || "-"}
          </span>

        </div>

      </td>

      {/* ================================================== */}
      {/* SEXE */}
      {/* ================================================== */}

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

      {/* ================================================== */}
      {/* AFFECTATION */}
      {/* ================================================== */}

      <td className="px-4 py-3">

        <StatusBadge
          label={
            student.is_assigned
              ? "Affecté"
              : "Non affecté"
          }
          color={
            student.is_assigned
              ? "green"
              : "gray"
          }
        />

      </td>

      {/* ================================================== */}
      {/* REDOUBLANT */}
      {/* ================================================== */}

      <td className="px-4 py-3">

        <StatusBadge
          label={
            student.is_repeating
              ? "Redoublant"
              : "Non redoublant"
          }
          color={
            student.is_repeating
              ? "orange"
              : "gray"
          }
        />

      </td>

      {/* ================================================== */}
      {/* ACTIONS */}
      {/* ================================================== */}

      <td className="px-4 py-3">

        <div className="flex justify-center gap-2">

          {/* VOIR */}

          <button
            type="button"
            onClick={onView}
            className="cursor-pointer rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
            title="Voir"
          >
            <Eye size={18} />
          </button>

          {/* MODIFIER */}

          <button
            type="button"
            onClick={() => onEdit(student)}
            className="cursor-pointer rounded-lg p-2 text-amber-600 transition hover:bg-amber-50"
            title="Modifier"
          >
            <Pencil size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
}