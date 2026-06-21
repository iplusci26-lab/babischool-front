"use client";

import {

  X,

  Calendar,

  User,

  AlertTriangle,

  Paperclip,

  Tag,

  Users,

} from "lucide-react";

export default function AnnouncementDetailModal({

  announcement,

  onClose,

}: any) {

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

  const targetLabel = (

    target: any

  ) => {

    switch (
      target.target_type
    ) {

      case "school":
        return "Toute l'école";

      case "staff":
        return "Personnel";

      case "teachers":
        return "Enseignants";

      case "parents":
        return "Parents";

      case "role":
        return (
          target.role_name ||
          "Rôle"
        );

      case "classroom":
        return (
          target.classroom_name ||
          "Classe"
        );

      case "level":
        return (
          target.classroom_level_name ||
          "Niveau"
        );

      case "cycle":
        return (
          target.cycle_name ||
          "Cycle"
        );

      default:
        return target.target_type;
    }
  };

  return (

    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex justify-between">

          <div>

            <h2 className="text-3xl font-bold">

              {announcement.title}

            </h2>

            <div className="flex items-center gap-3 mt-3">

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getPriorityColor(
                        announcement.priority
                      )
                }`}
              >

                {announcement.priority}

              </span>

              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">

                {announcement.category}

              </span>

            </div>

          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
          >

            <X size={20} />

          </button>

        </div>

        {/* BODY */}

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {/* META */}

          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-gray-50 rounded-2xl p-4">

              <div className="flex items-center gap-2 text-gray-600">

                <User size={16} />

                Auteur

              </div>

              <p className="font-medium mt-2">

                {
                  announcement.created_by_name
                }

              </p>

            </div>

            <div className="bg-gray-50 rounded-2xl p-4">

              <div className="flex items-center gap-2 text-gray-600">

                <Calendar size={16} />

                Publication

              </div>

              <p className="font-medium mt-2">

                {new Date(
                  announcement.publish_at
                ).toLocaleString()}

              </p>

            </div>

          </div>

          {/* EXPIRATION */}

          {announcement.expire_at && (

            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">

              <div className="flex items-center gap-2 text-yellow-700">

                <AlertTriangle size={16} />

                Expiration

              </div>

              <p className="mt-2">

                {new Date(
                  announcement.expire_at
                ).toLocaleString()}

              </p>

            </div>
          )}

          {/* CONTENU */}

          <div>

            <div className="flex items-center gap-2 mb-3">

              <Tag size={18} />

              <h3 className="font-semibold">

                Contenu

              </h3>

            </div>

            <div className="bg-gray-50 rounded-2xl p-5 whitespace-pre-wrap leading-relaxed">

              {announcement.content}

            </div>

          </div>

          {/* DESTINATAIRES */}

          <div>

            <div className="flex items-center gap-2 mb-3">

              <Users size={18} />

              <h3 className="font-semibold">

                Destinataires

              </h3>

            </div>

            <div className="flex flex-wrap gap-2">

              {announcement.targets?.map(
                (
                  target: any
                ) => (

                  <span
                    key={target.id}
                    className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm"
                  >

                    {targetLabel(
                      target
                    )}

                  </span>
                )
              )}

            </div>

          </div>

          {/* PIECE JOINTE */}

          {announcement.attachment && (

            <div>

              <div className="flex items-center gap-2 mb-3">

                <Paperclip size={18} />

                <h3 className="font-semibold">

                  Pièce jointe

                </h3>

              </div>

              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}${announcement.attachment}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border hover:bg-gray-50"
              >

                <Paperclip size={16} />

                Ouvrir le document

              </a>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}