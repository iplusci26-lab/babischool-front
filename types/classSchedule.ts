export type Weekday =
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY";

export type TimeSlotType =
    | "LESSON"
    | "EXAM"
    | "BREAK";

// ==========================================================
// JOUR
// ==========================================================

export interface WeekdayItem {
    value: Weekday;
    label: string;
}

// ==========================================================
// CRÉNEAU HORAIRE
// ==========================================================

export interface WeeklyTimeSlot {
    id: string;
    name: string;
    order: number;

    start_time: string;
    end_time: string;

    start_time_display: string;
    end_time_display: string;

    duration_minutes: number;

    slot_type: TimeSlotType;
    slot_type_label: string;

    is_active: boolean;
}

// ==========================================================
// FILTRES
// ==========================================================

export interface ScheduleFilter {
    classroom?: string;
    classroom_group?: string;
    course_group?: string;
    teacher?: string;
    subject?: string;
    weekday?: Weekday;
    time_slot?: string;
    is_active?: boolean;
}

// ==========================================================
// CLASSE / GROUPE PARTICIPANT À UNE SÉANCE
// ==========================================================

export interface ScheduleClass {
    id?: string;

    classroom: string;
    classroom_name?: string;

    classroom_group?: string | null;
    classroom_group_name?: string | null;
}

// ==========================================================
// EMPLOI DU TEMPS
// ==========================================================

export interface ClassSchedule {
    id: string;

    // ------------------------------------------------------
    // AFFECTATION
    // ------------------------------------------------------

    assignment: string;
    assignment_id: string;

    assignment_type:
        | "PRIMARY"
        | "SUBJECT";

    assignment_type_label: string;

    // ------------------------------------------------------
    // JOUR
    // ------------------------------------------------------

    weekday: Weekday;
    weekday_label: string;

    // ------------------------------------------------------
    // ENSEIGNANT
    // ------------------------------------------------------

    teacher_id: string;
    teacher_name: string;

    // ------------------------------------------------------
    // CLASSE PRINCIPALE DE L'AFFECTATION
    // ------------------------------------------------------

    classroom_id: string;
    classroom_name: string;

    // ------------------------------------------------------
    // GROUPE DE CLASSE
    // ------------------------------------------------------

    classroom_group_id?: string | null;
    classroom_group_name?: string | null;

    // ------------------------------------------------------
    // COURS COMMUN
    // ------------------------------------------------------

    course_group_id?: string | null;
    course_group_name?: string | null;

    // ------------------------------------------------------
    // MATIÈRE
    // ------------------------------------------------------

    subject_id: string | null;
    subject_name: string | null;

    // Matière utilisée pour une affectation PRIMARY
    lesson_subject: string | null;
    lesson_subject_id: string | null;
    lesson_subject_name: string | null;

    // ------------------------------------------------------
    // CRÉNEAU
    // ------------------------------------------------------

    time_slot: string;
    time_slot_id: string;

    time_slot_name: string;

    start_time: string;
    end_time: string;

    duration_minutes: number;

    slot_type: TimeSlotType;

    // ------------------------------------------------------
    // SALLE
    // ------------------------------------------------------

    room: string;

    // ------------------------------------------------------
    // ÉTAT
    // ------------------------------------------------------

    is_active: boolean;

    // ------------------------------------------------------
    // CLASSES / GROUPES PARTICIPANTS
    // ------------------------------------------------------

    schedule_classes?: ScheduleClass[];

    // ------------------------------------------------------
    // DATES
    // ------------------------------------------------------

    created_at: string;
    updated_at: string;
}

// ==========================================================
// PAYLOAD CRÉATION / MODIFICATION
// ==========================================================

export interface ClassSchedulePayload {
    assignment: string;

    weekday: Weekday;

    time_slot: string;

    lesson_subject?: string | null;

    room?: string;

    // ------------------------------------------------------
    // CLASSES / GROUPES PARTICIPANTS
    // ------------------------------------------------------

    schedule_classes?: ScheduleClassPayloadItem[];
}

// ==========================================================
// ÉLÉMENT DU PAYLOAD schedule_classes
// ==========================================================

export interface ScheduleClassPayloadItem {
    classroom: string;

    classroom_group?: string | null;
}

// ==========================================================
// GRILLE HEBDOMADAIRE
// ==========================================================

/*
export type WeeklyScheduleGrids = Record<
    Weekday,
    Record<string, ClassSchedule | null>
>;
*/

export type WeeklyScheduleGrids = {
    [weekday: string]: {
        [timeSlotId: string]: ClassSchedule[];
    };
};

// ==========================================================
// RÉPONSE GRILLE HEBDOMADAIRE
// ==========================================================

export interface WeeklyScheduleResponse {
    weekdays: WeekdayItem[];

    time_slots: WeeklyTimeSlot[];

    grid: WeeklyScheduleGrids;
}

// ==========================================================
// OPTIONS CLASSES
// ==========================================================

export interface ClassroomOption {
    id: string;
    name: string;
}

// ==========================================================
// OPTIONS ENSEIGNANTS
// ==========================================================

export interface TeacherOption {
    id: string;
    full_name: string;
}

// ==========================================================
// OPTIONS GROUPES DE CLASSE
// ==========================================================

export interface ClassroomGroupOption {
    id: string;
    name: string;

    classroom: string;
    classroom_name?: string;
}

// ==========================================================
// OPTIONS COURS COMMUNS
// ==========================================================

export interface CourseGroupOption {
    id: string;
    name: string;

    code?: string;
    description?: string;

    subject: string;
    subject_name?: string;

    teacher: string;
    teacher_name?: string;

    // Classes participant au cours commun
    classrooms: ClassroomOption[];

    is_active?: boolean;
}

// ==========================================================
// OPTIONS AFFECTATIONS PÉDAGOGIQUES
// ==========================================================

export interface AssignmentOption {
    id: string;

    label: string;

    assignment_type:
        | "PRIMARY"
        | "SUBJECT";

    // ------------------------------------------------------
    // CLASSE
    // ------------------------------------------------------

    classroom?: string | null;
    classroom_name?: string | null;

    // ------------------------------------------------------
    // GROUPE DE CLASSE
    // ------------------------------------------------------

    classroom_group?: string | null;
    classroom_group_name?: string | null;

    // ------------------------------------------------------
    // COURS COMMUN
    // ------------------------------------------------------

    course_group?: string | null;
    course_group_name?: string | null;

    // Classes participantes au CourseGroup
    course_group_classrooms?: ClassroomOption[];
}

// ==========================================================
// OPTIONS MATIÈRES
// ==========================================================

export interface SubjectOption {
    id: string;
    name: string;
}

// ==========================================================
// RÉPONSE DES FILTRES
// ==========================================================

export interface ScheduleFiltersResponse {
    classrooms: ClassroomOption[];

    teachers: TeacherOption[];

    classroom_groups?: ClassroomGroupOption[];

    course_groups?: CourseGroupOption[];

    subjects?: SubjectOption[];
}

// ==========================================================
// DONNÉES DU FORMULAIRE
// ==========================================================

export interface ScheduleFormDataResponse {
    assignments: AssignmentOption[];

    subjects: SubjectOption[];

    classrooms?: ClassroomOption[];

    classroom_groups?: ClassroomGroupOption[];

    course_groups?: CourseGroupOption[];
}