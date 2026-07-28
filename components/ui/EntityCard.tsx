"use client";

import { Edit, Trash2 } from "lucide-react";
import { ReactNode } from "react";

interface EntityCardProps {
  title: string;

  subtitle?: string;

  description?: string;

  badge?: ReactNode;

  footer?: ReactNode;

  selected?: boolean;

  children?: ReactNode;

  onClick?: () => void;

  onEdit?: () => void;

  onDelete?: () => void;
}

export default function EntityCard({
  title,
  subtitle,
  description,
  badge,
  footer,
  children,
  selected = false,
  onClick,
  onEdit,
  onDelete,
}: EntityCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        group
        rounded-xl
        border
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200

        ${
          onClick ? "cursor-pointer" : ""
        }

        ${
          selected
            ? "border-violet-600 ring-2 ring-violet-100"
            : "border-gray-200 hover:border-violet-300 hover:shadow-md"
        }
      `}
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex-1 min-w-0">

          <h3 className="truncate text-lg font-semibold text-gray-900">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}

          {description && (
            <p className="mt-2 text-sm text-gray-600">
              {description}
            </p>
          )}

        </div>

        {badge && (
          <div className="shrink-0">
            {badge}
          </div>
        )}

      </div>

      {/* Content */}

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}

      {/* Footer */}

      {(footer || onEdit || onDelete) && (
        <div className="mt-5 flex items-center justify-between border-t pt-4">

          <div>
            {footer}
          </div>

          <div className="flex items-center gap-2">

            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="
                  rounded-lg
                  p-2
                  text-blue-600
                  transition-colors
                  hover:bg-blue-50
                "
              >
                <Edit size={18} />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="
                  rounded-lg
                  p-2
                  text-red-600
                  transition-colors
                  hover:bg-red-50
                "
              >
                <Trash2 size={18} />
              </button>
            )}

          </div>

        </div>
      )}

    </div>
  );
}