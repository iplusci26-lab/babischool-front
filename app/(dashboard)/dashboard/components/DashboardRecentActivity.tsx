"use client";

import {
  UserPlus,
  Wallet,
  GraduationCap,
  ClipboardCheck,
  Bell,
} from "lucide-react";

interface Activity {
  id: string | number;
  title: string;
  description: string;
  time: string;
  type:
    | "payment"
    | "student"
    | "attendance"
    | "homework"
    | "notification";
}

interface DashboardRecentActivityProps {
  activities: Activity[];
}

export default function DashboardRecentActivity({
  activities,
}: DashboardRecentActivityProps) {

  const getIcon = (type: Activity["type"]) => {

    switch (type) {

      case "payment":
        return {
          icon: Wallet,
          bg: "bg-emerald-100",
          color: "text-emerald-700",
        };

      case "student":
        return {
          icon: UserPlus,
          bg: "bg-violet-100",
          color: "text-violet-700",
        };

      case "attendance":
        return {
          icon: ClipboardCheck,
          bg: "bg-green-100",
          color: "text-green-700",
        };

      case "homework":
        return {
          icon: GraduationCap,
          bg: "bg-orange-100",
          color: "text-orange-700",
        };

      default:
        return {
          icon: Bell,
          bg: "bg-blue-100",
          color: "text-blue-700",
        };

    }

  };

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <div className="mb-6">

        <p className="text-sm font-medium text-[#6214BE]">
          Activité récente
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          Derniers événements
        </h2>

      </div>

      {activities.length === 0 ? (

        <div className="py-10 text-center text-gray-500">

          Aucune activité récente.

        </div>

      ) : (

        <div className="space-y-5">

          {activities.map((activity) => {

            const config = getIcon(
              activity.type
            );

            const Icon = config.icon;

            return (

              <div
                key={activity.id}
                className="flex items-start gap-4"
              >

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.bg}`}
                >

                  <Icon
                    size={20}
                    className={config.color}
                  />

                </div>

                <div className="flex-1">

                  <div className="flex items-center justify-between">

                    <p className="font-semibold text-gray-900">

                      {activity.title}

                    </p>

                    <span className="text-xs text-gray-400">

                      {activity.time}

                    </span>

                  </div>

                  <p className="mt-1 text-sm text-gray-500">

                    {activity.description}

                  </p>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>

  );

}