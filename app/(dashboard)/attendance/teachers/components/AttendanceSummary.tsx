import { TeacherAttendanceSummary } from "../types";

interface AttendanceSummaryProps {
  summary: TeacherAttendanceSummary;
}

export default function AttendanceSummary({
  summary,
}: AttendanceSummaryProps) {
  const cards = [
    {
      title: "Cours",
      value: summary.total_courses,
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      valueColor: "text-purple-900",
    },
    {
      title: "Présents",
      value: summary.present,
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      valueColor: "text-green-900",
    },
    {
      title: "Retards",
      value: summary.late,
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      valueColor: "text-orange-900",
    },
    {
      title: "Absents",
      value: summary.absent,
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      valueColor: "text-red-900",
    },
    {
      title: "En attente",
      value: summary.pending,
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      valueColor: "text-yellow-900",
    },
    {
      title: "Justifiés",
      value: summary.justified,
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      valueColor: "text-blue-900",
    },
    {
      title: "Non justifiés",
      value: summary.unjustified,
      bg: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-700",
      valueColor: "text-pink-900",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl border ${card.border} ${card.bg} p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}
        >
          <p className={`text-sm font-medium ${card.text}`}>
            {card.title}
          </p>

          <p className={`mt-2 text-3xl font-bold ${card.valueColor}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}