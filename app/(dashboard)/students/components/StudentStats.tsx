"use client";

import {
  GraduationCap,
  School,
  UserRound,
  Users,
} from "lucide-react";

interface StudentStatsProps {
  total: number;
  girls: number;
  boys: number;
  classrooms: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({
  title,
  value,
  icon,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>
        </div>

        <div
          className={`rounded-xl p-3 ${color}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

export default function StudentStats({
  total,
  girls,
  boys,
  classrooms,
}: StudentStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Effectif élèves"
        value={total}
        color="bg-violet-100 text-violet-700"
        icon={<Users size={26} />}
      />

      <StatCard
        title="Filles"
        value={girls}
        color="bg-pink-100 text-pink-600"
        icon={<UserRound size={26} />}
      />

      <StatCard
        title="Garçons"
        value={boys}
        color="bg-blue-100 text-blue-600"
        icon={<GraduationCap size={26} />}
      />

      <StatCard
        title="Classes"
        value={classrooms}
        color="bg-emerald-100 text-emerald-700"
        icon={<School size={26} />}
      />

    </div>
  );
}