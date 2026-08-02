"use client";

import {
  BookOpen,
  Clock3,
  GraduationCap,
  MapPin,
} from "lucide-react";

interface TeacherScheduleProps {
  schedules: any[];
}

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi"
];

const DAY_LABELS: Record<string, string> = {
  Lundi: "Lundi",
  Mardi: "Mardi",
  Mercredi: "Mercredi",
  Jeudi: "Jeudi",
  Vendredi: "Vendredi",
  Samedi:"Samedi",
};

const COLORS = [
  "border-l-purple-500 bg-purple-50",
  "border-l-blue-500 bg-blue-50",
  "border-l-green-500 bg-green-50",
  "border-l-orange-500 bg-orange-50",
  "border-l-pink-500 bg-pink-50",
  "border-l-cyan-500 bg-cyan-50",
];

export default function TeacherSchedule({
  schedules,
}: TeacherScheduleProps) {

  const colorMap = new Map<string, string>();

  let colorIndex = 0;

  schedules.forEach((schedule) => {
    if (!colorMap.has(schedule.subject_name)) {
      colorMap.set(
        schedule.subject_name,
        COLORS[colorIndex % COLORS.length]
      );

      colorIndex++;
    }
  });

  const getByDay = (day: string) =>
    schedules
      .filter(
        (schedule) => schedule.weekday === day
      )
      .sort((a, b) =>
        a.start_time.localeCompare(
          b.start_time
        )
      );

  return (
    <div className="grid gap-5 xl:grid-cols-5">

      {DAYS.map((day) => (
        <div
          key={day}
          className="rounded-2xl border bg-white shadow-sm"
        >
          <div className="rounded-t-2xl bg-[#6214BE] px-4 py-3 text-center">

            <h2 className="font-semibold text-white">
              {DAY_LABELS[day]}
            </h2>

          </div>

          <div className="space-y-3 p-4">

            {getByDay(day).length === 0 && (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-400">
                Aucun cours
              </div>
            )}

            {getByDay(day).map(
              (schedule: any) => (
                <div
                  key={schedule.id}
                  className={`rounded-xl border border-l-4 p-4 shadow-sm ${
                    colorMap.get(
                      schedule.subject_name
                    ) ?? COLORS[0]
                  }`}
                >
                  <div className="flex items-center gap-2">

                    <BookOpen
                      size={18}
                      className="text-[#6214BE]"
                    />

                    <h3 className="font-semibold text-gray-900">
                      {schedule.subject_name}
                    </h3>

                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">

                    <div className="flex items-center gap-2">

                      <Clock3 size={15} />

                      <span>
                        {schedule.start_time} -{" "}
                        {schedule.end_time}
                      </span>

                    </div>

                    <div className="flex items-center gap-2">

                      <GraduationCap size={15} />

                      <span>
                        {schedule.classroom_name}
                      </span>

                    </div>

                    {schedule.room && (
                      <div className="flex items-center gap-2">

                        <MapPin size={15} />

                        <span>
                          {schedule.room}
                        </span>

                      </div>
                    )}

                  </div>

                </div>
              )
            )}

          </div>
        </div>
      ))}

    </div>
  );
}