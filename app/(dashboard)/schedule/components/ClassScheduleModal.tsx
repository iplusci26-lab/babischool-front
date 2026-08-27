"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";

import {
    ClassSchedule,
    ClassSchedulePayload,
    Weekday,
    WeekdayItem,
    WeeklyTimeSlot,
    AssignmentOption,
    SubjectOption,
} from "@/types/classSchedule";

interface ClassScheduleModalProps {
    open: boolean;
    schedule?: ClassSchedule | null;
    weekdays: WeekdayItem[];
    timeSlots: WeeklyTimeSlot[];
    assignments: AssignmentOption[];
    subjects: SubjectOption[];
    initialWeekday?: Weekday;
    initialTimeSlot?: string;
    onClose: () => void;
    onSubmit: (
        payload: ClassSchedulePayload
    ) => Promise<void>;
}

export default function ClassScheduleModal({
    open,
    schedule,
    weekdays,
    timeSlots,
    assignments,
    subjects,
    initialWeekday,
    initialTimeSlot,
    onClose,
    onSubmit,
}: ClassScheduleModalProps) {
    const [form, setForm] = useState<ClassSchedulePayload>({
        assignment: "",
        weekday: initialWeekday ?? "MONDAY",
        time_slot: initialTimeSlot ?? "",
        lesson_subject: null,
        room: "",
        schedule_classes: [],
    });

    const [loading, setLoading] = useState(false);

    const assignment = assignments.find(
        (item) => item.id === form.assignment
    );

    useEffect(() => {
        if (!open) {
            return;
        }

        if (schedule) {
            setForm({
                assignment: schedule.assignment,
                weekday: schedule.weekday,
                time_slot: schedule.time_slot,
                lesson_subject: schedule.lesson_subject,
                room: schedule.room ?? "",
                schedule_classes:
                    schedule.schedule_classes?.map((item) => ({
                        classroom: item.classroom,
                        classroom_group:
                            item.classroom_group ?? null,
                    })) ?? [],
            });
        } else {
            setForm({
                assignment: "",
                weekday: initialWeekday ?? "MONDAY",
                time_slot: initialTimeSlot ?? "",
                lesson_subject: null,
                room: "",
                schedule_classes: [],
            });
        }
    }, [
        open,
        schedule,
        initialWeekday,
        initialTimeSlot,
    ]);

    async function handleSubmit() {
        if (!form.assignment) {
            return;
        }

        if (!form.time_slot) {
            return;
        }

        if (
            assignment?.assignment_type === "PRIMARY" &&
            !form.lesson_subject
        ) {
            return;
        }

        setLoading(true);

        try {
            await onSubmit(form);
            onClose();
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            open={open}
            title={
                schedule
                    ? "Modifier la séance"
                    : "Nouvelle séance"
            }
            onClose={onClose}
            footer={
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border px-4 py-2"
                    >
                        Annuler
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-lg bg-violet-700 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Enregistrement..."
                            : "Enregistrer"}
                    </button>
                </div>
            }
        >
            <div className="space-y-5">

                {/* ================================================== */}
                {/* AFFECTATION */}
                {/* ================================================== */}

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Affectation
                    </label>

                    <select
                        value={form.assignment}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                assignment: e.target.value,
                                lesson_subject: null,
                                schedule_classes: [],
                            })
                        }
                        className="w-full rounded-lg border p-2"
                    >
                        <option value="">
                            Sélectionner...
                        </option>

                        {assignments.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ================================================== */}
                {/* JOUR */}
                {/* ================================================== */}

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Jour
                    </label>

                    <select
                        value={form.weekday}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                weekday:
                                    e.target.value as Weekday,
                            })
                        }
                        className="w-full rounded-lg border p-2"
                    >
                        {weekdays.map((day) => (
                            <option
                                key={day.value}
                                value={day.value}
                            >
                                {day.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ================================================== */}
                {/* CRÉNEAU */}
                {/* ================================================== */}

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Créneau
                    </label>

                    <select
                        value={form.time_slot}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                time_slot: e.target.value,
                            })
                        }
                        className="w-full rounded-lg border p-2"
                    >
                        <option value="">
                            Sélectionner...
                        </option>

                        {timeSlots
                            .filter(
                                (slot) =>
                                    slot.slot_type ===
                                    "LESSON" &&
                                    slot.is_active
                            )
                            .map((slot) => (
                                <option
                                    key={slot.id}
                                    value={slot.id}
                                >
                                    {slot.name} (
                                    {slot.start_time_display}
                                    {" - "}
                                    {slot.end_time_display}
                                    )
                                </option>
                            ))}
                    </select>
                </div>

                {/* ================================================== */}
                {/* MATIÈRE POUR PRIMARY */}
                {/* ================================================== */}

                {assignment?.assignment_type ===
                    "PRIMARY" && (
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Matière
                        </label>

                        <select
                            value={
                                form.lesson_subject ?? ""
                            }
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    lesson_subject:
                                        e.target.value ||
                                        null,
                                })
                            }
                            className="w-full rounded-lg border p-2"
                        >
                            <option value="">
                                Sélectionner...
                            </option>

                            {subjects.map((subject) => (
                                <option
                                    key={subject.id}
                                    value={subject.id}
                                >
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* ================================================== */}
                {/* SALLE */}
                {/* ================================================== */}

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Salle
                    </label>

                    <input
                        type="text"
                        value={form.room ?? ""}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                room: e.target.value,
                            })
                        }
                        placeholder="Ex : Salle 12"
                        className="w-full rounded-lg border p-2"
                    />
                </div>
            </div>
        </Modal>
    );
}