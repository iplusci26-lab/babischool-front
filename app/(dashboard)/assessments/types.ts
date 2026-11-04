// ===========================================================
// ASSESSMENT TYPES
// ===========================================================

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

// ===========================================================
// GROUPE DE CLASSE
// ===========================================================

export interface ClassroomGroup {
  id: string;
  name: string;
  display_order?: number;
  is_active?: boolean;
}

// ===========================================================
// ASSESSMENT
// ===========================================================

export interface Assessment {
  id: string;

  classroom: string;
  classroom_name: string;

  classroom_group?: string | null;
  classroom_group_name?: string | null;

  subject: string;
  subject_name: string;

  teacher: string;
  teacher_name: string;

  created_by: string;
  created_by_name: string;

  term: string;
  term_name: string;

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

// ===========================================================
// CLASSE
// ===========================================================

export interface Classroom {
  id: string;
  name: string;
  groups?: ClassroomGroup[];
}

// ===========================================================
// MATIÈRE
// ===========================================================

export interface Subject {
  id: string;
  name: string;
  code?: string;
}

// ===========================================================
// PÉRIODE ACADÉMIQUE
// ===========================================================

export interface Term {
  id: string;
  name: string;
  term_type?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

// ===========================================================
// FORMULAIRE ÉVALUATION
// ===========================================================

export interface AssessmentFormData {
  classroom: string;
  classroom_group: string;
  subject: string;
  term: string;
  assessment_type: AssessmentType | "";
  max_score: number | string;
  weight: number | string;
  date_assessment: string;
  category: AssessmentCategory;
}

// ===========================================================
// SUMMARY ASSESSMENT
// ===========================================================

export interface AssessmentSummary {
  total: number;
  homework: number;
  test: number;
  exam: number;
}

// ===========================================================
// FILTERS ASSESSMENT
// ===========================================================

export interface AssessmentFilters {
  search: string;
  classroom: string;
  subject: string;
  term: string;
  assessment_type: string;
}

// ===========================================================
// LIBELLÉS TYPES D'ÉVALUATIONS
// ===========================================================

export const ASSESSMENT_TYPE_LABELS: Record<
  AssessmentType,
  string
> = {
  homework: "Devoir",
  test: "Interrogation",
  exam: "Examen",
  compo: "Composition",
};

// ===========================================================
// LIBELLÉS STATUTS D'ÉVALUATIONS
// ===========================================================

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

// ===========================================================
// COULEURS DES BADGES
// ===========================================================

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

// ===========================================================
// OPTIONS TYPES D'ÉVALUATIONS
// ===========================================================

export const ASSESSMENT_TYPE_OPTIONS = [
  { value: "homework", label: "Devoir" },
  { value: "test", label: "Interrogation" },
  { value: "exam", label: "Examen" },
  { value: "compo", label: "Composition" },
];

// ===========================================================
// HOMEWORK FILTERS
// ===========================================================

export interface HomeworkFilters {
  search: string;
  classroom: string;
  subject: string;
  term: string;
  status: string;
}

// ===========================================================
// HOMEWORK SUMMARY
// ===========================================================

export interface HomeworkSummary {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
}

// ===========================================================
// HOMEWORK STATUS
// ===========================================================

export type HomeworkStatus =
  | "pending"
  | "completed"
  | "overdue";

// ===========================================================
// HOMEWORK STATUS OPTIONS
// ===========================================================

export const HOMEWORK_STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "pending", label: "À rendre" },
  { value: "completed", label: "Terminé" },
  { value: "overdue", label: "En retard" },
];

// ===========================================================
// FORMULAIRE EXERCICE
// ===========================================================

export interface HomeworkFormData {
  classroom: string;
  classroom_group: string;
  subject: string;
  term: string;

  title: string;
  description: string;

  assigned_date: string;
  due_date: string;

  max_score: number | string;

  is_published: boolean;
}

// ===========================================================
// HOMEWORK
// ===========================================================

export interface Homework {
  id: string;

  classroom: string;
  classroom_name: string;

  classroom_group?: string | null;
  classroom_group_name?: string | null;

  subject: string;
  subject_name: string;

  // Noms renvoyés par HomeworkView
  academic_term: string;
  academic_term_name: string;

  // Alias frontend pour la période
  term?: string;
  term_name?: string;

  academic_year?: string;
  academic_year_name?: string;

  title: string;
  description: string;

  assigned_date: string;
  due_date: string;

  max_score: number;

  status: HomeworkStatus;
  is_published: boolean;

  attachment?: string | null;

  total_students?: number;
  submitted_students?: number;
}