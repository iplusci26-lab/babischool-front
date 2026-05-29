"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

const DAY_LABELS: any = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
};

export default function TeacherSchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const extract = (res: any) => res.data.results || res.data;

  // 🎯 Couleurs par matière
  const getColor = (subject: string) => {
    const colors: any = {
      Math: "bg-blue-100",
      English: "bg-green-100",
      Physics: "bg-yellow-100",
      SVT: "bg-pink-100",
    };

    return colors[subject] || "bg-gray-100";
  };

  // 🔄 Load user + schedule
  useEffect(() => {
    const load = async () => {
      try {
        const me = await api.get("/auth/me/");
        const currentUser = me.data;

        setUser(currentUser);

        // 🔥 AUTO TEACHER
        if (currentUser.user_type === "teacher" || currentUser.user_type === "admin") {
          const res = await api.get(
            `/academics/schedules/?teacher_id=${currentUser.id}`
          );
          setSchedules(extract(res));
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 📦 Grouper par jour
  const getByDay = (day: string) => {
    return schedules
      .filter((s) => s.weekday === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  if (loading) {
    
    return <div className="p-6">Chargement...</div>;
  }
  
  if (!user || user.user_type !== "teacher" && user.user_type !== "admin") {
    return (
      <div className="p-6 text-red-500">
        Accès réservé aux professeurs
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">

      <h1 className="text-xl font-bold">
        Mon emploi du temps
      </h1>

      {/* 🧑‍🏫 INFO PROF */}
      <div className="bg-white p-4 rounded border">
        <div className="font-medium">
          {user.first_name} {user.last_name}
        </div>
        <div className="text-sm text-gray-500">
          Enseignant
        </div>
      </div>

      {/* 📅 GRID RESPONSIVE */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {DAYS.map((day) => (
          <div
            key={day}
            className="bg-white p-4 rounded border"
          >
            <h2 className="font-bold mb-3">
              {DAY_LABELS[day]}
            </h2>

            {getByDay(day).length === 0 && (
              <div className="text-sm text-gray-400">
                Aucun cours
              </div>
            )}

            {getByDay(day).map((s: any) => (
              <div
                key={s.id}
                className={`p-3 rounded mb-2 text-sm ${getColor(
                  s.subject_name
                )}`}
              >
                <div className="font-medium">
                  {s.start_time} - {s.end_time}
                </div>

                <div>{s.subject_name}</div>

                <div className="text-xs text-gray-600">
                  {s.classroom_name}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}