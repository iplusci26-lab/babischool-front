"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import DataTable, {
  DataTableColumn,
} from "@/components/data-table/DataTable";

import StatusBadge from "@/components/data-table/StatusBadge";

import ActionMenu from "@/components/data-table/ActionMenu";

import {
  Homework,
} from "../types";


interface HomeworkTableProps {

  homeworks: Homework[];

  loading: boolean;

  onView: (
    homework: Homework
  ) => void;

  onEdit: (
    homework: Homework
  ) => void;

  onDelete: (
    homework: Homework
  ) => void;

}


export default function HomeworkTable({

  homeworks,

  loading,

  onView,

  onEdit,

  onDelete,

}: HomeworkTableProps) {


  const columns: DataTableColumn<Homework>[] = [

    /* =======================================================
     * EXERCICE
     * ======================================================= */

    {

      key: "title",

      title: "Exercice",

      render: (homework) => (

        <div className="max-w-xs">

          <div className="font-semibold">

            {homework.title}

          </div>

          <div className="mt-1 truncate text-xs text-gray-500">

            {homework.description}

          </div>

        </div>

      ),

    },


    /* =======================================================
     * CLASSE / GROUPE
     * ======================================================= */

    {

      key: "classroom_name",

      title: "Classe",

      render: (homework) => (

        <div>

          <div className="font-medium text-gray-900">

            {homework.classroom_name}

          </div>

          <div className="mt-1 text-xs text-gray-500">

            {homework.classroom_group_name
              ? homework.classroom_group_name
              : "Toute la classe"}

          </div>

        </div>

      ),

    },


    /* =======================================================
     * MATIÈRE
     * ======================================================= */

    {

      key: "subject_name",

      title: "Matière",

    },


    /* =======================================================
     * DATE LIMITE
     * ======================================================= */

    {

      key: "due_date",

      title: "Date limite",

      render: (homework) => {

        if (!homework.due_date) {

          return "-";

        }

        return new Intl.DateTimeFormat(
          "fr-FR",
          {

            day: "2-digit",

            month: "short",

            year: "numeric",

          }
        ).format(
          new Date(homework.due_date)
        );

      },

    },


    /* =======================================================
     * STATUT
     * ======================================================= */

    {

      key: "status",

      title: "Statut",

      render: (homework) => (

        <StatusBadge

          label={

            homework.status === "completed"

              ? "Terminé"

              : homework.status === "overdue"

              ? "En retard"

              : "À rendre"

          }

          color={

            homework.status === "completed"

              ? "green"

              : homework.status === "overdue"

              ? "red"

              : "yellow"

          }

        />

      ),

    },


    /* =======================================================
     * ACTIONS
     * ======================================================= */

    {

      key: "actions",

      title: "Actions",

      render: (homework) => (

        <ActionMenu

          actions={[

            {

              label: "Voir",

              icon: <Eye size={16} />,

              onClick: () =>

                onView(homework),

            },


            {

              label: "Modifier",

              icon: <Pencil size={16} />,

              onClick: () =>

                onEdit(homework),

            },


            {

              label: "Supprimer",

              icon: <Trash2 size={16} />,

              danger: true,

              onClick: () =>

                onDelete(homework),

            },

          ]}

        />

      ),

    },

  ];


  return (

    <DataTable

      columns={columns}

      data={homeworks}

      loading={loading}

      emptyMessage="Aucun exercice trouvé."

    />

  );

}