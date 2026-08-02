export type StudentAttendanceStatus =
  | "present"
  | "absent"
  | "late";

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
}

export interface ScheduleSession {
  id: string;
  subject: string;
  classroom: string;
  weekday: string;
  start_time: string;
  end_time: string;
  is_closed: boolean;
}

export interface StudentAttendanceRecord {
  record_id: string;

  student_id: string;

  student_name: string;

  student_number: string;

  status: StudentAttendanceStatus;

  minutes_late: number;
}

export interface AttendanceSession {
  session_id: string;

  is_closed: boolean;

  schedule: ScheduleSession;

  stats: AttendanceSummary;

  students: StudentAttendanceRecord[];
}