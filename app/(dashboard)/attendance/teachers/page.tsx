"use client";

import AttendanceCard from "./components/AttendanceCard";
import AttendanceSummary from "./components/AttendanceSummary";
import EmptyAttendance from "./components/EmptyAttendance";
import { useState } from "react";
import { useTeacherAttendance } from "./hooks/useTeacherAttendance";

export default function TeacherAttendancePage() {

  const [activeTab, setActiveTab] = useState<"courses" | "history">("courses");


  const {
    dashboard,
    loading,
    submitting,
    error,
    handleAttendance,
    handleJustification,
  } = useTeacherAttendance();

  // TODO: Remplacer par les permissions/RBAC
  const canJustify = false;

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

  if (!dashboard) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Présence des enseignants
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Gérez les présences et les justifications
          des enseignants pour les cours du jour.
        </p>
      </div>


      <div className="flex rounded-xl bg-gray-100 p-1 w-fit">

        <button
          onClick={() => setActiveTab("courses")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            activeTab === "courses"
              ? "bg-[#6214BE] text-white shadow"
              : "text-gray-600 hover:text-[#6214BE]"
          }`}
        >
          Cours du jour
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
            activeTab === "history"
              ? "bg-[#6214BE] text-white shadow"
              : "text-gray-600 hover:text-[#6214BE]"
          }`}
        >
          Historique des validations
        </button>

      </div>

      {activeTab === "courses" && (
  <>
        <AttendanceSummary summary={dashboard.summary} />

        <h2 className="text-lg font-semibold text-gray-900">
          Cours du jour
        </h2>

        
      {dashboard.courses?.length === 0 ? (
        <EmptyAttendance />
      ) : (
        <div className="space-y-4">
          {dashboard.courses.map((course) => (
            <AttendanceCard
              key={course.schedule_id}
              course={course}
              loading={submitting}
              canJustify={canJustify}
              onAttendanceChange={
                handleAttendance
              }
              onJustificationChange={
                handleJustification
              }
            />
          ))}
        </div>
      )}

        {dashboard.pending_justifications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Justifications en attente
            </h2>

            {dashboard.pending_justifications.map((attendance) => (
              <div
                key={attendance.attendance_id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold">
                  {attendance.teacher_first_name} {attendance.teacher_last_name}
                </h3>

                <p className="text-sm text-gray-500">
                  {attendance.subject_name}
                </p>

                <p className="mt-2 text-sm">
                  Classe : {attendance.classroom_name}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    disabled={submitting}
                    onClick={() =>
                      handleJustification(
                        attendance.attendance_id,
                        "justified"
                      )
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Justifier
                  </button>

                  <button
                    disabled={submitting}
                    onClick={() =>
                      handleJustification(
                        attendance.attendance_id,
                        "unjustified"
                      )
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Non justifié
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    )}

      

      {activeTab === "history" && (
        <>

          {dashboard.validated_justifications.length === 0 ? (

            <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
              Aucune validation enregistrée.
            </div>

          ) : (

            <div className="space-y-4">

              {dashboard.validated_justifications.map((attendance) => (

                <div
                  key={attendance.attendance_id}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >

                  <h3 className="font-semibold">
                    {attendance.teacher_name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {attendance.subject_name}
                  </p>

                  <p className="mt-2">
                    {attendance.justification_status === "justified"
                      ? "✅ Justifié"
                      : "❌ Non justifié"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Validé par : {attendance.validated_by_name ?? "-"}
                  </p>

                </div>

              ))}

            </div>

          )}

        </>
      )}

    </div>
  );
}