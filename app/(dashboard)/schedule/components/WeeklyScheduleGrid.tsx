"use client";

import {
    ClassSchedule,
    Weekday,
    WeekdayItem,
    WeeklyScheduleGrids,
    WeeklyTimeSlot,
} from "@/types/classSchedule";

import ScheduleCell from "./ScheduleCell";

interface WeeklyScheduleGridProps {

    weekdays: WeekdayItem[];

    timeSlots: WeeklyTimeSlot[];

    grid: WeeklyScheduleGrids;

    onCellClick: (
        weekday: Weekday,
        timeSlot: WeeklyTimeSlot
    ) => void;

    onScheduleClick: (
        schedule: ClassSchedule
    ) => void;

}

export default function WeeklyScheduleGrid({

    weekdays,

    timeSlots,

    grid,

    onCellClick,

    onScheduleClick,

}: WeeklyScheduleGridProps) {

    return (

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">

            <table className="min-w-full border-collapse">

                <thead>

                    <tr className="bg-gray-50">

                        <th className="w-44 border px-4 py-3 text-left text-sm font-semibold">

                            Heure

                        </th>

                        {

                            weekdays.map((day) => (

                                <th
                                    key={day.value}
                                    className="border px-4 py-3 text-center text-sm font-semibold"
                                >

                                    {day.label}

                                </th>

                            ))

                        }

                    </tr>

                </thead>

                <tbody>

                    {

                        timeSlots.map((slot) => (

                            <tr
                                key={slot.id}
                                className="hover:bg-gray-50"
                            >

                                <td className="border bg-gray-50 px-3 py-3 align-top">

                                    <div className="font-medium">

                                        {slot.name}

                                    </div>

                                    <div className="text-xs text-gray-500">

                                        {slot.start_time_display}

                                        {" - "}

                                        {slot.end_time_display}

                                    </div>

                                </td>

                                {

                                    weekdays.map((day) => {

                                        const schedule =
                                            grid[day.value]?.[slot.id] ?? null;

                                        return (

                                            <ScheduleCell

                                                key={`${day.value}-${slot.id}`}

                                                weekday={day.value}

                                                timeSlot={slot}

                                                schedule={schedule}

                                                onCellClick={onCellClick}

                                                onScheduleClick={onScheduleClick}

                                            />

                                        );

                                    })

                                }

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}