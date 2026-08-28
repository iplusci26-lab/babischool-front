import { api } from "../api";
import { Classroom } from "@/types/classroom";

interface GetClassroomsParams {
    academicYearId?: string;
    cycleId?: string;
}

export interface ClassroomsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Classroom[];
}

export async function getClassrooms(
    params?: GetClassroomsParams
): Promise<ClassroomsResponse> {
    const response = await api.get(
        "/students/classrooms/",
        {
            params: {
                academic_year_id:
                    params?.academicYearId,

                cycle_id:
                    params?.cycleId,
            },
        }
    );

    return response.data;
}