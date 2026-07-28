"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2, Users } from "lucide-react";

import SearchInput from "@/components/data-table/SearchInput";
import Pagination from "@/components/data-table/Pagination";
import EmptyState from "@/components/data-table/EmptyState";

import ParentTable from "./ParentTable";
import ParentDialogs from "./ParentDialogs";
import useParents from "./hooks/useParents";

export default function ParentsPage() {
  const router = useRouter();

  const {
    parents,
    loading,

    page,
    setPage,

    pageSize,
    count,

    search,
    setSearch,

    selectedParent,

    confirmOpen,
    resultOpen,

    resetResult,

    openResetDialog,
    closeResetDialog,
    closeResultDialog,

    resetPassword,
  } = useParents();

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Parents
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les comptes parents de votre établissement.
          </p>
        </div>

        <button
          onClick={() => router.push("/admissions")}
          className="rounded-lg bg-[#6214BE] px-5 py-2 text-white transition hover:opacity-90"
        >
          Ajouter un élève
        </button>
      </div>

      {/* Recherche */}

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <SearchInput
          placeholder="Rechercher un parent..."
          defaultValue={search}
          onSearch={setSearch}
        />
      </div>

      {/* Tableau */}

      {parents.length === 0 && !loading ? (
        <EmptyState
          icon={Users}
          title="Aucun parent"
          description="Aucun parent n'a encore été enregistré."
          buttonLabel="Inscrire un élève"
          onButtonClick={() =>
            router.push("/admissions")
          }
        />
      ) : (
        <>
          <ParentTable
            parents={parents}
            loading={loading}
            onView={(parent) =>
              router.push(`/dashboard/parents/${parent.id}`)
            }
            onEdit={(parent) => {
              console.log("Modifier", parent);
            }}
            onDelete={(parent) => {
              console.log("Supprimer", parent);
            }}
            onResetPassword={openResetDialog}
          />

          <Pagination
            page={page}
            pageSize={pageSize}
            count={count}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Dialogs */}

      <ParentDialogs
        selectedParent={selectedParent}
        confirmOpen={confirmOpen}
        resultOpen={resultOpen}
        loading={loading}
        resetResult={resetResult}
        onConfirm={resetPassword}
        onCloseConfirm={closeResetDialog}
        onCloseResult={closeResultDialog}
      />
    </div>
  );
}