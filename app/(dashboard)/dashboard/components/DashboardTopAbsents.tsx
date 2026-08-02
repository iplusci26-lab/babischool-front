"use client";

import {
  Award,
  CircleAlert,
} from "lucide-react";

interface TeacherAbsent {
  name: string;
  count: number;
}

interface DashboardTopAbsentsProps {
  teachers: TeacherAbsent[];
}

export default function DashboardTopAbsents({
  teachers,
}: DashboardTopAbsentsProps) {

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-[#6214BE]">

            Enseignants les plus absents

          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">

            Top absences

          </h2>

        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">

          <CircleAlert
            size={28}
            className="text-red-600"
          />

        </div>

      </div>

      {teachers.length === 0 ? (

        <div className="rounded-2xl bg-green-50 py-12 text-center">

          <Award
            size={36}
            className="mx-auto mb-4 text-green-600"
          />

          <p className="font-semibold text-green-700">

            Aucune absence enregistrée

          </p>

          <p className="mt-2 text-sm text-gray-500">

            Tous les enseignants sont présents.

          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {teachers.map((teacher, index) => (

            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border p-4 transition hover:bg-gray-50"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6214BE]/10 font-bold text-[#6214BE]">

                  {teacher.name
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")}

                </div>

                <div>

                  <p className="font-semibold text-gray-900">

                    {teacher.name}

                  </p>

                  <p className="text-sm text-gray-500">

                    Rang #{index + 1}

                  </p>

                </div>

              </div>

              <div className="text-right">

                <div className="rounded-xl bg-red-100 px-3 py-2">

                  <span className="font-bold text-red-700">

                    {teacher.count}

                  </span>

                </div>

                <p className="mt-1 text-xs text-gray-500">

                  absence(s)

                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}