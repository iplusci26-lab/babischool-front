"use client";

import PendingJustificationCard from "./PendingJustificationCard";

interface PendingJustificationSectionProps {
  records: any[];
  loading: boolean;
  onJustificationChange: (
    attendanceId: string,
    status: "justified" | "unjustified"
  ) => void;
}

export default function PendingJustificationSection({
  records,
  loading,
  onJustificationChange,
}: PendingJustificationSectionProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Aucune justification en attente
        </h3>

        <p className="mt-2 text-gray-500">
          Toutes les absences et tous les retards ont déjà été traités.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-gray-900">
            Justifications en attente
          </h2>

          <p className="text-gray-500">
            Validez ou refusez les justificatifs des élèves.
          </p>

        </div>

        <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
          {records.length} en attente
        </div>

      </div>

      {records.map((record) => (
        <PendingJustificationCard
          key={record.attendance_id}
          record={record}
          loading={loading}
          onJustificationChange={onJustificationChange}
        />
      ))}

    </div>
  );
}