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

    schedule: ClassSchedule | null;

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

    schedule,

    onCellClick,

    onScheduleClick,

}: ScheduleCellProps) {

    /**
     * Pause
     */
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

    /**
     * Cellule vide
     */
    if (!schedule) {

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

    /**
     * Séance
     */
    return (

        <td
            className="cursor-pointer border p-2 transition hover:bg-violet-50"
            onClick={() =>
                onScheduleClick(
                    schedule
                )
            }
        >

            <div className="flex h-28 flex-col justify-between">

                <div>

                    <div className="flex items-center gap-2">

                        <BookOpen
                            size={16}
                            className="text-violet-700"
                        />

                        <span className="font-semibold text-violet-700">

                            {
                                schedule.lesson_subject_name
                                ??
                                schedule.subject_name
                            }

                        </span>

                    </div>

                    <div className="mt-2 text-sm text-gray-700">

                        {schedule.teacher_name}

                    </div>

                    <div className="text-xs text-gray-500">

                        {schedule.classroom_name}

                    </div>

                </div>

                {

                    schedule.room && (

                        <div className="text-xs text-gray-400">

                            Salle : {schedule.room}

                        </div>

                    )

                }

            </div>

        </td>

    );

}