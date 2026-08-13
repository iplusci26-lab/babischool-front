"use client";

import { Download, Plus, Users } from "lucide-react";
import ExportMenu  from "./ExportMenu";

interface StudentToolbarProps {
  total: number;

  onCreate: () => void;

  onExportExcel: () => void;
  onExportPDF: () => void;
}

export default function StudentToolbar({
  total,
  onCreate,
  onExportExcel,
  onExportPDF
}: StudentToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm border">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

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

        <div className="flex gap-3">

            <ExportMenu
                onExcel={onExportExcel}
                onPDF={onExportPDF}
            />

          <button
            onClick={onCreate}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-violet-700
              px-4
              py-2
              text-white
              hover:bg-violet-800
              cursor-pointer
            "
          >
            <Plus size={18} />

            Nouvel élève
          </button>

        </div>

      </div>

      <div className="text-sm text-gray-500">
        {total} élève{total > 1 ? "s" : ""} enregistré{total > 1 ? "s" : ""}
      </div>

    </div>
  );
}