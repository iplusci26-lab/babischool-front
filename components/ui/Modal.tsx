"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";


interface ModalProps {
  open: boolean;

  title: string;

  children: ReactNode;

  onClose: () => void;

  footer?: ReactNode;

  maxWidth?: string;
}


export default function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  maxWidth = "max-w-2xl",
}: ModalProps) {

  if (!open) return null;


  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-start
        justify-center
        overflow-y-auto
        bg-black/50
        p-3
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
    >

      <div
        className={`
          flex
          w-full
          ${maxWidth}
          max-h-[calc(100vh-1.5rem)]
          flex-col
          overflow-hidden
          rounded-xl
          bg-white
          shadow-xl
          sm:max-h-[90vh]
          sm:rounded-2xl
        `}
      >

        {/* ==================================================
         * HEADER
         * ================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-4
            border-b
            px-4
            py-3
            sm:px-6
            sm:py-4
          "
        >

          <h2
            className="
              truncate
              text-base
              font-semibold
              text-gray-900
              sm:text-lg
            "
          >

            {title}

          </h2>


          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="
              flex
              h-9
              w-9
              shrink-0
              cursor-pointer
              items-center
              justify-center
              rounded-lg
              transition
              hover:bg-gray-100
            "
          >

            <X size={20} />

          </button>

        </div>


        {/* ==================================================
         * BODY
         * ================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            p-4
            sm:p-6
          "
        >

          {children}

        </div>


        {/* ==================================================
         * FOOTER
         * ================================================== */}

        {footer && (

          <div
            className="
              flex
              shrink-0
              justify-end
              gap-3
              border-t
              bg-white
              px-4
              py-3
              sm:px-6
              sm:py-4
            "
          >

            {footer}

          </div>

        )}

      </div>

    </div>

  );

}