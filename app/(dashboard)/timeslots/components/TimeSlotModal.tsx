"use client";

import { useEffect, useMemo, useState } from "react";

import { TimeSlot } from "@/types/timeSlot";

export interface TimeSlotFormData {
    name: string;
    order: number;
    start_time: string;
    end_time: string;
    slot_type: "LESSON" | "BREAK" | "EXAM";
    is_active: boolean;
}

interface TimeSlotModalProps {
    open: boolean;
    loading: boolean;
    initialData?: TimeSlot | null;
    onClose: () => void;
    onSubmit: (data: TimeSlotFormData) => Promise<void>;
}

const DEFAULT_FORM: TimeSlotFormData = {
    name: "",
    order: 1,
    start_time: "",
    end_time: "",
    slot_type: "LESSON",
    is_active: true,
};

export default function TimeSlotModal({
    open,
    loading,
    initialData,
    onClose,
    onSubmit,
}: TimeSlotModalProps) {
    const [form, setForm] =
        useState<TimeSlotFormData>(DEFAULT_FORM);

    useEffect(() => {
        if (!open) return;

        if (!initialData) {
            setForm(DEFAULT_FORM);
            return;
        }

        setForm({
            name: initialData.name,
            order: initialData.order,
            start_time: initialData.start_time.slice(0, 5),
            end_time: initialData.end_time.slice(0, 5),
            slot_type: initialData.slot_type,
            is_active: initialData.is_active,
        });
    }, [open, initialData]);

    const updateField = <
        K extends keyof TimeSlotFormData
    >(
        field: K,
        value: TimeSlotFormData[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const isValid = useMemo(() => {
        return (
            form.name.trim() !== "" &&
            form.order > 0 &&
            form.start_time !== "" &&
            form.end_time !== "" &&
            form.start_time < form.end_time
        );
    }, [form]);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!isValid || loading) return;

        await onSubmit(form);
    };

    const title = initialData
        ? "Modifier l'heure"
        : "Nouvelle heure";

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="text-2xl text-gray-500 transition hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>

                    <div className="space-y-5 px-6 py-5">

                        {/* Nom */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Libellé de l'heure
                            </label>

                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    updateField("name", e.target.value)
                                }
                                className="w-full rounded-lg border px-3 py-2 focus:border-[#6214BE] focus:outline-none"
                                placeholder="Ex : 1er cours"
                            />
                        </div>

                        {/* Ordre */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Ordre
                            </label>

                            <input
                                type="number"
                                min={1}
                                step={1}
                                value={form.order}
                                onChange={(e) =>
                                    updateField(
                                        "order",
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2 focus:border-[#6214BE] focus:outline-none"
                            />
                        </div>

                        {/* Horaires */}
                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Heure de début
                                </label>

                                <input
                                    type="time"
                                    value={form.start_time}
                                    onChange={(e) =>
                                        updateField(
                                            "start_time",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2 focus:border-[#6214BE] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Heure de fin
                                </label>

                                <input
                                    type="time"
                                    value={form.end_time}
                                    onChange={(e) =>
                                        updateField(
                                            "end_time",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2 focus:border-[#6214BE] focus:outline-none"
                                />
                            </div>

                        </div>

                        {/* Type */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Type
                            </label>

                            <select
                                value={form.slot_type}
                                onChange={(e) =>
                                    updateField(
                                        "slot_type",
                                        e.target.value as "LESSON" | "BREAK"
                                    )
                                }
                                className="w-full rounded-lg border px-3 py-2 focus:border-[#6214BE] focus:outline-none"
                            >
                                <option value="LESSON">
                                    📘 Cours
                                </option>

                                <option value="BREAK">
                                    ☕ Pause
                                </option>
                            </select>

                            {form.slot_type === "BREAK" && (
                                <p className="mt-2 rounded-md bg-orange-50 p-3 text-sm text-orange-700">
                                    ☕ Les heures de type <strong>Pause</strong>{" "}
                                    apparaîtront dans l'emploi du temps mais ne
                                    pourront pas accueillir de séance
                                    d'enseignement.
                                </p>
                            )}
                        </div>

                        {/* Actif */}
                        <div className="flex items-center justify-between rounded-lg border p-4">

                            <div>
                                <p className="font-medium text-gray-800">
                                    Heure active
                                </p>

                                <p className="text-sm text-gray-500">
                                    Les heures de cours désactivéss ne seront plus
                                    proposées dans les emplois du temps.
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) =>
                                    updateField(
                                        "is_active",
                                        e.target.checked
                                    )
                                }
                                className="h-5 w-5 accent-[#6214BE]"
                            />

                        </div>

                        {/* Validation */}
                        {form.start_time !== "" &&
                            form.end_time !== "" &&
                            form.start_time >= form.end_time && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                    L'heure de fin doit être postérieure à
                                    l'heure de début.
                                </div>
                            )}

                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t px-6 py-4">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-lg border px-5 py-2 font-medium transition hover:bg-gray-100"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={!isValid || loading}
                            className="rounded-lg bg-[#6214BE] px-5 py-2 font-medium text-white transition hover:bg-[#5110a0] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Enregistrement..."
                                : "Enregistrer"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}