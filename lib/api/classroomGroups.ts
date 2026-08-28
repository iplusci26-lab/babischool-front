import { api } from "../api";
import { ClassroomGroup } from "@/types/classroomGroup";


export interface ClassroomGroupsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ClassroomGroup[];
}


export async function getClassroomGroups(
    classroomId: string
): Promise<ClassroomGroupsResponse> {
    const response = await api.get(
        `/classrooms/${classroomId}/groups/`
    );

    return response.data;
}