import { api } from "@/lib/api";

import {
    ClassSchedule,
    ClassSchedulePayload,
    ScheduleFilter,
    WeeklyScheduleResponse,
} from "@/types/classSchedule";

const BASE_URL = "/academics/schedules/";

export const getWeeklySchedule = async (
    filters?: ScheduleFilter
): Promise<WeeklyScheduleResponse> => {

    const { data } = await api.get<WeeklyScheduleResponse>(
        `${BASE_URL}weekly/`,
        {
            params: filters,
        }
    );

    return data;
};

export const getSchedules = async (
    filters?: ScheduleFilter & {
        weekday?: string;
        time_slot?: string;
        is_active?: boolean;
    }
): Promise<ClassSchedule[]> => {

    const { data } = await api.get<ClassSchedule[]>(
        BASE_URL,
        {
            params: filters,
        }
    );

    return data;
};

export const getSchedule = async (
    id: string
): Promise<ClassSchedule> => {

    const { data } = await api.get<ClassSchedule>(
        `${BASE_URL}${id}/`
    );

    return data;
};

export const createSchedule = async (
    payload: ClassSchedulePayload
): Promise<ClassSchedule> => {

    const { data } = await api.post<ClassSchedule>(
        BASE_URL,
        payload
    );

    return data;
};


export const updateSchedule = async (
    id: string,
    payload: ClassSchedulePayload
): Promise<ClassSchedule> => {

    const { data } = await api.put<ClassSchedule>(
        `${BASE_URL}${id}/`,
        payload
    );

    return data;
};

export const deleteSchedule = async (
    id: string
): Promise<void> => {

    await api.delete(
        `${BASE_URL}${id}/`
    );

};

export interface ScheduleFiltersResponse {
    classrooms: {
        id: string;
        name: string;
    }[];

    teachers: {
        id: string;
        full_name: string;
    }[];
}

export interface ScheduleFormDataResponse {
    assignments: {
        id: string;
        label: string;
        assignment_type: "PRIMARY" | "SUBJECT";
    }[];

    subjects: {
        id: string;
        name: string;
    }[];
}

export const getScheduleFilters = async (): Promise<ScheduleFiltersResponse> => {

    const { data } = await api.get<ScheduleFiltersResponse>(
        `${BASE_URL}filters/`
    );

    return data;
};

export const getScheduleFormData = async (): Promise<ScheduleFormDataResponse> => {

    const { data } = await api.get<ScheduleFormDataResponse>(
        `${BASE_URL}form-data/`
    );

    return data;
};

/*
export const duplicateWeekSchedule = async (
    sourceWeek: string,
    destinationWeek: string
) => {

    return api.post(
        `${BASE_URL}duplicate-week/`,
        {
            source_week: sourceWeek,
            destination_week: destinationWeek,
        }
    );

};*/