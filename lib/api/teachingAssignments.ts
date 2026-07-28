import { api } from "../api";
import { TeachingAssignment } from "@/types/teachingAssignment";

export async function getTeachingAssignments(
  classroomId: string
): Promise<TeachingAssignment[]> {

  const response = await api.get(
    "/academics/teaching-assignments/",
    {
      params: {
        classroom_id: classroomId,
      },
    }
  );

  return response.data;
}

export async function createTeachingAssignment(data: any) {

  const response = await api.post(
    "/academics/teaching-assignments/",
    data
  );

  return response.data;
}

export async function updateTeachingAssignment(
  id: string,
  data: any
) {

  const response = await api.put(
    `/academics/teaching-assignments/${id}/`,
    data
  );

  return response.data;
}

export async function deleteTeachingAssignment(
  id: string
) {

  await api.delete(
    `/academics/teaching-assignments/${id}/`
  );
}