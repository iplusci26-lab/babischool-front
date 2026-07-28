import { api } from "@/lib/api";
import { TimeSlot } from "@/types/timeSlot";

export interface TimeSlotPayload {
    name: string;
    order: number;
    start_time: string;
    end_time: string;
    slot_type: "LESSON" | "BREAK" | "EXAM";
    is_active: boolean;
}

const BASE_URL = "/academics/time-slots/";

export const getTimeSlots = async (
    isActive?: boolean
): Promise<TimeSlot[]> => {
    const params =
        isActive === undefined
            ? {}
            : { is_active: isActive };

    const { data } = await api.get<TimeSlot[]>(
        BASE_URL,
        { params }
    );

    return data;
};

export const getTimeSlot = async (
    id: string
): Promise<TimeSlot> => {
    const { data } = await api.get<TimeSlot>(
       `${BASE_URL}${id}/`
    );

    return data;
};

export const createTimeSlot = async (
    payload: TimeSlotPayload
): Promise<TimeSlot> => {
    const { data } = await api.post<TimeSlot>(
        BASE_URL,
        payload
    );

    return data;
};

export const updateTimeSlot = async (
    id: string,
    payload: TimeSlotPayload
): Promise<TimeSlot> => {
    const { data } = await api.put<TimeSlot>(
        `${BASE_URL}${id}/`,
        payload
    );

    return data;
};

export const deleteTimeSlot = async (
    id: string
): Promise<void> => {
    await api.delete(
        `${BASE_URL}${id}/`
    );
};