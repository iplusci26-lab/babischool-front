"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;

  value: number | string;

  icon: ReactNode;

  color?: string;

  subtitle?: string;

  loading?: boolean;

  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "bg-violet-100 text-violet-700",
  subtitle,
  loading = false,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        ${
          onClick
            ? "cursor-pointer hover:-translate-y-1 hover:shadow-md"
            : ""
        }
      `}
    >
      <div className="flex items-center justify-between">

        <div className="flex-1">

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          {loading ? (
            <div className="mt-3 h-8 w-20 animate-pulse rounded bg-gray-200" />
          ) : (
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {value}
            </h2>
          )}

          {subtitle && (
            <p className="mt-2 text-sm text-gray-500">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className={`rounded-xl p-3 ${color}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}