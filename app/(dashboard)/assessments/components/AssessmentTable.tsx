"use client";

import {
  Pencil,
  Trash2,
  Eye,
  Send,
} from "lucide-react";

import DataTable, {
  DataTableColumn,
} from "@/components/data-table/DataTable";

import StatusBadge from "@/components/data-table/StatusBadge";
import ActionMenu from "@/components/data-table/ActionMenu";

import {
  Assessment,
  ASSESSMENT_STATUS_COLORS,
  ASSESSMENT_TYPE_LABELS,
} from "../types";

interface AssessmentTableProps {

  assessments: Assessment[];

  loading: boolean;

  onView: (
    assessment: Assessment
  ) => void;

  onEdit: (
    assessment: Assessment
  ) => void;

  onDelete: (
    assessment: Assessment
  ) => void;

  onPublish: (
    assessment: Assessment
  ) => void;

}

export default function AssessmentTable({

  assessments,

  loading,

  onView,

  onEdit,

  onDelete,

  onPublish,

}: AssessmentTableProps) {

  const columns: DataTableColumn<Assessment>[] = [

    {
      key: "title",

      title: "Évaluation",

      render: (assessment) => (

        <div>

          <p className="font-semibold">

            {assessment.title}

          </p>

          <p className="text-xs text-gray-500">

            {
              ASSESSMENT_TYPE_LABELS[
                assessment.assessment_type
              ]
            }

          </p>

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
      key: "teacher_name",

      title: "Enseignant",

      render: (assessment) => (

        <span>

          {assessment.teacher_name}

        </span>

      ),
    },

    {
      key: "date_assessment",

      title: "Date",

      render: (assessment) => (

        new Date(
          assessment.date_assessment
        ).toLocaleDateString(
          "fr-FR"
        )

      ),
    },

    {
      key: "weight",

      title: "Coef.",

      className: "text-center",

      render: (assessment) => (

        <span className="font-semibold">

          {assessment.weight}

        </span>

      ),
    },

    {
      key: "max_score",

      title: "Note",

      className: "text-center",

      render: (assessment) => (

        <span>

          /{parseFloat(String(assessment.max_score))}

        </span>

      ),
    },

    {
      key: "status",

      title: "Statut",

      render: (assessment) => (

        <StatusBadge

          label={
            assessment.status_label
          }

          color={
            ASSESSMENT_STATUS_COLORS[
              assessment.status
            ]
          }

        />

      ),
    },

    {
      key: "actions",

      title: "Action",

      render: (assessment) => (

        <ActionMenu

          actions={[

            {

              label: "Voir",

              icon: (
                <Eye size={16} />
              ),

              onClick: () =>
                onView(
                  assessment
                ),

            },

            {

              label: "Modifier",

              icon: (
                <Pencil size={16} />
              ),

              onClick: () =>
                onEdit(
                  assessment
                ),

            },

            ...(assessment.can_publish

              ? [

                  {

                    label:
                      "Publier",

                    icon: (
                      <Send
                        size={16}
                      />
                    ),

                    onClick: () =>
                      onPublish(
                        assessment
                      ),

                  },

                ]

              : []),

            {

              label: "Supprimer",

              icon: (
                <Trash2
                  size={16}
                />
              ),

              danger: true,

              onClick: () =>
                onDelete(
                  assessment
                ),

            },

          ]}

        />

      ),
    },

  ];

  return (

    <DataTable

      columns={columns}

      data={assessments}

      loading={loading}

      emptyMessage="Aucune évaluation trouvée."

    />

  );

}