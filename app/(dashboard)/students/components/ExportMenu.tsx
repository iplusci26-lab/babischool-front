"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";

interface ExportMenuProps {
  onExcel: () => void;
  onPDF: () => void;
}

export default function ExportMenu({
  onExcel,
  onPDF,
}: ExportMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          bg-white
          px-4
          py-2
          shadow-sm
          transition
          hover:bg-gray-50
        "
      >
        <Download size={18} />

        Exporter
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            z-50
            mt-2
            w-56
            overflow-hidden
            rounded-xl
            border
            bg-white
            shadow-xl
          "
        >

          <button
            onClick={onExcel}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              hover:bg-gray-50
            "
          >
            <FileSpreadsheet
              size={18}
              className="text-green-600"
            />

            Export Excel
          </button>

          <button onClick={onPDF}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              hover:bg-gray-50
            "
          >
            <FileText
              size={18}
              className="text-red-600"
            />

            Export PDF
          </button>

        </div>
      )}

    </div>
  );
}