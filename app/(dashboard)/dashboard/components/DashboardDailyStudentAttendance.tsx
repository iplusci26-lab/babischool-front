"use client";

import { UserX, Clock3 } from "lucide-react";

interface Props {
  absent: number;
  late: number;
}

export default function DashboardDailyStudentAttendance({
  absent,
  late,
}: Props) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6">
        Situation des élèves aujourd'hui
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-red-50 p-5">
          <div className="flex items-center gap-3">
            <UserX className="text-red-600" />
            <span className="text-red-600 font-medium">
              Absents
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-red-700">
            {absent}
          </p>
        </div>

        <div className="rounded-2xl bg-orange-50 p-5">
          <div className="flex items-center gap-3">
            <Clock3 className="text-orange-600" />
            <span className="text-orange-600 font-medium">
              Retards
            </span>
          </div>

          <p className="mt-4 text-3xl font-bold text-orange-700">
            {late}
          </p>
        </div>

      </div>
    </div>
  );
}