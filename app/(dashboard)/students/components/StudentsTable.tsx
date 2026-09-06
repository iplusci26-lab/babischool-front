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

  /**
   * IDs UUID des élèves sélectionnés.
   */
  selectedStudents: UUID[];

  /**
   * Sélectionner ou désélectionner un élève.
   */
  onToggleSelection: (
    id: UUID
  ) => void;

  /**
   * Sélectionner tous les élèves affichés.
   */
  onSelectAll: () => void;

  /**
   * Voir les informations d'un élève.
   */
  onView: (
    student: Student
  ) => void;

  /**
   * Modifier un élève.
   */
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
  // STUDENT IDS
  // ========================================================

  /**
   * Extraction des UUID valides des élèves affichés.
   */
  const studentIds =
    students
      .map(
        (
          student
        ) =>
          student.id
      )
      .filter(
        (
          id
        ): id is UUID =>
          typeof id === "string" &&
          id.trim().length > 0
      );


  // ========================================================
  // ALL SELECTED
  // ========================================================

  const allSelected =

    studentIds.length > 0 &&

    studentIds.every(
      (
        id
      ) =>
        selectedStudents.includes(
          id
        )
    );


  // ========================================================
  // LOADING
  // ========================================================

  if (
    loading
  ) {

    return (

      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">

        Chargement des élèves...

      </div>

    );

  }


  // ========================================================
  // EMPTY STATE
  // ========================================================

  if (
    students.length === 0
  ) {

    return (

      <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">

        Aucun élève trouvé.

      </div>

    );

  }


  // ========================================================
  // RENDER
  // ========================================================

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

                  aria-label="Sélectionner tous les élèves"

                />

              </th>


              {/* ÉLÈVE */}

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">

                Élève

              </th>


              {/* DATE DE NAISSANCE */}

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">

                Date de naissance

              </th>


              {/* MATRICULE */}

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">

                Matricule

              </th>


              {/* CLASSE */}

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">

                Classe

              </th>


              {/* GROUPES */}

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">

                Groupes

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

            {students.map(
              (
                student
              ) => {

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