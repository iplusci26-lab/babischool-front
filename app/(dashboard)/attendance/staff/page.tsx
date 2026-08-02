"use client";

import { useState } from "react";

import StaffAttendanceFilters from "./components/StaffAttendanceFilters";
import StaffAttendanceSummary from "./components/StaffAttendanceSummary";
import StaffAttendanceTable from "./components/StaffAttendanceTable";

import { useStaffAttendance } from "./hooks/useStaffAttendance";

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

  const [activeTab] = useState<
    "attendance"
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

      {/* ==========================
              HEADER
      ========================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-gray-900">
            Présence du personnel administratif
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les présences quotidiennes du personnel administratif.
          </p>

        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="rounded-xl bg-[#6214BE] px-5 py-3 font-medium text-white transition hover:bg-[#4d0fa0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Enregistrer
        </button>

      </div>

      {/* ==========================
            RECHERCHE
      ========================== */}

      <StaffAttendanceFilters
        search={search}
        onSearchChange={setSearch}
        employeeCount={records.length}
      />

      {/* ==========================
            STATISTIQUES
      ========================== */}

      <StaffAttendanceSummary
        stats={stats}
      />

      {/* ==========================
              TABLEAU
      ========================== */}

      <StaffAttendanceTable
        records={records}
        loading={submitting}
        onStatusChange={updateStatus}
      />

    </div>
  );
}