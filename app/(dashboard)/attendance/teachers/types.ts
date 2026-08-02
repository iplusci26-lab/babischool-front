export type AttendanceStatus =
  | "present"
  | "late"
  | "absent"
  | null;

export type JustificationStatus =
  | "not_required"
  | "pending"
  | "justified"
  | "unjustified"
  | null;

export type CourseStatus =
  | "upcoming"
  | "running"
  | "finished";

export interface TeacherAttendanceSummary {
  total_courses: number;
  present: number;
  late: number;
  absent: number;
  pending: number;
  justified: number;
  unjustified: number;
}

export interface TeacherAttendanceCourse {

  attendance_id: string | null;
  schedule_id: string;

  teacher_id: string;
  teacher_last_name: string;
  teacher_first_name: string;
  validated_by_name: string | null;
  validated_at: string | null;
  subject_name: string;

  classroom_name: string;

  room: string | null;

  start_time: string;
  end_time: string;

  time_range: string;

  attendance_status: AttendanceStatus;

  justification_status: JustificationStatus;

  course_status: CourseStatus;
}

export interface TeacherAttendanceDashboard {
  summary: TeacherAttendanceSummary;
  courses: TeacherAttendanceCourse[];
  pending_justifications: PendingTeacherJustification[];
  validated_justifications: PendingTeacherJustification[];
}

export interface MarkAttendancePayload {
  schedule_id: string;
  attendance_status: Exclude<AttendanceStatus, null>;
}

export interface JustifyAttendancePayload {
  justification_status: "justified" | "unjustified";
}

export interface PendingTeacherJustification {
  attendance_id: string;

  teacher_name: string;
  
  teacher_first_name: string;

  teacher_last_name: string;

  subject_name: string;

  classroom_name: string;

  attendance_status: Exclude<AttendanceStatus, null>;

  justification_status: Exclude<JustificationStatus, null>;

  date: string;

  validated_by_name: string | null;

  validated_at: string | null;
}