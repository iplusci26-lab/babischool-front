export interface TeachingAssignment {
  id: string;

  academic_year_id?: string;
  academic_year_name: string;

  classroom_id?: string;
  classroom_name: string;

  classroom_group_id: string | null;
  classroom_group_name: string | null;

  course_group_id: string | null;
  course_group_name: string | null;

  teacher_id: string;
  teacher_name: string;

  subject_id: string | null;
  subject_name: string | null;

  assignment_type: string;
  assignment_type_label: string;

  is_homeroom_teacher: boolean;

  is_active: boolean;

  start_date: string | null;
  end_date: string | null;

  display_name: string;
}

export interface CreateTeachingAssignmentPayload {
  academic_year_id: string;

  classroom_id: string;

  teacher_id: string;

  assignment_type: string;

  subject_id?: string | null;

  classroom_group_id?: string | null;

  course_group_id?: string | null;

  is_homeroom_teacher?: boolean;

  start_date?: string | null;

  end_date?: string | null;
}

export interface UpdateTeachingAssignmentPayload {
  academic_year_id?: string;

  classroom_id?: string;

  teacher_id?: string;

  assignment_type?: string;

  subject_id?: string | null;

  classroom_group_id?: string | null;

  course_group_id?: string | null;

  is_homeroom_teacher?: boolean;

  start_date?: string | null;

  end_date?: string | null;

  is_active?: boolean;
}