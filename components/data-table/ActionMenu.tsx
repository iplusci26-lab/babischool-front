"use client";

import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface ActionMenuProps {
  actions: ActionMenuItem[];
}

export default function ActionMenu({
  actions,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      className="relative inline-block text-left"
      ref={menuRef}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          rounded-lg
          p-2
          transition
          hover:bg-gray-100
        "
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            z-50
            mt-2
            w-56
            overflow-hidden
            rounded-lg
            border
            border-gray-200
            bg-white
            shadow-lg
          "
        >
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              disabled={action.disabled}
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
              className={`
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-sm
                transition

                ${
                  action.disabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-100"
                }

                ${
                  action.danger
                    ? "text-red-600"
                    : "text-gray-700"
                }
              `}
            >
              {action.icon}

              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}