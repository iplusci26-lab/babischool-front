"use client";

import {
    BookOpen,
    Coffee,
    Plus,
} from "lucide-react";

import {
    ClassSchedule,
    Weekday,
    WeeklyTimeSlot,
} from "@/types/classSchedule";

interface ScheduleCellProps {
    weekday: Weekday;

    timeSlot: WeeklyTimeSlot;

    schedules: ClassSchedule[];

    onCellClick: (
        weekday: Weekday,
        timeSlot: WeeklyTimeSlot
    ) => void;

    onScheduleClick: (
        schedule: ClassSchedule
    ) => void;
}

export default function ScheduleCell({
    weekday,
    timeSlot,
    schedules,
    onCellClick,
    onScheduleClick,
}: ScheduleCellProps) {
    // ==========================================================
    // PAUSE
    // ==========================================================

    if (timeSlot.slot_type === "BREAK") {
        return (
            <td className="border bg-amber-50">
                <div className="flex h-28 flex-col items-center justify-center text-amber-700">
                    <Coffee size={22} />

                    <span className="mt-2 text-xs font-medium">
                        Pause
                    </span>
                </div>
            </td>
        );
    }

    // ==========================================================
    // CELLULE VIDE
    // ==========================================================

    if (schedules.length === 0) {
        return (
            <td
                className="cursor-pointer border transition hover:bg-violet-50"
                onClick={() =>
                    onCellClick(
                        weekday,
                        timeSlot
                    )
                }
            >
                <div className="flex h-28 items-center justify-center">
                    <Plus
                        size={22}
                        className="text-gray-400"
                    />
                </div>
            </td>
        );
    }

    // ==========================================================
    // CELLULE AVEC SÉANCES
    // ==========================================================

    return (
        <td className="border p-1 align-top">
            <div className="flex min-h-28 flex-col gap-1">

                {schedules.map((schedule) => {
                    // ==================================================
                    // MATIÈRE
                    // ==================================================

                    const subjectName =
                        schedule.lesson_subject_name ??
                        schedule.subject_name ??
                        "Matière";

                    // ==================================================
                    // PARTICIPANTS
                    // ==================================================
                    //
                    // PRIORITÉ :
                    //
                    // 1. schedule_classes si réellement renseigné
                    // 2. classroom_name de la réponse de la grille
                    //
                    // L'API de la grille renvoie actuellement :
                    //
                    // classroom_id
                    // classroom_name
                    // classroom_group_id
                    // classroom_group_name
                    //
                    // et non nécessairement schedule_classes.
                    // ==================================================

                    const scheduleClasses =
                        schedule.schedule_classes ??
                        [];

                    const hasScheduleClasses =
                        scheduleClasses.length > 0;

                    // ==================================================
                    // CLASSE À AFFICHER
                    // ==================================================

                    const classroomName =
                        schedule.classroom_name ??
                        null;

                    const classroomGroupName =
                        schedule.classroom_group_name ??
                        null;

                    // ==================================================
                    // COURS COMMUN
                    // ==================================================
                    //
                    // Si schedule_classes existe, on les utilise.
                    //
                    // Sinon on utilise les informations aplaties
                    // fournies par l'API de la grille.
                    //
                    // ==================================================

                    return (
                        <div
                            key={schedule.id}
                            onClick={() =>
                                onScheduleClick(
                                    schedule
                                )
                            }
                            className="
                                cursor-pointer
                                rounded-lg
                                border
                                border-violet-100
                                bg-violet-50
                                p-2
                                transition
                                hover:border-violet-300
                                hover:bg-violet-100
                            "
                        >
                            {/* ==================================================
                                MATIÈRE
                            ================================================== */}

                            <div className="flex items-start gap-1.5">
                                <BookOpen
                                    size={15}
                                    className="mt-0.5 shrink-0 text-violet-700"
                                />

                                <span className="text-sm font-semibold text-violet-700">
                                    {subjectName}
                                </span>
                            </div>

                            {/* ==================================================
                                COURS COMMUN
                            ================================================== */}

                            {schedule.course_group_name && (
                                <div className="mt-1 text-xs font-medium text-violet-600">
                                    Cours commun :{" "}
                                    {
                                        schedule.course_group_name
                                    }
                                </div>
                            )}

                            {/* ==================================================
                                CLASSES / GROUPES
                            ================================================== */}

                            <div className="mt-1 text-xs text-gray-600">

                                {/* ------------------------------------------
                                    CAS 1 :
                                    schedule_classes fourni par l'API
                                ------------------------------------------ */}

                                {hasScheduleClasses ? (
                                    <div className="space-y-0.5">
                                        {scheduleClasses.map(
                                            (
                                                participant,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        participant.id ??
                                                        `${participant.classroom}-${participant.classroom_group ?? "all"}-${index}`
                                                    }
                                                >
                                                    <span className="font-medium">
                                                        {
                                                            participant.classroom_name ??
                                                            participant.classroom
                                                        }
                                                    </span>

                                                    {participant.classroom_group_name && (
                                                        <>
                                                            {" • "}

                                                            <span className="text-violet-600">
                                                                Groupe{" "}
                                                                {
                                                                    participant.classroom_group_name
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : classroomName ? (
                                    /* ------------------------------------------
                                        CAS 2 :
                                        API grille = classroom_name
                                    ------------------------------------------ */

                                    <div>
                                        <span className="font-medium">
                                            {classroomName}
                                        </span>

                                        {classroomGroupName && (
                                            <>
                                                {" • "}

                                                <span className="text-violet-600">
                                                    Groupe{" "}
                                                    {
                                                        classroomGroupName
                                                    }
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    /* ------------------------------------------
                                        CAS 3 :
                                        aucune classe
                                    ------------------------------------------ */

                                    <div className="text-gray-400">
                                        Classe non renseignée
                                    </div>
                                )}
                            </div>

                            {/* ==================================================
                                ENSEIGNANT
                            ================================================== */}

                            {schedule.teacher_name && (
                                <div className="mt-1 text-xs text-gray-700">
                                    {schedule.teacher_name}
                                </div>
                            )}

                            {/* ==================================================
                                SALLE
                            ================================================== */}

                            {schedule.room && (
                                <div className="mt-1 text-[11px] text-gray-500">
                                    Salle :{" "}
                                    {schedule.room}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* ==========================================================
                    AJOUTER UNE AUTRE SÉANCE
                ========================================================== */}

                <button
                    type="button"
                    onClick={() =>
                        onCellClick(
                            weekday,
                            timeSlot
                        )
                    }
                    className="
                        flex
                        items-center
                        justify-center
                        rounded-md
                        py-1
                        text-gray-400
                        transition
                        hover:bg-gray-100
                        hover:text-violet-600
                    "
                    title="Ajouter un cours"
                >
                    <Plus size={16} />
                </button>
            </div>
        </td>
    );
}