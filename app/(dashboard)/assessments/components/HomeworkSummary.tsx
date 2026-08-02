"use client";

import {
  BookOpen,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { HomeworkSummary as Summary } from "../types";

interface HomeworkSummaryProps {
  summary: Summary;
}

export default function HomeworkSummary({
  summary,
}: HomeworkSummaryProps) {

  const cards = [

    {
      title: "Exercices",
      subtitle: "Total",
      value: summary.total,
      icon: BookOpen,
      bg: "bg-violet-100",
      color: "text-violet-700",
    },

    {
      title: "À rendre",
      subtitle: "En attente",
      value: summary.pending,
      icon: Clock3,
      bg: "bg-blue-100",
      color: "text-blue-700",
    },

    {
      title: "Terminés",
      subtitle: "Remis",
      value: summary.completed,
      icon: CheckCircle2,
      bg: "bg-green-100",
      color: "text-green-700",
    },

    {
      title: "En retard",
      subtitle: "Date dépassée",
      value: summary.overdue,
      icon: AlertTriangle,
      bg: "bg-red-100",
      color: "text-red-700",
    },

  ];

  return (

    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="
              group
              rounded-3xl
              border
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">

                  {card.title}

                </p>

                <h2 className="mt-2 text-4xl font-bold text-gray-900">

                  {card.value}

                </h2>

                <p className="mt-2 text-xs text-gray-400">

                  {card.subtitle}

                </p>

              </div>

              <div
                className={`
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  ${card.bg}
                  transition-transform
                  duration-300
                  group-hover:scale-110
                `}
              >

                <Icon
                  size={28}
                  className={card.color}
                />

              </div>

            </div>

          </div>

        );

      })}

    </div>

  );

}