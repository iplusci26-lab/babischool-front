"use client";

import {
    ClassroomOption,
    ScheduleFilter,
    TeacherOption,
} from "@/types/classSchedule";

interface ScheduleFiltersProps {

    filters: ScheduleFilter;

    classrooms: ClassroomOption[];

    teachers: TeacherOption[];

    onChange: (
        filters: ScheduleFilter
    ) => void;

}

export default function ScheduleFilters({

    filters,

    classrooms,

    teachers,

    onChange,

}: ScheduleFiltersProps) {
   
    return (

        <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">

            <div className="grid gap-4 md:grid-cols-2">

                {/* Classe */}

                <div>

                    <label className="mb-1 block text-sm font-medium">

                        Classe

                    </label>

                    <select

                        value={filters.classroom ?? ""}

                        onChange={(e) =>
                            onChange({
                                ...filters,
                                classroom:
                                    e.target.value || undefined,
                            })
                        }

                        className="w-full rounded-lg border px-3 py-2"

                    >

                        <option value="">

                            Toutes les classes

                        </option>

                        {

                            classrooms.map((classroom) => (

                                <option

                                    key={classroom.id}

                                    value={classroom.id}

                                >

                                    {classroom.name}

                                </option>

                            ))

                        }

                    </select>

                </div>

                {/* Enseignant */}

                <div>

                    <label className="mb-1 block text-sm font-medium">

                        Enseignant

                    </label>

                    <select

                        value={filters.teacher ?? ""}

                        onChange={(e) =>
                            onChange({
                                ...filters,
                                teacher:
                                    e.target.value || undefined,
                            })
                        }

                        className="w-full rounded-lg border px-3 py-2"

                    >

                        <option value="">

                            Tous les enseignants

                        </option>

                        {

                            teachers.map((teacher) => (

                                <option

                                    key={teacher.id}

                                    value={teacher.id}

                                >

                                    {teacher.full_name}

                                </option>

                            ))

                        }

                    </select>

                </div>

            </div>

        </div>

    );

}