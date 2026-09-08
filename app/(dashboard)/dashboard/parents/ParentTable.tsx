"use client";

import {
  Eye,
  KeyRound,
  Pencil,
  Power,
  RotateCcw,
} from "lucide-react";

import DataTable, {
  DataTableColumn,
} from "@/components/data-table/DataTable";

import StatusBadge from "@/components/data-table/StatusBadge";

import type {
  Parent,
} from "./types";

// ==========================================================
// PROPS
// ==========================================================

interface ParentTableProps {
  parents: Parent[];

  loading: boolean;

  onView: (
    parent: Parent
  ) => void;

  onEdit: (
    parent: Parent
  ) => void;

  onResetPassword: (
    parent: Parent
  ) => void;

  onToggleStatus: (
    parent: Parent
  ) => void;
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function ParentTable({
  parents,
  loading,
  onView,
  onEdit,
  onResetPassword,
  onToggleStatus,
}: ParentTableProps) {

  // ========================================================
  // COLUMNS
  // ========================================================

  const columns: DataTableColumn<Parent>[] = [

    // ======================================================
    // NOM COMPLET
    // ======================================================

    {
      key: "full_name",

      title: "Nom Prénom",
    },

    // ======================================================
    // TELEPHONE
    // ======================================================

    {
      key: "phone",

      title: "Téléphone",
    },

    // ======================================================
    // ENFANTS
    // ======================================================

    {
      key: "children_count",

      title: "Enfants",

      className: "text-center",

      render: (
        parent
      ) => (
        <span
          className="font-medium"
        >
          {parent.children_count}
        </span>
      ),
    },

    // ======================================================
    // COMPTE
    // ======================================================

    {
      key: "account_status",

      title: "Compte",

      render: (
        parent
      ) => (
        <StatusBadge
          label={
            parent.is_active
              ? "Actif"
              : "Désactivé"
          }
          color={
            parent.is_active
              ? "green"
              : "red"
          }
        />
      ),
    },

    // ======================================================
    // MOT DE PASSE
    // ======================================================

    {
      key: "password_status",

      title: "Mot de passe",

      render: (
        parent
      ) => (
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

    // ======================================================
    // ACTIONS
    // ======================================================

    {
      key: "actions",

      title: "Actions",

      className: "text-center",

      render: (
        parent
      ) => (
        <div
          className="
            flex
            items-center
            justify-center
            gap-2
          "
        >

          {/* ============================================== */}
          {/* VOIR */}
          {/* ============================================== */}

          {/*<button
            type="button"
            onClick={() =>
              onView(parent)
            }
            title="Voir"
            aria-label="Voir le parent"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-blue-600
              transition
              hover:bg-blue-50
              hover:text-blue-700
            "
          >
            <Eye size={18} />
          </button>*/}

          {/* ============================================== */}
          {/* MODIFIER */}
          {/* ============================================== */}

          <button
            type="button"
            onClick={() =>
              onEdit(parent)
            }
            title="Modifier"
            aria-label="Modifier le parent"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-[#6214BE]
              transition
              hover:bg-[#6214BE]/10
            "
          >
            <Pencil size={18} />
          </button>

          {/* ============================================== */}
          {/* RESET PASSWORD */}
          {/* ============================================== */}

          <button
            type="button"
            onClick={() =>
              onResetPassword(parent)
            }
            title="Réinitialiser le mot de passe"
            aria-label="Réinitialiser le mot de passe"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-orange-600
              transition
              hover:bg-orange-50
              hover:text-orange-700
            "
          >
            <KeyRound size={18} />
          </button>

          {/* ============================================== */}
          {/* ACTIVER / DESACTIVER */}
          {/* ============================================== */}

          <button
            type="button"
            onClick={() =>
              onToggleStatus(parent)
            }
            title={
              parent.is_active
                ? "Désactiver le parent"
                : "Réactiver le parent"
            }
            aria-label={
              parent.is_active
                ? "Désactiver le parent"
                : "Réactiver le parent"
            }
            className={
              parent.is_active
                ? `
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-red-600
                  transition
                  hover:bg-red-50
                  hover:text-red-700
                `
                : `
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-green-600
                  transition
                  hover:bg-green-50
                  hover:text-green-700
                `
            }
          >
            {
              parent.is_active
                ? (
                  <Power size={18} />
                )
                : (
                  <RotateCcw size={18} />
                )
            }
          </button>

        </div>
      ),
    },
  ];

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <DataTable
      columns={columns}
      data={parents}
      loading={loading}
      emptyMessage="Aucun parent trouvé."
    />
  );
}