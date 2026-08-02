import { JustificationStatus } from "../types";

interface JustificationStatusBadgeProps {
  status: JustificationStatus;
}

const STATUS_CONFIG: Record<
  Exclude<JustificationStatus, null>,
  {
    label: string;
    className: string;
  }
> = {
  not_required: {
    label: "Justification non requise",
    className:
      "bg-gray-100 text-gray-800 border border-gray-200",
  },
  pending: {
    label: "En attente de justification",
    className:
      "bg-orange-100 text-orange-800 border border-orange-200",
  },
  justified: {
    label: "Justifiée",
    className:
      "bg-green-100 text-green-800 border border-green-200",
  },
  unjustified: {
    label: "Non justifiée",
    className:
      "bg-red-100 text-red-800 border border-red-200",
  },
};

export default function JustificationStatusBadge({
  status,
}: JustificationStatusBadgeProps) {
  if (!status) {
    return (
      <span className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
        -
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