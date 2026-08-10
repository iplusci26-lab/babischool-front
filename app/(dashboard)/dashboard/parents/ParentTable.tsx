"use client";

import { Eye, KeyRound, Pencil, Trash2 } from "lucide-react";

import DataTable, {
  DataTableColumn,
} from "@/components/data-table/DataTable";

import StatusBadge from "@/components/data-table/StatusBadge";
import ActionMenu from "@/components/data-table/ActionMenu";

import { Parent } from "./types";

interface ParentTableProps {
  parents: Parent[];
  loading: boolean;

  onView: (parent: Parent) => void;
  onEdit: (parent: Parent) => void;
  onResetPassword: (parent: Parent) => void;
  onDelete: (parent: Parent) => void;
}

export default function ParentTable({
  parents,
  loading,
  onView,
  onEdit,
  onResetPassword,
  onDelete,
}: ParentTableProps) {
  const columns: DataTableColumn<Parent>[] = [
    {
      key: "full_name",
      title: "Nom Prenom",
    },

    {
      key: "phone",
      title: "Telephone",
    },

    {
      key: "children_count",
      title: "Enfant",
      className: "text-center",
      render: (parent) => (
        <span className="font-medium">
          {parent.children_count}
        </span>
      ),
    },

    {
      key: "status",
      title: "Statut",

      render: (parent) => (
        <StatusBadge
          label={
            parent.must_change_password
              ? "À modifier"
              : "Valide"
          }
          color={
            parent.must_change_password
              ? "yellow"
              : "green"
          }
        />
      ),
    },

    {
      key: "actions",
      title: "Action",

      render: (parent) => (
        <ActionMenu
          actions={[
            /*{
              label: "Voir",

              icon: <Eye size={16} />,

              onClick: () => onView(parent),
            },

            {
              label: "Modifier",

              icon: <Pencil size={16} />,

              onClick: () => onEdit(parent),
            },*/

            {
              label: "Réinitialiser le mot de passe",

              icon: <KeyRound size={16} />,

              onClick: () =>
                onResetPassword(parent),
            },

            {
              label: "Supprimer",

              icon: <Trash2 size={16} />,

              danger: true,

              onClick: () => onDelete(parent),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={parents}
      loading={loading}
      emptyMessage="Aucun parent trouvé."
    />
  );
}