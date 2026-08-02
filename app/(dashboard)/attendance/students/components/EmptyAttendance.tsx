"use client";

import { ClipboardList } from "lucide-react";

interface EmptyAttendanceProps {
  title?: string;
  description?: string;
}

export default function EmptyAttendance({
  title = "Aucun cours sélectionné",
  description = "Sélectionnez un cours pour commencer l'appel ou consulter les justifications.",
}: EmptyAttendanceProps) {
  return (
    <div className="rounded-2xl border border-dashed bg-white py-16 px-8 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">

        <ClipboardList
          size={36}
          className="text-[#6214BE]"
        />

      </div>

      <h2 className="mt-6 text-xl font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-gray-500">
        {description}
      </p>

    </div>
  );
}