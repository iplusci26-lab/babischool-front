"use client";

import { X } from "lucide-react";

interface DrawerHeaderProps {

  title: string;

  description?: string;

  onClose: () => void;

}

export default function DrawerHeader({

  title,

  description,

  onClose,

}: DrawerHeaderProps) {

  return (

    <div
      className="
        flex
        items-start
        justify-between
        border-b
        p-6
      "
    >

      <div>

        <h2 className="text-2xl font-bold">

          {title}

        </h2>

        {description && (

          <p className="mt-2 text-gray-500">

            {description}

          </p>

        )}

      </div>

      <button

        onClick={onClose}

        className="
          rounded-xl
          p-2
          transition
          hover:bg-gray-100
        "
      >

        <X size={22} />

      </button>

    </div>

  );

}