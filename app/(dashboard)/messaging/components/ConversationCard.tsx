"use client";

import {

  User,

  Clock

} from "lucide-react";

interface Props {

  conversation: any;

  onClick: () => void;
}

export default function ConversationCard({

  conversation,

  onClick

}: Props) {

  const formatDate = (
    date: string
  ) => {

    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "fr-FR",
      {

        day: "2-digit",

        month: "2-digit",

        year: "numeric"
      }
    );
  };

  return (

    <button
      onClick={onClick}
      className="w-full bg-white border rounded-3xl p-5 hover:shadow-md hover:border-indigo-200 transition text-left"
    >

      <div className="flex items-start gap-4">

        {/* AVATAR */}

        <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">

          <User
            size={24}
            className="text-indigo-600"
          />

        </div>

        {/* CONTENT */}

        <div className="flex-1 min-w-0">

          <div className="flex items-start justify-between gap-3">

            <div>

              <h3 className="font-bold text-gray-900 truncate">

                {conversation?.student_name}

              </h3>

              {conversation.parent_name && (

                <p className="text-sm text-gray-500 truncate">

                  Parent :
                  {" "}
                  {conversation.parent_name}

                </p>

              )}

            </div>

            {conversation.last_message_date && (

              <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">

                <Clock size={12} />

                {formatDate(
                  conversation.last_message_date
                )}

              </div>

            )}

          </div>

          {/* DERNIER MESSAGE */}

          <div className="mt-3 flex items-center justify-between gap-3">

            <p className="text-sm text-gray-600 truncate flex-1">

              {conversation.last_message ||
                "Aucun message"}

            </p>

            {(conversation.unread_count ?? 0) > 0 && (

              <div className="min-w-[24px] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">

                {conversation.unread_count}

              </div>

            )}

          </div>

        </div>

      </div>

    </button>
  );
}