import { api } from "../api";

import { CourseGroup } from "@/types/courseGroup";

export interface CourseGroupPayload {
    name: string;

    code?: string;

    description?: string;

    academic_year_id: string;

    subject_id: string;

    teacher_id: string;

    classroom_ids: string[];

    is_active?: boolean;
}

export async function getCourseGroups(params?: {
    academicYearId?: string;
    subjectId?: string;
    teacherId?: string;
}): Promise<CourseGroup[]> {

    const response = await api.get(
        "/academics/course-groups/",
        {
            params: {
                academic_year_id:
                    params?.academicYearId,

                subject_id:
                    params?.subjectId,

                teacher_id:
                    params?.teacherId,
            },
        }
    );

    return response.data;
}

export async function getCourseGroup(
    id: string
): Promise<CourseGroup> {

    const response = await api.get(
        `/academics/course-groups/${id}/`
    );

    return response.data;
}

export async function createCourseGroup(
    data: CourseGroupPayload
): Promise<CourseGroup> {

    const response = await api.post(
        "/academics/course-groups/",
        data
    );

    return response.data;
}

export async function updateCourseGroup(
    id: string,
    data: Partial<CourseGroupPayload>
): Promise<CourseGroup> {

    const response = await api.put(
        `/academics/course-groups/${id}/`,
        data
    );

    return response.data;
}

export async function patchCourseGroup(
    id: string,
    data: Partial<CourseGroupPayload>
): Promise<CourseGroup> {

    const response = await api.patch(
        `/academics/course-groups/${id}/`,
        data
    );

    return response.data;
}

export async function deleteCourseGroup(
    id: string
): Promise<void> {

    await api.delete(
        `/academics/course-groups/${id}/`
    );
}