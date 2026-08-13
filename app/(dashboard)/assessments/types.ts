export type AssessmentType =
  | "homework"
  | "test"
  | "exam"
  | "compo";

export type AssessmentStatus =
  | "draft"
  | "in_progress"
  | "ready"
  | "published"
  | "republish_required";

  export type AssessmentCategory =
  | "class"
  | "scheduled";

export interface Assessment {

  id: string;

  classroom: string;
  classroom_name: string;

  subject: string;
  subject_name: string;

  teacher: string;
  teacher_name: string;

  created_by: string;
  created_by_name: string;

  term: string;
  term_name: string;

  title: string;

  assessment_type: AssessmentType;

  max_score: number;

  weight: number;

  date_assessment: string;

  status: AssessmentStatus;

  status_label: string;

  can_publish: boolean;

  is_completed: boolean;

  created_at: string;

  updated_at: string;

  grades_count?: number;

  progress?: number;

  graded_students?: number;

  total_students?: number;
  category: AssessmentCategory;

}

export interface Classroom {

  id: string;

  name: string;

}

export interface Subject {

  id: string;

  name: string;

  code?: string;

}

export interface Term {

  id: string;

  name: string;

}

export interface AssessmentFormData {

  classroom: string;

  subject: string;

  term: string;

  title: string;

  assessment_type: AssessmentType;

  max_score: number | string;

  weight: number | string;

  date_assessment: string;

  category: AssessmentCategory;

}

export interface AssessmentSummary {

  total: number;

  homework: number;

  test: number;

  exam: number;

}

export interface AssessmentFilters {

  search: string;

  classroom: string;

  subject: string;

  term: string;

  assessment_type: string;

}

/* ===========================================================
 * Libellés
 * =========================================================== */

export const ASSESSMENT_TYPE_LABELS: Record<
  AssessmentType,
  string
> = {

  homework: "Devoir",

  test: "Interrogation",

  exam: "Examen",

  compo: "Composition",

};

export const ASSESSMENT_STATUS_LABELS: Record<
  AssessmentStatus,
  string
> = {

  draft: "Brouillon",

  in_progress: "Saisie en cours",

  ready: "Prête",

  published: "Publiée",

  republish_required: "Republication",

};

/* ===========================================================
 * Couleurs des badges
 * =========================================================== */

export const ASSESSMENT_STATUS_COLORS: Record<
  AssessmentStatus,
  "gray" | "yellow" | "blue" | "green" | "orange"
> = {

  draft: "gray",

  in_progress: "yellow",

  ready: "blue",

  published: "green",

  republish_required: "orange",

};

/* ===========================================================
 * Options Select
 * =========================================================== */

export const ASSESSMENT_TYPE_OPTIONS = [

  {
    value: "homework",
    label: "Devoir",
  },

  {
    value: "test",
    label: "Interrogation",
  },

  {
    value: "exam",
    label: "Examen",
  },

];

/* ===========================================================
 * HOMEWORK
 * =========================================================== */

export interface HomeworkFilters {

  search: string;

  classroom: string;

  subject: string;

  status: string;

}

export interface HomeworkSummary {

  total: number;

  pending: number;

  completed: number;

  overdue: number;

}

export const HOMEWORK_STATUS_OPTIONS = [

  {

    value: "",

    label: "Tous les statuts",

  },

  {

    value: "pending",

    label: "À rendre",

  },

  {

    value: "completed",

    label: "Terminé",

  },

  {

    value: "overdue",

    label: "En retard",

  },

];

export interface HomeworkFormData {

  classroom: string;

  subject: string;

  title: string;

  description: string;

  due_date: string;

  is_published: boolean;

}

export interface Homework {

  id: string;

  classroom: string;

  classroom_name: string;

  subject: string;

  subject_name: string;

  title: string;

  description: string;

  due_date: string;

  status: "pending" | "completed" | "overdue";

  is_published: boolean;

}