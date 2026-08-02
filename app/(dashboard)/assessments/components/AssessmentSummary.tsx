"use client";

import {
  ClipboardList,
  FileText,
  PenSquare,
  GraduationCap,
} from "lucide-react";

import { AssessmentSummary as Summary } from "../types";

interface AssessmentSummaryProps {
  summary: Summary;
}

export default function AssessmentSummary({
  summary,
}: AssessmentSummaryProps) {
  
  const cards = [

    {
      title: "Évaluations",
      subtitle: "Toutes catégories",
      value: summary.total,
      icon: ClipboardList,
      bg: "bg-violet-100",
      color: "text-violet-700",
    },

    {
      title: "Interrogations",
      subtitle: "Contrôles rapides",
      value: summary.test,
      icon: PenSquare,
      bg: "bg-blue-100",
      color: "text-blue-700",
    },

    {
      title: "Devoirs",
      subtitle: "Travaux notés",
      value: summary.homework,
      icon: FileText,
      bg: "bg-orange-100",
      color: "text-orange-700",
    },

    {
      title: "Examens",
      subtitle: "Évaluations finales",
      value: summary.exam,
      icon: GraduationCap,
      bg: "bg-green-100",
      color: "text-green-700",
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