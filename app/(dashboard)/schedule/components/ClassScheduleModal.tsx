"use client";

import { useEffect, useMemo, useState } from "react";

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
    // ======================================================
    // FORMULAIRE
    // ======================================================

    const [form, setForm] =
        useState<ClassSchedulePayload>({
            assignment: "",

            weekday:
                initialWeekday ?? "MONDAY",

            time_slot:
                initialTimeSlot ?? "",

            lesson_subject: null,

            room: "",

            schedule_classes: [],
        });

    // ======================================================
    // CHARGEMENT
    // ======================================================

    const [loading, setLoading] =
        useState(false);

    // ======================================================
    // AFFECTATION SÉLECTIONNÉE
    // ======================================================

    const assignment = useMemo(
        () =>
            assignments.find(
                (item) =>
                    item.id === form.assignment
            ),
        [assignments, form.assignment]
    );

    // ======================================================
    // CLASSES PARTICIPANTES DE L'AFFECTATION
    // ======================================================
    //
    // Pour un cours commun :
    //
    // assignment.course_group_classrooms
    //
    // contient toutes les classes associées au
    // cours commun.
    //
    // Pour une affectation classique :
    //
    // assignment.classroom
    // assignment.classroom_name
    // assignment.classroom_group
    // assignment.classroom_group_name
    //
    // permettent de reconstruire la classe participante.
    //
    // ======================================================

    const participantClasses = useMemo(() => {
        if (!assignment) {
            return [];
        }

        // --------------------------------------------------
        // COURS COMMUN
        // --------------------------------------------------

        if (
            assignment.course_group &&
            assignment.course_group_classrooms &&
            assignment.course_group_classrooms.length > 0
        ) {
            return assignment.course_group_classrooms.map(
                (classroom) => ({
                    classroom: classroom.id,
                    classroom_name:
                        classroom.name,
                    classroom_group: null,
                    classroom_group_name: null,
                })
            );
        }

        // --------------------------------------------------
        // AFFECTATION CLASSIQUE
        // --------------------------------------------------

        if (assignment.classroom) {
            return [
                {
                    classroom:
                        assignment.classroom,

                    classroom_name:
                        assignment.classroom_name ??
                        undefined,

                    classroom_group:
                        assignment.classroom_group ??
                        null,

                    classroom_group_name:
                        assignment.classroom_group_name ??
                        null,
                },
            ];
        }

        return [];
    }, [assignment]);

    // ======================================================
    // INITIALISATION DU FORMULAIRE
    // ======================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        // ==================================================
        // MODIFICATION
        // ==================================================

        if (schedule) {
            setForm({
                assignment:
                    schedule.assignment,

                weekday:
                    schedule.weekday,

                time_slot:
                    schedule.time_slot,

                lesson_subject:
                    schedule.lesson_subject,

                room:
                    schedule.room ?? "",

                schedule_classes:
                    schedule.schedule_classes?.map(
                        (item) => ({
                            classroom:
                                item.classroom,

                            classroom_group:
                                item.classroom_group ??
                                null,
                        })
                    ) ?? [],
            });

            return;
        }

        // ==================================================
        // CRÉATION
        // ==================================================

        setForm({
            assignment: "",

            weekday:
                initialWeekday ??
                "MONDAY",

            time_slot:
                initialTimeSlot ?? "",

            lesson_subject: null,

            room: "",

            schedule_classes: [],
        });
    }, [
        open,
        schedule,
        initialWeekday,
        initialTimeSlot,
    ]);

    // ======================================================
    // MISE À JOUR DES PARTICIPANTS
    // LORSQUE L'AFFECTATION CHANGE
    // ======================================================

    useEffect(() => {
        if (!open || schedule) {
            return;
        }

        if (!assignment) {
            return;
        }

        // ==================================================
        // CONSTRUCTION DE schedule_classes
        // ==================================================

        const scheduleClasses =
            participantClasses.map(
                (participant) => ({
                    classroom:
                        participant.classroom,

                    classroom_group:
                        participant.classroom_group ??
                        null,
                })
            );

        setForm((current) => ({
            ...current,

            schedule_classes:
                scheduleClasses,

            // Une affectation SUBJECT possède déjà
            // sa matière.
            //
            // Une affectation PRIMARY doit choisir
            // une matière spécifique pour la séance.
            lesson_subject:
                assignment.assignment_type ===
                "PRIMARY"
                    ? current.lesson_subject
                    : null,
        }));
    }, [
        open,
        schedule,
        assignment,
        participantClasses,
    ]);

    // ======================================================
    // SOUMISSION
    // ======================================================

    async function handleSubmit() {
        // --------------------------------------------------
        // AFFECTATION
        // --------------------------------------------------

        if (!form.assignment) {
            return;
        }

        // --------------------------------------------------
        // JOUR
        // --------------------------------------------------

        if (!form.weekday) {
            return;
        }

        // --------------------------------------------------
        // CRÉNEAU
        // --------------------------------------------------

        if (!form.time_slot) {
            return;
        }

        // --------------------------------------------------
        // PRIMARY → MATIÈRE OBLIGATOIRE
        // --------------------------------------------------

        if (
            assignment?.assignment_type ===
                "PRIMARY" &&
            !form.lesson_subject
        ) {
            return;
        }

        // --------------------------------------------------
        // UNE SÉANCE DOIT AVOIR AU MOINS
        // UNE CLASSE PARTICIPANTE
        // --------------------------------------------------

        if (
            !form.schedule_classes ||
            form.schedule_classes.length === 0
        ) {
            return;
        }

        // --------------------------------------------------
        // CONSTRUCTION DU PAYLOAD
        // --------------------------------------------------

        const payload: ClassSchedulePayload = {
            assignment:
                form.assignment,

            weekday:
                form.weekday,

            time_slot:
                form.time_slot,

            lesson_subject:
                assignment?.assignment_type ===
                "PRIMARY"
                    ? form.lesson_subject
                    : null,

            room:
                form.room?.trim() ?? "",

            schedule_classes:
                form.schedule_classes,
        };

        setLoading(true);

        try {
            await onSubmit(payload);

            onClose();
        } finally {
            setLoading(false);
        }
    }

    // ======================================================
    // RENDER
    // ======================================================

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
                        className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Annuler
                    </button>

                    <button
                        type="button"
                        onClick={
                            handleSubmit
                        }
                        disabled={
                            loading ||
                            !form.assignment ||
                            !form.time_slot ||
                            form.schedule_classes
                                ?.length === 0 ||
                            (assignment?.assignment_type ===
                                "PRIMARY" &&
                                !form.lesson_subject)
                        }
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
                    <label
                        htmlFor="schedule-assignment"
                        className="mb-1 block text-sm font-medium"
                    >
                        Affectation
                    </label>

                    <select
                        id="schedule-assignment"
                        value={
                            form.assignment
                        }
                        onChange={(e) => {
                            const assignmentId =
                                e.target.value;

                            const selectedAssignment =
                                assignments.find(
                                    (item) =>
                                        item.id ===
                                        assignmentId
                                );

                            const participants =
                                selectedAssignment
                                    ?.course_group_classrooms
                                    ?.map(
                                        (
                                            classroom
                                        ) => ({
                                            classroom:
                                                classroom.id,

                                            classroom_group:
                                                null,
                                        })
                                    ) ??
                                (selectedAssignment?.classroom
                                    ? [
                                          {
                                              classroom:
                                                  selectedAssignment.classroom,

                                              classroom_group:
                                                  selectedAssignment.classroom_group ??
                                                  null,
                                          },
                                      ]
                                    : []);

                            setForm(
                                (
                                    current
                                ) => ({
                                    ...current,

                                    assignment:
                                        assignmentId,

                                    lesson_subject:
                                        null,

                                    schedule_classes:
                                        participants,
                                })
                            );
                        }}
                        disabled={loading}
                        className="w-full rounded-lg border p-2 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                        <option value="">
                            Sélectionner...
                        </option>

                        {assignments.map(
                            (item) => (
                                <option
                                    key={
                                        item.id
                                    }
                                    value={
                                        item.id
                                    }
                                >
                                    {item.label}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* ================================================== */}
                {/* INFORMATIONS DE L'AFFECTATION */}
                {/* ================================================== */}

                {assignment && (
                    <div className="rounded-lg border bg-gray-50 p-3 text-sm">
                        <div className="font-medium text-gray-700">
                            Informations de l'affectation
                        </div>

                        <div className="mt-1 text-gray-600">
                            Type :{" "}
                            {assignment.assignment_type ===
                            "PRIMARY"
                                ? "Enseignement principal"
                                : "Enseignement d'une matière"}
                        </div>

                        {assignment.course_group_name && (
                            <div className="mt-1 text-gray-600">
                                Cours commun :{" "}
                                <span className="font-medium">
                                    {
                                        assignment.course_group_name
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* ================================================== */}
                {/* JOUR */}
                {/* ================================================== */}

                <div>
                    <label
                        htmlFor="schedule-weekday"
                        className="mb-1 block text-sm font-medium"
                    >
                        Jour
                    </label>

                    <select
                        id="schedule-weekday"
                        value={
                            form.weekday
                        }
                        onChange={(e) =>
                            setForm(
                                (current) => ({
                                    ...current,

                                    weekday:
                                        e.target
                                            .value as Weekday,
                                })
                            )
                        }
                        disabled={loading}
                        className="w-full rounded-lg border p-2 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                        {weekdays.map(
                            (day) => (
                                <option
                                    key={
                                        day.value
                                    }
                                    value={
                                        day.value
                                    }
                                >
                                    {day.label}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* ================================================== */}
                {/* CRÉNEAU */}
                {/* ================================================== */}

                <div>
                    <label
                        htmlFor="schedule-time-slot"
                        className="mb-1 block text-sm font-medium"
                    >
                        Créneau
                    </label>

                    <select
                        id="schedule-time-slot"
                        value={
                            form.time_slot
                        }
                        onChange={(e) =>
                            setForm(
                                (current) => ({
                                    ...current,

                                    time_slot:
                                        e.target
                                            .value,
                                })
                            )
                        }
                        disabled={loading}
                        className="w-full rounded-lg border p-2 disabled:cursor-not-allowed disabled:bg-gray-100"
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
                            .map(
                                (slot) => (
                                    <option
                                        key={
                                            slot.id
                                        }
                                        value={
                                            slot.id
                                        }
                                    >
                                        {
                                            slot.name
                                        }{" "}
                                        (
                                        {
                                            slot.start_time_display
                                        }{" "}
                                        -{" "}
                                        {
                                            slot.end_time_display
                                        }
                                        )
                                    </option>
                                )
                            )}
                    </select>
                </div>

                {/* ================================================== */}
                {/* MATIÈRE POUR PRIMARY */}
                {/* ================================================== */}

                {assignment?.assignment_type ===
                    "PRIMARY" && (
                    <div>
                        <label
                            htmlFor="schedule-lesson-subject"
                            className="mb-1 block text-sm font-medium"
                        >
                            Matière
                        </label>

                        <select
                            id="schedule-lesson-subject"
                            value={
                                form.lesson_subject ??
                                ""
                            }
                            onChange={(e) =>
                                setForm(
                                    (current) => ({
                                        ...current,

                                        lesson_subject:
                                            e.target
                                                .value ||
                                            null,
                                    })
                                )
                            }
                            disabled={
                                loading
                            }
                            className="w-full rounded-lg border p-2 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                            <option value="">
                                Sélectionner...
                            </option>

                            {subjects.map(
                                (
                                    subject
                                ) => (
                                    <option
                                        key={
                                            subject.id
                                        }
                                        value={
                                            subject.id
                                        }
                                    >
                                        {
                                            subject.name
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                )}

                {/* ================================================== */}
                {/* MATIÈRE POUR SUBJECT */}
                {/* ================================================== */}

                {assignment?.assignment_type ===
                    "SUBJECT" && (
                    <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                        La matière est déjà
                        définie par
                        l'affectation
                        pédagogique.
                    </div>
                )}

                {/* ================================================== */}
                {/* CLASSES / GROUPES PARTICIPANTS */}
                {/* ================================================== */}

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Classes / groupes participants
                    </label>

                    {participantClasses.length >
                    0 ? (
                        <div className="space-y-2 rounded-lg border bg-gray-50 p-3">
                            {participantClasses.map(
                                (
                                    participant
                                ) => (
                                    <div
                                        key={`${participant.classroom}-${participant.classroom_group ?? "all"}`}
                                        className="flex items-center justify-between rounded-md border bg-white px-3 py-2"
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">
                                                {
                                                    participant.classroom_name
                                                }
                                            </div>

                                            {participant.classroom_group_name && (
                                                <div className="text-xs text-gray-500">
                                                    Groupe :{" "}
                                                    {
                                                        participant.classroom_group_name
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700">
                                            Participant
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                            Aucune classe n'est
                            associée à cette
                            affectation.
                        </div>
                    )}
                </div>

                {/* ================================================== */}
                {/* SALLE */}
                {/* ================================================== */}

                <div>
                    <label
                        htmlFor="schedule-room"
                        className="mb-1 block text-sm font-medium"
                    >
                        Salle
                    </label>

                    <input
                        id="schedule-room"
                        type="text"
                        value={
                            form.room ?? ""
                        }
                        onChange={(e) =>
                            setForm(
                                (current) => ({
                                    ...current,

                                    room:
                                        e.target
                                            .value,
                                })
                            )
                        }
                        disabled={loading}
                        placeholder="Ex : Salle 12"
                        className="w-full rounded-lg border p-2 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                </div>
            </div>
        </Modal>
    );
}