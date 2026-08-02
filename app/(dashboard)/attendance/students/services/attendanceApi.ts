import { api } from "@/lib/api";

export async function getSchedules() {
  const res = await api.get("/academics/schedules/");
  return res.data.results ?? res.data;
}

export async function getAttendanceSession(
  scheduleId: string
) {
  const res = await api.get(
    `/attendance/session/?schedule_id=${scheduleId}`
  );

  return res.data;
}

export async function saveAttendance(
  scheduleId: string,
  updates: any[]
) {
  return api.post("/attendance/take/", {
    schedule_id: scheduleId,
    updates,
  });
}