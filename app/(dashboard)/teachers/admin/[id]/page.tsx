"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { api } from "@/lib/api";

import TeacherHeader from "./components/TeacherHeader";
import TeacherSubjects from "./components/TeacherSubjects";
import TeacherSchedule from "./components/TeacherSchedule";
import TeacherStats from "./components/TeacherStats";

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
];

export default function TeacherDetailPage() {

  const { id } = useParams();

  const [teacher, setTeacher] =
    useState<any>(null);

  const [schedules, setSchedules] =
    useState<any[]>([]);

  const [assignments, setAssignments] =
    useState<any[]>([]);

  const [activeTab, setActiveTab] =
    useState<"subjects" | "schedule">(
      "subjects"
    );

  const extract = (res: any) =>
    res.data.results || res.data;

  useEffect(() => {

    if (!id) {
      return;
    }

    load();

  }, [id]);

  const load = async () => {

    try {

      // ======================================================
      // ENSEIGNANT
      // ======================================================

      const teachers =
        await api.get(
          "/academics/teachers/"
        );

      const teacherList =
        extract(teachers);

      const found =
        teacherList.find(
          (t: any) =>
            t.id === id
        );

      setTeacher(found);

      // ======================================================
      // SÉANCES DE L'ENSEIGNANT
      // ======================================================

      /*
       * IMPORTANT :
       *
       * Le backend attend ?teacher=
       *
       * et NON ?teacher_id=
       */

      const schedulesRes =
        await api.get(
          `/academics/schedules/?teacher=${id}`
        );

      const teacherSchedules =
        extract(schedulesRes);

      setSchedules(
        teacherSchedules
      );

      console.log(
        "SÉANCES ENSEIGNANT :",
        teacherSchedules
      );

      // ======================================================
      // AFFECTATIONS DE L'ENSEIGNANT
      // ======================================================

      const assignmentsRes =
        await api.get(
          `/academics/teaching-assignments/?teacher_id=${id}`
        );

      const teacherAssignments =
        extract(assignmentsRes);

      setAssignments(
        teacherAssignments
      );

      console.log(
        "AFFECTATIONS ENSEIGNANT :",
        teacherAssignments
      );

    } catch (error) {

      console.error(
        "Erreur chargement enseignant :",
        error
      );

    }

  };

  // ========================================================
  // FILTRER PAR JOUR
  // ========================================================

  const getByDay = (
    day: string
  ) =>
    schedules
      .filter(
        (schedule) =>
          schedule.weekday_label === day
      )
      .sort(
        (a, b) =>
          a.start_time.localeCompare(
            b.start_time
          )
      );

  return (

    <div>

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <TeacherHeader
        teacher={teacher}
      />

      {/* ================================================== */}
      {/* STATISTIQUES */}
      {/* ================================================== */}

      <TeacherStats
        assignments={assignments}
        schedules={schedules}
      />

      {/* ================================================== */}
      {/* TABS */}
      {/* ================================================== */}

      <div className="mt-6">

        <div className="rounded-xl bg-gray-100 p-1 flex w-fit">

          <button
            onClick={() =>
              setActiveTab(
                "subjects"
              )
            }
            className={`
              rounded-lg
              px-5
              py-2
              text-sm
              font-medium
              transition
              ${
                activeTab === "subjects"
                  ? "bg-[#6214BE] text-white shadow"
                  : "text-gray-600 hover:text-[#6214BE]"
              }
            `}
          >
            Matières
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "schedule"
              )
            }
            className={`
              rounded-lg
              px-5
              py-2
              text-sm
              font-medium
              transition
              ${
                activeTab === "schedule"
                  ? "bg-[#6214BE] text-white shadow"
                  : "text-gray-600 hover:text-[#6214BE]"
              }
            `}
          >
            Emploi du temps
          </button>

        </div>

      </div>

      {/* ================================================== */}
      {/* MATIÈRES */}
      {/* ================================================== */}

      {activeTab === "subjects" && (

        <TeacherSubjects
          assignments={assignments}
          schedules={schedules}
        />

      )}

      {/* ================================================== */}
      {/* EMPLOI DU TEMPS */}
      {/* ================================================== */}

      {activeTab === "schedule" && (

        <TeacherSchedule
          schedules={schedules}
        />

      )}

    </div>

  );
}