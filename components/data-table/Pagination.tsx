"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  count: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  count,
  page,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, count);

  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const startPage = Math.max(2, page - 1);
    const endPage = Math.min(totalPages - 1, page + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
      <p className="text-sm text-gray-500">
        Affichage de <strong>{start}</strong> à <strong>{end}</strong> sur{" "}
        <strong>{count}</strong> résultat{count > 1 ? "s" : ""}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={16} />
          Précédent
        </button>

        {pages.map((item, index) =>
          item === "..." ? (
            <span
              key={index}
              className="px-2 text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(Number(item))}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                page === item
                  ? "bg-[#6214BE] text-white"
                  : "border hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Suivant
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}