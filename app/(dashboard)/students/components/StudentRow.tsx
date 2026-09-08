"use client";

import {
  Eye,
  Pencil,
  User,
  UsersRound,
} from "lucide-react";

import StatusBadge from "@/components/ui/StatusBadge";

import type {
  Student,
} from "../types";

// ==========================================================
// PROPS
// ==========================================================

interface StudentRowProps {
  student: Student;

  selected: boolean;

  onToggleSelection: () => void;

  onView: () => void;

  onEdit: (
    student: Student
  ) => void;
}

// ==========================================================
// HELPERS
// ==========================================================

function formatDate(
  date: string | null | undefined
) {
  if (!date) {
    return "Date inconnue";
  }

  const dateOnlyMatch =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      date
    );

  if (dateOnlyMatch) {
    const [
      ,
      year,
      month,
      day,
    ] = dateOnlyMatch;

    return `${day}/${month}/${year}`;
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      day: "2-digit",

      month: "2-digit",

      year: "numeric",
    }
  ).format(
    parsedDate
  );
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function StudentRow({
  student,
  selected,
  onToggleSelection,
  onView,
  onEdit,
}: StudentRowProps) {

  // ========================================================
  // INITIALS
  // ========================================================

  const initials =
    [
      student.first_name
        .trim()
        .charAt(0),

      student.last_name
        .trim()
        .charAt(0),
    ]
      .join("")
      .toUpperCase();

  // ========================================================
  // DISPLAY NAME
  // ========================================================

  const displayName =
    student.display_name
      ?.trim() ||
    [
      student.last_name,
      student.first_name,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Élève sans nom";

  // ========================================================
  // CLASSROOM
  // ========================================================

  /**
   * Le backend retourne :
   *
   * classroom: {
   *   id: UUID,
   *   name: string
   * }
   *
   * ou null.
   */

  const classroomName =
    student.classroom?.name
      ?.trim() ||
    null;

  // ========================================================
  // GROUPS
  // ========================================================

  const studentGroups =
    student.groups ?? [];

  // ========================================================
  // GENDER
  // ========================================================

  const genderLabel =
    student.gender === "M"
      ? "Garçon"
      : "Fille";

  const genderColor =
    student.gender === "M"
      ? "blue"
      : "pink";

  // ========================================================
  // ASSIGNMENT
  // ========================================================

  const isAssigned =
    student.is_assigned;

  // ========================================================
  // REPEATING
  // ========================================================

  const isRepeating =
    student.is_repeating;

  // ========================================================
  // PARENT
  // ========================================================

  const parentName =
    student.parent_name
      ?.trim() ||
    null;

  const parentPhone =
    student.parent_phone
      ?.trim() ||
    null;

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <tr
      className="
        border-t
        transition
        hover:bg-gray-50
      "
    >

      {/* ================================================= */}
      {/* CHECKBOX */}
      {/* ================================================= */}

      <td className="px-4 py-3">

        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelection}
          className="cursor-pointer"
          aria-label={`Sélectionner ${displayName}`}
        />

      </td>

      {/* ================================================= */}
      {/* ÉLÈVE */}
      {/* ================================================= */}

      <td className="px-4 py-3">

        <div className="flex items-center gap-3">

          {/* PHOTO */}

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-violet-100
              font-semibold
              text-violet-700
            "
          >

            {student.photo ? (

              <img
                src={student.photo}
                alt={displayName}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />

            ) : (

              <span>
                {initials || "?"}
              </span>

            )}

          </div>

          {/* INFORMATIONS */}

          <div className="min-w-0">

            <div
              className="
                truncate
                font-semibold
                text-gray-900
              "
            >
              {displayName}
            </div>

            <div
              className="
                mt-1
                text-xs
                text-gray-500
              "
            >

              {student.birth_place ? (

                <>
                  Né(e) à{" "}

                  <span
                    className="
                      font-medium
                      text-gray-600
                    "
                  >
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

      {/* ================================================= */}
      {/* DATE DE NAISSANCE */}
      {/* ================================================= */}

      <td className="px-4 py-3">

        <span
          className="
            font-medium
            text-gray-700
          "
        >
          {formatDate(
            student.date_of_birth
          )}
        </span>

      </td>

      {/* ================================================= */}
      {/* MATRICULE */}
      {/* ================================================= */}

      <td className="px-4 py-3">

        <span
          className="
            font-medium
            text-gray-700
          "
        >
          {student.student_number || "-"}
        </span>

      </td>

      {/* ================================================= */}
      {/* CLASSE */}
      {/* ================================================= */}

      <td className="px-4 py-3">

        {classroomName ? (

          <StatusBadge
            label={classroomName}
            color="purple"
          />

        ) : (

          <span
            className="
              text-sm
              text-gray-400
            "
          >
            Non affectée
          </span>

        )}

      </td>

      {/* ================================================= */}
      {/* GROUPES */}
      {/* ================================================= */}

      <td className="px-4 py-3">

        {studentGroups.length > 0 ? (

          <div
            className="
              flex
              max-w-[220px]
              flex-wrap
              gap-1.5
            "
          >

            {studentGroups.map(
              (
                group,
                index
              ) => (

                <span
                  key={
                    group.membership_id ||
                    group.group_id ||
                    `${group.name}-${index}`
                  }
                  className="
                    inline-flex
                    max-w-full
                    items-center
                    gap-1
                    rounded-full
                    bg-violet-50
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-violet-700
                    ring-1
                    ring-inset
                    ring-violet-200
                  "
                  title={
                    group.description ||
                    group.name
                  }
                >

                  <UsersRound
                    size={12}
                    className="shrink-0"
                  />

                  <span className="truncate">

                    {group.name ||
                      "Groupe"}

                  </span>

                </span>

              )
            )}

          </div>

        ) : (

          <span
            className="
              text-sm
              text-gray-400
            "
          >
            Aucun groupe
          </span>

        )}

      </td>

      {/* ================================================= */}
      {/* PARENT */}
      {/* ================================================= */}

      <td className="px-4 py-3">

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <User
            size={16}
            className="
              shrink-0
              text-gray-500
            "
          />

          <div className="min-w-0">

            {parentName ? (

              <div
                className="
                  truncate
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                {parentName}
              </div>

            ) : (

              <div
                className="
                  text-sm
                  text-gray-400
                "
              >
                Parent non renseigné
              </div>

            )}

            {parentPhone ? (

              <div
                className="
                  mt-0.5
                  text-xs
                  text-gray-500
                "
              >
                {parentPhone}
              </div>

            ) : null}

          </div>

        </div>

      </td>

      {/* ================================================= */}
      {/* SEXE */}
      {/* ================================================= */}

      <td className="px-4 py-3">

        <StatusBadge
          label={genderLabel}
          color={genderColor}
        />

      </td>

      {/* ================================================= */}
      {/* AFFECTATION */}
      {/* ================================================= */}

      <td className="px-4 py-3 text-center">

        <StatusBadge
          label={
            isAssigned
              ? "Affecté"
              : "Non affecté"
          }
          color={
            isAssigned
              ? "green"
              : "gray"
          }
        />

      </td>

      {/* ================================================= */}
      {/* REDOUBLANT */}
      {/* ================================================= */}

      <td className="px-4 py-3 text-center">

        <StatusBadge
          label={
            isRepeating
              ? "Redoublant"
              : "Non redoublant"
          }
          color={
            isRepeating
              ? "yellow"
              : "gray"
          }
        />

      </td>

      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <td className="px-4 py-3">

        <div
          className="
            flex
            justify-center
            gap-2
          "
        >

          {/* VIEW */}

          <button
            type="button"
            onClick={onView}
            className="
              cursor-pointer
              rounded-lg
              p-2
              text-blue-600
              transition
              hover:bg-blue-50
            "
            title="Voir"
            aria-label={`Voir ${displayName}`}
          >
            <Eye size={18} />
          </button>

          {/* EDIT */}

          <button
            type="button"
            onClick={() =>
              onEdit(student)
            }
            className="
              cursor-pointer
              rounded-lg
              p-2
              text-amber-600
              transition
              hover:bg-amber-50
            "
            title="Modifier"
            aria-label={`Modifier ${displayName}`}
          >
            <Pencil size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
}