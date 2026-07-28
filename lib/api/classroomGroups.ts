import { api } from "../api";
import { ClassroomGroup } from "@/types/classroomGroup";

export async function getClassroomGroups(
    classroomId: string
): Promise<ClassroomGroup[]> {

    const response = await api.get(
        "/students/classroom-groups/",
        {
            params: {
                classroom_id: classroomId,
            },
        }
    );

    return response.data;

}