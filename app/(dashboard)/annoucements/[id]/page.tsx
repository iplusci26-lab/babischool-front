"use client";

import { api } from "@/lib/api";

import {
  ArrowLeft,
  Paperclip,
  User,
  Calendar
} from "lucide-react";

import Link from "next/link";

import {
  useParams
} from "next/navigation";

import {
  useEffect,
  useState
} from "react";

export default function AnnouncementDetailPage() {

  const { id } =
    useParams();

  const [
    announcement,
    setAnnouncement
  ] = useState<any>(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const loadAnnouncement =
    async () => {

      try {

        const res =
          await api.get(
            `/announcements/${id}/`
          );

        setAnnouncement(
          res.data
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    loadAnnouncement();

  }, []);

  if (loading) {

    return (

      <div className="p-6">

        Chargement...

      </div>
    );
  }

  if (!announcement) {

    return (

      <div className="p-6">

        Annonce introuvable

      </div>
    );
  }

  return (

    <div className="space-y-6">

      <Link
        href="/annoucements"
        className="
        inline-flex
        items-center
        gap-2
        text-indigo-600
        "
      >

        <ArrowLeft size={18} />

        Retour

      </Link>

      <div className="
      bg-white
      rounded-3xl
      border
      p-8
      ">

        <div className="
        flex
        items-start
        justify-between
        gap-4
        ">

          <div>

            <h1 className="
            text-3xl
            font-bold
            ">
              {announcement.title}
            </h1>

            <div className="
            flex
            flex-wrap
            gap-5
            mt-4
            text-sm
            text-gray-500
            ">

              <div className="
              flex
              items-center
              gap-2
              ">

                <User size={16} />

                {
                  announcement.created_by_name
                }

              </div>

              <div className="
              flex
              items-center
              gap-2
              ">

                <Calendar size={16} />

                {new Date(
                  announcement.publish_at
                ).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }
                )}

              </div>

            </div>

          </div>

          <span
            className="
            px-3
            py-1
            rounded-full
            bg-indigo-100
            text-indigo-700
            text-sm
            "
          >
            {
              announcement.category
            }
          </span>

        </div>

        <div className="
        mt-8
        prose
        max-w-none
        ">

          <p className="
          whitespace-pre-line
          text-gray-700
          ">
            {
              announcement.content
            }
          </p>

        </div>

        {announcement.attachment && (

          <div className="
          mt-8
          border-t
          pt-6
          ">

            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}${announcement.attachment}`}
              target="_blank"
              rel="noreferrer"
              className="
              inline-flex
              items-center
              gap-2
              text-indigo-600
              hover:underline
              "
            >

              <Paperclip
                size={18}
              />

              Télécharger la pièce jointe

            </a>

          </div>

        )}

      </div>

    </div>
  );
}