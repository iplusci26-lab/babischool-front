// ==========================================================
// COMMON
// ==========================================================

export type UUID = string;


// ==========================================================
// PAYMENTS
// ==========================================================

export interface ParentPayment {

  id: UUID;

  amount: string | number;

  payment_date: string;

  reference?: string | null;

  notes?: string | null;

}


// ==========================================================
// CLASSROOM
// ==========================================================

/**
 * Classe utilisée dans les listes de classes.
 */
export interface Classroom {

  id: UUID;

  name: string;

}


/**
 * Classe actuellement associée à un élève.
 *
 * Exemple :
 *
 * {
 *   id: "...",
 *   name: "..."
 * }
 */
export interface StudentClassroom {

  id: UUID;

  name: string;

}


// ==========================================================
// STUDENT GROUP
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


// ==========================================================
// STUDENT
// ==========================================================

/**
 * Structure normalisée d'un élève retournée par le backend.
 *
 * Selon l'endpoint utilisé, la classe peut être retournée sous
 * différentes formes :
 *
 * - classroom: { id, name }
 * - classroom_id: UUID
 * - classroom_name: string
 *
 * Les champs classroom_id et classroom_name sont conservés pour
 * assurer la compatibilité avec StudentListSerializer.
 */
export interface Student {


  // ========================================================
  // IDENTITÉ
  // ========================================================

  id: UUID;

  student_number: string;

  first_name: string;

  last_name: string;

  gender: "M" | "F";

  date_of_birth: string | null;

  birth_place: string | null;

  display_name: string;


  /**
   * Photo de l'élève.
   *
   * Certains endpoints peuvent ne pas encore la retourner.
   */
  photo?: string | null;


  // ========================================================
  // INFORMATIONS SCOLAIRES
  // ========================================================

  is_assigned: boolean;

  is_repeating: boolean;


  // ========================================================
  // CLASSE
  // ========================================================

  /**
   * Format détaillé utilisé notamment par StudentDetailSerializer.
   */
  classroom?: StudentClassroom | null;


  /**
   * UUID de la classe.
   *
   * Utile pour StudentListSerializer et pour pré-remplir
   * le StudentModal.
   */
  classroom_id?: UUID | null;


  /**
   * Nom de la classe actuelle.
   *
   * Utilisé notamment dans les listes d'élèves.
   */
  classroom_name?: string | null;


  // ========================================================
  // PARENT
  // ========================================================

  /**
   * Numéro du parent retourné par l'API.
   */
  parent_phone: string | null;


  /**
   * Conservés pour compatibilité avec certains endpoints.
   */
  parent?: UUID | null;

  parent_name?: string | null;


  // ========================================================
  // FINANCES
  //
  // Certains endpoints peuvent ne pas retourner ces champs.
  // Ils sont donc optionnels pour permettre l'utilisation du
  // même type dans StudentListSerializer et
  // StudentDetailSerializer.
  // ========================================================

  tuition_fee?: string | number;

  amount_paid?: string | number;

  balance?: string | number;

  payments?: ParentPayment[];


  // ========================================================
  // GROUPES
  // ========================================================

  groups: StudentGroup[];

}


// ==========================================================
// STUDENT UPDATE PAYLOAD
// ==========================================================

/**
 * Payload envoyé vers :
 *
 * PATCH /students/:student_id/
 *
 * Correspond à StudentUpdateSerializer.
 */
export interface StudentUpdatePayload {


  // ========================================================
  // IDENTITÉ
  // ========================================================

  student_number?: string;

  first_name?: string;

  last_name?: string;

  gender?: "M" | "F";

  date_of_birth?: string;

  birth_place?: string;


  // ========================================================
  // INFORMATIONS SCOLAIRES
  // ========================================================

  is_assigned?: boolean;

  is_repeating?: boolean;


  // ========================================================
  // CLASSROOM
  // ========================================================

  /**
   * UUID de la nouvelle classe.
   *
   * IMPORTANT :
   *
   * Le backend utilise :
   *
   * allow_null=False
   *
   * Donc :
   *
   * ❌ null ne doit jamais être envoyé.
   *
   * Si aucune classe n'est sélectionnée,
   * le champ doit simplement être omis.
   */
  classroom_id?: UUID;

}


// ==========================================================
// CLASSROOM GROUP
// ==========================================================

export interface ClassroomGroup {

  id: UUID;

  classroom: UUID;

  classroom_name?: string | null;

  classroom_level_name?: string | null;

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


  // ========================================================
  // IDENTITÉ
  // ========================================================

  id: UUID;

  student_number: string;

  first_name: string;

  last_name: string;

  display_name: string;

  gender: "M" | "F";


  // ========================================================
  // CLASSROOM
  // ========================================================

  classroom?: UUID | null;

  classroom_name?: string | null;


  // ========================================================
  // INFORMATIONS SCOLAIRES
  // ========================================================

  is_assigned: boolean;

  is_repeating: boolean;


  // ========================================================
  // GROUPS
  // ========================================================

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
   */
  classroom: UUID | null;


  gender:
    | ""
    | "M"
    | "F";

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

/**
 * Réponse retournée par StudentListView.
 */
export interface StudentListResponse {

  data: Student[];

  queryset_F: number;

  queryset_M: number;

  total_E: number;

}