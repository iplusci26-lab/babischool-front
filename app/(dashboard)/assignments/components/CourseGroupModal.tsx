"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Subject } from "@/types/subject";
import { Teacher } from "@/types/teachers";
import { Classroom } from "@/types/classroom";
import { CourseGroup } from "@/types/courseGroup";

import { getSubjects } from "@/lib/api/subjects";
import { getTeachers } from "@/lib/api/teachers";
import {
    createCourseGroup,
    updateCourseGroup,
} from "@/lib/api/courseGroups";

type CourseGroupModalProps = {
    open: boolean;
    courseGroup?: CourseGroup | null;
    academicYearId: string;
    classrooms: Classroom[];
    onClose: () => void;
    onSaved: () => void;
};

export default function CourseGroupModal({
    open,
    courseGroup,
    academicYearId,
    classrooms,
    onClose,
    onSaved,
}: CourseGroupModalProps) {

    const [subjects, setSubjects] =
        useState<Subject[]>([]);

    const [teachers, setTeachers] =
        useState<Teacher[]>([]);

    const [saving, setSaving] =
        useState(false);

    const [form, setForm] = useState({
        name: "",
        code: "",
        description: "",
        subject_id: "",
        teacher_id: "",
        classroom_ids: [] as string[],
        is_active: true,
    });

    const [errors, setErrors] =
        useState<Record<string, string[]>>({});


    // ==========================================================
    // CHARGEMENT DES MATIÈRES
    // ==========================================================

    const loadSubjects = async () => {

        try {

            const data = await getSubjects();

            setSubjects(data.results);

        } catch (error) {

            console.error(error);

            toast.error(
                "Impossible de charger les matières."
            );

        }

    };


    // ==========================================================
    // CHARGEMENT DES ENSEIGNANTS
    // ==========================================================

    const loadTeachers = async () => {

        try {

            const data = await getTeachers();

            setTeachers(data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Impossible de charger les enseignants."
            );

        }

    };


    // ==========================================================
    // INITIALISATION
    // ==========================================================

    useEffect(() => {

        if (!open)
            return;

        loadSubjects();
        loadTeachers();

    }, [open]);


    // ==========================================================
    // INITIALISATION DU FORMULAIRE
    // ==========================================================

    useEffect(() => {

        if (!open)
            return;

        setErrors({});

        if (!courseGroup) {

            setForm({
                name: "",
                code: "",
                description: "",
                subject_id: "",
                teacher_id: "",
                classroom_ids: [],
                is_active: true,
            });

            return;

        }

        setForm({
            name: courseGroup.name ?? "",
            code: courseGroup.code ?? "",
            description: courseGroup.description ?? "",
            subject_id:
                (courseGroup as any).subject_id ?? "",
            teacher_id:
                courseGroup.teacher_id ?? "",
            classroom_ids:
                courseGroup.classrooms?.map(
                    (classroom) => classroom.id
                ) ?? [],
            is_active:
                courseGroup.is_active,
        });

    }, [open, courseGroup]);


    // ==========================================================
    // CHANGEMENT D'UNE CLASSE
    // ==========================================================

    const toggleClassroom = (
        classroomId: string
    ) => {

        setForm((prev) => {

            const exists =
                prev.classroom_ids.includes(
                    classroomId
                );

            return {
                ...prev,

                classroom_ids: exists
                    ? prev.classroom_ids.filter(
                        (id) => id !== classroomId
                    )
                    : [
                        ...prev.classroom_ids,
                        classroomId,
                    ],
            };

        });

    };


    // ==========================================================
    // SÉLECTIONNER TOUTES LES CLASSES
    // ==========================================================

    const selectAllClassrooms = () => {

        setForm((prev) => ({
            ...prev,

            classroom_ids:
                classrooms.map(
                    (classroom) => classroom.id
                ),
        }));

    };


    // ==========================================================
    // DÉSÉLECTIONNER TOUTES LES CLASSES
    // ==========================================================

    const clearClassrooms = () => {

        setForm((prev) => ({
            ...prev,
            classroom_ids: [],
        }));

    };


    // ==========================================================
    // SUBMIT
    // ==========================================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setErrors({});

        // ------------------------------------------------------
        // VALIDATION FRONT
        // ------------------------------------------------------

        if (!form.name.trim()) {

            setErrors({
                name: [
                    "Le nom du cours commun est obligatoire.",
                ],
            });

            return;

        }

        if (!form.subject_id) {

            setErrors({
                subject_id: [
                    "Veuillez sélectionner une matière.",
                ],
            });

            return;

        }

        if (!form.teacher_id) {

            setErrors({
                teacher_id: [
                    "Veuillez sélectionner un enseignant.",
                ],
            });

            return;

        }

        if (form.classroom_ids.length === 0) {

            setErrors({
                classroom_ids: [
                    "Sélectionnez au moins une classe.",
                ],
            });

            return;

        }

        // ------------------------------------------------------
        // PAYLOAD
        // ------------------------------------------------------

        const payload = {

            name: form.name.trim(),

            // Code optionnel
            ...(form.code.trim()
                ? {
                    code: form.code.trim(),
                }
                : {}),

            // Description optionnelle
            ...(form.description.trim()
                ? {
                    description:
                        form.description.trim(),
                }
                : {}),

            academic_year_id:
                academicYearId,

            subject_id:
                form.subject_id,

            teacher_id:
                form.teacher_id,

            classroom_ids:
                form.classroom_ids,

            is_active:
                form.is_active,
        };

        try {

            setSaving(true);

            if (courseGroup) {

                await updateCourseGroup(
                    courseGroup.id,
                    payload
                );

                toast.success(
                    "Cours commun mis à jour."
                );

            } else {

                await createCourseGroup(
                    payload
                );

                toast.success(
                    "Cours commun créé."
                );

            }

            onSaved();

            onClose();

        } catch (error: any) {

            console.error(error);

            const responseData =
                error.response?.data;

            if (responseData) {

                setErrors(responseData);

                const firstError =
                    Object.values(responseData)
                        .flat()
                        .find(
                            (message) =>
                                typeof message ===
                                "string"
                        );

                if (firstError) {

                    toast.error(
                        firstError as string
                    );

                } else {

                    toast.error(
                        "Impossible d'enregistrer le cours commun."
                    );

                }

            } else {

                toast.error(
                    "Une erreur est survenue."
                );

            }

        } finally {

            setSaving(false);

        }

    };


    if (!open)
        return null;


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="border-b px-6 py-4">

                    <h2 className="text-xl font-semibold">

                        {courseGroup
                            ? "Modifier le cours commun"
                            : "Nouveau cours commun"}

                    </h2>

                    <p className="mt-1 text-sm text-gray-500">

                        Regroupez plusieurs classes autour
                        d'une même matière et d'un même enseignant.

                    </p>

                </div>


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 p-6"
                >

                    {/* ==================================================
                        NOM
                    ================================================== */}

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Nom du cours commun

                            <span className="ml-1 text-red-500">
                                *
                            </span>

                        </label>

                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                            placeholder="Ex : Anglais avancé"
                            className="w-full rounded-lg border p-3"
                        />

                        {errors.name && (

                            <p className="mt-2 text-sm text-red-600">

                                {errors.name[0]}

                            </p>

                        )}

                    </div>


                    {/* ==================================================
                        CODE + MATIÈRE
                    ================================================== */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* CODE */}

                        <div>

                            <label className="mb-2 block text-sm font-medium">

                                Code

                                <span className="ml-1 text-xs text-gray-400">
                                    (optionnel)
                                </span>

                            </label>

                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        code: e.target.value,
                                    })
                                }
                                placeholder="Ex : ANG-ADV"
                                className="w-full rounded-lg border p-3"
                            />

                            {errors.code && (

                                <p className="mt-2 text-sm text-red-600">

                                    {errors.code[0]}

                                </p>

                            )}

                        </div>


                        {/* MATIÈRE */}

                        <div>

                            <label className="mb-2 block text-sm font-medium">

                                Matière

                                <span className="ml-1 text-red-500">
                                    *
                                </span>

                            </label>

                            <select
                                value={form.subject_id}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        subject_id:
                                            e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border p-3"
                            >

                                <option value="">

                                    Sélectionner une matière

                                </option>

                                {subjects.map(
                                    (subject) => (

                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >

                                            {subject.name}

                                        </option>

                                    )
                                )}

                            </select>

                            {errors.subject_id && (

                                <p className="mt-2 text-sm text-red-600">

                                    {errors.subject_id[0]}

                                </p>

                            )}

                        </div>

                    </div>


                    {/* ==================================================
                        ENSEIGNANT
                    ================================================== */}

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Enseignant

                            <span className="ml-1 text-red-500">
                                *
                            </span>

                        </label>

                        <select
                            value={form.teacher_id}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    teacher_id:
                                        e.target.value,
                                })
                            }
                            className="w-full rounded-lg border p-3"
                        >

                            <option value="">

                                Sélectionner un enseignant

                            </option>

                            {teachers.map(
                                (teacher) => (

                                    <option
                                        key={teacher.id}
                                        value={teacher.id}
                                    >

                                        {teacher.first_name}{" "}
                                        {teacher.last_name}

                                    </option>

                                )
                            )}

                        </select>

                        {errors.teacher_id && (

                            <p className="mt-2 text-sm text-red-600">

                                {errors.teacher_id[0]}

                            </p>

                        )}

                    </div>


                    {/* ==================================================
                        DESCRIPTION
                    ================================================== */}

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Description

                            <span className="ml-1 text-xs text-gray-400">
                                (optionnel)
                            </span>

                        </label>

                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description:
                                        e.target.value,
                                })
                            }
                            rows={3}
                            placeholder="Description du cours commun..."
                            className="w-full resize-none rounded-lg border p-3"
                        />

                        {errors.description && (

                            <p className="mt-2 text-sm text-red-600">

                                {errors.description[0]}

                            </p>

                        )}

                    </div>


                    {/* ==================================================
                        CLASSES
                    ================================================== */}

                    <div>

                        <div className="mb-2 flex items-center justify-between">

                            <div>

                                <label className="block text-sm font-medium">

                                    Classes participantes

                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>

                                </label>

                                <p className="mt-1 text-xs text-gray-500">

                                    Sélectionnez les classes qui
                                    suivent ce cours commun.

                                </p>

                            </div>

                            <div className="flex gap-2">

                                <button
                                    type="button"
                                    onClick={
                                        selectAllClassrooms
                                    }
                                    className="text-xs font-medium text-[#6214BE] hover:underline"
                                >

                                    Tout sélectionner

                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        clearClassrooms
                                    }
                                    className="text-xs font-medium text-gray-500 hover:underline"
                                >

                                    Tout désélectionner

                                </button>

                            </div>

                        </div>


                        <div className="rounded-lg border">

                            {classrooms.length === 0 ? (

                                <div className="p-6 text-center text-sm text-gray-500">

                                    Aucune classe disponible
                                    pour cette année scolaire.

                                </div>

                            ) : (

                                <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">

                                    {classrooms.map(
                                        (classroom) => {

                                            const selected =
                                                form.classroom_ids.includes(
                                                    classroom.id
                                                );

                                            return (

                                                <label
                                                    key={classroom.id}
                                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                                                        selected
                                                            ? "border-[#6214BE] bg-purple-50"
                                                            : "hover:bg-gray-50"
                                                    }`}
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selected
                                                        }
                                                        onChange={() =>
                                                            toggleClassroom(
                                                                classroom.id
                                                            )
                                                        }
                                                        className="h-4 w-4 accent-[#6214BE]"
                                                    />

                                                    <span className="text-sm font-medium">

                                                        {
                                                            classroom.name
                                                        }

                                                    </span>

                                                </label>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>

                        <p className="mt-2 text-xs text-gray-500">

                            {form.classroom_ids.length}{" "}
                            classe
                            {form.classroom_ids.length > 1
                                ? "s"
                                : ""}{" "}
                            sélectionnée
                            {form.classroom_ids.length > 1
                                ? "s"
                                : ""}

                        </p>

                        {errors.classroom_ids && (

                            <p className="mt-2 text-sm text-red-600">

                                {errors.classroom_ids[0]}

                            </p>

                        )}

                        {errors.classrooms && (

                            <p className="mt-2 text-sm text-red-600">

                                {errors.classrooms[0]}

                            </p>

                        )}

                    </div>


                    {/* ==================================================
                        STATUT
                    ================================================== */}

                    <div className="flex items-center gap-3">

                        <input
                            id="course-group-active"
                            type="checkbox"
                            checked={form.is_active}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    is_active:
                                        e.target.checked,
                                })
                            }
                            className="h-4 w-4 accent-[#6214BE]"
                        />

                        <label
                            htmlFor="course-group-active"
                            className="text-sm font-medium"
                        >

                            Cours commun actif

                        </label>

                    </div>


                    {/* ==================================================
                        FOOTER
                    ================================================== */}

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
                            disabled={
                                saving ||
                                !form.name.trim() ||
                                !form.subject_id ||
                                !form.teacher_id ||
                                form.classroom_ids.length === 0
                            }
                            className="rounded-lg bg-[#6214BE] px-5 py-2 text-white hover:bg-[#5310a0] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {saving
                                ? "Enregistrement..."
                                : courseGroup
                                    ? "Mettre à jour"
                                    : "Créer le cours commun"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}