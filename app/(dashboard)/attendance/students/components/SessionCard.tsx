"use client";

import {
  BookOpen,
  GraduationCap,
  Clock3,
  Lock,
  Unlock,
} from "lucide-react";

interface SessionCardProps {
  session: any;
}

export default function SessionCard({
  session,
}: SessionCardProps) {
  if (!session) return null;

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">

      <div className="bg-[#6214BE] px-6 py-5 text-white">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              {session.schedule.subject}
            </h2>

            <p className="mt-1 text-purple-100">
              {session.schedule.classroom}
            </p>

          </div>

          {session.is_closed ? (
            <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2">
              <Lock size={16} />
              Session clôturée
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2">
              <Unlock size={16} />
              Session ouverte
            </div>
          )}

        </div>

      </div>

      <div className="grid gap-4 p-6 md:grid-cols-3">

        <div className="flex items-center gap-3">

          <BookOpen
            className="text-[#6214BE]"
            size={20}
          />

          <div>

            <p className="text-xs text-gray-500">
              Matière
            </p>

            <p className="font-medium">
              {session.schedule.subject}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <GraduationCap
            className="text-[#6214BE]"
            size={20}
          />

          <div>

            <p className="text-xs text-gray-500">
              Classe
            </p>

            <p className="font-medium">
              {session.schedule.classroom}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <Clock3
            className="text-[#6214BE]"
            size={20}
          />

          <div>

            <p className="text-xs text-gray-500">
              Horaire
            </p>

            <p className="font-medium">
              {session.schedule.weekday} •{" "}
              {session.schedule.start_time} -{" "}
              {session.schedule.end_time}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}