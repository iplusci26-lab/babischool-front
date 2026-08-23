"use client";

import { useEffect, useMemo, useState } from "react";

import {
    GraduationCap,
    Trash2,
} from "lucide-react";

import Modal from "@/components/ui/Modal";

import {
    Classroom,
    ClassroomLevel,
    Staff,
    StaffResponsibility,
    StaffResponsibilityFormData,
} from "../types";

import {
    getClassroomLevels,
    getClassrooms,
    getStaffResponsibilities,
    createStaffResponsibility,
    deleteStaffResponsibility,
} from "../hooks/useStaff";


interface StaffResponsibilityModalProps {
    staff: Staff;
    onClose: () => void;
}


export default function StaffResponsibilityModal({
    staff,
    onClose,
}: StaffResponsibilityModalProps) {

    /* ==========================================================
     * STATE
     * ========================================================== */

    const [levels, setLevels] =
        useState<ClassroomLevel[]>([]);

    const [classrooms, setClassrooms] =
        useState<Classroom[]>([]);

    const [responsibilities, setResponsibilities] =
        useState<StaffResponsibility[]>([]);

    const [selectedLevel, setSelectedLevel] =
        useState("");

    const [allClasses, setAllClasses] =
        useState(true);

    const [selectedClassrooms, setSelectedClassrooms] =
        useState<string[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);


    /* ==========================================================
     * CHARGEMENT INITIAL
     * ========================================================== */

    useEffect(() => {
        loadData();
    }, [staff.id]);


    async function loadData() {

        setLoading(true);
        setError(null);

        try {

            const [
                levelsData,
                classroomsData,
                responsibilitiesData,
            ] = await Promise.all([

                getClassroomLevels(),

                getClassrooms(),

                getStaffResponsibilities(
                    staff.id
                ),

            ]);

            setLevels(levelsData);

            setClassrooms(classroomsData);

            setResponsibilities(
                responsibilitiesData
            );

        } catch (err) {

            console.error(err);

            setError(
                "Impossible de charger les responsabilités."
            );

        } finally {

            setLoading(false);

        }

    }


    /* ==========================================================
     * CLASSES DU NIVEAU SÉLECTIONNÉ
     * ========================================================== */

    const levelClassrooms = useMemo(() => {

        if (!selectedLevel) {
            return [];
        }

        return classrooms.filter(
            (classroom) =>
                classroom.classroom_level ===
                selectedLevel
        );

    }, [
        classrooms,
        selectedLevel,
    ]);


    /* ==========================================================
     * CHANGEMENT DE NIVEAU
     * ========================================================== */

    function handleLevelChange(
        levelId: string
    ) {

        setSelectedLevel(levelId);

        /*
         * Lorsqu'un nouveau niveau est sélectionné,
         * on repart par défaut sur toutes ses classes.
         */

        setAllClasses(true);

        setSelectedClassrooms([]);

        setError(null);

    }


    /* ==========================================================
     * TOUTES LES CLASSES
     * ========================================================== */

    function handleAllClassesChange(
        checked: boolean
    ) {

        setAllClasses(checked);

        if (checked) {
            setSelectedClassrooms([]);
        }

        setError(null);

    }


    /* ==========================================================
     * SÉLECTION D'UNE CLASSE
     * ========================================================== */

    function toggleClassroom(
        classroomId: string
    ) {

        setAllClasses(false);

        setSelectedClassrooms(
            (previous) => {

                if (
                    previous.includes(
                        classroomId
                    )
                ) {

                    return previous.filter(
                        (id) =>
                            id !== classroomId
                    );

                }

                return [
                    ...previous,
                    classroomId,
                ];

            }
        );

        setError(null);

    }


    /* ==========================================================
     * ENREGISTREMENT
     * ========================================================== */

    async function handleSubmit() {

        setError(null);

        if (!selectedLevel) {

            setError(
                "Veuillez sélectionner un niveau."
            );

            return;

        }

        if (
            !allClasses &&
            selectedClassrooms.length === 0
        ) {

            setError(
                "Veuillez sélectionner au moins une classe."
            );

            return;

        }

        const formData: StaffResponsibilityFormData = {

            classroom_level:
                selectedLevel,

            all_classes:
                allClasses,

            classrooms:
                allClasses
                    ? []
                    : selectedClassrooms,

        };

        setSaving(true);

        try {

            await createStaffResponsibility(
                staff.id,
                formData
            );

            /*
             * Réinitialisation du formulaire
             */

            setSelectedLevel("");

            setAllClasses(true);

            setSelectedClassrooms([]);

            /*
             * Rechargement des responsabilités
             */

            const updatedResponsibilities =
                await getStaffResponsibilities(
                    staff.id
                );

            setResponsibilities(
                updatedResponsibilities
            );

        } catch (err: any) {

            console.error(err);

            /*
             * Gestion des erreurs Django/DRF
             */

            const responseData =
                err?.response?.data;

            if (
                responseData?.detail
            ) {

                setError(
                    responseData.detail
                );

            } else if (
                typeof responseData === "object"
            ) {

                const firstError =
                    Object.values(
                        responseData
                    )[0];

                if (
                    Array.isArray(firstError)
                ) {

                    setError(
                        String(firstError[0])
                    );

                } else {

                    setError(
                        String(firstError)
                    );

                }

            } else {

                setError(
                    "Impossible d'enregistrer la responsabilité."
                );

            }

        } finally {

            setSaving(false);

        }

    }


    /* ==========================================================
     * SUPPRESSION
     * ========================================================== */

    async function handleDelete(
        responsibilityId: string
    ) {

        if (
            !confirm(
                "Supprimer cette responsabilité ?"
            )
        ) {

            return;

        }

        try {

            await deleteStaffResponsibility(
                staff.id,
                responsibilityId
            );

            setResponsibilities(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item.id !==
                            responsibilityId
                    )
            );

        } catch (err) {

            console.error(err);

            alert(
                "Impossible de supprimer cette responsabilité."
            );

        }

    }


    /* ==========================================================
     * AFFICHAGE
     * ========================================================== */

    return (

        <Modal
            open={true}
            onClose={onClose}
            title="Responsabilités du personnel"
        >

            <div className="space-y-6">

                {/* ==================================================
                 * PERSONNEL
                 * ================================================== */}

                <div className="flex items-center gap-3 rounded-xl bg-violet-50 p-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">

                        <GraduationCap
                            size={22}
                        />

                    </div>

                    <div className="min-w-0">

                        <p className="truncate font-semibold text-gray-900">

                            {staff.last_name}{" "}
                            {staff.first_name}

                        </p>

                        <p className="truncate text-sm text-gray-500">

                            {staff.function ||
                                staff.role?.name ||
                                "Personnel"}

                        </p>

                    </div>

                </div>


                {/* ==================================================
                 * CHARGEMENT
                 * ================================================== */}

                {loading ? (

                    <div className="py-8 text-center text-gray-500">

                        Chargement...

                    </div>

                ) : (

                    <>

                        {/* ==================================================
                         * FORMULAIRE
                         * ================================================== */}

                        <div className="space-y-4">

                            <h3 className="font-semibold text-gray-900">

                                Ajouter une responsabilité

                            </h3>


                            {/* ==================================================
                             * NIVEAU
                             * ================================================== */}

                            <div>

                                <label
                                    htmlFor="staff-responsibility-level"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >

                                    Niveau

                                </label>

                                <select
                                    id="staff-responsibility-level"
                                    value={selectedLevel}
                                    onChange={(e) =>
                                        handleLevelChange(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                                >

                                    <option value="">

                                        Sélectionner un niveau

                                    </option>

                                    {levels.map(
                                        (level) => (

                                            <option
                                                key={
                                                    level.id
                                                }
                                                value={
                                                    level.id
                                                }
                                            >

                                                {level.name}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* ==================================================
                             * OPTIONS DES CLASSES
                             * ================================================== */}

                            {selectedLevel && (

                                <div className="rounded-xl border p-4">

                                    <label className="flex cursor-pointer items-start gap-3">

                                        <input
                                            type="checkbox"
                                            checked={
                                                allClasses
                                            }
                                            onChange={(e) =>
                                                handleAllClassesChange(
                                                    e.target.checked
                                                )
                                            }
                                            className="mt-1 h-4 w-4 shrink-0 rounded"
                                        />

                                        <div>

                                            <p className="font-medium text-gray-900">

                                                Toutes les classes

                                            </p>

                                            <p className="text-sm text-gray-500">

                                                Le personnel sera responsable de toutes les classes de ce niveau.

                                            </p>

                                        </div>

                                    </label>

                                </div>

                            )}


                            {/* ==================================================
                             * CLASSES
                             * ================================================== */}

                            {selectedLevel &&
                                !allClasses && (

                                    <div className="space-y-2">

                                        <p className="text-sm font-medium text-gray-700">

                                            Classes concernées

                                        </p>

                                        {levelClassrooms.length ===
                                        0 ? (

                                            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">

                                                Aucune classe disponible pour ce niveau.

                                            </div>

                                        ) : (

                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                                                {levelClassrooms.map(
                                                    (
                                                        classroom
                                                    ) => (

                                                        <label
                                                            key={
                                                                classroom.id
                                                            }
                                                            className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition hover:bg-gray-50"
                                                        >

                                                            <input
                                                                type="checkbox"
                                                                checked={selectedClassrooms.includes(
                                                                    classroom.id
                                                                )}
                                                                onChange={() =>
                                                                    toggleClassroom(
                                                                        classroom.id
                                                                    )
                                                                }
                                                                className="h-4 w-4 shrink-0 rounded"
                                                            />

                                                            <span className="text-sm font-medium text-gray-800">

                                                                {
                                                                    classroom.name
                                                                }

                                                            </span>

                                                        </label>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>

                                )}


                            {/* ==================================================
                             * ERREUR
                             * ================================================== */}

                            {error && (

                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">

                                    {error}

                                </div>

                            )}


                            {/* ==================================================
                             * AJOUTER
                             * ================================================== */}

                            <div className="flex justify-end">

                                <button
                                    type="button"
                                    onClick={
                                        handleSubmit
                                    }
                                    disabled={
                                        saving ||
                                        !selectedLevel
                                    }
                                    className="rounded-lg bg-[#6214BE] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#51109d] disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {saving
                                        ? "Enregistrement..."
                                        : "Ajouter"}

                                </button>

                            </div>

                        </div>


                        {/* ==================================================
                         * RESPONSABILITÉS EXISTANTES
                         * ================================================== */}

                        <div className="border-t pt-5">

                            <h3 className="mb-3 font-semibold text-gray-900">

                                Responsabilités actuelles

                            </h3>


                            {responsibilities.length ===
                            0 ? (

                                <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">

                                    Aucune responsabilité attribuée.

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {responsibilities.map(
                                        (responsibility) => {

                                            const levelName =
                                                responsibility.classroom_level_name ||
                                                (
                                                    typeof responsibility.classroom_level === "object"
                                                        ? responsibility.classroom_level.name
                                                        : responsibility.classroom_level
                                                );

                                            const classroomNames =
                                                responsibility.classroom_names?.length
                                                    ? responsibility.classroom_names
                                                        .map((classroom: any) =>
                                                            typeof classroom === "object"
                                                                ? classroom.name
                                                                : classroom
                                                        )
                                                        .join(", ")
                                                    : Array.isArray(
                                                        responsibility.classrooms
                                                    )
                                                        ? responsibility.classrooms
                                                            .map((classroom: any) =>
                                                                typeof classroom === "object"
                                                                    ? classroom.name
                                                                    : classroom
                                                            )
                                                            .join(", ")
                                                        : "";

                                            return (

                                                <div
                                                    key={responsibility.id}
                                                    className="flex items-center justify-between gap-4 rounded-xl border p-4"
                                                >

                                                    <div className="min-w-0">

                                                        <p className="font-medium text-gray-900">

                                                            {levelName || "Niveau inconnu"}

                                                        </p>

                                                        <p className="mt-1 text-sm text-gray-500">

                                                            {responsibility.all_classes
                                                                ? "Toutes les classes"
                                                                : classroomNames ||
                                                                "Aucune classe sélectionnée"}

                                                        </p>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                responsibility.id
                                                            )
                                                        }
                                                        className="shrink-0 cursor-pointer rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                                        title="Supprimer"
                                                    >

                                                        <Trash2 size={18} />

                                                    </button>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>


                        {/* ==================================================
                         * FERMER
                         * ================================================== */}

                        <div className="flex justify-end border-t pt-4">

                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >

                                Fermer

                            </button>

                        </div>

                    </>

                )}

            </div>

        </Modal>

    );

}