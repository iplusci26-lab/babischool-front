"use client";

import {
  Plus,
  Users,
  UsersRound,
} from "lucide-react";

import ExportMenu from "./ExportMenu";

// ==========================================================
// PROPS
// ==========================================================

interface StudentToolbarProps {
  total: number;

  selectedCount: number;

  onCreate: () => void;

  onExportExcel: () => void;

  onExportPDF: () => void;

  onManageGroups: () => void;
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function StudentToolbar({
  total,
  selectedCount,
  onCreate,
  onExportExcel,
  onExportPDF,
  onManageGroups,
}: StudentToolbarProps) {

  // ========================================================
  // NORMALIZED VALUES
  // ========================================================

  const safeTotal =
    Number.isFinite(total) && total > 0
      ? total
      : 0;


  const safeSelectedCount =
    Number.isFinite(selectedCount) &&
    selectedCount > 0
      ? selectedCount
      : 0;


  const hasSelection =
    safeSelectedCount > 0;


  // ========================================================
  // HANDLE GROUP MANAGEMENT
  // ========================================================

  const handleManageGroups = () => {

    onManageGroups();

  };


  // ========================================================
  // RENDER
  // ========================================================

  return (

    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        {/* ================================================ */}
        {/* TITLE */}
        {/* ================================================ */}

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-violet-100 p-3">

              <Users
                className="text-violet-700"
                size={24}
              />

            </div>


            <div>

              <h1 className="text-2xl font-bold">
                Élèves
              </h1>


              <p className="text-sm text-gray-500">
                Gestion des élèves de votre établissement
              </p>

            </div>

          </div>

        </div>


        {/* ================================================ */}
        {/* ACTIONS */}
        {/* ================================================ */}

        <div className="flex flex-wrap gap-3">

          {/* ============================================== */}
          {/* GROUP MANAGEMENT */}
          {/* ============================================== */}

          <button
            type="button"
            onClick={handleManageGroups}
            className="
              flex
              cursor-pointer
              items-center
              gap-2
              rounded-xl
              border
              border-violet-200
              bg-violet-50
              px-4
              py-2
              font-medium
              text-violet-700
              transition
              hover:bg-violet-100
            "
          >

            <UsersRound size={18} />


            <span>
              Gérer les groupes
            </span>


            {/* Badge visible uniquement s'il y a une sélection */}

            {hasSelection && (

              <span
                className="
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-violet-700
                  px-1.5
                  text-xs
                  font-semibold
                  text-white
                "
              >
                {safeSelectedCount}
              </span>

            )}

          </button>


          {/* ============================================== */}
          {/* EXPORT */}
          {/* ============================================== */}

          <ExportMenu
            onExcel={onExportExcel}
            onPDF={onExportPDF}
          />


          {/* ============================================== */}
          {/* NEW STUDENT */}
          {/* ============================================== */}

          <button
            type="button"
            onClick={onCreate}
            className="
              flex
              cursor-pointer
              items-center
              gap-2
              rounded-xl
              bg-violet-700
              px-4
              py-2
              text-white
              transition
              hover:bg-violet-800
            "
          >

            <Plus size={18} />

            Nouvel élève

          </button>

        </div>

      </div>


      {/* ================================================== */}
      {/* TOTAL / SELECTION */}
      {/* ================================================== */}

      <div className="flex flex-wrap items-center gap-3 text-sm">

        <span className="text-gray-500">

          {safeTotal} élève
          {safeTotal > 1 ? "s" : ""}
          {" "}
          enregistré
          {safeTotal > 1 ? "s" : ""}

        </span>


        {hasSelection && (

          <>

            <span className="text-gray-300">
              •
            </span>


            <span className="font-medium text-violet-700">

              {safeSelectedCount} élève
              {safeSelectedCount > 1
                ? "s"
                : ""
              }
              {" "}
              sélectionné
              {safeSelectedCount > 1
                ? "s"
                : ""
              }

            </span>

          </>

        )}

      </div>

    </div>

  );
}