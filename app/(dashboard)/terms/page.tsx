"use client";

import { Plus, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";

import AcademicYearCard from "./components/AcademicYearCard";
import AcademicYearModal from "./components/AcademicYearModal";
import TermCard from "./components/TermCard";
import TermForm from "./components/TermForm";

import { useTerms } from "./hooks/useTerms";

export default function TermsPage() {
  const {
    /* States */
    loading,
    saving,
    error,

    /* Data */
    academicYears,
    terms,

    /* Selection */
    selectedAcademicYearId,
    selectAcademicYear,

    /* Modal */
    isAcademicYearModalOpen,
    openAcademicYearModal,
    closeAcademicYearModal,

    /* Forms */
    academicYearForm,
    termForm,
    updateAcademicYearForm,
    updateTermForm,

    /* Editing */
    editingAcademicYear,
    editingTerm,

    /* Academic Year */
    editAcademicYear,
    saveAcademicYear,
    deleteAcademicYear,

    /* Academic Term */
    editTerm,
    saveTerm,
    deleteTerm,
    createNewTerm,
    resetTermForm,
  } = useTerms();

  const selectedAcademicYear =
    academicYears.find(
      (year) => year.id === selectedAcademicYearId
    ) ?? null;

    
  const handleSelectAcademicYear = (
    id: string
  ) => {
    selectAcademicYear(id);
  };

  return (
    <div className="space-y-6">

      {/* ==========================
          Header
      ========================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">

            Années académiques

          </h1>

          <p className="mt-1 text-gray-500">

            Configurez les années académiques et
            les périodes de votre établissement.

          </p>

        </div>

        <Button
          onClick={openAcademicYearModal}
          className="gap-2"
        >
          <Plus size={18} />

          Nouvelle année

        </Button>

      </div>

      {/* ==========================
          Error
      ========================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

          {error}

        </div>
      )}

      {/* ==========================
          Loading
      ========================== */}

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">

          Chargement...

        </div>
      ) : (

        <div className="grid gap-6 xl:grid-cols-12">

          {/* ==========================
              Left Panel
          ========================== */}

          <div className="xl:col-span-4">

            <div className="rounded-2xl border bg-white shadow-sm">

              <div className="border-b p-5">

                <h2 className="font-semibold text-gray-900">

                  Années académiques

                </h2>

              </div>

              <div className="space-y-4 p-4">
              {academicYears.length === 0 ? (

      <div className="rounded-xl border-2 border-dashed p-8 text-center text-gray-500">

        Aucune année académique disponible.

      </div>

      ) : (

      academicYears.map((year) => (
        <AcademicYearCard
          key={year.id}
          year={year}
          selected={
            selectedAcademicYearId === year.id
          }
          onSelect={() =>
            handleSelectAcademicYear(year.id)
          }
          onEdit={editAcademicYear}
          onDelete={deleteAcademicYear}
        />
      ))

      )}

      </div>

      </div>

      </div>

      {/* ==========================
      Right Panel
      ========================== */}

      <div className="space-y-6 xl:col-span-8">

      {selectedAcademicYear ? (

      <>

      {/* Header */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <CalendarDays
              size={22}
              className="text-purple-600"
            />

            <h2 className="text-2xl font-semibold">

              {selectedAcademicYear.name}

            </h2>

          </div>

          <p className="mt-2 text-gray-500">

            Gérez les périodes de cette année académique.

          </p>

        </div>

        <Button
          onClick={() => createNewTerm(selectedAcademicYearId)}
          className="gap-2"
        >

          <Plus size={18} />

          Nouvelle période

        </Button>

      </div>

      </div>

      {/* Form */}

      <TermForm
      form={termForm}
      editing={!!editingTerm}
      loading={saving}
      onChange={updateTermForm}
      onSubmit={saveTerm}
      onCancel={resetTermForm}
      />

      {/* Terms */}

      <div className="rounded-2xl border bg-white shadow-sm">

      <div className="border-b p-5">

        <h2 className="font-semibold">

          Périodes académiques

        </h2>

      </div>

      <div className="space-y-4 p-5">

        {terms.length === 0 ? (

          <div className="rounded-xl border-2 border-dashed p-8 text-center text-gray-500">

            Aucune période enregistrée.

          </div>

        ) : (

          terms.map((term) => (

            <TermCard
              key={term.id}
              term={term}
              onEdit={editTerm}
              onDelete={deleteTerm}
            />

          ))

        )}

      </div>

      </div>

      </>

      ) : (

      <div className="rounded-2xl border-2 border-dashed bg-white p-16 text-center">

      <h2 className="text-xl font-semibold">

      Aucune année sélectionnée

      </h2>

      <p className="mt-2 text-gray-500">

      Sélectionnez une année académique
      pour commencer.

      </p>

      </div>

      )}

      </div>

      </div>

      )}

      {/* ==========================
          Academic Year Modal
      ========================== */}

      <AcademicYearModal
        open={isAcademicYearModalOpen}
        loading={saving}
        editing={!!editingAcademicYear}
        form={academicYearForm}
        onClose={closeAcademicYearModal}
        onSubmit={saveAcademicYear}
        onChange={updateAcademicYearForm}
      />

      </div>
      );
}