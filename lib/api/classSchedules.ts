import { api } from "@/lib/api";

import {
    ClassSchedule,
    ClassSchedulePayload,
    ScheduleFilter,
    WeeklyScheduleResponse,
    ScheduleFiltersResponse,
    ScheduleFormDataResponse,
} from "@/types/classSchedule";

// ==========================================================
// BASE URL
// ==========================================================

const BASE_URL = "/academics/schedules/";

// ==========================================================
// EMPLOI DU TEMPS HEBDOMADAIRE
// ==========================================================

export const getWeeklySchedule = async (
    filters?: ScheduleFilter
): Promise<WeeklyScheduleResponse> => {
    const { data } =
        await api.get<WeeklyScheduleResponse>(
            `${BASE_URL}weekly/`,
            {
                params: filters,
            }
        );

    return data;
};

// ==========================================================
// LISTE DES SÉANCES
// ==========================================================

export const getSchedules = async (
    filters?: ScheduleFilter
): Promise<ClassSchedule[]> => {
    const { data } =
        await api.get<ClassSchedule[]>(
            BASE_URL,
            {
                params: filters,
            }
        );

    return data;
};

// ==========================================================
// UNE SÉANCE
// ==========================================================

export const getSchedule = async (
    id: string
): Promise<ClassSchedule> => {
    const { data } =
        await api.get<ClassSchedule>(
            `${BASE_URL}${id}/`
        );

    return data;
};

// ==========================================================
// CRÉATION
// ==========================================================

export const createSchedule = async (
    payload: ClassSchedulePayload
): Promise<ClassSchedule> => {
    const { data } =
        await api.post<ClassSchedule>(
            BASE_URL,
            payload
        );

    return data;
};

// ==========================================================
// MODIFICATION
// ==========================================================

export const updateSchedule = async (
    id: string,
    payload: ClassSchedulePayload
): Promise<ClassSchedule> => {
    const { data } =
        await api.put<ClassSchedule>(
            `${BASE_URL}${id}/`,
            payload
        );

    return data;
};

// ==========================================================
// SUPPRESSION
// ==========================================================

export const deleteSchedule = async (
    id: string
): Promise<void> => {
    await api.delete(
        `${BASE_URL}${id}/`
    );
};

// ==========================================================
// OPTIONS DES FILTRES
// ==========================================================

export const getScheduleFilters =
    async (): Promise<ScheduleFiltersResponse> => {
        const { data } =
            await api.get<ScheduleFiltersResponse>(
                `${BASE_URL}filters/`
            );

        return data;
    };

// ==========================================================
// DONNÉES DU FORMULAIRE
// ==========================================================

export const getScheduleFormData =
    async (): Promise<ScheduleFormDataResponse> => {
        const { data } =
            await api.get<ScheduleFormDataResponse>(
                `${BASE_URL}form-data/`
            );

        return data;
    };

// ==========================================================
// DUPLICATION D'UNE SEMAINE
// ==========================================================

export interface DuplicateWeekScheduleResponse {
    source_week: string;
    destination_week: string;
    created: number;
    skipped?: number;
}

export const duplicateWeekSchedule = async (
    sourceWeek: string,
    destinationWeek: string
): Promise<DuplicateWeekScheduleResponse> => {
    const { data } =
        await api.post<DuplicateWeekScheduleResponse>(
            `${BASE_URL}duplicate-week/`,
            {
                source_week: sourceWeek,
                destination_week: destinationWeek,
            }
        );

    return data;
};