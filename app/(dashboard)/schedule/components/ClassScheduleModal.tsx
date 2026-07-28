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
    });

    const [loading, setLoading] = useState(false);

    const assignment = assignments.find(
        (a) => a.id === form.assignment
    );
   
    useEffect(() => {

        if (!open) return;

        if (schedule) {

            setForm({

                assignment: schedule.assignment,

                weekday: schedule.weekday,

                time_slot: schedule.time_slot,

                lesson_subject: schedule.lesson_subject,

                room: schedule.room,

            });

        } else {

            setForm({

                assignment: "",

                weekday: initialWeekday ?? "MONDAY",

                time_slot: initialTimeSlot ?? "",

                lesson_subject: null,

                room: "",

            });

        }

    }, [
        open,
        schedule,
        initialWeekday,
        initialTimeSlot,
    ]);

    async function handleSubmit() {

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
                        onClick={onClose}
                        className="rounded-lg border px-4 py-2"
                    >
                        Annuler
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-lg bg-violet-700 px-4 py-2 text-white"
                    >
                        {
                            loading
                                ? "Enregistrement..."
                                : "Enregistrer"
                        }
                    </button>

                </div>
            }
        >

            <div className="space-y-5">

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
                            })
                        }
                        className="w-full rounded-lg border p-2"
                    >

                        <option value="">
                            Sélectionner...
                        </option>

                        {

                            assignments.map((item) => (

                                <option
                                    key={item.id}
                                    value={item.id}
                                >

                                    {item.label}

                                </option>

                            ))

                        }

                    </select>

                </div>

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

                        {

                            weekdays.map((day) => (

                                <option
                                    key={day.value}
                                    value={day.value}
                                >

                                    {day.label}

                                </option>

                            ))

                        }

                    </select>

                </div>

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

                        {

                            timeSlots
                                .filter(
                                    (slot) =>
                                        slot.slot_type === "LESSON"
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

                                ))

                        }

                    </select>

                </div>

                {

                    assignment?.assignment_type ===
                        "PRIMARY" && (

                        <div>

                            <label className="mb-1 block text-sm font-medium">

                                Matière

                            </label>

                            <select
                                value={
                                    form.lesson_subject ??
                                    ""
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

                                {

                                    subjects.map((subject) => (

                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >

                                            {subject.name}

                                        </option>

                                    ))

                                }

                            </select>

                        </div>

                    )

                }

                <div>

                    <label className="mb-1 block text-sm font-medium">

                        Salle

                    </label>

                    <input
                        value={form.room ?? ""}
                        onChange={(e) =>
                            setForm({

                                ...form,

                                room: e.target.value,

                            })
                        }
                        className="w-full rounded-lg border p-2"
                    />

                </div>

            </div>

        </Modal>

    );

}