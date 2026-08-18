"use client";

import {
  BadgeCheck,
  CircleX,
  Clock3,
  TrendingUp,
} from "lucide-react";

interface DashboardAttendanceCardProps {
  today: {
    present: number;
    absent: number;
    late: number;
  };
}

export default function DashboardAttendanceCard({
  today,
}: DashboardAttendanceCardProps) {

  const total =
    today.present +
    today.absent +
    today.late;

  const attendanceRate =
    total === 0
      ? 0
      : Math.round(
          (today.absent / total) * 100
        );

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-[#6214BE]">

            Absence aujourd'hui

          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">

            {attendanceRate}%

          </h2>

        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">

          <TrendingUp
            size={28}
            className="text-red-700"
          />

        </div>

      </div>

      {/* Progression */}

      <div className="mb-6">

        <div className="h-3 overflow-hidden rounded-full bg-gray-100">

          <div
            className="h-full rounded-full bg-red-400 transition-all"
            style={{
              width: `${attendanceRate}%`,
            }}
          />

        </div>

      </div>

      {/* Statistiques */}

      <div className="grid grid-cols-2 gap-4">

        {/*<div className="rounded-2xl bg-green-50 p-4">

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">

            <BadgeCheck
              size={20}
              className="text-green-700"
            />

          </div>

          <p className="text-xs text-gray-500">

            Présents

          </p>

          <p className="mt-1 text-2xl font-bold text-green-700">

            {today.present}

          </p>

        </div>*/}

        <div className="rounded-2xl bg-red-50 p-4">

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">

            <CircleX
              size={20}
              className="text-red-700"
            />

          </div>

          <p className="text-xs text-gray-500">

            Absents

          </p>

          <p className="mt-1 text-2xl font-bold text-red-700">

            {today.absent}

          </p>

        </div>

        <div className="rounded-2xl bg-orange-50 p-4">

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">

            <Clock3
              size={20}
              className="text-orange-700"
            />

          </div>

          <p className="text-xs text-gray-500">

            Retards

          </p>

          <p className="mt-1 text-2xl font-bold text-orange-700">

            {today.late}

          </p>

        </div>

      </div>

    </div>

  );

}