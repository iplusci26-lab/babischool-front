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

export interface WeekdayItem {
    value: Weekday;
    label: string;
}

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

export interface ScheduleFilter {

    classroom?: string;

    teacher?: string;

    weekday?: Weekday;

    time_slot?: string;

    is_active?: boolean;

}

export interface ClassSchedule {

    id: string;

    assignment: string;
    assignment_id: string;
    assignment_type: "PRIMARY" | "SUBJECT";
    assignment_type_label: string;

    weekday: Weekday;
    weekday_label: string;

    teacher_id: string;
    teacher_name: string;

    classroom_id: string;
    classroom_name: string;

    subject_id: string | null;
    subject_name: string | null;

    lesson_subject: string | null;
    lesson_subject_id: string | null;
    lesson_subject_name: string | null;

    time_slot: string;
    time_slot_id: string;
    time_slot_name: string;

    start_time: string;
    end_time: string;
    duration_minutes: number;
    slot_type: TimeSlotType;

    room: string;

    is_active: boolean;

    created_at: string;
    updated_at: string;
}

export interface ClassSchedulePayload {
    assignment: string;
    weekday: Weekday;
    time_slot: string;
    lesson_subject?: string | null;
    room?: string;
}

export type WeeklyScheduleGrids = Record<
    Weekday,
    Record<string, ClassSchedule | null>
>;

export interface WeeklyScheduleResponse {

    weekdays: WeekdayItem[];

    time_slots: WeeklyTimeSlot[];

    grid: WeeklyScheduleGrids;

}

export interface ClassroomOption {
    id: string;
    name: string;
}

export interface TeacherOption {
    id: string;
    full_name: string;
}



export interface AssignmentOption {
    id: string;
    label: string;
    assignment_type: "PRIMARY" | "SUBJECT";
}

export interface SubjectOption {
    id: string;
    name: string;
}


export interface ScheduleFiltersResponse {
    classrooms: ClassroomOption[];
    teachers: TeacherOption[];
}

export interface ScheduleFormDataResponse {
    assignments: AssignmentOption[];
    subjects: SubjectOption[];
}