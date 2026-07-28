"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface EntityModalProps {
  open: boolean;

  title: string;

  children: ReactNode;

  saving?: boolean;

  saveLabel?: string;

  cancelLabel?: string;

  onClose: () => void;

  onSave: () => void;
}

export default function EntityModal({
  open,
  title,
  children,
  saving = false,
  saveLabel = "Enregistrer",
  cancelLabel = "Annuler",
  onClose,
  onSave,
}: EntityModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-4 p-6">
          {children}
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t px-6 py-4">

          <button
            type="button"
            onClick={onClose}
            className="
                rounded-lg
                border
                border-gray-300
                px-5
                py-2
                hover:bg-gray-50
            "
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="
                rounded-lg
                bg-violet-600
                px-5
                py-2
                text-white
                transition
                hover:bg-violet-700
                disabled:opacity-50
            "
          >
            {saving ? "Enregistrement..." : saveLabel}
          </button>

        </div>

      </div>

    </div>
  );
}