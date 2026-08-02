"use client";

import { useState } from "react";

import StudentAttendanceSummary from "./components/StudentAttendanceSummary";
import StudentAttendanceSessionCard from "./components/StudentAttendanceSessionCard";
import StudentAttendanceFilters from "./components/StudentAttendanceFilters";
import EmptyAttendance from "./components/EmptyAttendance";

import { useStudentAttendance } from "./hooks/useStudentAttendance";

export default function StudentAttendancePage() {

  const {
    dashboard,
    classrooms,
    loading,
    submitting, 
    error,

    selectedClassroom,
    selectedDate,

    setSelectedClassroom,
    setSelectedDate,
    handleStartAttendance,
    handleAttendance,
    handleJustification,
  } = useStudentAttendance();

  const [activeTab, setActiveTab] = useState<
    "attendance" | "history"
  >("attendance");

  



  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">
          Chargement...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ===========================
            HEADER
      =========================== */}

      <div>

        <h1 className="text-2xl font-bold text-gray-900">
          Présence des élèves
        </h1>

        <p className="mt-1 text-sm text-gray-500">
        Effectuez l'appel des élèves par classe et par séance de cours.
        Les données affichées correspondent au contexte sélectionné ci-dessous.
        </p>

      </div>

      {/* ===========================
            TABS
      =========================== */}

      <div className="flex rounded-xl bg-gray-100 p-1 w-fit">

        <button
          onClick={() => setActiveTab("attendance")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            activeTab === "attendance"
              ? "bg-[#6214BE] text-white shadow"
              : "text-gray-600 hover:text-[#6214BE]"
          }`}
        >
          Appel
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            activeTab === "history"
              ? "bg-[#6214BE] text-white shadow"
              : "text-gray-600 hover:text-[#6214BE]"
          }`}
        >
          Historique
        </button>

      </div>

      {/* ===========================
            FILTRES
      =========================== */}

      <StudentAttendanceFilters
        classrooms={classrooms}
        selectedClassroom={selectedClassroom}
        selectedDate={selectedDate}
        sessionCount={dashboard?.summary.total_sessions ?? 0}
        onClassroomChange={setSelectedClassroom}
        onDateChange={setSelectedDate}
      />

      {/* ===========================
            APPEL
      =========================== */}

      {activeTab === "attendance" && (

        <>

          {dashboard && (
            <StudentAttendanceSummary
              summary={dashboard.summary}
            />
          )}

          {!selectedClassroom ? (

            <div className="rounded-xl border bg-white p-10 text-center text-gray-500">

              Sélectionnez une classe pour afficher
              les cours du jour.

            </div>

          ) : dashboard?.sessions.length === 0 ? (

            <EmptyAttendance />

          ) : (

            <div className="space-y-5">

              {dashboard?.sessions.map((session) => (

                <StudentAttendanceSessionCard
                  key={session.session_id ?? `schedule-${session.schedule_id}`}
                  session={session}
                  loading={submitting}
                  onStartAttendance={handleStartAttendance}
                  onAttendanceChange={handleAttendance}
                 
                />

              ))}
   
            </div>

          )}

        </>

      )}

      {/* ===========================
            HISTORIQUE
      =========================== */}

      {activeTab === "history" && (

        <div className="rounded-xl border bg-white p-10 text-center text-gray-500">

          L'historique sera disponible dans une prochaine version.

        </div>

      )}

    </div>
  );

}