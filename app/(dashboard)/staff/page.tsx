"use client";

import { useEffect, useState } from "react";

import {
  getStaff,
  getRoles,
  createStaff,
  deleteStaff,
} from "./hooks/useStaff";

import StaffForm, {
  StaffFormData,
} from "./components/StaffForm";

import StaffTable from "./components/StaffTable";

import StaffDetailsModal from "./components/StaffDetailsModal";

import StaffEditModal from "./components/StaffEditModal";

import StaffResponsibilityModal from "./components/StaffResponsibilityModal";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);

  const [roles, setRoles] = useState<any[]>([]);

  const [selectedStaff, setSelectedStaff] =
    useState<any>(null);

  const [openView, setOpenView] =
    useState(false);

  const [openEdit, setOpenEdit] =
    useState(false);

  const [openResponsibility, setOpenResponsibility] =
    useState(false);

  /* ==========================================================
   * LOAD
   * ========================================================== */

  useEffect(() => {
    loadStaff();
    loadRoles();
  }, []);

  async function loadStaff() {
    try {
      const data = await getStaff();

      setStaff(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadRoles() {
    try {
      const data = await getRoles();

      setRoles(data.results || data);
    } catch (error) {
      console.error(error);
    }
  }

  /* ==========================================================
   * CREATE
   * ========================================================== */

  async function handleCreate(
    data: StaffFormData
  ) {
    try {
      await createStaff(data);

      await loadStaff();
    } catch (error) {
      console.error(error);

      alert(
        "Impossible d'ajouter le personnel administratif."
      );
    }
  }

  /* ==========================================================
   * DELETE
   * ========================================================== */

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Supprimer ce personnel ?"
      )
    ) {
      return;
    }

    try {
      await deleteStaff(id);

      await loadStaff();
    } catch (error) {
      console.error(error);

      alert(
        "Erreur lors de la suppression."
      );
    }
  }

  /* ==========================================================
   * VIEW
   * ========================================================== */

  function handleView(person: any) {
    setSelectedStaff(person);

    setOpenView(true);
  }

  /* ==========================================================
   * EDIT
   * ========================================================== */

  function handleEdit(person: any) {
    setSelectedStaff(person);

    setOpenEdit(true);
  }

  /* ==========================================================
   * RESPONSIBILITIES
   * ========================================================== */

  function handleResponsibility(person: any) {
    setSelectedStaff(person);

    setOpenResponsibility(true);
  }

  /* ==========================================================
   * RENDER
   * ========================================================== */

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Administration
      </h1>

      {/* ======================================================
       * FORMULAIRE D'AJOUT
       * ====================================================== */}

      <StaffForm
        roles={roles}
        onSubmit={handleCreate}
      />

      {/* ======================================================
       * TABLEAU DU PERSONNEL
       * ====================================================== */}

      <StaffTable
        staff={staff}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onResponsibilities={handleResponsibility}
      />

      {/* ======================================================
       * DETAILS
       * ====================================================== */}

      {openView && selectedStaff && (
        <StaffDetailsModal
          staff={selectedStaff}
          onClose={() =>
            setOpenView(false)
          }
        />
      )}

      {/* ======================================================
       * MODIFICATION
       * ====================================================== */}

      {openEdit && selectedStaff && (
        <StaffEditModal
          staff={selectedStaff}
          roles={roles}
          onClose={() =>
            setOpenEdit(false)
          }
          onUpdated={() => {
            setOpenEdit(false);
            loadStaff();
          }}
        />
      )}

      {/* ======================================================
       * RESPONSABILITÉS
       * ====================================================== */}

      {openResponsibility &&
        selectedStaff && (
          <StaffResponsibilityModal
            staff={selectedStaff}
            onClose={() =>
              setOpenResponsibility(false)
            }
          />
        )}

    </div>
  );
}