"use client";

import Image from "next/image";
import {
  Mail,
  Phone,
  User,
  Calendar,
  BadgeCheck,
} from "lucide-react";

interface TeacherHeaderProps {
  teacher: any;
}

export default function TeacherHeader({
  teacher,
}: TeacherHeaderProps) {
  if (!teacher) return null;

  const initials = `${teacher.first_name?.[0] ?? ""}${
    teacher.last_name?.[0] ?? ""
  }`;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Bandeau */}
      <div className="h-2 bg-[#6214BE]" />

      <div className="p-6">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Partie gauche */}

          <div className="flex items-center gap-5">

            {teacher.avatar ? (
              <Image
                src={teacher.avatar}
                alt={`${teacher.last_name} ${teacher.first_name}`}
                width={88}
                height={88}
                className="h-22 w-22 rounded-full border-4 border-[#6214BE]/10 object-cover"
              />
            ) : (
              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#6214BE]/10 text-3xl font-bold text-[#6214BE]">
                {initials.toUpperCase()}
              </div>
            )}

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-2xl font-bold text-gray-900">
                {teacher.last_name} {teacher.first_name}
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  <BadgeCheck size={14} />
                  Actif
                </span>

              </div>

              <div className="mt-2 flex items-center gap-2 text-gray-500">

                <User size={16} />

                <span>Enseignant</span>

              </div>

            </div>

          </div>

          {/* Partie droite */}

          <div className="grid gap-3 text-sm text-gray-600">

            <div className="flex items-center gap-2">
              <Phone
                size={16}
                className="text-[#6214BE]"
              />
              <span>{teacher.phone || "-"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail
                size={16}
                className="text-[#6214BE]"
              />
              <span>{teacher.email || "-"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar
                size={16}
                className="text-[#6214BE]"
              />
              <span>
                Depuis{" "}
                {teacher.date_joined
                  ? new Date(
                      teacher.date_joined
                    ).toLocaleDateString("fr-FR")
                  : "-"}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}