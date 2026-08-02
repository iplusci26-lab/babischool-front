"use client";

import {
  BookOpen,
  Users,
  UserCheck,
  UserX,
  Clock3,
  FileText,
} from "lucide-react";

interface AttendanceSummary {
  total_sessions: number;
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  pending_justifications: number;
}

interface StudentAttendanceSummaryProps {
  summary: AttendanceSummary;
}

export default function StudentAttendanceSummary({
  summary,
}: StudentAttendanceSummaryProps) {
  const cards = [
    {
      title: "Séances",
      value: summary.total_sessions,
      icon: BookOpen,
      bg: "bg-violet-50",
      color: "text-[#6214BE]",
    },
    {
      title: "Élèves",
      value: summary.total_students,
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Présents",
      value: summary.present_count,
      icon: UserCheck,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Absents",
      value: summary.absent_count,
      icon: UserX,
      bg: "bg-red-50",
      color: "text-red-600",
    },
    {
      title: "Retards",
      value: summary.late_count,
      icon: Clock3,
      bg: "bg-amber-50",
      color: "text-amber-600",
    },
   /* {
      title: "Justifications",
      value: summary.pending_justifications,
      icon: FileText,
      bg: "bg-orange-50",
      color: "text-orange-600",
    },*/
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.bg}`}
              >
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>

              <span className={`text-3xl font-bold ${card.color}`}>
                {card.value}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600">
                {card.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}