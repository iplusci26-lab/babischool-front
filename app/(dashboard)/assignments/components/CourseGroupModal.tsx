
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Subject } from "@/types/subject";
import { Teacher } from "@/types/teachers";
import { Classroom } from "@/types/classroom";
import { CourseGroup } from "@/types/courseGroup";
import { ClassroomGroup } from "@/types/classroomGroup";

import { getSubjects } from "@/lib/api/subjects";
import { getTeachers } from "@/lib/api/teachers";
import { getClassroomGroups } from "@/lib/api/classroomGroups";

import {
    createCourseGroup,
    updateCourseGroup,
} from "@/lib/api/courseGroups";

type ParticipantForm = {
    classroom_id: string;
    classroom_group_id: string;
};

type CourseGroupModalProps = {
    open: boolean;
    courseGroup?: CourseGroup | null;
    academicYearId: string;
    classrooms: Classroom[];
    onClose: () => void;
    onSaved: () => void;
};

const EMPTY_FORM = {
    name: "",
    code: "",
    description: "",
    subject_id: "",
    teacher_id: "",
    participants: [] as ParticipantForm[],
    is_active: true,
};

export default function CourseGroupModal({
    open,
    courseGroup,
    academicYearId,
    classrooms,
    onClose,
    onSaved,
}: CourseGroupModalProps) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    const [groupsByClassroom, setGroupsByClassroom] =
        useState<Record<string, ClassroomGroup[]>>({});

    const [loadingGroups, setLoadingGroups] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState(EMPTY_FORM);

    const [errors, setErrors] =
        useState<Record<string, string[]>>({});

    // ----------------------------------------------------------
    // CHARGEMENT DES MATIÈRES ET ENSEIGNANTS
    // ----------------------------------------------------------

    useEffect(() => {
        if (!open) return;

        const loadData = async () => {
            try {
                const [subjectData, teacherData] = await Promise.all([
                    getSubjects(),
                    getTeachers(),
                ]);

                setSubjects(subjectData.results ?? []);
                setTeachers(teacherData ?? []);
            } catch (error) {
                console.error(error);
                toast.error(
                    "Impossible de charger les matières et enseignants."
                );
            }
        };

        void loadData();
    }, [open]);

    // ----------------------------------------------------------
    // CHARGEMENT DES GROUPES DE CHAQUE CLASSE
    // ----------------------------------------------------------

    useEffect(() => {
        if (!open) return;

        let cancelled = false;

        const loadGroups = async () => {
            setLoadingGroups(true);

            try {
                const entries = await Promise.all(
                    classrooms.map(async (classroom) => {
                        try {
                            const response = await getClassroomGroups(
                                classroom.id
                            );

                            return [
                                String(classroom.id),
                                response.results ?? [],
                            ] as const;
                        } catch (error) {
                            console.error(
                                `Impossible de charger les groupes de ${classroom.name}`,
                                error
                            );

                            return [String(classroom.id), []] as const;
                        }
                    })
                );

                if (!cancelled) {
                    setGroupsByClassroom(Object.fromEntries(entries));
                }
            } finally {
                if (!cancelled) {
                    setLoadingGroups(false);
                }
            }
        };

        void loadGroups();

        return () => {
            cancelled = true;
        };
    }, [open, classrooms]);

    // ----------------------------------------------------------
    // INITIALISATION DU FORMULAIRE
    // ----------------------------------------------------------

    useEffect(() => {
        if (!open) return;

        setErrors({});

        if (!courseGroup) {
            setForm({ ...EMPTY_FORM, participants: [] });
            return;
        }

        const existing = courseGroup as any;

        /*
         * Le nouveau format peut fournir participants.
         * L'ancien format fournit classrooms.
         *
         * On accepte les deux pour préserver la modification
         * des cours communs déjà enregistrés.
         */
        const existingParticipants =
            existing.participants ?? existing.classrooms ?? [];

        const participants: ParticipantForm[] =
            existingParticipants.map((item: any) => ({
                classroom_id: String(
                    item.classroom_id ??
                    item.classroom?.id ??
                    item.classroom ??
                    item.id
                ),
                classroom_group_id:
                    item.classroom_group_id == null
                        ? item.classroom_group?.id == null
                            ? ""
                            : String(item.classroom_group.id)
                        : String(item.classroom_group_id),
            }));

        setForm({
            name: courseGroup.name ?? "",
            code: courseGroup.code ?? "",
            description: courseGroup.description ?? "",
            subject_id: String(existing.subject_id ?? ""),
            teacher_id: String(existing.teacher_id ?? ""),
            participants,
            is_active: courseGroup.is_active ?? true,
        });
    }, [open, courseGroup]);

    // ----------------------------------------------------------
    // PARTICIPANTS
    // ----------------------------------------------------------

    const getParticipant = (classroomId: string) =>
        form.participants.find(
            (participant) =>
                participant.classroom_id === classroomId
        );

    const toggleClassroom = (classroomId: string) => {
        setForm((previous) => {
            const exists = previous.participants.some(
                (participant) =>
                    participant.classroom_id === classroomId
            );

            return {
                ...previous,
                participants: exists
                    ? previous.participants.filter(
                        (participant) =>
                            participant.classroom_id !== classroomId
                    )
                    : [
                        ...previous.participants,
                        {
                            classroom_id: classroomId,
                            classroom_group_id: "",
                        },
                    ],
            };
        });

        setErrors((previous) => ({
            ...previous,
            participants: [],
            classroom_ids: [],
        }));
    };

    const selectAllClassrooms = () => {
        setForm((previous) => ({
            ...previous,
            participants: classrooms.map((classroom) => {
                const existing = previous.participants.find(
                    (participant) =>
                        participant.classroom_id === String(classroom.id)
                );

                return existing ?? {
                    classroom_id: String(classroom.id),
                    classroom_group_id: "",
                };
            }),
        }));
    };

    const clearClassrooms = () => {
        setForm((previous) => ({
            ...previous,
            participants: [],
        }));
    };

    const changeParticipantGroup = (
        classroomId: string,
        groupId: string
    ) => {
        setForm((previous) => ({
            ...previous,
            participants: previous.participants.map((participant) =>
                participant.classroom_id === classroomId
                    ? {
                        ...participant,
                        classroom_group_id: groupId,
                    }
                    : participant
            ),
        }));
    };

    // ----------------------------------------------------------
    // VALIDATION ET ENREGISTREMENT
    // ----------------------------------------------------------

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setErrors({});

        if (!form.name.trim()) {
            setErrors({
                name: ["Le nom du cours commun est obligatoire."],
            });
            return;
        }

        if (!form.subject_id) {
            setErrors({
                subject_id: ["Veuillez sélectionner une matière."],
            });
            return;
        }

        if (!form.teacher_id) {
            setErrors({
                teacher_id: ["Veuillez sélectionner un enseignant."],
            });
            return;
        }

        if (form.participants.length === 0) {
            setErrors({
                participants: [
                    "Sélectionnez au moins une classe participante.",
                ],
            });
            return;
        }

        const payload = {
            name: form.name.trim(),
            ...(form.code.trim()
                ? { code: form.code.trim() }
                : {}),
            ...(form.description.trim()
                ? { description: form.description.trim() }
                : {}),
            academic_year_id: academicYearId,
            subject_id: form.subject_id,
            teacher_id: form.teacher_id,

            // Nouveau format attendu par le serializer.

            classroom_ids: [
                ...new Set(
                    form.participants.map(
                        (participant) => participant.classroom_id
                    )
                ),
            ],
            
            participants: form.participants.map((participant) => ({
                classroom_id: participant.classroom_id,
                classroom_group_id:
                    participant.classroom_group_id || null,
            })),

            is_active: form.is_active,
        };

        try {
            setSaving(true);

            if (courseGroup) {
                await updateCourseGroup(courseGroup.id, payload);
                toast.success("Cours commun mis à jour.");
            } else {
                await createCourseGroup(payload);
                toast.success("Cours commun créé.");
            }

            onSaved();
            onClose();
        } catch (error: any) {
            console.error(error);

            const responseData = error.response?.data;

            if (responseData && typeof responseData === "object") {
                const normalizedErrors: Record<string, string[]> = {};

                Object.entries(responseData).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        normalizedErrors[key] = value.map(String);
                    } else if (typeof value === "string") {
                        normalizedErrors[key] = [value];
                    } else if (value && typeof value === "object") {
                        normalizedErrors[key] = [
                            JSON.stringify(value),
                        ];
                    }
                });

                setErrors(normalizedErrors);

                const firstError = Object.values(normalizedErrors)
                    .flat()[0];

                toast.error(
                    firstError ??
                    "Impossible d'enregistrer le cours commun."
                );
            } else {
                toast.error("Une erreur est survenue.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    // ----------------------------------------------------------
    // AFFICHAGE
    // ----------------------------------------------------------

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-semibold">
                        {courseGroup
                            ? "Modifier le cours commun"
                            : "Nouveau cours commun"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Associez une matière et un enseignant à plusieurs
                        classes entières ou groupes de classe.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 p-6"
                >
                    {/* NOM */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Nom du cours commun *
                        </label>

                        <input
                            value={form.name}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    name: event.target.value,
                                }))
                            }
                            placeholder="Ex. : Anglais avancé"
                            className="w-full rounded-lg border p-3"
                        />

                        {errors.name && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.name[0]}
                            </p>
                        )}
                    </div>

                    {/* CODE ET MATIÈRE */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Code (optionnel)
                            </label>

                            <input
                                value={form.code}
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        code: event.target.value,
                                    }))
                                }
                                placeholder="Ex. : ANG-ADV"
                                className="w-full rounded-lg border p-3"
                            />

                            {errors.code && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.code[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Matière *
                            </label>

                            <select
                                value={form.subject_id}
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        subject_id: event.target.value,
                                    }))
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

                            {errors.subject_id && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.subject_id[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ENSEIGNANT */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Enseignant *
                        </label>

                        <select
                            value={form.teacher_id}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    teacher_id: event.target.value,
                                }))
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
                                    {teacher.first_name} {teacher.last_name}
                                </option>
                            ))}
                        </select>

                        {errors.teacher_id && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.teacher_id[0]}
                            </p>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Description (optionnel)
                        </label>

                        <textarea
                            value={form.description}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    description: event.target.value,
                                }))
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

                    {/* PARTICIPANTS */}
                    <section>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-semibold">
                                    Classes et groupes participants *
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Pour chaque classe, choisissez la classe
                                    entière ou un groupe précis.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={selectAllClassrooms}
                                    className="text-xs font-medium text-[#6214BE] hover:underline"
                                >
                                    Tout sélectionner
                                </button>

                                <button
                                    type="button"
                                    onClick={clearClassrooms}
                                    className="text-xs text-gray-500 hover:underline"
                                >
                                    Tout désélectionner
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 rounded-lg border p-4">
                            {classrooms.length === 0 ? (
                                <p className="py-4 text-center text-sm text-gray-500">
                                    Aucune classe disponible pour cette année
                                    scolaire.
                                </p>
                            ) : (
                                classrooms.map((classroom) => {
                                    const classroomId = String(classroom.id);
                                    const participant = getParticipant(classroomId);
                                    const groups =
                                        groupsByClassroom[classroomId] ?? [];

                                    return (
                                        <div
                                            key={classroomId}
                                            className={`rounded-lg border p-3 ${
                                                participant
                                                    ? "border-[#6214BE] bg-purple-50"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(participant)}
                                                    onChange={() =>
                                                        toggleClassroom(classroomId)
                                                    }
                                                    className="h-4 w-4 accent-[#6214BE]"
                                                />

                                                <span className="flex-1 text-sm font-medium">
                                                    {classroom.name}
                                                </span>

                                                {participant && (
                                                    <span className="text-xs text-[#6214BE]">
                                                        Participant
                                                    </span>
                                                )}
                                            </div>

                                            {participant && (
                                                <div className="mt-3 pl-7">
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Partie de la classe
                                                    </label>

                                                    <select
                                                        value={
                                                            participant.classroom_group_id
                                                        }
                                                        onChange={(event) =>
                                                            changeParticipantGroup(
                                                                classroomId,
                                                                event.target.value
                                                            )
                                                        }
                                                        disabled={loadingGroups}
                                                        className="w-full rounded-lg border bg-white p-2.5 text-sm disabled:opacity-60"
                                                    >
                                                        <option value="">
                                                            Classe entière
                                                        </option>

                                                        {groups.map((group) => (
                                                            <option
                                                                key={group.id}
                                                                value={group.id}
                                                            >
                                                                Groupe : {group.name}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {loadingGroups && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Chargement des groupes...
                                                        </p>
                                                    )}

                                                    {!loadingGroups &&
                                                        groups.length === 0 && (
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Aucun groupe disponible.
                                                                La classe entière reste
                                                                sélectionnable.
                                                            </p>
                                                        )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                            {form.participants.length} classe(s) participante(s)
                        </p>

                        {errors.participants && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.participants.join(" ")}
                            </p>
                        )}

                        {errors.classroom_ids && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.classroom_ids.join(" ")}
                            </p>
                        )}
                    </section>

                    {/* STATUT */}
                    <div className="flex items-center gap-3">
                        <input
                            id="course-group-active"
                            type="checkbox"
                            checked={form.is_active}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    is_active: event.target.checked,
                                }))
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

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 border-t pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={
                                saving ||
                                loadingGroups ||
                                !form.name.trim() ||
                                !form.subject_id ||
                                !form.teacher_id ||
                                form.participants.length === 0
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
