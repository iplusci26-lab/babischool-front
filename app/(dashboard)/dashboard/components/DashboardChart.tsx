"use client";

import {
  BarChart3,
} from "lucide-react";

interface DashboardChartProps {

  rate: number;

}

export default function DashboardChart({

  rate,

}: DashboardChartProps) {

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-[#6214BE]">

            Performance

          </p>

          <h2 className="mt-1 text-2xl font-bold">

            Tendance de présence

          </h2>

        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">

          <BarChart3
            size={26}
            className="text-[#6214BE]"
          />

        </div>

      </div>

      <div className="flex h-64 items-center justify-center">

        <div className="w-full">

          <div className="mb-4 flex justify-between">

            <span className="text-sm text-gray-500">

              Présence moyenne

            </span>

            <span className="font-bold">

              {rate}%

            </span>

          </div>

          <div className="h-5 overflow-hidden rounded-full bg-gray-100">

            <div

              className="h-full rounded-full bg-[#6214BE] transition-all duration-500"

              style={{

                width: `${rate}%`,

              }}

            />

          </div>

          <p className="mt-6 text-center text-sm text-gray-500">

            Le graphique détaillé des tendances
            (7 jours, 30 jours, trimestre)
            sera disponible dans une prochaine version.

          </p>

        </div>

      </div>

    </div>

  );

}