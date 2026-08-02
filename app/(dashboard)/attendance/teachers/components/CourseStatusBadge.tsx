import { CourseStatus } from "../types";

interface CourseStatusBadgeProps {
  status: CourseStatus;
}

const STATUS_CONFIG: Record<
  CourseStatus,
  {
    label: string;
    className: string;
  }
> = {
  upcoming: {
    label: "À venir",
    className:
      "bg-blue-100 text-blue-800 border border-blue-200",
  },
  running: {
    label: "En cours",
    className:
      "bg-green-100 text-green-800 border border-green-200",
  },
  finished: {
    label: "Terminé",
    className:
      "bg-gray-100 text-gray-800 border border-gray-200",
  },
};

export default function CourseStatusBadge({
  status,
}: CourseStatusBadgeProps) {
  const config = STATUS_CONFIG[status]  ??
  {
    label: "Inconnu",
    className: "bg-gray-100 text-gray-700",
  };
  console.log(status)
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}