"use client";

import { BarChart3 } from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ChartItem {
  day: string;
  absent: number;
  late: number;
}

interface DashboardChartProps {
  data: ChartItem[];
}

export default function DashboardChart({
  data,
}: DashboardChartProps) {
  const totalAbsences = data.reduce(
    (sum, item) => sum + item.absent,
    0
  );

  const totalRetards = data.reduce(
    (sum, item) => sum + item.late,
    0
  );

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-[#6214BE]">
            Suivi hebdomadaire
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Absences & retards
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Évolution des 7 derniers jours
          </p>

        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">

          <BarChart3
            size={26}
            className="text-[#6214BE]"
          />

        </div>

      </div>

      {/* Résumé */}

      <div className="mb-6 grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-red-50 p-4">

          <p className="text-sm text-red-500">
            Absences
          </p>

          <p className="mt-1 text-2xl font-bold text-red-700">
            {totalAbsences}
          </p>

        </div>

        <div className="rounded-2xl bg-orange-50 p-4">

          <p className="text-sm text-orange-500">
            Retards
          </p>

          <p className="mt-1 text-2xl font-bold text-orange-600">
            {totalRetards}
          </p>

        </div>

      </div>

      {/* Graphique */}

      <div className="h-72">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="absent"
              name="Absences"
              stroke="#DC2626"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="late"
              name="Retards"
              stroke="#EA580C"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}