"use client";

import { useState } from "react";

import {
  CalendarDays,
  History,
  ClipboardCheck,
} from "lucide-react";

import AttendanceCard from "./components/AttendanceCard";
import AttendanceSummary from "./components/AttendanceSummary";
import EmptyAttendance from "./components/EmptyAttendance";
import AttendanceHistory from "./components/AttendanceHistory";

import { useTeacherAttendance } from "./hooks/useTeacherAttendance";

export default function TeacherAttendancePage() {

  const [activeTab, setActiveTab] = useState<
    "courses" | "absence-history" | "validation-history"
  >("courses");


  const {
    dashboard,
    loading,
    submitting,
    error,
    handleAttendance,
    handleJustification,
  } = useTeacherAttendance();


  // TODO : remplacer par les permissions/RBAC
  const canJustify = false;


  /* ==========================================================
   * LOADING
   * ========================================================== */

  if (loading) {

    return (

      <div className="flex items-center justify-center py-20">

        <p className="text-gray-500">
          Chargement...
        </p>

      </div>

    );

  }


  /* ==========================================================
   * ERROR
   * ========================================================== */

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


      {/* ======================================================
       * HEADER
       * ====================================================== */}

      <div>

        <h1 className="text-2xl font-bold text-gray-900">

          Présence des enseignants

        </h1>

        <p className="mt-1 text-sm text-gray-500">

          Gérez les présences, les absences et les
          justifications des enseignants.

        </p>

      </div>


      {/* ======================================================
       * TABS
       * ====================================================== */}

      <div className="flex w-fit flex-wrap rounded-xl bg-gray-100 p-1">


        {/* ==================================================
         * COURS DU JOUR
         * ================================================== */}

        <button
          type="button"
          onClick={() =>
            setActiveTab("courses")
          }
          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition ${
            activeTab === "courses"
              ? "bg-[#6214BE] text-white shadow"
              : "text-gray-600 hover:text-[#6214BE]"
          }`}
        >

          <CalendarDays size={16} />

          Cours du jour

        </button>


        {/* ==================================================
         * HISTORIQUE DES ABSENCES
         * ================================================== */}

        <button
          type="button"
          onClick={() =>
            setActiveTab("absence-history")
          }
          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition ${
            activeTab === "absence-history"
              ? "bg-[#6214BE] text-white shadow"
              : "text-gray-600 hover:text-[#6214BE]"
          }`}
        >

          <History size={16} />

          Historique des absences

        </button>


        {/* ==================================================
         * HISTORIQUE DES VALIDATIONS
         * ================================================== */}

        <button
          type="button"
          onClick={() =>
            setActiveTab("validation-history")
          }
          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition ${
            activeTab === "validation-history"
              ? "bg-[#6214BE] text-white shadow"
              : "text-gray-600 hover:text-[#6214BE]"
          }`}
        >

          <ClipboardCheck size={16} />

          Historique des validations

        </button>

      </div>


      {/* ======================================================
       * ONGLET : COURS DU JOUR
       * ====================================================== */}

      {activeTab === "courses" && (

        <>

          {/* --------------------------------------------------
           * RÉSUMÉ
           * -------------------------------------------------- */}

          <AttendanceSummary
            summary={dashboard.summary}
          />


          {/* --------------------------------------------------
           * DATE
           * -------------------------------------------------- */}

          <div className="mt-2 flex items-center gap-2 text-md font-bold text-[#6214BE]">

            <CalendarDays size={16} />

            <span>

              Présence du jour :{" "}

              {new Date().toLocaleDateString(
                "fr-FR",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}

            </span>

          </div>


          {/* --------------------------------------------------
           * COURS
           * -------------------------------------------------- */}

          {dashboard.courses?.length === 0 ? (

            <EmptyAttendance />

          ) : (

            <div className="space-y-4">

              {dashboard.courses.map(
                (course) => (

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

                )
              )}

            </div>

          )}


          {/* ==================================================
           * JUSTIFICATIONS EN ATTENTE
           * ================================================== */}

          {dashboard.pending_justifications.length > 0 && (

            <div className="space-y-4">

              <h2 className="text-lg font-semibold text-gray-900">

                Justifications en attente

              </h2>


              {dashboard.pending_justifications.map(
                (attendance) => (

                  <div
                    key={attendance.attendance_id}
                    className="rounded-xl border bg-white p-5 shadow-sm"
                  >

                    <h3 className="font-semibold">

                      {attendance.teacher_first_name}{" "}
                      {attendance.teacher_last_name}

                    </h3>


                    <p className="text-sm text-gray-500">

                      {attendance.subject_name}

                    </p>


                    <p className="mt-2 text-sm">

                      Classe :{" "}
                      {attendance.classroom_name}

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
                        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
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
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                      >

                        Non justifié

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </>

      )}


      {/* ======================================================
       * ONGLET : HISTORIQUE DES ABSENCES
       * ====================================================== */}

      {activeTab === "absence-history" && (

        <AttendanceHistory />

      )}


      {/* ======================================================
       * ONGLET : HISTORIQUE DES VALIDATIONS
       * ====================================================== */}

      {activeTab === "validation-history" && (

        <>

          {dashboard.validated_justifications?.length === 0 ? (

            <div className="rounded-xl border bg-white p-8 text-center text-gray-500">

              <ClipboardCheck
                size={32}
                className="mx-auto mb-3 text-gray-400"
              />

              <p className="font-medium">

                Aucune validation enregistrée.

              </p>

              <p className="mt-1 text-sm">

                Les justifications traitées apparaîtront ici.

              </p>

            </div>

          ) : (

            <div className="space-y-4">


              <div>

                <h2 className="text-lg font-semibold text-gray-900">

                  Historique des validations

                </h2>

                <p className="mt-1 text-sm text-gray-500">

                  Liste des justifications traitées par
                  l'administration.

                </p>

              </div>


              {dashboard.validated_justifications.map(
                (attendance) => (

                  <div
                    key={attendance.attendance_id}
                    className="rounded-xl border bg-white p-5 shadow-sm"
                  >


                    {/* ENSEIGNANT */}

                    <h3 className="font-semibold text-gray-900">

                      {attendance.teacher_name}

                    </h3>


                    {/* MATIÈRE */}

                    <p className="text-sm text-gray-500">

                      {attendance.subject_name}

                    </p>


                    {/* CLASSE */}

                    {attendance.classroom_name && (

                      <p className="mt-2 text-sm text-gray-700">

                        Classe :{" "}

                        {attendance.classroom_name}

                      </p>

                    )}


                    {/* STATUT */}

                    <div className="mt-3">

                      {attendance.justification_status ===
                      "justified" ? (

                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">

                          ✓ Justifié

                        </span>

                      ) : (

                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">

                          ✕ Non justifié

                        </span>

                      )}

                    </div>


                    {/* VALIDATEUR */}

                    <p className="mt-3 text-sm text-gray-500">

                      Validé par :{" "}

                      <span className="font-medium text-gray-700">

                        {attendance.validated_by_name ?? "-"}

                      </span>

                    </p>


                    {/* DATE SI DISPONIBLE */}

                    {attendance.validated_at && (

                      <p className="mt-1 text-xs text-gray-400">

                        {new Date(
                          attendance.validated_at
                        ).toLocaleString(
                          "fr-FR"
                        )}

                      </p>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </>

      )}

    </div>

  );

}