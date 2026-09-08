"use client";

import { useRouter } from "next/navigation";

import { Users } from "lucide-react";

import SearchInput from "@/components/data-table/SearchInput";

import Pagination from "@/components/data-table/Pagination";

import EmptyState from "@/components/data-table/EmptyState";

import ParentTable from "./ParentTable";

import ParentDialogs from "./ParentDialogs";

import ParentEditModal from "./ParentEditModal";

import useParents from "./hooks/useParents";


// ==========================================================
// COMPONENT
// ==========================================================

export default function ParentsPage() {

  // ========================================================
  // ROUTER
  // ========================================================

  const router = useRouter();


  // ========================================================
  // PARENTS
  // ========================================================

  const {

    // ======================================================
    // DATA
    // ======================================================

    parents,

    loading,

    page,

    setPage,

    pageSize,

    count,

    search,

    setSearch,


    // ======================================================
    // RESET PASSWORD
    // ======================================================

    selectedParent,

    confirmOpen,

    resultOpen,

    resetResult,

    openResetDialog,

    closeResetDialog,

    closeResultDialog,

    resetPassword,


    // ======================================================
    // EDIT
    // ======================================================

    editModalOpen,

    editingParent,

    openEditModal,

    closeEditModal,

    updateParent,


    // ======================================================
    // DEACTIVATE
    // ======================================================

    deactivateOpen,

    openDeactivateDialog,

    closeDeactivateDialog,

    toggleParentStatus,

  } = useParents();


  // ========================================================
  // RENDER
  // ========================================================

  return (

    <div className="space-y-6">


      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div
        className="
          flex
          flex-col
          justify-between
          gap-4
          md:flex-row
          md:items-center
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
              text-gray-900
            "
          >
            Parents
          </h1>


          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Gérez les comptes parents
            de votre établissement.
          </p>

        </div>


        <button
          type="button"
          onClick={() =>
            router.push(
              "/admissions"
            )
          }
          className="
            rounded-lg
            bg-[#6214BE]
            px-5
            py-2
            text-white
            transition
            hover:opacity-90
          "
        >
          Ajouter un élève
        </button>

      </div>


      {/* ================================================== */}
      {/* SEARCH */}
      {/* ================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          rounded-xl
          border
          border-gray-200
          bg-white
          p-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <SearchInput
          placeholder="Rechercher un parent..."
          defaultValue={search}
          onSearch={setSearch}
        />

      </div>


      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      {
        parents.length === 0 &&
        !loading
          ? (

            <EmptyState
              icon={Users}
              title="Aucun parent"
              description="
                Aucun parent n'a encore
                été enregistré.
              "
              buttonLabel="Inscrire un élève"
              onButtonClick={() =>
                router.push(
                  "/admissions"
                )
              }
            />

          )
          : (

            <>


              {/* ========================================== */}
              {/* TABLE */}
              {/* ========================================== */}

              <ParentTable
                parents={parents}
                loading={loading}


                // ==========================================
                // VIEW
                // ==========================================

                onView={(parent) =>
                  router.push(
                    `/dashboard/parents/${parent.id}`
                  )
                }


                // ==========================================
                // EDIT
                // ==========================================

                onEdit={openEditModal}


                // ==========================================
                // RESET PASSWORD
                // ==========================================

                onResetPassword={openResetDialog}


                // ==========================================
                // DEACTIVATE
                // ==========================================

                onToggleStatus={openDeactivateDialog}

                
              />


              {/* ========================================== */}
              {/* PAGINATION */}
              {/* ========================================== */}

              <Pagination
                page={page}
                pageSize={pageSize}
                count={count}
                onPageChange={setPage}
              />

            </>

          )
      }


      {/* ================================================== */}
      {/* PARENT DIALOGS */}
      {/* ================================================== */}

      <ParentDialogs

        // ==================================================
        // SELECTED PARENT
        // ==================================================

        selectedParent={selectedParent}


        // ==================================================
        // RESET PASSWORD
        // ==================================================

        confirmOpen={confirmOpen}

        resultOpen={resultOpen}

        resetResult={resetResult}

        onConfirm={resetPassword}

        onCloseConfirm={closeResetDialog}

        onCloseResult={closeResultDialog}


        // ==================================================
        // DEACTIVATE
        // ==================================================

        deactivateOpen={deactivateOpen}

        onConfirmDeactivate={toggleParentStatus}

        onCloseDeactivate={closeDeactivateDialog}


        // ==================================================
        // LOADING
        // ==================================================

        loading={loading}

      />


      {/* ================================================== */}
      {/* EDIT MODAL */}
      {/* ================================================== */}

      <ParentEditModal

        open={editModalOpen}

        parent={editingParent}

        loading={loading}

        onClose={closeEditModal}

        onSubmit={updateParent}

      />


    </div>

  );

}