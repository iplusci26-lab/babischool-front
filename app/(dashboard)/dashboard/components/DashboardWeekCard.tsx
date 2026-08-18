"use client";

import {
  CalendarDays,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

interface DashboardWeekCardProps {
  week: {
    total: number;
    absent: number;
    absence_rate: number;
  };
}

export default function DashboardWeekCard({
  week,
}: DashboardWeekCardProps) {

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-[#6214BE]">
            Cette semaine
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            {week.absence_rate}%
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Taux moyen d'absence enseignant
          </p>

        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">

          <TrendingUp
            size={28}
            className="text-red-700"
          />

        </div>

      </div>

      {/* Progression */}

      <div className="mb-6 h-3 overflow-hidden rounded-full bg-gray-100">

        <div
          className="h-full rounded-full bg-red-400 transition-all"
          style={{
            width: `${week.absence_rate}%`,
          }}
        />

      </div>

      {/* KPIs */}

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-green-50 p-4">

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">

            <CalendarDays
              size={20}
              className="text-green-700"
            />

          </div>

          <p className="text-xs text-gray-500">
            Cours réalisés
          </p>

          <p className="mt-1 text-2xl font-bold text-green-700">
            {week.total}
          </p>

        </div>

        <div className="rounded-2xl bg-red-50 p-4">

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">

            <BadgeCheck
              size={20}
              className="text-red-700"
            />

          </div>

          <p className="text-xs text-gray-500">
            Absence
          </p>

          <p className="mt-1 text-2xl font-bold text-red-700">
            {week.absent}
          </p>

        </div>

      </div>

    </div>

  );

}