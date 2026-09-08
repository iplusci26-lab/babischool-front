// ==========================================================
// COMMON
// ==========================================================

export type UUID = string;


// ==========================================================
// PARENT
// ==========================================================

/**
 * Parent retourné par l'API.
 *
 * Utilisé principalement dans la liste des parents.
 */
export interface Parent {

  // ========================================================
  // IDENTIFICATION
  // ========================================================

  id: UUID;


  // ========================================================
  // INFORMATIONS
  // ========================================================

  full_name: string;

  phone: string;


  // ========================================================
  // COMPTE
  // ========================================================

  /**
   * Indique si le compte parent est actif.
   *
   * true  = compte actif
   * false = compte désactivé
   */
  is_active: boolean;


  /**
   * Indique si le parent doit modifier son mot de passe
   * lors de sa prochaine connexion.
   */
  must_change_password: boolean;


  // ========================================================
  // ENFANTS
  // ========================================================

  children_count: number;


  // ========================================================
  // DATES
  // ========================================================

  created_at: string;

  updated_at: string;

}


// ==========================================================
// PARENT DETAIL
// ==========================================================

/**
 * Informations complètes d'un parent.
 *
 * Utilisé pour récupérer les données avant modification.
 */
export interface ParentDetail {

  // ========================================================
  // IDENTIFICATION
  // ========================================================

  id: UUID;


  // ========================================================
  // UTILISATEUR
  // ========================================================

  first_name: string;

  last_name: string;

  gender: "m" | "f" | null;

  date_of_birth: string | null;


  // ========================================================
  // CONTACT
  // ========================================================

  phone: string;

  alternate_phone: string;


  // ========================================================
  // PROFIL
  // ========================================================

  occupation: string;

  address: string;


  // ========================================================
  // COMPTE
  // ========================================================

  is_active: boolean;


  // ========================================================
  // DATES
  // ========================================================

  created_at: string;

  updated_at: string;

}


// ==========================================================
// PARENT UPDATE PAYLOAD
// ==========================================================

/**
 * Données envoyées pour modifier un parent.
 *
 * PATCH /parents/:id/
 */
export interface ParentUpdatePayload {

  // ========================================================
  // IDENTITÉ
  // ========================================================

  first_name?: string;

  last_name?: string;

  gender?: "m" | "f" | null;

  date_of_birth?: string | null;


  // ========================================================
  // CONTACT
  // ========================================================

  phone?: string;

  alternate_phone?: string;


  // ========================================================
  // PROFIL
  // ========================================================

  occupation?: string;

  address?: string;

}


// ==========================================================
// PAGINATION
// ==========================================================

export interface PaginatedResponse<T> {

  count: number;

  next: string | null;

  previous: string | null;

  results: T[];

}


// ==========================================================
// RESET PARENT PASSWORD
// ==========================================================

export interface ResetParentPasswordResponse {

  message: string;

  parent: {

    id: UUID;

    name: string;

    phone: string;

  };

  temporary_password: string;

  must_change_password: boolean;

}


// ==========================================================
// PARENT ACCOUNT STATUS RESPONSE
// ==========================================================

/**
 * Réponse retournée après activation
 * ou désactivation du compte parent.
 */
export interface ParentAccountStatusResponse {

  message: string;

  parent_id: UUID;

  is_active: boolean;

}