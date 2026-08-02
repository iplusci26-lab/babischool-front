"use client";

import {
  BookOpen,
  GraduationCap,
  CalendarDays,
} from "lucide-react";

interface TeacherSubjectsProps {
  assignments: any[];
  schedules: any[];
}

const COLORS = [
  "bg-purple-50 border-purple-200 text-purple-700",
  "bg-blue-50 border-blue-200 text-blue-700",
  "bg-green-50 border-green-200 text-green-700",
  "bg-orange-50 border-orange-200 text-orange-700",
  "bg-pink-50 border-pink-200 text-pink-700",
  "bg-cyan-50 border-cyan-200 text-cyan-700",
];

const WEEKDAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export default function TeacherSubjects({
  assignments,
  schedules,
}: TeacherSubjectsProps) {
  const grouped = assignments.reduce(
    (acc: any, assignment: any) => {
      const subject = assignment.subject_name;

      if (!acc[subject]) {
        acc[subject] = [];
      }

      acc[subject].push(assignment.classroom_name);

      return acc;
    },
    {}
  );

  const subjects = Object.entries(grouped);

  const today = WEEKDAYS[new Date().getDay()];

  if (subjects.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        Aucune matière affectée.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {subjects.map(([subject, classrooms], index) => {
        const color =
          COLORS[index % COLORS.length];

        const sessions = schedules.filter(
          (schedule) =>
            schedule.subject_name === subject
        ).length;

        const todaySessions = schedules.filter(
          (schedule) =>
            schedule.subject_name === subject &&
            schedule.weekday === today
        ).length;

        return (
          <div
            key={subject}
            className={`rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${color}`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/70 p-2">
                <BookOpen size={22} />
              </div>

              <div>
                <h3 className="font-semibold">
                  {subject}
                </h3>

                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-white/70 px-2 py-1">
                    {(classrooms as string[]).length} classe(s)
                  </span>

                  <span className="rounded-full bg-white/70 px-2 py-1 flex items-center gap-1">
                    <CalendarDays size={12} />
                    {sessions} séance(s)
                  </span>

                  <span className="rounded-full bg-white/70 px-2 py-1">
                    Aujourd'hui : {todaySessions}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {(classrooms as string[]).map(
                (classroom) => (
                  <div
                    key={classroom}
                    className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2"
                  >
                    <GraduationCap size={16} />

                    <span className="text-sm">
                      {classroom}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}