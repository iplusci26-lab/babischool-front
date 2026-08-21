"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import ProtectedRoute from "@/components/auth/protected-route";

import Drawer from "@/components/ui/Drawer";
import DrawerHeader from "@/components/ui/DrawerHeader";
import DrawerContent from "@/components/ui/DrawerContent";
import DrawerFooter from "@/components/ui/DrawerFooter";

import AssessmentSummary from "./AssessmentSummary";
import AssessmentFilters from "./AssessmentFilters";
import AssessmentTable from "./AssessmentTable";
import AssessmentForm from "./AssessmentForm";

import { Assessment } from "../types";
import { useAssessment } from "../hooks/useAssessment";

export default function AssessmentTab() {

  const {

    assessments,

    classrooms,

    subjects,

    terms,

    form,

    filters,

    summary,

    loading,

    submitting,

    error,

    editingAssessment,

    setForm,

    setFilters,

    saveAssessment,

    publishAssessment,

    editAssessment,

    deleteAssessment,

    resetForm,

    closeEdition,

  } = useAssessment("class");

  const [

    drawerOpen,

    setDrawerOpen,

  ] = useState(false);

  /**
   * Nouvelle évaluation
   */
  function handleNew() {

    resetForm();

    setDrawerOpen(true);

  }

  /**
   * Modifier
   */
  function handleEdit(
    assessment: Assessment
  ) {

    editAssessment(
      assessment
    );

    setDrawerOpen(true);

  }

  /**
   * Voir
   */
  function handleView(
    assessment: Assessment
  ) {

    console.log(
      assessment
    );

  }

  /**
   * Fermer Drawer
   */
  function handleClose() {

    closeEdition();

    setDrawerOpen(false);

  }

  /**
   * Sauvegarder
   */
  async function handleSave() {

    await saveAssessment();

    handleClose();

  }

  /**
   * Publier
   */
  async function handlePublish(
    assessment: Assessment
  ) {

    if (
      !confirm(
        "Publier cette évaluation ? Les notes seront visibles par les parents."
      )
    ) {
      return;
    }

    await publishAssessment(
      assessment.id
    );

  }

  return (

    <ProtectedRoute menu="evaluations">

      <div className="space-y-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-3xl font-bold">

              Évaluations

            </h1>

            <p className="mt-2 text-gray-500">

              Indiquer les évaluations qui serviront
              à la saisie des notes des élèves.

            </p>

          </div>

          <button

            onClick={handleNew}

            className="
              inline-flex
              items-center
              gap-2
              rounded-2xl
              bg-[#6214BE]
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-[#4F10A0]
            "

          >

            <Plus size={20} />

            Nouvelle évaluation

          </button>

        </div>

        {/* ================================================= */}
        {/* ERREUR */}
        {/* ================================================= */}

        {error && (

          <div
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-red-600
            "
          >

            {error}

          </div>

        )}

        {/* ================================================= */}
        {/* SUMMARY */}
        {/* ================================================= */}

        <AssessmentSummary

          summary={summary}

        />

        {/* ================================================= */}
        {/* FILTRES */}
        {/* ================================================= */}

        <AssessmentFilters

          filters={filters}

          classrooms={classrooms}

          subjects={subjects}

          terms={terms}

          onFiltersChange={setFilters}

        />

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <AssessmentTable

          assessments={assessments}

          loading={loading}

          onView={handleView}

          onEdit={handleEdit}

          onPublish={handlePublish}

          onDelete={(assessment) =>

            deleteAssessment(
              assessment.id
            )

          }

        />

      </div>

      {/* ================================================= */}
      {/* DRAWER */}
      {/* ================================================= */}

      <Drawer

        open={drawerOpen}

        onClose={handleClose}

        size="md"

      >

        <DrawerHeader

          title={

            editingAssessment

              ? "Modifier l'évaluation"

              : "Nouvelle évaluation"

          }

          description={

            editingAssessment

              ? "Modifiez les informations de cette évaluation."

              : "Créez une nouvelle évaluation qui sera utilisée pour la saisie des notes."

          }

          onClose={handleClose}

        />

        <DrawerContent>

          <AssessmentForm

            form={form}

            classrooms={classrooms}

            subjects={subjects}

            terms={terms}

            loading={submitting}

            onChange={setForm}

           

          />

        </DrawerContent>

        <DrawerFooter>

          <button

            onClick={handleClose}

            className="
              rounded-xl
              border
              px-5
              py-2
              hover:bg-gray-50
            "

          >

            Annuler

          </button>

          <button

            disabled={submitting}

            onClick={handleSave}

            className="
              rounded-xl
              bg-[#6214BE]
              px-5
              py-2
              font-medium
              text-white
              transition
              hover:bg-[#4F10A0]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "

          >

            {

              submitting

                ? "Enregistrement..."

                : editingAssessment

                ? "Enregistrer"

                : "Créer l'évaluation"

            }

          </button>

        </DrawerFooter>

      </Drawer>

    </ProtectedRoute>

  );

}