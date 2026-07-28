"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {Pencil,Trash2,} from "lucide-react";
import TimeSlotModal, {TimeSlotFormData,} from "./components/TimeSlotModal";

import {
    createTimeSlot,
    deleteTimeSlot,
    getTimeSlots,
    updateTimeSlot,
} from "@/lib/api/timeSlots";

import { TimeSlot } from "@/types/timeSlot";

export default function TimeSlotsPage() {

    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);

    const [editingSlot, setEditingSlot] =
        useState<TimeSlot | null>(null);

    const [error, setError] =
        useState<string | null>(null);

    const loadTimeSlots = useCallback(async () => {

        try {

            setLoading(true);

            setError(null);

            const data = await getTimeSlots(true);

            setTimeSlots(data);

        } catch (err) {

            console.error(err);

            setError(
                "Impossible de charger les créneaux."
            );

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadTimeSlots();

    }, [loadTimeSlots]);

    const handleCreate = () => {

        setEditingSlot(null);

        setModalOpen(true);

    };

    const handleEdit = (
        slot: TimeSlot
    ) => {

        setEditingSlot(slot);

        setModalOpen(true);

    };

    const handleCloseModal = () => {

        if (saving) return;

        setModalOpen(false);

        setEditingSlot(null);

    };

    const handleSubmit = async (
        data: TimeSlotFormData
    ) => {

        try {

            setSaving(true);

            if (editingSlot) {

                await updateTimeSlot(
                    editingSlot.id,
                    data
                );

            } else {

                await createTimeSlot(data);

            }

            await loadTimeSlots();

            setModalOpen(false);

            setEditingSlot(null);
            toast.success("Créneau enregistré avec succès.");

        } catch (err) {

            console.error(err);

            toast.error("Impossible d'enregistrer le créneau.");

        } finally {

            setSaving(false);

        }

    };

    const handleDelete = async (
        slot: TimeSlot
    ) => {

        const confirmed = window.confirm(
            `Voulez-vous vraiment désactiver le créneau "${slot.name}" ?`
        );

        if (!confirmed) return;

        try {

            await deleteTimeSlot(slot.id);

            await loadTimeSlots();

        } catch (err) {

            console.error(err);

            toast.error("Impossible d'enregistrer le créneau.");

        }

    };

    return (
        <div className="space-y-6">
    
            {/* Header */}
            <div className="flex items-center justify-between">
    
                <div>
    
                    <h1 className="text-2xl font-bold">
                        Créneaux horaires
                    </h1>
    
                    <p className="text-sm text-gray-500">
                        Configurez les horaires utilisés par les emplois du temps.
                    </p>
    
                </div>
    
                <button
                    onClick={handleCreate}
                    className="rounded-lg bg-[#6214BE] px-4 py-2 text-white transition hover:bg-[#5110a0]"
                >
                    Nouveau créneau
                </button>
    
            </div>
    
            {/* Erreur */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}
    
            {/* Contenu */}
            {loading ? (
    
                <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
                    Chargement des créneaux...
                </div>
    
            ) : timeSlots.length === 0 ? (
    
                <div className="rounded-xl border bg-white p-8 text-center">
    
                    <h3 className="text-lg font-semibold text-gray-800">
                        Aucun créneau configuré
                    </h3>
    
                    <p className="mt-2 text-sm text-gray-500">
                        Commencez par créer votre premier créneau horaire.
                    </p>
    
                    <button
                        onClick={handleCreate}
                        className="mt-5 rounded-lg bg-[#6214BE] px-4 py-2 text-white transition hover:bg-[#5110a0]"
                    >
                        Nouveau créneau
                    </button>
    
                </div>
    
            ) : (
    
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
    
                    <table className="min-w-full">
    
                        <thead className="bg-gray-50">
    
                            <tr className="text-left text-sm font-semibold text-gray-700">
    
                                <th className="px-6 py-4">
                                    Ordre
                                </th>
    
                                <th className="px-6 py-4">
                                    Libellé
                                </th>
    
                                <th className="px-6 py-4">
                                    Horaire
                                </th>
    
                                <th className="px-6 py-4">
                                    Durée
                                </th>
    
                                <th className="px-6 py-4">
                                    Type
                                </th>
    
                                <th className="px-6 py-4">
                                    Statut
                                </th>
    
                                <th className="px-6 py-4 text-right">
                                    Actions
                                </th>
    
                            </tr>
    
                        </thead>
    
                        <tbody>
    
                            {timeSlots.map((slot) => (
    
                                <tr
                                    key={slot.id}
                                    className="border-t hover:bg-gray-50"
                                >
    
                                    <td className="px-6 py-4 font-medium">
                                        {slot.order}
                                    </td>
    
                                    <td className="px-6 py-4">
                                        {slot.name}
                                    </td>
    
                                    <td className="px-6 py-4">
                                        {slot.start_time_display}
                                        {" - "}
                                        {slot.end_time_display}
                                    </td>
    
                                    <td className="px-6 py-4">
                                        {slot.duration_minutes} min
                                    </td>
    
                                    <td className="px-6 py-4">
    
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                slot.slot_type === "LESSON"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-orange-100 text-orange-700"
                                            }`}
                                        >
                                            {slot.slot_type === "LESSON"
                                                ? "📘 Cours"
                                                : "☕ Pause"}
                                        </span>
    
                                    </td>
    
                                    <td className="px-6 py-4">
    
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                slot.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {slot.is_active
                                                ? "Actif"
                                                : "Désactivé"}
                                        </span>
    
                                    </td>
    
                                    <td className="px-6 py-4">
    
                                        <div className="flex justify-end gap-2">
    
                                            <button
                                                onClick={() => handleEdit(slot)}
                                                className="rounded-lg border px-3 py-1 text-sm transition hover:bg-gray-100"
                                            >
                                                Modifier
                                            </button>
    
                                            <button
                                                onClick={() => handleDelete(slot)}
                                                className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600 transition hover:bg-red-50"
                                            >
                                                Désactiver
                                            </button>
    
                                        </div>
    
                                    </td>
    
                                </tr>
    
                            ))}
    
                        </tbody>
    
                    </table>
    
                </div>
    
            )}
    
            {/* Modal */}
            <TimeSlotModal
                open={modalOpen}
                loading={saving}
                initialData={editingSlot}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />
    
        </div>
    );

}
    