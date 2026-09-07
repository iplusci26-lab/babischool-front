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

import type { Homework } from "../types";


/* ===========================================================
 * COMPONENT
 * =========================================================== */

export default function HomeworkTab() {


  /* ===========================================================
   * HOOK
   * =========================================================== */

  const {

    /* ---------------------------------------------------------
     * DONNÉES
     * --------------------------------------------------------- */

    homeworks,

    classrooms,

    subjects,

    terms,


    /* ---------------------------------------------------------
     * SUMMARY
     * --------------------------------------------------------- */

    summary,


    /* ---------------------------------------------------------
     * FILTRES
     * --------------------------------------------------------- */

    filters,

    setFilters,


    /* ---------------------------------------------------------
     * FORMULAIRE
     * --------------------------------------------------------- */

    form,

    setForm,


    /* ---------------------------------------------------------
     * ÉTATS
     * --------------------------------------------------------- */

    loading,

    submitting,

    editingHomework,


    /* ---------------------------------------------------------
     * ACTIONS
     * --------------------------------------------------------- */

    saveHomework,

    editHomework,

    deleteHomework,

    resetForm,

    closeEdition,

  } = useHomework();


  /* ===========================================================
   * DRAWER
   * =========================================================== */

  const [

    drawerOpen,

    setDrawerOpen,

  ] = useState(false);


  /* ===========================================================
   * NOUVEL EXERCICE
   * =========================================================== */

  function handleNew() {

    resetForm();

    setDrawerOpen(
      true
    );

  }


  /* ===========================================================
   * MODIFICATION
   * =========================================================== */

  function handleEdit(
    homework: Homework
  ) {

    editHomework(
      homework
    );

    setDrawerOpen(
      true
    );

  }


  /* ===========================================================
   * SAUVEGARDE
   * =========================================================== */

  async function handleSave() {

    await saveHomework();


    /*
     * On ferme uniquement après
     * l'exécution de la sauvegarde.
     */

    setDrawerOpen(
      false
    );

  }


  /* ===========================================================
   * FERMETURE DRAWER
   * =========================================================== */

  function handleClose() {

    closeEdition();

    setDrawerOpen(
      false
    );

  }


  /* ===========================================================
   * RENDER
   * =========================================================== */

  return (

    <div className="space-y-8">


      {/* =====================================================
       * HEADER
       * ===================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">


        {/* ---------------------------------------------------
         * TITRE
         * --------------------------------------------------- */}

        <div>

          <h2 className="text-2xl font-bold">

            Exercices

          </h2>


          <p className="mt-2 text-gray-500">

            Communiquez les exercices à traiter à la maison.

          </p>

        </div>


        {/* ---------------------------------------------------
         * ACTION
         * --------------------------------------------------- */}

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


      {/* =====================================================
       * SUMMARY
       * ===================================================== */}

      <HomeworkSummary

        summary={summary}

      />


      {/* =====================================================
       * FILTERS
       * ===================================================== */}

      <HomeworkFilters

        filters={filters}

        classrooms={classrooms}

        subjects={subjects}

        onFiltersChange={setFilters}

      />


      {/* =====================================================
       * TABLE
       * ===================================================== */}

      <HomeworkTable

        homeworks={homeworks}

        loading={loading}

        onView={(homework) => {

          console.log(
            homework
          );

        }}

        onEdit={handleEdit}

        onDelete={(homework) =>

          deleteHomework(
            homework.id
          )

        }

      />


      {/* =====================================================
       * DRAWER
       * ===================================================== */}

      <Drawer

        open={drawerOpen}

        onClose={handleClose}

        size="md"

      >


        {/* ===================================================
         * HEADER
         * =================================================== */}

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


        {/* ===================================================
         * CONTENT
         * =================================================== */}

        <DrawerContent>


          <HomeworkForm

            form={form}

            classrooms={classrooms}

            subjects={subjects}

            /*
             * IMPORTANT :
             *
             * Les périodes étaient correctement chargées
             * dans useHomework(), mais elles n'étaient pas
             * transmises au composant HomeworkForm.
             */

            terms={terms}

            onChange={setForm}

          />


        </DrawerContent>


        {/* ===================================================
         * FOOTER
         * =================================================== */}

        <DrawerFooter>


          {/* -------------------------------------------------
           * ANNULER
           * ------------------------------------------------- */}

          <button

            onClick={handleClose}

            disabled={submitting}

            className="
              rounded-xl
              border
              px-5
              py-2
              transition
              hover:bg-gray-50
              disabled:opacity-50
            "

          >

            Annuler

          </button>


          {/* -------------------------------------------------
           * SAUVEGARDE
           * ------------------------------------------------- */}

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