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
import DashboardRecentActivity from "./components/DashboardRecentActivity";
import DashboardQuickActions from "./components/DashboardQuickActions";
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

        {/* ================================= */}

        {/* HEADER */}

        {/* ================================= */}

        <DashboardHeader
          schoolName={data.school_name}
        />

        {/* ================================= */}

        {/* KPI */}

        {/* ================================= */}

        <DashboardStats
          data={data}
        />

        {/* ================================= */}

        {/* LIGNE 1 */}

        {/* ================================= */}

        <div className="grid gap-6 xl:grid-cols-2">

          <DashboardAttendanceCard
            today={stats.today}
          />

          <DashboardFinanceCard
            totalPayments={data.total_payments}
            paymentsToday={data.payments_today}
          />

        </div>

        {/* ================================= */}

        {/* LIGNE 2 */}

        {/* ================================= */}

        <div className="grid gap-6 xl:grid-cols-2">

          <DashboardWeekCard
            week={stats.week}
          />

          <DashboardTopAbsents
            teachers={stats.top_absents}
          />

        </div>

        {/* ================================= */}

        {/* LIGNE 3 */}

        {/* ================================= */}

        <div className="grid gap-6 xl:grid-cols-2">

          <DashboardQuickActions />

          <DashboardChart
            rate={stats.week.rate}
          />

        </div>

        {/* ================================= */}

        {/* LIGNE 4 */}

        {/* ================================= */}

        <DashboardRecentActivity
          activities={[]}
        />

      </div>

    </ProtectedRoute>

  );

}