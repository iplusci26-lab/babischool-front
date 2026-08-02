"use client";

import {
  GraduationCap,
  BadgeAlert,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

interface PendingJustificationCardProps {
  record: any;
  loading: boolean;
  onJustificationChange: (
    attendanceId: string,
    status: "justified" | "unjustified"
  ) => void;
}

export default function PendingJustificationCard({
  record,
  loading,
  onJustificationChange,
}: PendingJustificationCardProps) {
  const isAbsent = record.attendance_status === "absent";

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">

      {/* Header */}

      <div className="border-b bg-gray-50 px-5 py-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6214BE]/10">
              <GraduationCap
                className="text-[#6214BE]"
                size={22}
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                {record.student_name}
              </h3>

              <p className="text-sm text-gray-500">
                Matricule : {record.student_number}
              </p>
            </div>

          </div>

          <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            En attente
          </div>

        </div>

      </div>

      {/* Informations */}

      <div className="space-y-4 p-5">

        <div className="grid gap-4 md:grid-cols-2">

          <div>

            <p className="text-xs uppercase tracking-wide text-gray-400">
              Classe
            </p>

            <p className="font-medium">
              {record.classroom_name}
            </p>

          </div>

          <div>

            <p className="text-xs uppercase tracking-wide text-gray-400">
              Matière
            </p>

            <p className="font-medium">
              {record.subject_name}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2">

          {isAbsent ? (
            <XCircle
              className="text-red-600"
              size={18}
            />
          ) : (
            <Clock3
              className="text-orange-500"
              size={18}
            />
          )}

          <span
            className={`font-medium ${
              isAbsent
                ? "text-red-600"
                : "text-orange-600"
            }`}
          >
            {isAbsent ? "Absent" : "Retard"}
          </span>

        </div>

        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">

          <div className="flex items-center gap-2 text-yellow-700">

            <BadgeAlert size={18} />

            <span className="font-medium">
              Justification en attente de validation
            </span>

          </div>

        </div>

        <div className="flex flex-wrap gap-3">

          <button
            disabled={loading}
            onClick={() =>
              onJustificationChange(
                record.attendance_id,
                "justified"
              )
            }
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle2 size={18} />
            Justifier
          </button>

          <button
            disabled={loading}
            onClick={() =>
              onJustificationChange(
                record.attendance_id,
                "unjustified"
              )
            }
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            <XCircle size={18} />
            Non justifié
          </button>

        </div>

      </div>

    </div>
  );
}