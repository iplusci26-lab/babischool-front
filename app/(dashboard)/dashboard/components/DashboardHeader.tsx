"use client";

import {
  CalendarDays,
  School,
} from "lucide-react";

interface DashboardHeaderProps {
  schoolName?: string;
}

export default function DashboardHeader({
  schoolName,
}: DashboardHeaderProps) {

  const today = new Date();

  const formattedDate =
    today.toLocaleDateString(
      "fr-FR",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  return (

    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">

      <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Gauche */}

        <div>

          <span className="text-sm font-medium uppercase tracking-wider text-[#6214BE]">

            Tableau de bord

          </span>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">

            Bonjour 👋

          </h1>

          <p className="mt-3 max-w-2xl text-gray-500">

            Bienvenue sur votre espace de contrôle et de supervision des activités dans votre établissement.
            Consultez les statistiques et les données essentielles.

            

          </p>

        </div>

        {/* Droite */}

        <div className="flex flex-col gap-4">

          <div className="flex items-center gap-3 rounded-2xl bg-[#6214BE]/5 px-5 py-4">

            <School
              size={22}
              className="text-[#6214BE]"
            />

            <div>

              <p className="text-xs uppercase tracking-wide text-gray-500">

                Établissement

              </p>

              <p className="font-semibold text-gray-900">

                {schoolName || "BabiSchool"}

              </p>

            </div>

          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-5 py-4">

            <CalendarDays
              size={22}
              className="text-[#6214BE]"
            />

            <div>

              <p className="text-xs uppercase tracking-wide text-gray-500">

                Aujourd'hui

              </p>

              <p className="font-medium capitalize text-gray-800">

                {formattedDate}

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}