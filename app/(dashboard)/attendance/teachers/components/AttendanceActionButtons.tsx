import { AttendanceStatus } from "../types";

interface AttendanceActionButtonsProps {
  value: AttendanceStatus;
  loading?: boolean;
  onChange: (
    status: Exclude<AttendanceStatus, null>
  ) => void;
}

const BUTTONS: {
  value: Exclude<AttendanceStatus, null>;
  label: string;
  className: string;
  activeClassName: string;
}[] = [
  {
    value: "present",
    label: "Présent",
    className:
      "border-green-300 text-green-700 hover:bg-green-50",
    activeClassName:
      "bg-green-600 text-white border-green-600",
  },
  {
    value: "late",
    label: "Retard",
    className:
      "border-yellow-300 text-yellow-700 hover:bg-yellow-50",
    activeClassName:
      "bg-yellow-500 text-white border-yellow-500",
  },
  {
    value: "absent",
    label: "Absent",
    className:
      "border-red-300 text-red-700 hover:bg-red-50",
    activeClassName:
      "bg-red-600 text-white border-red-600",
  },
];

export default function AttendanceActionButtons({
  value,
  loading = false,
  onChange,
}: AttendanceActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {BUTTONS.map((button) => {
        const isActive = value === button.value;

        return (
          <button
            key={button.value}
            type="button"
            disabled={loading}
            onClick={() => onChange(button.value)}
            className={`
              rounded-lg
              border
              px-4
              py-2
              text-sm
              font-medium
              transition-colors
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${
                isActive
                  ? button.activeClassName
                  : button.className
              }
            `}
          >
            {button.label}
          </button>
        );
      })}
    </div>
  );
}