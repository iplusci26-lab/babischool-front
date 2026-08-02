import { JustificationStatus } from "../types";

interface JustificationActionButtonsProps {
  status: JustificationStatus;
  loading?: boolean;
  onJustify: (
    status: "justified" | "unjustified"
  ) => void;
}

const BUTTONS = [
  {
    value: "justified" as const,
    label: "Justifier",
    className:
      "border-green-300 text-green-700 hover:bg-green-50",
    activeClassName:
      "border-green-600 bg-green-600 text-white",
  },
  {
    value: "unjustified" as const,
    label: "Non justifier",
    className:
      "border-red-300 text-red-700 hover:bg-red-50",
    activeClassName:
      "border-red-600 bg-red-600 text-white",
  },
];

export default function JustificationActionButtons({
  status,
  loading = false,
  onJustify,
}: JustificationActionButtonsProps) {
  // Rien à afficher si aucune justification n'est nécessaire
  if (status === "not_required") {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {BUTTONS.map((button) => {
        const isActive = status === button.value;

        return (
          <button
            key={button.value}
            type="button"
            disabled={loading}
            onClick={() => onJustify(button.value)}
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