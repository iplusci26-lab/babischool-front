"use client";

import {
  Eye,
  Pencil,
  Trash2,
  Calendar,
  User,
  Paperclip,
  Clock,
} from "lucide-react";

export default function AnnouncementCard({

  announcement,

  onView,

  onEdit,

  onDelete,

}: any) {

  // =====================================================
  // EXPIRATION
  // =====================================================

  const isExpired = (() => {
    if (!announcement.expire_at) {
      return false;
    }
  
    const expirationDate = new Date(
      announcement.expire_at
    );
  
    // L'annonce reste valide jusqu'à 23:59:59
    // du jour d'expiration.
    expirationDate.setHours(
      23,
      59,
      59,
      999
    );
  
    return expirationDate.getTime() < Date.now();
  })();
  // =====================================================
  // PRIORITÉ
  // =====================================================

  const getPriorityColor = (
    priority: string
  ) => {

    switch (priority) {

      case "important":

        return (
          "bg-orange-100 text-orange-700"
        );

      case "urgent":

        return (
          "bg-red-100 text-red-700"
        );

      default:

        return (
          "bg-gray-100 text-gray-700"
        );
    }
  };


  return (

    <div
      className={`
        relative
        border
        rounded-3xl
        p-5
        shadow-sm
        transition
        ${
          isExpired
            ? "bg-gray-100 border-gray-300 opacity-75"
            : "bg-white border-gray-200 hover:shadow-md"
        }
      `}
    >

      {/* ================================================= */}
      {/* BADGE EXPIRÉ */}
      {/* ================================================= */}

      {isExpired && (

        <div
          className="
            absolute
            top-4
            right-4
            flex
            items-center
            gap-1.5
            px-3
            py-1
            rounded-full
            bg-gray-700
            text-white
            text-xs
            font-semibold
          "
        >

          <Clock size={13} />

          Expiré

        </div>

      )}


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex items-start justify-between">

        <div
          className={
            isExpired
              ? "pr-20"
              : ""
          }
        >

          <h3
            className={`
              font-bold
              text-lg
              ${
                isExpired
                  ? "text-gray-500"
                  : "text-gray-900"
              }
            `}
          >

            {announcement.title}

          </h3>

          <p className="text-sm text-gray-500 mt-1">

            {announcement.category}

          </p>

        </div>


        {!isExpired && (

          <span
            className={`
              px-3
              py-1
              rounded-full
              text-xs
              font-medium
              ${getPriorityColor(
                announcement.priority
              )}
            `}
          >

            {announcement.priority}

          </span>

        )}

      </div>


      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <p
        className={`
          mt-4
          line-clamp-3
          ${
            isExpired
              ? "text-gray-500"
              : "text-gray-600"
          }
        `}
      >

        {announcement.content}

      </p>


      {/* ================================================= */}
      {/* META */}
      {/* ================================================= */}

      <div className="mt-5 space-y-2 text-sm text-gray-500">

        <div className="flex items-center gap-2">

          <User size={14} />

          {announcement.created_by_name}

        </div>


        <div className="flex items-center gap-2">

          <Calendar size={14} />

          {new Date(
            announcement.publish_at
          ).toLocaleDateString()}

        </div>


        {/* DATE D'EXPIRATION */}

        {announcement.expire_at && (

          <div
            className={`
              flex
              items-center
              gap-2
              ${
                isExpired
                  ? "text-red-600 font-medium"
                  : ""
              }
            `}
          >

            <Clock size={14} />

            {isExpired
              ? "Expiré le "
              : "Expire le "
            }

            {new Date(
              announcement.expire_at
            ).toLocaleDateString()}

          </div>

        )}


        {announcement.attachment && (

          <div className="flex items-center gap-2">

            <Paperclip size={14} />

            Pièce jointe

          </div>

        )}

      </div>


      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div className="mt-6 flex items-center justify-end gap-2">

        <button
          onClick={onView}
          className="
            h-10
            w-10
            rounded-xl
            border
            flex
            items-center
            justify-center
            hover:bg-gray-50
          "
        >

          <Eye size={18} />

        </button>


        <button
          onClick={() =>
            onEdit?.(
              announcement
            )
          }
          className="
            h-10
            w-10
            rounded-xl
            border
            flex
            items-center
            justify-center
            hover:bg-blue-50
            text-blue-600
          "
        >

          <Pencil size={18} />

        </button>


        <button
          onClick={() =>
            onDelete?.(
              announcement
            )
          }
          className="
            h-10
            w-10
            rounded-xl
            border
            flex
            items-center
            justify-center
            hover:bg-red-50
            text-red-600
          "
        >

          <Trash2 size={18} />

        </button>

      </div>

    </div>
  );
}