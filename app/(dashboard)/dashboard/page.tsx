"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

import ProtectedRoute from "@/components/auth/protected-route";

import DashboardHeader from "./components/DashboardHeader";
import DashboardStats from "./components/DashboardStats";
import DashboardAttendanceCard from "./components/DashboardAttendanceCard";
import DashboardFinanceCard from "./components/DashboardFinanceCard";
import DashboardWeekCard from "./components/DashboardWeekCard";
import DashboardTopAbsents from "./components/DashboardTopAbsents";
import DashboardQuickActions from "./components/DashboardQuickActions";
import DashboardDailyStudentAttendance from "./components/DashboardDailyStudentAttendance";
import DashboardChart from "./components/DashboardChart";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  const [stats, setStats] = useState<any>(null);

  const load = async () => {
    const statsResponse = await api.get(
      "/attendance/stats/"
    );

    setStats(statsResponse.data);

    const dashboardResponse = await api.get(
      "/dashboard/admin/"
    );

    setData(dashboardResponse.data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!data || !stats) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#6214BE] border-t-transparent" />

          <p className="text-gray-500">
            Chargement du tableau de bord...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute menu="dashboard">
      <div className="space-y-8 p-6">

        {/* HEADER */}
        <DashboardHeader
          schoolName={data.school_name}
        />

        {/* KPI GLOBAUX */}
        <DashboardStats
          data={data}
        />

        {/* ========================= */}
        {/* PRIORITÉ JOURNALIÈRE */}
        {/* ========================= */}

        <div className="grid gap-6 xl:grid-cols-2">

          <DashboardDailyStudentAttendance
            absent={stats.students_today.absent}
            late={stats.students_today.late}
          />

          <DashboardFinanceCard
            totalPayments={data.total_payments}
            paymentsToday={data.payments_today}
          />

        </div>

        {/* ========================= */}
        {/* ANALYSE / TENDANCES */}
        {/* ========================= */}

        <div className="grid gap-6 xl:grid-cols-2">

          <DashboardChart
            data={stats.week_chart}
          />

          <DashboardWeekCard
            week={stats.week}
          />

        </div>

        {/* ========================= */}
        {/* SUIVI ENSEIGNANTS */}
        {/* ========================= */}

        <div className="grid gap-6 xl:grid-cols-2">

          <DashboardAttendanceCard
            today={stats.today}
          />

          <DashboardTopAbsents
            teachers={stats.top_absents}
          />

        </div>

        {/* ========================= */}
        {/* ACTIONS RAPIDES */}
        {/* ========================= */}

        <DashboardQuickActions />

      </div>
    </ProtectedRoute>
  );
}