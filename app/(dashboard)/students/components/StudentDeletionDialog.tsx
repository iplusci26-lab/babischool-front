
"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import type { StudentDeletionPreview } from "../types";

interface StudentDeletionDialogProps {
  open: boolean;
  preview: StudentDeletionPreview | null;
  loading: boolean;
  deleting: boolean;
  studentName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const deletionLabels: Record<
  keyof StudentDeletionPreview["counts"],
  string
> = {
  students: "Élève",
  enrollments: "Inscriptions scolaires",
  classroom_group_memberships: "Appartenances aux groupes",
  payments: "Paiements",
  ledger_entries: "Écritures comptables",
  invoices: "Factures",
  grades: "Notes",
  grade_correction_history: "Historiques de correction des notes",
  attendance_records: "Enregistrements de présence",
  homework_submissions: "Devoirs rendus",
  conversations: "Conversations",
  messages: "Messages",
  parent_links: "Liens avec les parents",
};

export default function StudentDeletionDialog({
  open,
  preview,
  loading,
  deleting,
  studentName,
  onClose,
  onConfirm,
}: StudentDeletionDialogProps) {
  if (!open) return null;

  const counts = preview?.counts;

  const countEntries = counts
    ? Object.entries(counts).filter(
        ([key]) => key !== "students"
      )
    : [];

  return (
    <div
      className="
        fixed inset-0 z-[60]
        flex items-center justify-center
        bg-black/60 p-4
      "
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deletion-title"
        className="
          w-full max-w-2xl
          max-h-[90vh] overflow-y-auto
          rounded-2xl bg-white
          shadow-2xl
        "
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h2
                id="deletion-title"
                className="text-lg font-bold text-gray-900"
              >
                Supprimer définitivement cet élève
              </h2>

              <p className="text-sm text-gray-500">
                Vérifiez les conséquences avant de continuer.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            aria-label="Fermer"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* WARNING */}
          <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="font-semibold text-red-800">
                Attention : cette opération est irréversible.
              </p>

              <p className="mt-1 text-sm text-red-700">
                La suppression de cet élève entraînera également
                la suppression des données associées indiquées
                ci-dessous.
              </p>
            </div>
          </div>

          {/* STUDENT */}
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Élève concerné
            </p>

            {preview ? (
              <>
                <p className="font-semibold text-gray-900">
                  {preview.student?.full_name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Matricule : {preview.student?.student_number}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                 Chargement des informations...
              </p>
            )}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex items-center justify-center gap-3 py-8 text-sm text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Chargement de l'aperçu de suppression...
            </div>
          )}

          {/* PREVIEW */}
          {!loading && preview && (
            <>
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Données qui seront supprimées
                  </h3>

                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    {preview.total_related_records} enregistrement(s) lié(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {countEntries.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2.5"
                    >
                      <span className="text-sm text-gray-600">
                        {deletionLabels[
                          key as keyof StudentDeletionPreview["counts"]
                        ] || key}
                      </span>

                      <span className="font-semibold tabular-nums text-gray-900">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRESERVED */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Données qui seront conservées
                </h3>

                <div className="space-y-2 rounded-xl border border-green-200 bg-green-50 p-4">
                  {(preview?.preserved ?? []).map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-start gap-2 text-sm text-green-800"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ERROR / NO PREVIEW */}
          {!loading && !preview && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Impossible de charger les informations de suppression.
              Fermez cette fenêtre puis réessayez.
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse justify-end gap-3 border-t bg-gray-50 p-5 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="
              rounded-xl border border-gray-300
              bg-white px-5 py-2.5
              text-sm font-medium text-gray-700
              hover:bg-gray-100
              disabled:opacity-50
            "
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={!preview || loading || deleting}
            className="
              flex items-center justify-center gap-2
              rounded-xl bg-red-600
              px-5 py-2.5
              text-sm font-semibold text-white
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {deleting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Suppression en cours...
              </>
            ) : (
              <>
                <Trash2 size={17} />
                Confirmer la suppression
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
