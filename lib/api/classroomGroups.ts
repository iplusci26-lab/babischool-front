import { api } from "../api";

import { ClassroomGroup } from "@/types/classroomGroup";


// ==========================================================
// RESPONSE
// ==========================================================

export interface ClassroomGroupsResponse {

    count: number;

    next: string | null;

    previous: string | null;

    results: ClassroomGroup[];

}


// ==========================================================
// GET CLASSROOM GROUPS
// ==========================================================

export async function getClassroomGroups(
    classroomId: string
): Promise<ClassroomGroupsResponse> {

    const response = await api.get(
        "/students/classroom-groups/",
        {
            params: {
                classroom: classroomId,
            },
        }
    );

    return response.data;

}