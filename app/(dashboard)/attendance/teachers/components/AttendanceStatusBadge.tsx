import { AttendanceStatus } from "../types";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
}

const STATUS_CONFIG: Record<
  Exclude<AttendanceStatus, null>,
  {
    label: string;
    className: string;
  }
> = {
  present: {
    label: "Présent",
    className:
      "bg-green-100 text-green-800 border border-green-200",
  },
  late: {
    label: "Retard",
    className:
      "bg-yellow-100 text-yellow-800 border border-yellow-200",
  },
  absent: {
    label: "Absent",
    className:
      "bg-red-100 text-red-800 border border-red-200",
  },
};

export default function AttendanceStatusBadge({
  status,
}: AttendanceStatusBadgeProps) {
  if (!status) {
    return (
      <span className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
        Non marqué
      </span>
    );
  }

  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}