"use client";

import React from "react";
import EmptyState from "./EmptyState";

export interface DataTableColumn<T> {
  key: string;
  title: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];

  loading?: boolean;

  rowKey?: (row: T) => string | number;

  emptyMessage?: string;

  emptyComponent?: React.ReactNode;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  rowKey,
  emptyMessage = "Aucune donnée disponible.",
  emptyComponent,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 ${column.className ?? ""}`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-gray-500"
                >
                  Chargement...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6"
                >
                  {emptyComponent ?? (
                    <EmptyState
                      title={emptyMessage}
                    />
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={
                    rowKey
                      ? rowKey(row)
                      : index
                  }
                  className="transition-colors hover:bg-gray-50"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-sm text-gray-700 ${column.className ?? ""}`}
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}