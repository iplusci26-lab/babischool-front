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

export default function StaffPage() {

    const [staff, setStaff] = useState<any[]>([]);

    const [roles, setRoles] = useState<any[]>([]);

    const [selectedStaff, setSelectedStaff] =
        useState<any>(null);

    const [openView, setOpenView] =
        useState(false);

    const [openEdit, setOpenEdit] =
        useState(false);

    useEffect(() => {

        loadStaff();

        loadRoles();

    }, []);

    async function loadStaff() {

        try {

          const data =
          await getStaff();

            setStaff(data);

        } catch (error) {

            console.error(error);

        }

    }

    async function loadRoles() {

        try {

            const data = 
                await getRoles();

            setRoles(data.results || data);

        } catch (error) {

            console.error(error);

        }

    }

    async function handleCreate(
        data: StaffFormData
    ) {

        try {

          await createStaff(data);

            await loadStaff();

        } catch (error) {

            console.error(error);

            alert(
                "Impossible d'ajouter le personnel."
            );

        }

    }

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

            loadStaff();

        } catch (error) {

            console.error(error);

            alert(
                "Erreur lors de la suppression."
            );

        }

    }

    function handleView(person: any) {

        setSelectedStaff(person);

        setOpenView(true);

    }

    function handleEdit(person: any) {

        setSelectedStaff(person);

        setOpenEdit(true);

    }

    return (

        <div className="space-y-6">

            <h1 className="text-2xl font-bold">

                Personnel

            </h1>

            <StaffForm
                roles={roles}
                onSubmit={handleCreate}
            />

            <StaffTable
                staff={staff}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {openView &&
                selectedStaff && (

                <StaffDetailsModal
                    staff={selectedStaff}
                    onClose={() =>
                        setOpenView(false)
                    }
                />

            )}

            {openEdit &&
                selectedStaff && (

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

        </div>

    );

}