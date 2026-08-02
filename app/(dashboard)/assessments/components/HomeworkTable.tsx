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

    {
      key: "title",

      title: "Exercice",

      render: (homework) => (

        <div>

          <div className="font-semibold">

            {homework.title}

          </div>

          <div className="mt-1 text-xs text-gray-500">

            {homework.description}

          </div>

        </div>

      ),

    },

    {
      key: "classroom_name",

      title: "Classe",
    },

    {
      key: "subject_name",

      title: "Matière",
    },

    {
      key: "due_date",

      title: "Date limite",
    },

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