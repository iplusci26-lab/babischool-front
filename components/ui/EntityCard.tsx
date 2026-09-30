
"use client";

import { Edit, Trash2, Loader2 } from "lucide-react";
import { ReactNode, useRef, useState } from "react";

interface EntityCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: ReactNode;
  footer?: ReactNode;
  selected?: boolean;
  children?: ReactNode;

  onClick?: () => void;
  onEdit?: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
}

type Action = "edit" | "delete";

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
  const [loadingAction, setLoadingAction] =
    useState<Action | null>(null);

  // Empêche les doubles clics avant même le prochain rendu React.
  const actionLock = useRef(false);

  const handleAction = async (
    action: Action,
    callback: (() => void | Promise<void>) | undefined,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (!callback || actionLock.current) return;

    actionLock.current = true;
    setLoadingAction(action);

    try {
      await callback();
    } catch (error) {
      console.error(
        `Erreur lors de l'action ${action} :`,
        error
      );
    } finally {
      actionLock.current = false;
      setLoadingAction(null);
    }
  };

  const isBusy = loadingAction !== null;

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
        ${onClick ? "cursor-pointer" : ""}
        ${
          selected
            ? "border-violet-600 ring-2 ring-violet-100"
            : "border-gray-200 hover:border-violet-300 hover:shadow-md"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
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
          <div className="shrink-0">{badge}</div>
        )}
      </div>

      {/* Content */}
      {children && (
        <div className="mt-4">{children}</div>
      )}

      {/* Footer and actions */}
      {(footer || onEdit || onDelete) && (
        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <div>{footer}</div>

          <div className="flex items-center gap-2">
            {/* Edit button */}
            {onEdit && (
              <button
                type="button"
                disabled={isBusy}
                aria-label={
                  loadingAction === "edit"
                    ? "Modification en cours"
                    : "Modifier"
                }
                title={
                  loadingAction === "edit"
                    ? "Modification en cours..."
                    : "Modifier"
                }
                onClick={(e) =>
                  void handleAction("edit", onEdit, e)
                }
                className="
                  rounded-lg
                  p-2
                  text-blue-600
                  transition-colors
                  hover:bg-blue-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loadingAction === "edit" ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Edit size={18} />
                )}
              </button>
            )}

            {/* Delete button */}
            {onDelete && (
              <button
                type="button"
                disabled={isBusy}
                aria-label={
                  loadingAction === "delete"
                    ? "Suppression en cours"
                    : "Supprimer"
                }
                title={
                  loadingAction === "delete"
                    ? "Suppression en cours..."
                    : "Supprimer"
                }
                onClick={(e) =>
                  void handleAction("delete", onDelete, e)
                }
                className="
                  rounded-lg
                  p-2
                  text-red-600
                  transition-colors
                  hover:bg-red-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loadingAction === "delete" ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}