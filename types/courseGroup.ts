export interface CourseGroupClassroom {
    id: string;
    name: string;
}

export interface CourseGroup {
    id: string;

    name: string;

    code: string;

    description: string;

    academic_year_id: string;
    academic_year_name: string;

    subject_id: string;
    subject_name: string;

    teacher_id: string;
    teacher_name: string;

    classroom_ids: string[];

    classrooms: CourseGroupClassroom[];

    is_active: boolean;

    
}