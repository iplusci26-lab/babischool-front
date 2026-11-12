"use client";

import { User, Clock, MessageSquare } from "lucide-react";

interface Props {
  conversation: any;
  onClick: () => void;
}

export default function ConversationCard({
  conversation,
  onClick,
}: Props) {
  const formatDate = (date: string) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Informations du contact
  const contactName =
    conversation?.contact?.name ||
    conversation?.parent_name ||
    "Contact inconnu";

  const contactRole =
    conversation?.contact?.role || "Contact";

  const studentName = conversation?.student_name || "";

  const lastMessage =
    conversation?.last_message || "Aucun message";

  const lastMessageDate =
    conversation?.last_message_date ||
    conversation?.updated_at;

  const unreadCount = Number(conversation?.unread_count || 0);

  return (
    <button
      onClick={onClick}
      className="w-full bg-white border rounded-3xl p-5 hover:shadow-md hover:border-indigo-200 transition text-left"
    >
      <div className="flex items-start gap-4">

        {/* AVATAR */}
        <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
          {conversation?.contact?.avatar ? (
            <img
              src={conversation.contact.avatar}
              alt={contactName}
              className="h-full w-full object-cover"
            />
          ) : (
            <User
              size={24}
              className="text-indigo-600"
            />
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              {/* NOM DU CONTACT */}
              <h3 className="font-bold text-gray-900 truncate">
                {contactName}
              </h3>

              <p className="text-sm text-gray-500 truncate">
                {contactRole}
              </p>

              {/* ÉLÈVE SI DISPONIBLE */}
              {studentName && (
                <p className="text-xs text-gray-400 truncate mt-1">
                  Élève : {studentName}
                </p>
              )}

            </div>

            {/* DATE */}
            {lastMessageDate && (
              <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                <Clock size={12} />
                {formatDate(lastMessageDate)}
              </div>
            )}

          </div>

          {/* DERNIER MESSAGE */}
          <div className="mt-3 flex items-center justify-between gap-3">

            <p className="text-sm text-gray-600 truncate flex-1">
              {lastMessage}
            </p>

            {unreadCount > 0 && (
              <div className="min-w-[24px] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">
                {unreadCount}
              </div>
            )}

          </div>

        </div>
      </div>
    </button>
  );
}
