"use client";

import {
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface ExportMenuProps {
  onExcel: () => void;
  onPDF: () => void;
}

export default function ExportMenu({
  onExcel,
  onPDF,
}: ExportMenuProps) {

  const [open, setOpen] = useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  // ==========================================================
  // FERMETURE AU CLIC EXTÉRIEUR
  // ==========================================================

  useEffect(() => {

    const handleClickOutside = (
      event: MouseEvent
    ) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }

    };

    if (open) {

      document.addEventListener(
        "mousedown",
        handleClickOutside
      );

    }

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, [open]);

  // ==========================================================
  // FERMETURE AVEC ESCAPE
  // ==========================================================

  useEffect(() => {

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {

      if (
        event.key === "Escape"
      ) {
        setOpen(false);
      }

    };

    if (open) {

      document.addEventListener(
        "keydown",
        handleKeyDown
      );

    }

    return () => {

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [open]);

  // ==========================================================
  // EXPORT EXCEL
  // ==========================================================

  const handleExcel = () => {

    // Fermer immédiatement le menu
    setOpen(false);

    // Lancer l'export
    onExcel();

  };

  // ==========================================================
  // EXPORT PDF
  // ==========================================================

  const handlePDF = () => {

    // Fermer immédiatement le menu
    setOpen(false);

    // Lancer l'export
    onPDF();

  };

  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div
      ref={menuRef}
      className="relative"
    >

      {/* ================================================== */}
      {/* BOUTON EXPORTER */}
      {/* ================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen((prev) => !prev)
        }
        aria-expanded={open}
        aria-haspopup="menu"
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
          cursor-pointer
          hover:bg-gray-50
        "
      >

        <Download size={18} />

        Exporter

      </button>

      {/* ================================================== */}
      {/* MENU */}
      {/* ================================================== */}

      {open && (

        <div
          role="menu"
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

          {/* ================================================== */}
          {/* EXCEL */}
          {/* ================================================== */}

          <button
            type="button"
            role="menuitem"
            onClick={handleExcel}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              transition
              hover:bg-gray-50
            "
          >

            <FileSpreadsheet
              size={18}
              className="text-green-600"
            />

            <span>
              Export Excel
            </span>

          </button>

          {/* ================================================== */}
          {/* PDF */}
          {/* ================================================== */}

          <button
            type="button"
            role="menuitem"
            onClick={handlePDF}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              transition
              hover:bg-gray-50
            "
          >

            <FileText
              size={18}
              className="text-red-600"
            />

            <span>
              Export PDF
            </span>

          </button>

        </div>

      )}

    </div>

  );
}