"use client";

import {
  BookOpen,
  GraduationCap,
  CalendarDays,
  Clock3,
} from "lucide-react";

interface TeacherStatsProps {
  assignments: any[];
  schedules: any[];
}

const WEEKDAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export default function TeacherStats({
  assignments,
  schedules,
}: TeacherStatsProps) {
  const subjects = new Set(
    assignments.map((a) => a.subject_name)
  );

  const classrooms = new Set(
    assignments.map((a) => a.classroom_name)
  );

  const today = WEEKDAYS[new Date().getDay()];

  const todaySchedules = schedules.filter(
    (schedule) => schedule.weekday === today
  );

  const cards = [
    {
      title: "Matières",
      value: subjects.size,
      icon: BookOpen,
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-[#6214BE]",
    },
    {
      title: "Classes",
      value: classrooms.size,
      icon: GraduationCap,
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Séances",
      value: schedules.length,
      icon: CalendarDays,
      bg: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Aujourd'hui",
      value: todaySchedules.length,
      icon: Clock3,
      bg: "bg-orange-50",
      border: "border-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`rounded-2xl border ${card.border} ${card.bg} p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {card.title}
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>

              <div
                className={`rounded-xl p-3 ${card.iconBg}`}
              >
                <Icon
                  className={card.iconColor}
                  size={24}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}