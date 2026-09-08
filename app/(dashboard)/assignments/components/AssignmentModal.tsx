"use client";

import { useEffect, useState } from "react";

import { TeachingAssignment } from "@/types/teachingAssignment";
import { Subject } from "@/types/subject";
import { Teacher } from "@/types/teachers";
import { CourseGroup } from "@/types/courseGroup";

import { toast } from "sonner";

import { getSubjects } from "@/lib/api/subjects";
import { getTeachers } from "@/lib/api/teachers";
import { getCourseGroups } from "@/lib/api/courseGroups";
import { ClassroomGroup } from "@/types/classroomGroup";
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

    // ==========================================================
    // DATA
    // ==========================================================

    const [subjects, setSubjects] =
        useState<Subject[]>([]);

    const [teachers, setTeachers] =
        useState<Teacher[]>([]);

    const [courseGroups, setCourseGroups] =
        useState<CourseGroup[]>([]);

    const [classroomGroups, setClassroomGroups] =
        useState<ClassroomGroup[]>([]);

    const [loadingClassroomGroups, setLoadingClassroomGroups] =
        useState(false);


    // ==========================================================
    // STATE
    // ==========================================================

    const [saving, setSaving] =
        useState(false);

    const [loadingCourseGroups, setLoadingCourseGroups] =
        useState(false);

    const [form, setForm] = useState({

        subject_id: "",

        teacher_id: "",

        classroom_group_id: "",

        course_group_id: "",

        assignment_type: "",

        start_date: "",

        end_date: "",

    });

    const [errors, setErrors] =
        useState<Record<string, string[]>>({});


    // ==========================================================
    // LOAD SUBJECTS
    // ==========================================================

    const loadSubjects = async () => {

        try {

            const data =
                await getSubjects();

            setSubjects(data.results);

        } catch (error) {

            console.error(
                "Erreur lors du chargement des matières :",
                error
            );

        }

    };


    // ==========================================================
    // LOAD TEACHERS
    // ==========================================================

    const loadTeachers = async () => {

        try {

            const data =
                await getTeachers();

            setTeachers(data);
           

        } catch (error) {

            console.error(
                "Erreur lors du chargement des enseignants :",
                error
            );

        }

    };


    // ==========================================================
    // LOAD COURSE GROUPS
    // ==========================================================

    const loadCourseGroups = async (
        subjectId?: string
    ) => {
           
        if (!academicYearId) {

            setCourseGroups([]);

            return;

        }

        try {

            setLoadingCourseGroups(true);

            const data =
                await getCourseGroups({

                    academicYearId,

                    subjectId:
                        subjectId || undefined,

                });

            setCourseGroups(data);

        } catch (error) {

            console.error(
                "Erreur lors du chargement des cours communs :",
                error
            );

            setCourseGroups([]);

        } finally {

            setLoadingCourseGroups(false);

        }

    };


    const loadClassroomGroups = async () => {

        if (!classroomId) {
    
            setClassroomGroups([]);
    
            return;
        }
    
        try {
    
            setLoadingClassroomGroups(true);
    
            const data =
                await getClassroomGroups(
                    classroomId
                );
                console.log(
                    "CLASSROOM GROUPS RESPONSE:",
                    data
                );
                
                console.log(
                    "CLASSROOM GROUPS TYPE:",
                    Array.isArray(data.results),
                    typeof data
                );
            setClassroomGroups(data.results);
    
        } catch (error) {
    
            console.error(
                "Erreur lors du chargement des groupes de classe :",
                error
            );
    
            setClassroomGroups([]);
    
        } finally {
    
            setLoadingClassroomGroups(false);
    
        }
    };
    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useEffect(() => {

        if (!open)
            return;

        loadSubjects();

        loadTeachers();

        loadClassroomGroups();

    }, [open,
        classroomId,
    ]);


    // ==========================================================
    // LOAD COURSE GROUPS WHEN SUBJECT CHANGES
    // ==========================================================

    useEffect(() => {

        if (!open)
            return;

        if (
            form.assignment_type !== "SUBJECT"
        ) {

            setCourseGroups([]);

            return;

        }

        if (!form.subject_id) {

            setCourseGroups([]);

            return;

        }

        loadCourseGroups(
            form.subject_id
        );

    }, [
        open,
        academicYearId,
        form.subject_id,
        form.assignment_type,
    ]);


    // ==========================================================
    // INITIALISE FORM
    // ==========================================================

    useEffect(() => {

        if (!open)
            return;


        // ------------------------------------------------------
        // Nouvelle affectation
        // ------------------------------------------------------

        if (!assignment) {

            setForm({

                subject_id: "",

                teacher_id: "",

                classroom_group_id: "",

                course_group_id: "",

                assignment_type: "",

                start_date: "",

                end_date: "",

            });

            setErrors({});

            return;

        }


        // ------------------------------------------------------
        // Modification
        // ------------------------------------------------------

        setForm({

            subject_id:
                assignment.subject_id ?? "",

            teacher_id:
                assignment.teacher_id ?? "",

            classroom_group_id:
                assignment.classroom_group_id ?? "",

            course_group_id:
                assignment.course_group_id ?? "",

            assignment_type:
                assignment.assignment_type,

            start_date:
                assignment.start_date ?? "",

            end_date:
                assignment.end_date ?? "",

        });

        setErrors({});

    }, [
        open,
        assignment,
    ]);


    // ==========================================================
    // TYPE CHANGE
    // ==========================================================

    useEffect(() => {

        if (
            form.assignment_type === "PRIMARY"
        ) {

            setForm((prev) => ({

                ...prev,

                subject_id: "",

                course_group_id: "",

            }));

            setCourseGroups([]);

        }

    }, [
        form.assignment_type,
    ]);


    // ==========================================================
    // SUBJECT CHANGE
    // ==========================================================

    const handleSubjectChange = (
        subjectId: string
    ) => {

        setForm((prev) => ({

            ...prev,

            subject_id: subjectId,

            // Un ancien cours commun ne doit pas
            // rester sélectionné lorsqu'on change
            // de matière.

            course_group_id: "",

        }));

    };


    // ==========================================================
    // COURSE GROUP CHANGE
    // ==========================================================

    const handleCourseGroupChange = (
        courseGroupId: string
    ) => {

        setForm((prev) => ({

            ...prev,

            course_group_id:
                courseGroupId,

        }));

    };


    // ==========================================================
    // SUBMIT
    // ==========================================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            setErrors({});

            setSaving(true);


            // --------------------------------------------------
            // PAYLOAD
            // --------------------------------------------------

            const payload = {

                academic_year_id:
                    academicYearId,

                classroom_id:
                    classroomId,

                teacher_id:
                    form.teacher_id,

                assignment_type:
                    form.assignment_type,

                start_date:
                    form.start_date || null,

                end_date:
                    form.end_date || null,

                subject_id:
                    form.assignment_type === "SUBJECT"
                        ? form.subject_id || null
                        : null,

                course_group_id:
                    form.assignment_type === "SUBJECT"
                        ? form.course_group_id || null
                        : null,

                    
                classroom_group_id:
                    form.assignment_type === "SUBJECT"
                        ? form.classroom_group_id || null
                        : null,

                is_homeroom_teacher:
                    form.assignment_type === "PRIMARY",

            };


            // --------------------------------------------------
            // CREATE
            // --------------------------------------------------

            if (!assignment) {

                await createTeachingAssignment(
                    payload
                );

            }


            // --------------------------------------------------
            // UPDATE
            // --------------------------------------------------

            else {

                await updateTeachingAssignment(
                    assignment.id,
                    payload
                );

            }


            // --------------------------------------------------
            // SUCCESS
            // --------------------------------------------------

            toast.success(
                assignment
                    ? "Affectation mise à jour."
                    : "Affectation créée."
            );

            onSaved();

            onClose();

        } catch (error: any) {

            console.error(error);


            // --------------------------------------------------
            // BACKEND VALIDATION ERRORS
            // --------------------------------------------------

            if (
                error.response?.data
            ) {

                const backendErrors =
                    error.response.data;

                setErrors(
                    backendErrors
                );


                // Afficher la première erreur disponible

                const firstError =
                    Object.values(
                        backendErrors
                    )[0];

                if (
                    Array.isArray(firstError)
                    && firstError.length > 0
                ) {

                    toast.error(
                        String(firstError[0])
                    );

                } else if (
                    typeof firstError === "string"
                ) {

                    toast.error(
                        firstError
                    );

                } else {

                    toast.error(
                        "Impossible d'enregistrer l'affectation."
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


    // ==========================================================
    // VALIDATION
    // ==========================================================

    const isFormValid =
        Boolean(form.teacher_id)
        &&
        (
            form.assignment_type === "PRIMARY"
            ||
            Boolean(form.subject_id)
        );


    // ==========================================================
    // RENDER
    // ==========================================================

    if (!open)
        return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    
            {/* ======================================================
                MODAL
            ====================================================== */}
    
            <div
                className="
                    flex
                    w-full
                    max-w-2xl
                    max-h-[calc(100vh-2rem)]
                    flex-col
                    overflow-hidden
                    rounded-xl
                    bg-white
                    shadow-xl
                "
            >
    
                {/* ==================================================
                    HEADER FIXE
                ================================================== */}
    
                <div className="shrink-0 border-b px-6 py-4">
    
                    <h2 className="text-xl font-semibold">
    
                        {assignment
                            ? "Modifier une affectation"
                            : "Nouvelle affectation"}
    
                    </h2>
    
                    <p className="mt-1 text-sm text-gray-500">
    
                        Affectez un enseignant à cette classe.
    
                    </p>
    
                </div>
    
    
                {/* ==================================================
                    FORM
                ================================================== */}
    
                <form
                    onSubmit={handleSubmit}
                    className="
                        flex
                        min-h-0
                        flex-1
                        flex-col
                    "
                >
    
                    {/* ==============================================
                        BODY SCROLLABLE
                    ============================================== */}
    
                    <div
                        className="
                            min-h-0
                            flex-1
                            space-y-5
                            overflow-y-auto
                            p-6
                        "
                    >
    
                        {/* ==========================================
                            TYPE
                        ========================================== */}
    
                        <div>
    
                            <label className="mb-2 block text-sm font-medium">
    
                                Type d'enseignant
    
                            </label>
    
                            <select
                                value={
                                    form.assignment_type
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
    
                                        assignment_type:
                                            e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border p-3"
                            >
                                
                                <option >
    
                                    Selectionnez le type d'enseignant
    
                                </option>

                                <option value="PRIMARY">
    
                                    Enseignant primaire
    
                                </option>
    
                                <option value="SUBJECT">
    
                                    Enseignant secondaire / supérieur
    
                                </option>
    
                            </select>
    
    
                            {form.assignment_type === "PRIMARY" && (
    
                                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
    
                                    ℹ️ L'enseignant titulaire est
                                    responsable de toute la classe.
                                    Aucune matière ni aucun cours
                                    commun ne sont nécessaires.
    
                                </div>
    
                            )}
    
                        </div>
    
    
                        {/* ==========================================
                            MATIÈRE
                        ========================================== */}
    
                        {form.assignment_type === "SUBJECT" && (
    
                            <div>
    
                                <label className="mb-2 block text-sm font-medium">
    
                                    Matière
    
                                </label>
    
                                <select
                                    value={
                                        form.subject_id
                                    }
                                    onChange={(e) =>
                                        handleSubjectChange(
                                            e.target.value
                                        )
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
    
    
                                {errors.subject && (
    
                                    <p className="mt-2 text-sm text-red-600">
    
                                        {errors.subject[0]}
    
                                    </p>
    
                                )}
    
                            </div>
    
                        )}
    
    
                        {/* ==========================================
                            GROUPE DE CLASSE
                        ========================================== */}
    
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
                                    disabled={
                                        loadingClassroomGroups
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        p-3
                                        disabled:cursor-not-allowed
                                        disabled:bg-gray-100
                                    "
                                >
    
                                    <option value="">
    
                                        Classe entière
    
                                    </option>
    
                                    {classroomGroups.map(
                                        (group) => (
    
                                            <option
                                                key={group.id}
                                                value={group.id}
                                            >
    
                                                {group.name}
    
                                            </option>
    
                                        )
                                    )}
    
                                </select>
    
    
                                {loadingClassroomGroups && (
    
                                    <p className="mt-2 text-xs text-gray-500">
    
                                        Chargement des groupes...
    
                                    </p>
    
                                )}
    
    
                                {!loadingClassroomGroups &&
                                    classroomGroups.length === 0 && (
    
                                        <p className="mt-2 text-xs text-gray-500">
    
                                            Aucun groupe dans cette classe.
                                            L'affectation concerne toute
                                            la classe.
    
                                        </p>
    
                                    )}
    
    
                                {errors.classroom_group && (
    
                                    <p className="mt-2 text-sm text-red-600">
    
                                        {errors.classroom_group[0]}
    
                                    </p>
    
                                )}
    
                            </div>
    
                        )}
    
    
                        {/* ==========================================
                            ENSEIGNANT
                        ========================================== */}
    
                        <div>
    
                            <label className="mb-2 block text-sm font-medium">
    
                                Enseignant
    
                            </label>
    
                            <select
                                value={
                                    form.teacher_id
                                }
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
    
    
                            {errors.teacher && (
    
                                <p className="mt-2 text-sm text-red-600">
    
                                    {errors.teacher[0]}
    
                                </p>
    
                            )}
    
                        </div>
    
    
                        {/* ==========================================
                            COURS COMMUN
                        ========================================== */}
    
                        {form.assignment_type === "SUBJECT" && (
    
                            <div>
    
                                <div className="mb-2 flex items-center justify-between">
    
                                    <label className="block text-sm font-medium">
    
                                        Cours commun
    
                                    </label>
    
    
                                    {!form.subject_id && (
    
                                        <span className="text-xs text-gray-400">
    
                                            Sélectionnez d'abord
                                            une matière
    
                                        </span>
    
                                    )}
    
                                </div>
    
    
                                <select
                                    value={
                                        form.course_group_id
                                    }
                                    onChange={(e) =>
                                        handleCourseGroupChange(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        !form.subject_id
                                        ||
                                        loadingCourseGroups
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        p-3
                                        disabled:cursor-not-allowed
                                        disabled:bg-gray-100
                                    "
                                >
    
                                    <option value="">
    
                                        Classe entière
    
                                    </option>
    
    
                                    {courseGroups.map(
                                        (courseGroup) => (
    
                                            <option
                                                key={
                                                    courseGroup.id
                                                }
                                                value={
                                                    courseGroup.id
                                                }
                                            >
    
                                                {courseGroup.name}
    
                                                {courseGroup.code
                                                    ? ` (${courseGroup.code})`
                                                    : ""}
    
                                            </option>
    
                                        )
                                    )}
    
                                </select>
    
    
                                {loadingCourseGroups && (
    
                                    <p className="mt-2 text-xs text-gray-500">
    
                                        Chargement des cours
                                        communs...
    
                                    </p>
    
                                )}
    
    
                                {!loadingCourseGroups
                                    &&
                                    form.subject_id
                                    &&
                                    courseGroups.length === 0 && (
    
                                        <p className="mt-2 text-xs text-gray-500">
    
                                            Aucun cours commun pour
                                            cette matière.
    
                                        </p>
    
                                    )
                                }
    
    
                                {errors.course_group && (
    
                                    <p className="mt-2 text-sm text-red-600">
    
                                        {errors.course_group[0]}
    
                                    </p>
    
                                )}
    
                            </div>
    
                        )}
    
    
                        {/* ==========================================
                            INFORMATION COURS COMMUN
                        ========================================== */}
    
                        {form.assignment_type === "SUBJECT"
                            &&
                            form.course_group_id
                            && (
    
                                <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-sm text-purple-700">
    
                                    <strong>
    
                                        Cours commun :
    
                                    </strong>{" "}
    
                                    Cette affectation sera liée
                                    au cours commun sélectionné.
                                    Les autres classes membres
                                    de ce cours pourront utiliser
                                    la même affectation pédagogique.
    
                                </div>
    
                            )
                        }
    
                    </div>
    
    
                    {/* ==============================================
                        FOOTER FIXE
                    ============================================== */}
    
                    <div
                        className="
                            shrink-0
                            border-t
                            bg-white
                            px-6
                            py-4
                        "
                    >
    
                        <div className="flex items-center justify-end gap-3">
    
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={saving}
                                className="
                                    cursor-pointer
                                    rounded-lg
                                    border
                                    px-4
                                    py-2
                                    hover:bg-gray-100
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
    
                                Annuler
    
                            </button>
    
    
                            <button
                                type="submit"
                                disabled={
                                    saving
                                    ||
                                    !isFormValid
                                }
                                className="
                                    cursor-pointer
                                    rounded-lg
                                    bg-[#6214BE]
                                    px-5
                                    py-2
                                    text-white
                                    hover:bg-[#5310a0]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
    
                                {saving
                                    ? "Enregistrement..."
                                    : assignment
                                        ? "Mettre à jour"
                                        : "Enregistrer"
                                }
    
                            </button>
    
                        </div>
    
                    </div>
    
                </form>
    
            </div>
    
        </div>
    );

}