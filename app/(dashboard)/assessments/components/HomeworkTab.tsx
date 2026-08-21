"use client";

import { useState } from "react";
import { BookPlus } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import DrawerHeader from "@/components/ui/DrawerHeader";
import DrawerContent from "@/components/ui/DrawerContent";
import DrawerFooter from "@/components/ui/DrawerFooter";

import HomeworkSummary from "./HomeworkSummary";
import HomeworkFilters from "./HomeworkFilters";
import HomeworkTable from "./HomeworkTable";
import HomeworkForm from "./HomeworkForm";

import { useHomework } from "../hooks/useHomework";

export default function HomeworkTab() {

  const {

    homeworks,

    classrooms,

    subjects,

    summary,

    filters,

    form,

    loading,

    submitting,

    editingHomework,

    setFilters,

    setForm,

    saveHomework,

    editHomework,

    deleteHomework,

    resetForm,

    closeEdition,

  } = useHomework();

  const [

    drawerOpen,

    setDrawerOpen,

  ] = useState(false);

  function handleNew() {

    resetForm();

    setDrawerOpen(true);

  }

  function handleEdit(homework: any) {

    editHomework(homework);

    setDrawerOpen(true);

  }

  async function handleSave() {

    await saveHomework();

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

            Exercices

          </h2>

          <p className="mt-2 text-gray-500">

            Communiquez les exercices à traiter à la maison.

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

          <BookPlus size={20} />

          Nouvel exercice

        </button>

      </div>

      {/* SUMMARY */}

      <HomeworkSummary

        summary={summary}

      />

      {/* FILTERS */}

      <HomeworkFilters

        filters={filters}

        classrooms={classrooms}

        subjects={subjects}

        onFiltersChange={setFilters}

      />

      {/* TABLE */}

      <HomeworkTable

        homeworks={homeworks}

        loading={loading}

        onView={(homework) => {

          console.log(homework);

        }}

        onEdit={handleEdit}

        onDelete={(homework) =>

          deleteHomework(
            homework.id
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

            editingHomework

              ? "Modifier l'exercice"

              : "Nouvel exercice"

          }

          description={

            editingHomework

              ? "Modifiez les informations de cet exercice."

              : "Créer un nouvel exercice de maison."

          }

          onClose={handleClose}

        />

        <DrawerContent>

          <HomeworkForm

            form={form}

            classrooms={classrooms}

            subjects={subjects}

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
              disabled:opacity-50
            "

          >

            {

              submitting

                ? "Enregistrement..."

                : editingHomework

                ? "Enregistrer"

                : "Créer"

            }

          </button>

        </DrawerFooter>

      </Drawer>

    </div>

  );

}