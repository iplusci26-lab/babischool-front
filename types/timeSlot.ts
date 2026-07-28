export type TimeSlotType = "LESSON" | "BREAK" | "EXAM";

export interface TimeSlot {

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

    created_at: string;

    updated_at: string;

}