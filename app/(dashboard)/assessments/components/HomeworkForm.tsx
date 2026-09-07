"use client";

import { useMemo } from "react";

import SearchSelect from "@/components/ui/SearchSelect";

import {
  HomeworkFormData,
  Classroom,
  Subject,
  Term,
} from "../types";


/* ===========================================================
 * PROPS
 * =========================================================== */

interface HomeworkFormProps {

  form: HomeworkFormData;

  classrooms?: Classroom[];

  subjects?: Subject[];

  terms?: Term[];

  onChange: (
    form: HomeworkFormData
  ) => void;

}


/* ===========================================================
 * COMPONENT
 * =========================================================== */

export default function HomeworkForm({

  form,

  classrooms = [],

  subjects = [],

  terms = [],

  onChange,

}: HomeworkFormProps) {


  /* =========================================================
   * OPTIONS CLASSES
   * ========================================================= */

  const classroomOptions =
    useMemo(() => {

      return classrooms.map(

        (classroom) => ({

          value:
            String(
              classroom.id
            ),

          label:
            classroom.name,

        })

      );

    }, [

      classrooms,

    ]);


  /* =========================================================
   * OPTIONS MATIÈRES
   * ========================================================= */

  const subjectOptions =
    useMemo(() => {

      return subjects.map(

        (subject) => ({

          value:
            String(
              subject.id
            ),

          label:
            subject.name,

        })

      );

    }, [

      subjects,

    ]);


  /* =========================================================
   * OPTIONS PÉRIODES
   * ========================================================= */

  const termOptions =
    useMemo(() => {

      console.log(
        "TERM OPTIONS:",
        terms
      );


      return terms.map(

        (term) => ({

          value:
            String(
              term.id
            ),

          label:
            term.name,

        })

      );

    }, [

      terms,

    ]);


  /* =========================================================
   * CLASSE SÉLECTIONNÉE
   * ========================================================= */

  const selectedClassroom =

    classrooms.find(

      (classroom) =>

        String(
          classroom.id
        ) ===
        String(
          form.classroom
        )

    );


  /* =========================================================
   * GROUPES DE LA CLASSE
   * ========================================================= */

  const classroomGroups =

    selectedClassroom?.groups ?? [];


  /* =========================================================
   * GROUPES ACTIFS
   * ========================================================= */

  const activeGroups =

    classroomGroups.filter(

      (group) =>

        group.is_active !== false

    );


  /* =========================================================
   * OPTIONS GROUPES
   * ========================================================= */

  const groupOptions = [

    {

      value:
        "",

      label:
        "Toute la classe",

    },

    ...activeGroups.map(

      (group) => ({

        value:
          String(
            group.id
          ),

        label:
          group.name,

      })

    ),

  ];


  /* =========================================================
   * RENDER
   * ========================================================= */

  return (

    <div className="space-y-8">


      {/* =====================================================
       * CLASSE / MATIÈRE / PÉRIODE
       * ===================================================== */}

      <div className="grid gap-6 md:grid-cols-3">


        {/* ---------------------------------------------------
         * CLASSE
         * --------------------------------------------------- */}

        <SearchSelect

          label="Classe"

          value={
            String(
              form.classroom
            )
          }

          options={
            classroomOptions
          }

          onChange={(value) =>

            onChange({

              ...form,

              classroom:
                String(
                  value
                ),


              /*
               * On réinitialise le groupe
               * lorsqu'on change de classe.
               */

              classroom_group:
                "",

            })

          }

        />


        {/* ---------------------------------------------------
         * MATIÈRE
         * --------------------------------------------------- */}

        <SearchSelect

          label="Matière"

          value={
            String(
              form.subject
            )
          }

          options={
            subjectOptions
          }

          onChange={(value) =>

            onChange({

              ...form,

              subject:
                String(
                  value
                ),

            })

          }

        />


        {/* ---------------------------------------------------
         * PÉRIODE
         * --------------------------------------------------- */}

        <SearchSelect

          label="Période"

          value={
            String(
              form.term
            )
          }

          options={
            termOptions
          }

          onChange={(value) =>

            onChange({

              ...form,

              term:
                String(
                  value
                ),

            })

          }

        />

      </div>


      {/* =====================================================
       * GROUPE D'ÉLÈVES
       * ===================================================== */}

      {

        form.classroom &&

        activeGroups.length > 0 && (

          <div>


            <label className="mb-2 block text-sm font-medium text-gray-700">

              Élèves concernés

            </label>


            <SearchSelect

              value={
                String(
                  form.classroom_group
                )
              }

              options={
                groupOptions
              }

              onChange={(value) =>

                onChange({

                  ...form,

                  classroom_group:
                    String(
                      value
                    ),

                })

              }

            />


            <p className="mt-2 text-xs text-gray-400">

              Choisissez si l'exercice concerne toute la classe
              ou uniquement un groupe spécifique.

            </p>


          </div>

        )

      }


      {/* =====================================================
       * TITRE
       * ===================================================== */}

      <div>


        <label className="mb-2 block text-sm font-medium text-gray-700">

          Titre de l'exercice

        </label>


        <input

          value={
            form.title
          }

          onChange={(e) =>

            onChange({

              ...form,

              title:
                e.target.value,

            })

          }

          placeholder="Ex : Exercices Chapitre 5"

          className="

            w-full

            rounded-2xl

            border

            px-4

            py-3

            outline-none

            transition

            focus:border-[#6214BE]

          "

        />


      </div>


      {/* =====================================================
       * DESCRIPTION
       * ===================================================== */}

      <div>


        <label className="mb-2 block text-sm font-medium text-gray-700">

          Description

        </label>


        <textarea

          rows={6}

          value={
            form.description
          }

          onChange={(e) =>

            onChange({

              ...form,

              description:
                e.target.value,

            })

          }

          placeholder="Décrivez le travail demandé aux élèves..."

          className="

            w-full

            resize-none

            rounded-2xl

            border

            px-4

            py-3

            outline-none

            transition

            focus:border-[#6214BE]

          "

        />


        <p className="mt-2 text-xs text-gray-400">

          Cette description sera visible par les élèves
          et leurs parents.

        </p>


      </div>


      {/* =====================================================
       * DATE LIMITE / PUBLICATION
       * ===================================================== */}

      <div className="grid gap-6 md:grid-cols-2">


        {/* ---------------------------------------------------
         * DATE LIMITE
         * --------------------------------------------------- */}

        <div>


          <label className="mb-2 block text-sm font-medium text-gray-700">

            À rendre le

          </label>


          <input

            type="date"

            value={
              form.due_date
            }

            onChange={(e) =>

              onChange({

                ...form,

                due_date:
                  e.target.value,

              })

            }

            className="

              w-full

              rounded-2xl

              border

              px-4

              py-3

              outline-none

              transition

              focus:border-[#6214BE]

            "

          />


          <p className="mt-2 text-xs text-gray-400">

            Date à laquelle les élèves devront
            rendre l'exercice.

          </p>


        </div>


        {/* ---------------------------------------------------
         * PUBLICATION
         * --------------------------------------------------- */}

        <div>


          <label className="mb-2 block text-sm font-medium text-gray-700">

            Publication

          </label>


          <SearchSelect

            value={

              form.is_published

                ? "published"

                : "draft"

            }

            options={[

              {

                value:
                  "draft",

                label:
                  "Brouillon",

              },

              {

                value:
                  "published",

                label:
                  "Publier immédiatement",

              },

            ]}

            onChange={(value) =>

              onChange({

                ...form,

                is_published:

                  value ===
                  "published",

              })

            }

          />


          <p className="mt-2 text-xs text-gray-400">

            Si l'exercice est publié,
            les élèves et les parents
            recevront une notification.

          </p>


        </div>


      </div>


    </div>

  );

}