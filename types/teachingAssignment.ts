export interface TeachingAssignment {
    id: string;
  
    academic_year_name: string;
  
    classroom_name: string;
  
    classroom_group_name: string | null;
  
    teacher_name: string;
  
    subject_name: string | null;
  
    assignment_type: string;
  
    assignment_type_label: string;
  
    is_homeroom_teacher: boolean;
  
    is_active: boolean;
  
    start_date: string | null;
  
    end_date: string | null;
  
    display_name: string;

    subject_id: string;

    teacher_id: string;

    classroom_group_id: string;
  }