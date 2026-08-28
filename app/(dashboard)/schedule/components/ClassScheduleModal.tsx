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
    // ==========================================================
    // FORMULAIRE
    // ==========================================================

    const [form, setForm] =
        useState<ClassSchedulePayload>({
            assignment: "",
            weekday: initialWeekday ?? "MONDAY",
            time_slot: initialTimeSlot ?? "",
            lesson_subject: null,
            room: "",
            schedule_classes: [],
        });

    const [loading, setLoading] =
        useState(false);

    // ==========================================================
    // CLASSES PARTICIPANTES
    // ==========================================================
    //
    // On garantit toujours un tableau.
    //
    // Cela évite :
    //
    // "form.schedule_classes is possibly undefined"
    //
    // ==========================================================

    const scheduleClasses =
        form.schedule_classes ?? [];

    // ==========================================================
    // AFFECTATION SÉLECTIONNÉE
    // ==========================================================

    const assignment = useMemo(() => {
        if (!form.assignment) {
            return undefined;
        }

        return assignments.find(
            (item) =>
                String(item.id) ===
                String(form.assignment)
        );
    }, [
        assignments,
        form.assignment,
    ]);

    // ==========================================================
    // CONSTRUCTION DES CLASSES PARTICIPANTES
    // ==========================================================
    //
    // CAS 1 :
    //
    // CourseGroup
    //
    //     course_group_classrooms
    //          ↓
    //     toutes les classes membres
    //
    // CAS 2 :
    //
    // Affectation normale
    //
    //     classroom
    //     classroom_group
    //
    // ==========================================================

    function buildParticipants(
        selectedAssignment?: AssignmentOption
    ) {
        if (!selectedAssignment) {
            return [];
        }

        // ======================================================
        // COURS COMMUN
        // ======================================================

        if (
            selectedAssignment.course_group_classrooms &&
            selectedAssignment.course_group_classrooms.length > 0
        ) {
            return selectedAssignment.course_group_classrooms.map(
                (classroom) => ({
                    classroom:
                        String(classroom.id),

                    classroom_group:
                        null,
                })
            );
        }

        // ======================================================
        // AFFECTATION NORMALE
        // ======================================================

        if (
            selectedAssignment.classroom !==
            undefined &&
            selectedAssignment.classroom !==
            null
        ) {
            return [
                {
                    classroom:
                        String(
                            selectedAssignment.classroom
                        ),

                    classroom_group:
                        selectedAssignment.classroom_group !==
                            undefined &&
                        selectedAssignment.classroom_group !==
                            null
                            ? String(
                                  selectedAssignment.classroom_group
                              )
                            : null,
                },
            ];
        }

        // ======================================================
        // AUCUNE CLASSE
        // ======================================================

        return [];
    }

    // ==========================================================
    // INFORMATIONS DES CLASSES PARTICIPANTES
    // ==========================================================
    //
    // IMPORTANT :
    //
    // On part de scheduleClasses.
    //
    // C'est exactement ce qui sera envoyé au backend.
    //
    // ==========================================================

    const participantClasses =
        useMemo(() => {
            if (!assignment) {
                return [];
            }

            return scheduleClasses.map(
                (participant) => {
                    const classroomId =
                        String(
                            participant.classroom
                        );

                    // ==================================================
                    // COURSE GROUP
                    // ==================================================

                    const courseGroupClassroom =
                        assignment.course_group_classrooms?.find(
                            (classroom) =>
                                String(
                                    classroom.id
                                ) ===
                                classroomId
                        );

                    if (
                        courseGroupClassroom
                    ) {
                        return {
                            classroom:
                                classroomId,

                            classroom_name:
                                courseGroupClassroom.name,

                            classroom_group:
                                null,

                            classroom_group_name:
                                null,
                        };
                    }

                    // ==================================================
                    // CLASSE DE L'AFFECTATION
                    // ==================================================

                    if (
                        assignment.classroom !==
                            undefined &&
                        assignment.classroom !==
                            null &&
                        String(
                            assignment.classroom
                        ) === classroomId
                    ) {
                        return {
                            classroom:
                                classroomId,

                            classroom_name:
                                assignment.classroom_name ??
                                "Classe",

                            classroom_group:
                                participant.classroom_group ??
                                null,

                            classroom_group_name:
                                assignment.classroom_group_name ??
                                null,
                        };
                    }

                    // ==================================================
                    // FALLBACK
                    // ==================================================

                    return {
                        classroom:
                            classroomId,

                        classroom_name:
                            "Classe",

                        classroom_group:
                            participant.classroom_group ??
                            null,

                        classroom_group_name:
                            null,
                    };
                }
            );
        }, [
            assignment,
            scheduleClasses,
        ]);

    // ==========================================================
    // VALIDATION
    // ==========================================================

    const isFormValid = useMemo(() => {
        // ------------------------------------------------------
        // Affectation
        // ------------------------------------------------------

        if (!form.assignment) {
            return false;
        }

        // ------------------------------------------------------
        // Jour
        // ------------------------------------------------------

        if (!form.weekday) {
            return false;
        }

        // ------------------------------------------------------
        // Créneau
        // ------------------------------------------------------

        if (!form.time_slot) {
            return false;
        }

        // ------------------------------------------------------
        // Affectation existante
        // ------------------------------------------------------

        if (!assignment) {
            return false;
        }

        // ------------------------------------------------------
        // Classe participante
        // ------------------------------------------------------

        if (scheduleClasses.length === 0) {
            return false;
        }

        // ------------------------------------------------------
        // PRIMARY → matière obligatoire
        // ------------------------------------------------------

        if (
            assignment.assignment_type ===
                "PRIMARY" &&
            !form.lesson_subject
        ) {
            return false;
        }

        return true;
    }, [
        form.assignment,
        form.weekday,
        form.time_slot,
        form.lesson_subject,
        assignment,
        scheduleClasses.length,
    ]);

    // ==========================================================
    // INITIALISATION
    // ==========================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        // ======================================================
        // MODIFICATION
        // ======================================================

        if (schedule) {
            setForm({
                assignment:
                    String(
                        schedule.assignment
                    ),

                weekday:
                    schedule.weekday,

                time_slot:
                    String(
                        schedule.time_slot
                    ),

                lesson_subject:
                    schedule.lesson_subject
                        ? String(
                              schedule.lesson_subject
                          )
                        : null,

                room:
                    schedule.room ?? "",

                schedule_classes:
                    schedule.schedule_classes?.map(
                        (item) => ({
                            classroom:
                                String(
                                    item.classroom
                                ),

                            classroom_group:
                                item.classroom_group !==
                                    undefined &&
                                item.classroom_group !==
                                    null
                                    ? String(
                                          item.classroom_group
                                      )
                                    : null,
                        })
                    ) ?? [],
            });

            return;
        }

        // ======================================================
        // CRÉATION
        // ======================================================

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

    // ==========================================================
    // CHANGEMENT D'AFFECTATION
    // ==========================================================

    function handleAssignmentChange(
        assignmentId: string
    ) {
        const selectedAssignment =
            assignments.find(
                (item) =>
                    String(item.id) ===
                    String(assignmentId)
            );

        const participants =
            buildParticipants(
                selectedAssignment
            );

        setForm((current) => ({
            ...current,

            assignment:
                assignmentId,

            lesson_subject:
                null,

            schedule_classes:
                participants,
        }));
    }

    // ==========================================================
    // SOUMISSION
    // ==========================================================

    async function handleSubmit() {
        // ------------------------------------------------------
        // Validation
        // ------------------------------------------------------

        if (!isFormValid) {
            return;
        }

        if (!assignment) {
            return;
        }

        // ------------------------------------------------------
        // Payload
        // ------------------------------------------------------

        const payload: ClassSchedulePayload = {
            assignment:
                String(
                    form.assignment
                ),

            weekday:
                form.weekday,

            time_slot:
                String(
                    form.time_slot
                ),

            lesson_subject:
                assignment.assignment_type ===
                "PRIMARY"
                    ? form.lesson_subject
                    : null,

            room:
                form.room?.trim() ?? "",

            schedule_classes:
                scheduleClasses.map(
                    (item) => ({
                        classroom:
                            String(
                                item.classroom
                            ),

                        classroom_group:
                            item.classroom_group !==
                                undefined &&
                            item.classroom_group !==
                                null
                                ? String(
                                      item.classroom_group
                                  )
                                : null,
                    })
                ),
        };

        // ------------------------------------------------------
        // Enregistrement
        // ------------------------------------------------------

        setLoading(true);

        try {
            await onSubmit(payload);

            onClose();
        } finally {
            setLoading(false);
        }
    }

    // ==========================================================
    // RENDER
    // ==========================================================

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
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                    {/* ==========================================
                        ANNULER
                    ========================================== */}

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            w-full
                            rounded-lg
                            border
                            px-4
                            py-2
                            text-sm
                            sm:w-auto
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        Annuler
                    </button>

                    {/* ==========================================
                        ENREGISTRER
                    ========================================== */}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            loading ||
                            !isFormValid
                        }
                        className="
                            w-full
                            rounded-lg
                            bg-violet-700
                            px-4
                            py-2
                            text-sm
                            text-white
                            sm:w-auto
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Enregistrement..."
                            : "Enregistrer"}
                    </button>
                </div>
            }
        >
            {/* ==================================================
                CONTENU SCROLLABLE
            ================================================== */}

            <div
                className="
                    max-h-[calc(100dvh-180px)]
                    overflow-y-auto
                    overscroll-contain
                    pr-1
                    sm:max-h-[calc(100dvh-200px)]
                    sm:pr-2
                "
            >
                <div className="space-y-5 pb-2">

                    {/* ==================================================
                        AFFECTATION
                    ================================================== */}

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
                            onChange={(e) =>
                                handleAssignmentChange(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                p-2
                                text-sm
                                disabled:cursor-not-allowed
                                disabled:bg-gray-100
                            "
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
                                        {
                                            item.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* ==================================================
                        INFORMATIONS AFFECTATION
                    ================================================== */}

                    {assignment && (
                        <div
                            className="
                                rounded-lg
                                border
                                bg-gray-50
                                p-3
                                text-sm
                            "
                        >
                            <div className="font-medium text-gray-700">
                                Informations de
                                l'affectation
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

                            {!assignment.course_group_name &&
                                assignment.classroom_name && (
                                    <div className="mt-1 text-gray-600">
                                        Classe :{" "}
                                        <span className="font-medium">
                                            {
                                                assignment.classroom_name
                                            }
                                        </span>
                                    </div>
                                )}

                            {assignment.classroom_group_name && (
                                <div className="mt-1 text-gray-600">
                                    Groupe :{" "}
                                    <span className="font-medium">
                                        {
                                            assignment.classroom_group_name
                                        }
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ==================================================
                        JOUR
                    ================================================== */}

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
                                    (
                                        current
                                    ) => ({
                                        ...current,

                                        weekday:
                                            e.target
                                                .value as Weekday,
                                    })
                                )
                            }
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                p-2
                                text-sm
                                disabled:cursor-not-allowed
                                disabled:bg-gray-100
                            "
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
                                        {
                                            day.label
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* ==================================================
                        CRÉNEAU
                    ================================================== */}

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
                                    (
                                        current
                                    ) => ({
                                        ...current,

                                        time_slot:
                                            e.target
                                                .value,
                                    })
                                )
                            }
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                border
                                p-2
                                text-sm
                                disabled:cursor-not-allowed
                                disabled:bg-gray-100
                            "
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
                                    (
                                        slot
                                    ) => (
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

                    {/* ==================================================
                        MATIÈRE PRIMARY
                    ================================================== */}

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
                                        (
                                            current
                                        ) => ({
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
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    p-2
                                    text-sm
                                    disabled:cursor-not-allowed
                                    disabled:bg-gray-100
                                "
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

                    {/* ==================================================
                        MATIÈRE SUBJECT
                    ================================================== */}

                    {assignment?.assignment_type ===
                        "SUBJECT" && (
                        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                            La matière est déjà
                            définie par
                            l'affectation
                            pédagogique.
                        </div>
                    )}

                    {/* ==================================================
                        CLASSES PARTICIPANTES
                    ================================================== */}

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Classes / groupes
                            participants
                        </label>

                        {participantClasses.length >
                        0 ? (
                            <div
                                className="
                                    space-y-2
                                    rounded-lg
                                    border
                                    bg-gray-50
                                    p-3
                                "
                            >
                                {participantClasses.map(
                                    (
                                        participant
                                    ) => (
                                        <div
                                            key={`${participant.classroom}-${participant.classroom_group ?? "all"}`}
                                            className="
                                                flex
                                                flex-col
                                                gap-2
                                                rounded-md
                                                border
                                                bg-white
                                                px-3
                                                py-2
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                            "
                                        >
                                            <div className="min-w-0">
                                                <div className="break-words text-sm font-medium text-gray-800">
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

                                            <span
                                                className="
                                                    w-fit
                                                    shrink-0
                                                    rounded-full
                                                    bg-violet-100
                                                    px-2
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    text-violet-700
                                                "
                                            >
                                                Participant
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div
                                className="
                                    rounded-lg
                                    bg-amber-50
                                    p-3
                                    text-sm
                                    text-amber-700
                                "
                            >
                                {assignment
                                    ? "Aucune classe n'est associée à cette affectation."
                                    : "Sélectionnez une affectation pour afficher les classes participantes."}
                            </div>
                        )}
                    </div>

                    {/* ==================================================
                        SALLE
                    ================================================== */}

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
                                    (
                                        current
                                    ) => ({
                                        ...current,

                                        room: e.target
                                            .value,
                                    })
                                )
                            }
                            disabled={loading}
                            placeholder="Ex : Salle 12"
                            className="
                                w-full
                                rounded-lg
                                border
                                p-2
                                text-sm
                                disabled:cursor-not-allowed
                                disabled:bg-gray-100
                            "
                        />
                    </div>

                </div>
            </div>
        </Modal>
    );
}