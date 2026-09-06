// ==========================================================
// COMMON
// ==========================================================

export type UUID = string;


// ==========================================================
// DOMAIN MODELS
// ==========================================================

export interface StudentGroup {

  membership_id: UUID;

  group_id: UUID;

  name: string;

  code?: string | null;

  description?: string | null;

  classroom_name?: string | null;

  is_active: boolean;

}


export interface Student {

  id: UUID;

  student_number: string;

  first_name: string;

  last_name: string;

  display_name: string;

  gender: "M" | "F";

  date_of_birth?: string | null;

  is_assigned: boolean;

  is_repeating: boolean;

  birth_place?: string | null;

  classroom?: UUID | null;

  classroom_name?: string | null;


  // ========================================================
  // GROUPS
  // ========================================================

  groups?: StudentGroup[];


  // ========================================================
  // PARENT
  // ========================================================

  parent?: UUID | null;

  parent_name?: string | null;

  parent_phone?: string | null;


  // ========================================================
  // PHOTO / STATUS
  // ========================================================

  photo?: string | null;

  status:
    | "ACTIVE"
    | "INACTIVE"
    | "TRANSFERRED";

}


// ==========================================================
// CLASSROOM
// ==========================================================

export interface Classroom {

  id: UUID;

  name: string;

}


// ==========================================================
// CLASSROOM GROUP
// ==========================================================

export interface ClassroomGroup {

  id: UUID;

  classroom: UUID;

  classroom_name?: string;

  classroom_level_name?: string;

  name: string;

  code?: string | null;

  description?: string | null;

  is_active: boolean;

  display_order?: number;

}


// ==========================================================
// GROUP MEMBER
// ==========================================================

export interface StudentGroupMember {

  /**
   * ID réel de l'élève.
   *
   * Nécessaire pour :
   *
   * - sélectionner un membre
   * - retirer un membre
   * - identifier l'élève dans StudentGroupManager
   */

  id: UUID;

  student_number: string;

  first_name: string;

  last_name: string;

  display_name: string;

  gender: "M" | "F";

  classroom?: UUID | null;

  classroom_name?: string | null;

  is_assigned: boolean;

  is_repeating: boolean;

  groups?: StudentGroup[];

}


// ==========================================================
// GROUP MEMBERS RESPONSE
// ==========================================================

export interface ClassroomGroupMembersResponse {

  group: ClassroomGroup;

  data: StudentGroupMember[];

  total: number;

}


// ==========================================================
// BULK GROUP OPERATIONS
// ==========================================================

export interface BulkGroupMembersPayload {

  student_ids: UUID[];

  group_ids: UUID[];

}


export interface BulkGroupMembersResponse {

  detail: string;

  created?: number;

  reactivated?: number;

  already_members?: number;

  removed?: number;

  already_removed?: number;

  total_processed: number;

}


// ==========================================================
// FILTERS
// ==========================================================

export interface StudentFilters {

  search: string;


  /**
   * UUID de la classe sélectionnée.
   *
   * Les identifiants du projet utilisent UUID,
   * donc la valeur doit rester une string.
   */

  classroom: UUID | null;


  gender:
    | ""
    | "M"
    | "F";


  // status:
  //   | ""
  //   | "ACTIVE"
  //   | "INACTIVE"
  //   | "TRANSFERRED";

}


// ==========================================================
// STATS
// ==========================================================

export interface StudentStats {

  total: number;

  girls: number;

  boys: number;

  classrooms: number;

}


// ==========================================================
// PAGINATION
// ==========================================================

export interface Pagination {

  page: number;

  pageSize: number;

  total: number;

}


// ==========================================================
// EXPORT
// ==========================================================

export type ExportType =
  | "excel"
  | "pdf";


// ==========================================================
// API RESPONSE
// ==========================================================

export interface StudentListResponse {

  data: Student[];

  total_E: number;

  queryset_M: number;

  queryset_F: number;

}