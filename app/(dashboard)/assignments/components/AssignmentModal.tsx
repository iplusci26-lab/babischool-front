"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { TeachingAssignment } from "@/types/teachingAssignment";
import { Subject } from "@/types/subject";
import { Teacher } from "@/types/teachers";
import { CourseGroup } from "@/types/courseGroup";
import { ClassroomGroup } from "@/types/classroomGroup";

import { toast } from "sonner";

import { getSubjects } from "@/lib/api/subjects";
import { getTeachers } from "@/lib/api/teachers";
import { getCourseGroups } from "@/lib/api/courseGroups";
import { getClassroomGroups } from "@/lib/api/classroomGroups";

import {
    createTeachingAssignment,
    updateTeachingAssignment,
} from "@/lib/api/teachingAssignments";

import {
    Check,
    ChevronDown,
    Search,
    X,
} from "lucide-react";


// ==========================================================
// TYPES
// ==========================================================

type AssignmentModalProps = {
    open: boolean;
    assignment?: TeachingAssignment | null;
    academicYearId: string;
    classroomId: string;
    onClose: () => void;
    onSaved: () => void;
};

type SearchableOption = {
    value: string;
    label: string;
    searchText?: string;
};

type SearchableSelectProps = {
    label: string;
    value: string;
    options: SearchableOption[];
    onChange: (value: string) => void;

    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    error?: string;

    emptyMessage?: string;
    searchPlaceholder?: string;

    allowEmpty?: boolean;
    emptyLabel?: string;

    className?: string;
};


// ==========================================================
// SEARCHABLE SELECT
// ==========================================================

function SearchableSelect({
    label,
    value,
    options,
    onChange,
    placeholder = "Sélectionner...",
    disabled = false,
    loading = false,
    error,
    emptyMessage = "Aucun résultat.",
    searchPlaceholder = "Rechercher...",
    allowEmpty = true,
    emptyLabel = "Aucune sélection",
    className = "",
}: SearchableSelectProps) {

    const containerRef =
        useRef<HTMLDivElement>(null);

    const inputRef =
        useRef<HTMLInputElement>(null);

    const [open, setOpen] =
        useState(false);

    const [search, setSearch] =
        useState("");


    // ======================================================
    // OPTION SÉLECTIONNÉE
    // ======================================================

    const selectedOption =
        options.find(
            (option) =>
                option.value === value
        );


    // ======================================================
    // FILTRAGE
    // ======================================================

    const normalizedSearch =
        search.trim().toLowerCase();

    const filteredOptions =
        options.filter((option) => {

            if (!normalizedSearch) {
                return true;
            }

            const text =
                option.searchText ||
                option.label;

            return text
                .toLowerCase()
                .includes(normalizedSearch);
        });


    // ======================================================
    // FERMETURE AU CLIC EXTÉRIEUR
    // ======================================================

    useEffect(() => {

        const handleClickOutside = (
            event: MouseEvent
        ) => {

            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
                setSearch("");
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);


    // ======================================================
    // OUVERTURE
    // ======================================================

    const handleOpen = () => {

        if (disabled) {
            return;
        }

        setOpen((previous) => !previous);

        setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
    };


    // ======================================================
    // SÉLECTION
    // ======================================================

    const handleSelect = (
        optionValue: string
    ) => {

        onChange(optionValue);

        setOpen(false);

        setSearch("");
    };


    // ======================================================
    // CLEAR
    // ======================================================

    const handleClear = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {

        event.stopPropagation();

        onChange("");

        setSearch("");
    };


    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
        >

            {/* LABEL */}

            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>


            {/* TRIGGER */}

            <button
                type="button"
                onClick={handleOpen}
                disabled={disabled}
                className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-lg
                    border
                    bg-white
                    px-3
                    py-3
                    text-left
                    transition

                    ${
                        error
                            ? "border-red-400"
                            : "border-gray-300"
                    }

                    ${
                        open
                            ? "border-[#6214BE] ring-2 ring-[#6214BE]/20"
                            : ""
                    }

                    ${
                        disabled
                            ? "cursor-not-allowed bg-gray-100 text-gray-400"
                            : "cursor-pointer hover:border-gray-400"
                    }
                `}
            >

                <span
                    className={
                        selectedOption
                            ? "text-gray-800"
                            : "text-gray-400"
                    }
                >
                    {loading
                        ? "Chargement..."
                        : selectedOption?.label ||
                          placeholder}
                </span>


                <ChevronDown
                    size={18}
                    className={`
                        text-gray-400
                        transition-transform
                        ${
                            open
                                ? "rotate-180"
                                : ""
                        }
                    `}
                />

            </button>


            {/* CLEAR BUTTON */}

            {value && !disabled && !open && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="
                        absolute
                        right-9
                        top-[38px]
                        z-10
                        rounded-full
                        p-1
                        text-gray-400
                        transition
                        hover:bg-gray-100
                        hover:text-gray-600
                    "
                    aria-label="Effacer la sélection"
                >
                    <X size={15} />
                </button>
            )}


            {/* DROPDOWN */}

            {open && !disabled && (

                <div
                    className="
                        absolute
                        left-0
                        right-0
                        z-[70]
                        mt-2
                        overflow-hidden
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        shadow-xl
                    "
                >

                    {/* RECHERCHE */}

                    <div
                        className="
                            border-b
                            border-gray-100
                            bg-white
                            p-2
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                border
                                border-gray-200
                                px-3
                            "
                        >

                            <Search
                                size={17}
                                className="shrink-0 text-gray-400"
                            />

                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder={
                                    searchPlaceholder
                                }
                                className="
                                    w-full
                                    border-0
                                    bg-transparent
                                    py-2.5
                                    text-sm
                                    outline-none
                                "
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    className="
                                        text-gray-400
                                        hover:text-gray-600
                                    "
                                    aria-label="Effacer la recherche"
                                >
                                    <X size={15} />
                                </button>
                            )}

                        </div>

                    </div>


                    {/* OPTIONS */}

                    <div
                        className="
                            max-h-60
                            overflow-y-auto
                            p-1
                        "
                    >

                        {/* OPTION VIDE */}

                        {allowEmpty && (
                            <button
                                type="button"
                                onClick={() =>
                                    handleSelect("")
                                }
                                className={`
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-lg
                                    px-3
                                    py-2.5
                                    text-left
                                    text-sm
                                    transition

                                    ${
                                        value === ""
                                            ? "bg-purple-50 text-[#6214BE]"
                                            : "text-gray-500 hover:bg-gray-50"
                                    }
                                `}
                            >

                                <span>
                                    {emptyLabel}
                                </span>

                                {value === "" && (
                                    <Check
                                        size={17}
                                        className="text-[#6214BE]"
                                    />
                                )}

                            </button>
                        )}


                        {/* OPTIONS FILTRÉES */}

                        {filteredOptions.length > 0 ? (

                            filteredOptions.map(
                                (option) => (

                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            handleSelect(
                                                option.value
                                            )
                                        }
                                        className={`
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            rounded-lg
                                            px-3
                                            py-2.5
                                            text-left
                                            text-sm
                                            transition

                                            ${
                                                value ===
                                                option.value
                                                    ? "bg-purple-50 text-[#6214BE]"
                                                    : "text-gray-700 hover:bg-gray-50"
                                            }
                                        `}
                                    >

                                        <span>
                                            {option.label}
                                        </span>

                                        {value ===
                                            option.value && (
                                            <Check
                                                size={17}
                                                className="text-[#6214BE]"
                                            />
                                        )}

                                    </button>

                                )
                            )

                        ) : (

                            <div
                                className="
                                    px-3
                                    py-6
                                    text-center
                                    text-sm
                                    text-gray-500
                                "
                            >
                                {emptyMessage}
                            </div>

                        )}

                    </div>

                </div>

            )}


            {/* ERROR */}

            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}

        </div>
    );
}


// ==========================================================
// MAIN COMPONENT
// ==========================================================

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

    const [
        loadingClassroomGroups,
        setLoadingClassroomGroups,
    ] = useState(false);


    // ==========================================================
    // STATE
    // ==========================================================

    const [saving, setSaving] =
        useState(false);

    const [
        loadingCourseGroups,
        setLoadingCourseGroups,
    ] = useState(false);

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

            setSubjects(
                data.results
            );

        } catch (error) {

            console.error(
                "Erreur lors du chargement des matières :",
                error
            );

            toast.error(
                "Impossible de charger les matières."
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

            toast.error(
                "Impossible de charger les enseignants."
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
                        subjectId ||
                        undefined,
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


    // ==========================================================
    // LOAD CLASSROOM GROUPS
    // ==========================================================

    const loadClassroomGroups =
        async () => {

            if (!classroomId) {

                setClassroomGroups([]);

                return;
            }

            try {

                setLoadingClassroomGroups(
                    true
                );

                const data =
                    await getClassroomGroups(
                        classroomId
                    );

                setClassroomGroups(
                    data.results
                );

            } catch (error) {

                console.error(
                    "Erreur lors du chargement des groupes de classe :",
                    error
                );

                setClassroomGroups([]);

            } finally {

                setLoadingClassroomGroups(
                    false
                );
            }
        };


    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useEffect(() => {

        if (!open) {
            return;
        }

        loadSubjects();

        loadTeachers();

        loadClassroomGroups();

    }, [
        open,
        classroomId,
    ]);


    // ==========================================================
    // LOAD COURSE GROUPS
    // ==========================================================

    useEffect(() => {

        if (!open) {
            return;
        }

        if (
            form.assignment_type !==
            "SUBJECT"
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

        if (!open) {
            return;
        }

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

        setForm({

            subject_id:
                assignment.subject_id ??
                "",

            teacher_id:
                assignment.teacher_id ??
                "",

            classroom_group_id:
                assignment.classroom_group_id ??
                "",

            course_group_id:
                assignment.course_group_id ??
                "",

            assignment_type:
                assignment.assignment_type,

            start_date:
                assignment.start_date ??
                "",

            end_date:
                assignment.end_date ??
                "",

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
            form.assignment_type ===
            "PRIMARY"
        ) {

            setForm((previous) => ({

                ...previous,

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

        setForm((previous) => ({

            ...previous,

            subject_id:
                subjectId,

            course_group_id:
                "",

        }));
    };


    // ==========================================================
    // COURSE GROUP CHANGE
    // ==========================================================

    const handleCourseGroupChange = (
        courseGroupId: string
    ) => {

        setForm((previous) => ({

            ...previous,

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
                    form.start_date ||
                    null,

                end_date:
                    form.end_date ||
                    null,

                subject_id:
                    form.assignment_type ===
                    "SUBJECT"
                        ? form.subject_id ||
                          null
                        : null,

                course_group_id:
                    form.assignment_type ===
                    "SUBJECT"
                        ? form.course_group_id ||
                          null
                        : null,

                classroom_group_id:
                    form.assignment_type ===
                    "SUBJECT"
                        ? form.classroom_group_id ||
                          null
                        : null,

                is_homeroom_teacher:
                    form.assignment_type ===
                    "PRIMARY",

            };


            if (!assignment) {

                await createTeachingAssignment(
                    payload
                );

            } else {

                await updateTeachingAssignment(
                    assignment.id,
                    payload
                );
            }


            toast.success(
                assignment
                    ? "Affectation mise à jour."
                    : "Affectation créée."
            );

            onSaved();

            onClose();

        } catch (error: any) {

            console.error(error);

            if (
                error.response?.data
            ) {

                const backendErrors =
                    error.response.data;

                setErrors(
                    backendErrors
                );

                const firstError =
                    Object.values(
                        backendErrors
                    )[0];

                if (
                    Array.isArray(
                        firstError
                    ) &&
                    firstError.length > 0
                ) {

                    toast.error(
                        String(
                            firstError[0]
                        )
                    );

                } else if (
                    typeof firstError ===
                    "string"
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
        Boolean(form.teacher_id) &&
        (
            form.assignment_type ===
                "PRIMARY" ||
            Boolean(form.subject_id)
        );


    // ==========================================================
    // SEARCHABLE OPTIONS
    // ==========================================================

    const subjectOptions:
        SearchableOption[] =
        subjects.map(
            (subject) => ({

                value:
                    String(subject.id),

                label:
                    subject.name,

                searchText:
                    `${subject.name} ${
                        subject.code || ""
                    }`,
            })
        );


    const teacherOptions:
        SearchableOption[] =
        teachers.map(
            (teacher) => {

                const fullName =
                    `${teacher.first_name} ${teacher.last_name}`;

                return {

                    value:
                        String(teacher.id),

                    label:
                        fullName,

                    searchText:
                        `${fullName} ${
                            teacher.phone || ""
                        }`,
                };
            }
        );


    const classroomGroupOptions:
        SearchableOption[] =
        classroomGroups.map(
            (group) => ({

                value:
                    String(group.id),

                label:
                    group.name,

                searchText:
                    group.name,

            })
        );


    const courseGroupOptions:
        SearchableOption[] =
        courseGroups.map(
            (courseGroup) => ({

                value:
                    String(courseGroup.id),

                label:
                    `${courseGroup.name}${
                        courseGroup.code
                            ? ` (${courseGroup.code})`
                            : ""
                    }`,

                searchText:
                    `${courseGroup.name} ${
                        courseGroup.code || ""
                    }`,

            })
        );


    // ==========================================================
    // RENDER
    // ==========================================================

    if (!open) {
        return null;
    }


    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                p-4
            "
        >

            {/* ==================================================
                MODAL
            ================================================== */}

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
                    HEADER
                ================================================== */}

                <div
                    className="
                        shrink-0
                        border-b
                        px-6
                        py-4
                    "
                >

                    <h2 className="text-xl font-semibold text-gray-900">

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

                    {/* ==================================================
                        BODY
                    ================================================== */}

                    <div
                        className="
                            min-h-0
                            flex-1
                            space-y-5
                            overflow-y-auto
                            p-6
                        "
                    >

                        {/* ==================================================
                            TYPE D'ENSEIGNANT
                            SELECT SIMPLE
                        ================================================== */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                "
                            >
                                Type d'enseignant
                            </label>

                            <select
                                value={
                                    form.assignment_type
                                }
                                onChange={(e) =>
                                    setForm(
                                        (previous) => ({
                                            ...previous,
                                            assignment_type:
                                                e.target.value,
                                        })
                                    )
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    bg-white
                                    p-3
                                    text-gray-800
                                    outline-none
                                    transition
                                    focus:border-[#6214BE]
                                    focus:ring-2
                                    focus:ring-[#6214BE]/20
                                "
                            >

                                <option value="">
                                    Sélectionnez le type d'enseignant
                                </option>

                                <option value="PRIMARY">
                                    Enseignant primaire
                                </option>

                                <option value="SUBJECT">
                                    Enseignant secondaire / supérieur
                                </option>

                            </select>

                        </div>


                        {/* ==================================================
                            INFO PRIMARY
                        ================================================== */}

                        {form.assignment_type ===
                            "PRIMARY" && (

                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-blue-200
                                    bg-blue-50
                                    p-3
                                    text-sm
                                    text-blue-700
                                "
                            >

                                ℹ️ L'enseignant titulaire est
                                responsable de toute la classe.
                                Aucune matière ni aucun cours
                                commun ne sont nécessaires.

                            </div>

                        )}


                        {/* ==================================================
                            MATIÈRE
                        ================================================== */}

                        {form.assignment_type ===
                            "SUBJECT" && (

                            <SearchableSelect
                                label="Matière"
                                value={
                                    form.subject_id
                                }
                                options={
                                    subjectOptions
                                }
                                onChange={
                                    handleSubjectChange
                                }
                                placeholder="Sélectionner une matière"
                                searchPlaceholder="Rechercher une matière..."
                                emptyMessage="Aucune matière trouvée."
                                error={
                                    errors.subject?.[0]
                                }
                            />

                        )}


                        {/* ==================================================
                            GROUPE DE CLASSE
                        ================================================== */}

                        {form.assignment_type ===
                            "SUBJECT" && (

                            <SearchableSelect
                                label="Groupe"
                                value={
                                    form.classroom_group_id
                                }
                                options={
                                    classroomGroupOptions
                                }
                                onChange={(value) =>
                                    setForm(
                                        (previous) => ({
                                            ...previous,
                                            classroom_group_id:
                                                value,
                                        })
                                    )
                                }
                                disabled={
                                    loadingClassroomGroups
                                }
                                loading={
                                    loadingClassroomGroups
                                }
                                placeholder="Classe entière"
                                searchPlaceholder="Rechercher un groupe..."
                                emptyLabel="Classe entière"
                                emptyMessage="Aucun groupe trouvé."
                                error={
                                    errors.classroom_group?.[0]
                                }
                            />

                        )}


                        {!loadingClassroomGroups &&
                            form.assignment_type ===
                                "SUBJECT" &&
                            classroomGroups.length ===
                                0 && (

                                <p
                                    className="
                                        -mt-3
                                        text-xs
                                        text-gray-500
                                    "
                                >

                                    Aucun groupe dans cette
                                    classe. L'affectation concerne
                                    toute la classe.

                                </p>

                            )}


                        {/* ==================================================
                            ENSEIGNANT
                        ================================================== */}

                        <SearchableSelect
                            label="Enseignant"
                            value={
                                form.teacher_id
                            }
                            options={
                                teacherOptions
                            }
                            onChange={(value) =>
                                setForm(
                                    (previous) => ({
                                        ...previous,
                                        teacher_id:
                                            value,
                                    })
                                )
                            }
                            placeholder="Sélectionner un enseignant"
                            searchPlaceholder="Rechercher par nom, prénom ou téléphone..."
                            emptyMessage="Aucun enseignant trouvé."
                            error={
                                errors.teacher?.[0]
                            }
                        />


                        {/* ==================================================
                            COURS COMMUN
                        ================================================== */}

                        {form.assignment_type ===
                            "SUBJECT" && (

                            <SearchableSelect
                                label="Cours commun"
                                value={
                                    form.course_group_id
                                }
                                options={
                                    courseGroupOptions
                                }
                                onChange={
                                    handleCourseGroupChange
                                }
                                disabled={
                                    !form.subject_id ||
                                    loadingCourseGroups
                                }
                                loading={
                                    loadingCourseGroups
                                }
                                placeholder={
                                    !form.subject_id
                                        ? "Sélectionnez d'abord une matière"
                                        : "Classe entière"
                                }
                                searchPlaceholder="Rechercher un cours commun..."
                                emptyLabel="Classe entière"
                                emptyMessage="Aucun cours commun trouvé."
                                error={
                                    errors.course_group?.[0]
                                }
                            />

                        )}


                        {/* ==================================================
                            LOADING COURS COMMUNS
                        ================================================== */}

                        {loadingCourseGroups &&
                            form.subject_id && (

                                <p
                                    className="
                                        -mt-3
                                        text-xs
                                        text-gray-500
                                    "
                                >

                                    Chargement des cours
                                    communs...

                                </p>

                            )}


                        {/* ==================================================
                            AUCUN COURS COMMUN
                        ================================================== */}

                        {!loadingCourseGroups &&
                            form.subject_id &&
                            courseGroups.length ===
                                0 &&
                            form.assignment_type ===
                                "SUBJECT" && (

                                <p
                                    className="
                                        -mt-3
                                        text-xs
                                        text-gray-500
                                    "
                                >

                                    Aucun cours commun pour
                                    cette matière.

                                </p>

                            )}


                        {/* ==================================================
                            INFO COURS COMMUN
                        ================================================== */}

                        {form.assignment_type ===
                            "SUBJECT" &&
                            form.course_group_id && (

                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-purple-200
                                    bg-purple-50
                                    p-3
                                    text-sm
                                    text-purple-700
                                "
                            >

                                <strong>
                                    Cours commun :
                                </strong>{" "}

                                Cette affectation sera liée
                                au cours commun sélectionné.
                                Les autres classes membres
                                de ce cours pourront utiliser
                                la même affectation pédagogique.

                            </div>

                        )}

                    </div>


                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <div
                        className="
                            shrink-0
                            border-t
                            bg-white
                            px-6
                            py-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-end
                                gap-3
                            "
                        >

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
                                    transition
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
                                    saving ||
                                    !isFormValid
                                }
                                className="
                                    cursor-pointer
                                    rounded-lg
                                    bg-[#6214BE]
                                    px-5
                                    py-2
                                    text-white
                                    transition
                                    hover:bg-[#5310a0]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                {saving
                                    ? "Enregistrement..."
                                    : assignment
                                        ? "Mettre à jour"
                                        : "Enregistrer"}

                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
}