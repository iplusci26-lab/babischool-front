"use client";

import {
  GraduationCap,
  Presentation,
  Users,
  School,
  BookOpen,
  Banknote,
} from "lucide-react";

interface DashboardStatsProps {
  data: {
    students_count: number;
    teachers_count: number;
    parents_count: number;
    classrooms_count: number;
    subjects_count: number;
    total_payments: number;
  };
}

export default function DashboardStats({
  data,
}: DashboardStatsProps) {

  const cards = [

    {
      title: "Élèves",
      value: data.students_count,
      icon: GraduationCap,
      bg: "bg-violet-100",
      color: "text-violet-700",
    },

    {
      title: "Enseignants",
      value: data.teachers_count,
      icon: Presentation,
      bg: "bg-blue-100",
      color: "text-blue-700",
    },

    {
      title: "Parents",
      value: data.parents_count,
      icon: Users,
      bg: "bg-green-100",
      color: "text-green-700",
    },

    {
      title: "Classes",
      value: data.classrooms_count,
      icon: School,
      bg: "bg-orange-100",
      color: "text-orange-700",
    },

    {
      title: "Matières",
      value: data.subjects_count,
      icon: BookOpen,
      bg: "bg-pink-100",
      color: "text-pink-700",
    },

    {
      title: "Recettes",
      value: `${Number(
        data.total_payments
      ).toLocaleString("fr-FR")} FCFA`,
      icon: Banknote,
      bg: "bg-emerald-100",
      color: "text-emerald-700",
    },

  ];

  return (

    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="group rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
            >

              <Icon
                size={28}
                className={card.color}
              />

            </div>

            <p className="text-sm font-medium text-gray-500">

              {card.title}

            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">

              {card.value}

            </h2>

          </div>

        );

      })}

    </div>

  );

}