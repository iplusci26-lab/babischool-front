"use client";

import { useEffect, useState } from "react";

import { TeachingAssignment } from "@/types/teachingAssignment";
import { Subject } from "@/types/subject";
import { Teacher } from "@/types/teachers";
import { ClassroomGroup } from "@/types/classroomGroup";
import { toast } from "sonner";
import { getSubjects } from "@/lib/api/subjects";
import { getTeachers } from "@/lib/api/teachers";
import { getClassroomGroups } from "@/lib/api/classroomGroups";

import {
    createTeachingAssignment,
    updateTeachingAssignment,
} from "@/lib/api/teachingAssignments";

type AssignmentModalProps = {
    open: boolean;
    assignment?: TeachingAssignment | null;
    academicYearId: string;
    classroomId: string;
    onClose: () => void;
    onSaved: () => void;
};

export default function AssignmentModal({
    open,
    assignment,
    academicYearId,
    classroomId,
    onClose,
    onSaved,
}: AssignmentModalProps) {

    const [subjects, setSubjects] =
        useState<Subject[]>([]);

    const [teachers, setTeachers] =
        useState<Teacher[]>([]);

    const [groups, setGroups] =
        useState<ClassroomGroup[]>([]);

    const [saving, setSaving] =
        useState(false);

    const [form, setForm] = useState({

        subject_id: "",

        teacher_id: "",

        classroom_group_id: "",

        assignment_type: "SUBJECT",

        is_homeroom_teacher: false,

        start_date: "",

        end_date: "",

    });

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const loadSubjects = async () => {

        try {
           
            const data =
                await getSubjects();
               
            setSubjects(data.results);

        } catch (error:any) {
           
                console.error(error);


        }

    };

    const loadTeachers = async () => {

        try {
            
            const data =
                await getTeachers();
           
            setTeachers(data);

        } catch (error) {

            console.error(error);

        }

    };

    const loadGroups = async () => {

        if (!classroomId)
            return;

        try {

            const data =
                await getClassroomGroups(
                    classroomId
                );
                
            setGroups(data.results);

        } catch (error) {

            console.error(error);

        }

    };
        useEffect(() => {

        if (!open)
            return;

        loadSubjects();

        loadTeachers();

        loadGroups();

    }, [open]);

    useEffect(() => {

        if (!assignment) {

            setForm({

                subject_id: "",

                teacher_id: "",

                classroom_group_id: "",

                assignment_type: "SUBJECT",

                is_homeroom_teacher: false,

                start_date: "",

                end_date: "",

            });

            return;

        }

        setForm({

            subject_id: assignment.subject_id ?? "",

            teacher_id: assignment.teacher_id,

            classroom_group_id:
                assignment.classroom_group_id ?? "",

            assignment_type:
                assignment.assignment_type,

            is_homeroom_teacher:
                assignment.is_homeroom_teacher,

            start_date:
                assignment.start_date ?? "",

            end_date:
                assignment.end_date ?? "",

        });

    }, [assignment]);

    useEffect(() => {

        if (form.assignment_type === "PRIMARY") {
    
            setForm((prev) => ({
    
                ...prev,
    
                subject_id: "",
    
                classroom_group_id: "",
    
            }));
    
        }
    
    }, [form.assignment_type]);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
    
        e.preventDefault();
    
        try {
            setErrors({});
            setSaving(true);
            
            const payload = {
    
                academic_year_id: academicYearId,

                classroom_id: classroomId,

                teacher_id: form.teacher_id,

                assignment_type: form.assignment_type,

                start_date: form.start_date || null,

                end_date: form.end_date || null,

                is_homeroom_teacher:
                    form.assignment_type === "PRIMARY",

                subject_id:
                    form.assignment_type === "SUBJECT"
                        ? form.subject_id || null
                        : null,

                classroom_group_id:
                    form.assignment_type === "SUBJECT"
                        ? form.classroom_group_id || null
                        : null,
    
            };
    
            if (assignment) {
    
                await updateTeachingAssignment(
                    assignment.id,
                    payload
                );
    
            } else {
    
                await createTeachingAssignment(
                    payload
                );
    
            }
    
            onSaved();
    
            onClose();
    
        } catch (error:any) {
            
            if (error.response?.data) {
                
                setErrors(error.response?.data);
                console.log("----------------------",error.response?.data)
            } else {
        
                console.error(error);
                console.log("----------------------",error)
        
            }


            toast.error(error.response?.data);
    
          
            
          
    
        } finally {
    
            setSaving(false);
    
        }
    
    };
    const isFormValid =
    form.teacher_id &&
    (
        form.assignment_type === "PRIMARY" ||
        form.subject_id
    );
    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

                {/* ==========================
                    Header
                ========================== */}

                <div className="border-b px-6 py-4">

                    <h2 className="text-xl font-semibold">

                        {assignment
                            ? "Modifier une affectation"
                            : "Nouvelle affectation"}

                    </h2>

                </div>

                {/* ==========================
                    Body
                ========================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 p-6"
                    >

                        {/* Type */}

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Type enseignant

                        </label>

                        <select
                            value={form.assignment_type}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    assignment_type:
                                        e.target.value,
                                })
                            }
                            className="w-full rounded-lg border p-3"
                        >

                            <option value="PRIMARY">

                                Enseignant primaire

                            </option>

                            <option value="SUBJECT">

                                Professeur secondaire

                            </option>

                        </select>
                        {form.assignment_type === "PRIMARY" && (

                        <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">

                            ℹ️ Un enseignant titulaire est responsable de toute la classe.
                            Aucune matière ni aucun groupe ne sont nécessaires.

                        </div>

                        )}

                        </div>

                    {/* Matière */}

                        {form.assignment_type === "SUBJECT" && (

                        <div>

                            <label className="mb-2 block text-sm font-medium">

                                Matière

                            </label>

                            <select
                                value={form.subject_id}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        subject_id: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border p-3"
                            >

                                <option value="">

                                    Sélectionner une matière

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

                            {errors.subject && (

                                <p className="mt-2 text-sm text-red-600">

                                    {errors.subject[0]}

                                </p>

                            )}

                        </div>

                        )}

                    {/* Enseignant */}

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Enseignant

                        </label>

                        <select
                            value={form.teacher_id}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    teacher_id: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border p-3"
                        >

                            <option value="">

                                Sélectionner un enseignant

                            </option>

                            {teachers.map((teacher) => (

                                <option
                                    key={teacher.id}
                                    value={teacher.id}
                                >

                                    {teacher.first_name}  {teacher.last_name}

                                </option>

                            ))}

                        </select>
                        {errors.teacher && (
                            
                            <p className="mt-2 text-sm text-red-600">
                                {errors.teacher[0]}
                            </p>
                        )}

                    </div>


                    {/* Groupe */}

                        {form.assignment_type === "SUBJECT" && (

                        <div>

                            <label className="mb-2 block text-sm font-medium">

                                Groupe

                            </label>

                            <select
                                value={form.classroom_group_id}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        classroom_group_id:
                                            e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border p-3"
                            >

                                <option value="">

                                    Classe entière

                                </option>

                                {groups.map((group) => (

                                    <option
                                        key={group.id}
                                        value={group.id}
                                    >

                                        {group.name}

                                    </option>

                                ))}

                            </select>

                        </div>

                        )}

                    {/* Dates */}

                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <label className="mb-2 block text-sm font-medium">

                                Début

                            </label>

                            <input
                                type="date"
                                value={form.start_date}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        start_date:
                                            e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border p-3"
                            />

                        </div>

                        <div>

                            <label className="mb-2 block text-sm font-medium">

                                Fin

                            </label>

                            <input
                                type="date"
                                value={form.end_date}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        end_date:
                                            e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border p-3"
                            />

                        </div>

                    </div>

               {/* ==========================Footer========================== */}

                <div className="flex items-center justify-end gap-3 border-t pt-5">

                <button
                    type="button"
                    onClick={onClose}
                    disabled={saving}
                    className="rounded-lg border px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Annuler
                </button>

                <button
                    type="submit"
                    disabled={saving || !isFormValid}
                    className="rounded-lg bg-[#6214BE] px-5 py-2 text-white hover:bg-[#5310a0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving
                        ? "Enregistrement..."
                        : assignment
                            ? "Mettre à jour"
                            : "Enregistrer"}
                </button>

                </div>

                </form>

                </div>

                </div>

                );

                }
