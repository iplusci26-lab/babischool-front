import { api } from "@/lib/api";

import {
  TeacherAttendanceDashboard,
  MarkAttendancePayload,
  JustifyAttendancePayload,
} from "../types";

/**
 * Récupère le tableau de bord des présences du jour.
 */
export async function getTodayAttendance(): Promise<TeacherAttendanceDashboard> {
  const response = await api.get(
    "/attendance/teacher-attendance/today/"
  );

  return response.data;
}

/**
 * Marque la présence d'un enseignant.
 */
export async function markAttendance(
  payload: MarkAttendancePayload
) {
  const response = await api.post(
    "/attendance/teacher-attendance/",
    payload
  );

  return response.data;
}

/**
 * Valide ou refuse une justification.
 */
export async function justifyAttendance(
  attendanceId: string,
  payload: JustifyAttendancePayload
) {
  const response = await api.patch(
    `/attendance/teacher-attendance/${attendanceId}/justify/`,
    payload
  );

  return response.data;
}