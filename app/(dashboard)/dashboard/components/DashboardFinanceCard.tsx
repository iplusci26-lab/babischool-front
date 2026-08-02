"use client";

import {
  Banknote,
  Wallet,
  TrendingUp,
} from "lucide-react";

interface DashboardFinanceCardProps {
  totalPayments: number;
  paymentsToday: number;
}

export default function DashboardFinanceCard({
  totalPayments,
  paymentsToday,
}: DashboardFinanceCardProps) {

  const formatMoney = (value: number) =>
    Number(value).toLocaleString(
      "fr-FR"
    );

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-[#6214BE]">

            Situation financière

          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">

            {formatMoney(paymentsToday)} FCFA

          </h2>

          <p className="mt-1 text-sm text-gray-500">

            Encaissements aujourd'hui

          </p>

        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">

          <Banknote
            size={28}
            className="text-emerald-700"
          />

        </div>

      </div>

      {/* Barre */}

      <div className="mb-6 h-3 overflow-hidden rounded-full bg-gray-100">

        <div className="h-full w-full rounded-full bg-emerald-500" />

      </div>

      {/* KPIs */}

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-emerald-50 p-4">

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">

            <Wallet
              size={20}
              className="text-emerald-700"
            />

          </div>

          <p className="text-xs text-gray-500">

            Total encaissé

          </p>

          <p className="mt-1 text-xl font-bold text-emerald-700">

            {formatMoney(totalPayments)} FCFA

          </p>

        </div>

        <div className="rounded-2xl bg-blue-50 p-4">

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">

            <TrendingUp
              size={20}
              className="text-blue-700"
            />

          </div>

          <p className="text-xs text-gray-500">

            Aujourd'hui

          </p>

          <p className="mt-1 text-xl font-bold text-blue-700">

            {formatMoney(paymentsToday)} FCFA

          </p>

        </div>

      </div>

    </div>

  );

}