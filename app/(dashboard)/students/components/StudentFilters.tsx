"use client";

import {
  Search,
  RotateCcw,
} from "lucide-react";

import Input from "@/components/ui/Input";

import Select from "@/components/ui/Select";

import type {
  Classroom,
  StudentFilters as Filters,
  UUID,
} from "../types";


// ==========================================================
// PROPS
// ==========================================================

interface StudentFiltersProps {

  filters: Filters;

  classrooms: Classroom[];

  onChange: (
    values: Partial<Filters>
  ) => void;

  onReset: () => void;

}


// ==========================================================
// COMPONENT
// ==========================================================

export default function StudentFilters({

  filters,

  classrooms,

  onChange,

  onReset,

}: StudentFiltersProps) {


  // ========================================================
  // CLASSROOM CHANGE
  // ========================================================

  const handleClassroomChange = (
    value: string
  ) => {

    // Toutes les classes

    if (
      !value
    ) {

      onChange({
        classroom: null,
      });

      return;

    }


    // UUID valide

    const classroomId =
      value.trim();


    if (
      classroomId.length === 0
    ) {

      onChange({
        classroom: null,
      });

      return;

    }


    onChange({
      classroom:
        classroomId as UUID,
    });

  };


  // ========================================================
  // GENDER CHANGE
  // ========================================================

  const handleGenderChange = (
    value: string
  ) => {

    if (
      value !== "M" &&
      value !== "F"
    ) {

      onChange({
        gender: "",
      });

      return;

    }


    onChange({
      gender: value,
    });

  };


  // ========================================================
  // RENDER
  // ========================================================

  return (

    <div className="rounded-2xl border bg-white p-5 shadow-sm">

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">


        {/* ================================================== */}
        {/* RECHERCHE */}
        {/* ================================================== */}

        <Input

          placeholder="Rechercher un élève..."

          value={
            filters.search ?? ""
          }

          onChange={(event) =>
            onChange({
              search:
                event.target.value,
            })
          }

          leftIcon={
            <Search size={18} />
          }

        />


        {/* ================================================== */}
        {/* CLASSE */}
        {/* ================================================== */}

        <Select

          value={
            filters.classroom ?? ""
          }

          options={[

            {
              label:
                "Toutes les classes",

              value: "",
            },

            ...classrooms.map(
              (
                classroom
              ) => ({

                label:
                  classroom.name,

                value:
                  classroom.id,

              })
            ),

          ]}

          onChange={(event) =>

            handleClassroomChange(
              event.target.value
            )

          }

        />


        {/* ================================================== */}
        {/* SEXE */}
        {/* ================================================== */}

        <Select

          value={
            filters.gender ?? ""
          }

          options={[

            {
              label:
                "Tous les sexes",

              value: "",
            },

            {
              label:
                "Garçons",

              value: "M",
            },

            {
              label:
                "Filles",

              value: "F",
            },

          ]}

          onChange={(event) =>

            handleGenderChange(
              event.target.value
            )

          }

        />


        {/* ================================================== */}
        {/* RÉINITIALISER */}
        {/* ================================================== */}

        <button

          type="button"

          onClick={onReset}

          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            px-4
            py-2
            transition
            hover:bg-gray-50
            cursor-pointer
          "

        >

          <RotateCcw size={18} />

          Réinitialiser

        </button>


      </div>

    </div>

  );

}