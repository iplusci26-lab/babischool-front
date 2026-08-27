"use client";

import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import ScheduleFilter from "./components/ScheduleFilters";
import WeeklyScheduleGrid from "./components/WeeklyScheduleGrid";
import ClassScheduleModal from "./components/ClassScheduleModal";

import {
    createSchedule,
    deleteSchedule,
    getWeeklySchedule,
    updateSchedule,
    getScheduleFilters,
    getScheduleFormData,
} from "@/lib/api/classSchedules";

import {
    ClassSchedule,
    ClassSchedulePayload,
    ScheduleFilter as ScheduleFiltersType,
    Weekday,
    WeeklyScheduleResponse,
    WeeklyTimeSlot,
    ScheduleFiltersResponse,
    ScheduleFormDataResponse,
} from "@/types/classSchedule";

export default function ClassSchedulesPage() {
    // ======================================================
    // EMPLOI DU TEMPS
    // ======================================================

    const [weeklySchedule, setWeeklySchedule] =
        useState<WeeklyScheduleResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    // ======================================================
    // FILTRES
    // ======================================================

    const [filters, setFilters] =
        useState<ScheduleFiltersType>({});

    // ======================================================
    // MODAL
    // ======================================================

    const [modalOpen, setModalOpen] =
        useState(false);

    const [selectedSchedule, setSelectedSchedule] =
        useState<ClassSchedule | null>(null);

    const [selectedWeekday, setSelectedWeekday] =
        useState<Weekday>("MONDAY");

    const [selectedTimeSlot, setSelectedTimeSlot] =
        useState("");

    // ======================================================
    // DONNÉES DES FILTRES
    // ======================================================

    const [scheduleFilters, setScheduleFilters] =
        useState<ScheduleFiltersResponse>({
            classrooms: [],
            teachers: [],
        });

    // ======================================================
    // DONNÉES DU FORMULAIRE
    // ======================================================

    const [formData, setFormData] =
        useState<ScheduleFormDataResponse>({
            assignments: [],
            subjects: [],
        });

    // ======================================================
    // CHARGEMENT DE L'EMPLOI DU TEMPS
    // ======================================================

    async function loadSchedule() {
        setLoading(true);

        try {
            const data = await getWeeklySchedule(filters);

            setWeeklySchedule(data);
        } catch (error) {
            console.error(
                "Erreur lors du chargement de l'emploi du temps :",
                error
            );

            toast.error(
                "Impossible de charger l'emploi du temps."
            );
        } finally {
            setLoading(false);
        }
    }

    // ======================================================
    // CHARGEMENT DES DONNÉES DU FORMULAIRE
    // ======================================================

    async function loadFormData() {
        try {
            const [
                filtersData,
                formDataResponse,
            ] = await Promise.all([
                getScheduleFilters(),
                getScheduleFormData(),
            ]);

            setScheduleFilters(filtersData);
            setFormData(formDataResponse);
        } catch (error) {
            console.error(
                "Erreur lors du chargement des données du formulaire :",
                error
            );

            toast.error(
                "Impossible de charger les données du formulaire."
            );
        }
    }

    // ======================================================
    // CHARGEMENT INITIAL
    // ======================================================

    useEffect(() => {
        loadFormData();
    }, []);

    // ======================================================
    // RECHARGEMENT DE LA GRILLE
    // ======================================================

    useEffect(() => {
        loadSchedule();
    }, [filters]);

    // ======================================================
    // CRÉATION D'UNE SÉANCE
    // ======================================================

    function handleCreate(
        weekday: Weekday,
        slot: WeeklyTimeSlot
    ) {
        setSelectedSchedule(null);

        setSelectedWeekday(weekday);

        setSelectedTimeSlot(slot.id);

        setModalOpen(true);
    }

    // ======================================================
    // MODIFICATION D'UNE SÉANCE
    // ======================================================

    function handleEdit(
        schedule: ClassSchedule
    ) {
        setSelectedSchedule(schedule);

        setModalOpen(true);
    }

    // ======================================================
    // ENREGISTREMENT
    // ======================================================

    async function handleSubmit(
        payload: ClassSchedulePayload
    ) {
        console.log(
            "PAYLOAD EMPLOI DU TEMPS :",
            JSON.stringify(payload, null, 2)
        );
        try {
            if (selectedSchedule) {
                // --------------------------------------------------
                // MODIFICATION
                // --------------------------------------------------

                await updateSchedule(
                    selectedSchedule.id,
                    payload
                );

                toast.success(
                    "La séance a été modifiée."
                );
            } else {
                // --------------------------------------------------
                // CRÉATION
                // --------------------------------------------------

                await createSchedule(payload);

                toast.success(
                    "La séance a été créée."
                );
            }

            setModalOpen(false);

            setSelectedSchedule(null);

            await loadSchedule();

        } catch (error) {
            console.error(
                "Erreur lors de l'enregistrement :",
                error
            );

            if (axios.isAxiosError(error)) {
                const data = error.response?.data;

                // --------------------------------------------------
                // Message texte
                // --------------------------------------------------

                if (typeof data === "string") {
                    toast.error(data);
                    return;
                }

                // --------------------------------------------------
                // Erreurs DRF
                // --------------------------------------------------

                if (
                    data &&
                    typeof data === "object"
                ) {
                    const messages = Object.values(data)
                        .flatMap((value) => {
                            if (Array.isArray(value)) {
                                return value;
                            }

                            return [value];
                        })
                        .filter(
                            (value) =>
                                typeof value === "string"
                        )
                        .join("\n");

                    if (messages) {
                        toast.error(messages);
                        return;
                    }
                }
            }

            toast.error(
                "Une erreur est survenue."
            );
        }
    }

    // ======================================================
    // SUPPRESSION
    // ======================================================

    async function handleDelete() {
        if (!selectedSchedule) {
            return;
        }

        try {
            await deleteSchedule(
                selectedSchedule.id
            );

            toast.success(
                "La séance a été supprimée."
            );

            setModalOpen(false);

            setSelectedSchedule(null);

            await loadSchedule();

        } catch (error) {
            console.error(
                "Erreur lors de la suppression :",
                error
            );

            if (axios.isAxiosError(error)) {
                const data = error.response?.data;

                if (typeof data === "string") {
                    toast.error(data);
                    return;
                }

                if (
                    data &&
                    typeof data === "object"
                ) {
                    const messages = Object.values(data)
                        .flatMap((value) => {
                            if (Array.isArray(value)) {
                                return value;
                            }

                            return [value];
                        })
                        .filter(
                            (value) =>
                                typeof value === "string"
                        )
                        .join("\n");

                    if (messages) {
                        toast.error(messages);
                        return;
                    }
                }
            }

            toast.error(
                "Impossible de supprimer la séance."
            );
        }
    }

    // ======================================================
    // CHARGEMENT
    // ======================================================

    if (loading) {
        return (
            <div className="p-6">
                Chargement...
            </div>
        );
    }

    // ======================================================
    // ERREUR DE CHARGEMENT
    // ======================================================

    if (!weeklySchedule) {
        return (
            <div className="p-6">
                Impossible de charger l'emploi du temps.
            </div>
        );
    }

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="space-y-6 p-6">

            {/* ==================================================
                EN-TÊTE
            ================================================== */}

            <div>
                <h1 className="text-2xl font-bold">
                    Emploi du temps
                </h1>

                <p className="text-sm text-gray-500">
                    Gestion des heures de cours
                </p>
            </div>

            {/* ==================================================
                FILTRES
            ================================================== */}

            <ScheduleFilter
                filters={filters}
                onChange={setFilters}
                classrooms={scheduleFilters.classrooms}
                teachers={scheduleFilters.teachers}
            />

            {/* ==================================================
                GRILLE
            ================================================== */}

            <WeeklyScheduleGrid
                weekdays={weeklySchedule.weekdays}
                timeSlots={weeklySchedule.time_slots}
                grid={weeklySchedule.grid}
                onCellClick={handleCreate}
                onScheduleClick={handleEdit}
            />

            {/* ==================================================
                MODAL
            ================================================== */}

            <ClassScheduleModal
                open={modalOpen}
                schedule={selectedSchedule}
                weekdays={weeklySchedule.weekdays}
                timeSlots={weeklySchedule.time_slots}
                assignments={formData.assignments}
                subjects={formData.subjects}
                initialWeekday={selectedWeekday}
                initialTimeSlot={selectedTimeSlot}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedSchedule(null);
                }}
                onSubmit={handleSubmit}
            />
        </div>
    );
}