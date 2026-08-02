"use client";

import { CalendarDays } from "lucide-react";

interface AttendanceHeaderProps {
  schedules: any[];
}

export default function AttendanceHeader({
  schedules,
}: AttendanceHeaderProps) {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#6214BE] to-purple-700 p-6 text-white shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Présence des élèves
          </h1>

          <p className="mt-2 text-purple-100 capitalize">
            {today}
          </p>
        </div>

        <div className="hidden rounded-2xl bg-white/20 p-4 md:block">
          <CalendarDays size={34} />
        </div>
      </div>

      <div className="mt-6 flex gap-8">
        <div>
          <div className="text-sm text-purple-200">
            Cours disponibles
          </div>

          <div className="text-3xl font-bold">
            {schedules.length}
          </div>
        </div>
      </div>
    </div>
  );
}