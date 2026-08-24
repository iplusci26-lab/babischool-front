"use client";

import { useState } from "react";

import {
  CalendarDays,
  History,
} from "lucide-react";

import StaffAttendanceFilters from "./components/StaffAttendanceFilters";
import StaffAttendanceSummary from "./components/StaffAttendanceSummary";
import StaffAttendanceTable from "./components/StaffAttendanceTable";
import StaffAttendanceHistory from "./components/StaffAttendanceHistory";

import { useStaffAttendance } from "./hooks/useStaffAttendance";

type ActiveTab = "today" | "history";

export default function StaffAttendancePage() {

  const {
    records,
    loading,
    submitting,
    error,

    search,
    setSearch,

    stats,

    updateStatus,
    submit,
  } = useStaffAttendance();

  const [activeTab, setActiveTab] =
    useState<ActiveTab>("today");

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

      {/* ======================================================
       * HEADER
       * ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-gray-900">
            Présence du personnel administratif
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les présences quotidiennes et consultez
            l'historique des absences du personnel.
          </p>

        </div>

        {/* Le bouton Enregistrer est uniquement
            nécessaire sur la présence du jour */}

        {activeTab === "today" && (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="rounded-xl bg-[#6214BE] px-5 py-3 font-medium text-white transition hover:bg-[#4d0fa0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Enregistrement..."
              : "Enregistrer"}
          </button>
        )}

      </div>


      {/* ======================================================
       * TABS
       * ====================================================== */}

      <div className="flex w-fit rounded-xl bg-gray-100 p-1">

        {/* ==========================
         * PRÉSENCE DU JOUR
         * ========================== */}

        <button
          type="button"
          onClick={() =>
            setActiveTab("today")
          }
          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition ${
            activeTab === "today"
              ? "bg-[#6214BE] text-white shadow"
              : "text-gray-600 hover:text-[#6214BE]"
          }`}
        >
          <CalendarDays size={16} />

          Présence du jour
        </button>


        {/* ==========================
         * HISTORIQUE
         * ========================== */}

        <button
          type="button"
          onClick={() =>
            setActiveTab("history")
          }
          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition ${
            activeTab === "history"
              ? "bg-[#6214BE] text-white shadow"
              : "text-gray-600 hover:text-[#6214BE]"
          }`}
        >
          <History size={16} />

          Historique des absences
        </button>

      </div>


      {/* ======================================================
       * PRÉSENCE DU JOUR
       * ====================================================== */}

      {activeTab === "today" && (
        <>

          {/* ==========================
           * DATE
           * ========================== */}

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


          {/* ==========================
           * RECHERCHE
           * ========================== */}

          <StaffAttendanceFilters
            search={search}
            onSearchChange={setSearch}
            employeeCount={records.length}
          />


          {/* ==========================
           * STATISTIQUES
           * ========================== */}

          <StaffAttendanceSummary
            stats={stats}
          />


          {/* ==========================
           * TABLEAU
           * ========================== */}

          <StaffAttendanceTable
            records={records}
            loading={submitting}
            onStatusChange={updateStatus}
          />

        </>
      )}


      {/* ======================================================
       * HISTORIQUE DES ABSENCES
       * ====================================================== */}

      {activeTab === "history" && (
        <StaffAttendanceHistory />
      )}

    </div>
  );
}