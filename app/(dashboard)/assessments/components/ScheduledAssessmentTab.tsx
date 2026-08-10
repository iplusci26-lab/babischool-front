"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import DrawerHeader from "@/components/ui/DrawerHeader";
import DrawerContent from "@/components/ui/DrawerContent";
import DrawerFooter from "@/components/ui/DrawerFooter";

import AssessmentSummary from "./AssessmentSummary";
import AssessmentFilters from "./AssessmentFilters";
import AssessmentForm from "./AssessmentForm";
import AssessmentTable from "./AssessmentTable";

import { useAssessment } from "../hooks/useAssessment";

export default function ScheduledAssessmentTab() {

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

    editingAssessment,

    setForm,

    setFilters,

    saveAssessment,

    editAssessment,

    deleteAssessment,

    resetForm,

    closeEdition,

  } = useAssessment("scheduled");

  const [

    drawerOpen,

    setDrawerOpen,

  ] = useState(false);

  function handleNew() {

    resetForm();

    setDrawerOpen(true);

  }

  function handleEdit(
    assessment: any
  ) {

    editAssessment(
      assessment
    );

    setDrawerOpen(true);

  }

  async function handleSave() {

    await saveAssessment();

    setDrawerOpen(false);

  }

  function handleClose() {

    closeEdition();

    setDrawerOpen(false);

  }

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-2xl font-bold">

            Évaluations programmées

          </h2>

          <p className="mt-2 text-gray-500">

            Planifiez les évaluations à venir.
            Les enseignants, les élèves et les parents seront informés.

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

          <CalendarPlus size={20} />

          Programmer une évaluation

        </button>

      </div>

      {/* SUMMARY */}

      <AssessmentSummary
        summary={summary}
      />

      {/* FILTERS */}

      <AssessmentFilters

        filters={filters}

        classrooms={classrooms}

        subjects={subjects}

        terms={terms}

        onFiltersChange={setFilters}

      />

      {/* TABLE */}

      <AssessmentTable

        assessments={assessments}

        loading={loading}
        onGrade={() => {}}
        onView={() => {}}

        onEdit={handleEdit}

        onDelete={(assessment) =>

          deleteAssessment(
            assessment.id
          )

        }

      />

      {/* DRAWER */}

      <Drawer

        open={drawerOpen}

        onClose={handleClose}

        size="md"

      >

        <DrawerHeader

          title={

            editingAssessment

              ? "Modifier la programmation"

              : "Programmer une évaluation"

          }

          description={

            editingAssessment

              ? "Modifiez la programmation de cette évaluation."

              : "Choisissez la date et les informations de cette évaluation."

          }

          onClose={handleClose}

        />

        <DrawerContent>

          <AssessmentForm

            form={form}

            classrooms={classrooms}

            subjects={subjects}

            terms={terms}

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
              disabled:opacity-50
            "

          >

            {

              submitting

                ? "Enregistrement..."

                : editingAssessment

                ? "Enregistrer"

                : "Programmer"

            }

          </button>

        </DrawerFooter>

      </Drawer>

    </div>

  );

}