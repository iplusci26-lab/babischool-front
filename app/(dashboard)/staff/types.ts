export interface Role {
    id: string;
    name: string;
}


/* ==========================================================
 * NIVEAU
 * ========================================================== */

export interface ClassroomLevel {
    id: string;
    name: string;
}


/* ==========================================================
 * CLASSE
 * ========================================================== */

export interface Classroom {
    id: string;

    name: string;

    classroom_level:
        | string
        | ClassroomLevel;

    classroom_level_name?: string;
}


/* ==========================================================
 * RESPONSABILITÉ DU PERSONNEL
 * ========================================================== */

export interface StaffResponsibility {

    id: string;

    staff: string;

    classroom_level:
        | string
        | ClassroomLevel;

    classroom_level_name?: string;

    all_classes: boolean;

    classrooms: string[];

    classroom_names?: string[];

}


/* ==========================================================
 * PERSONNEL
 * ========================================================== */

export interface Staff {

    id: string;

    first_name: string;

    last_name: string;

    phone: string;

    user_type: string;

    role?: Role;

    function?: string;

    responsibilities?: StaffResponsibility[];

}


/* ==========================================================
 * FORMULAIRE PERSONNEL
 * ========================================================== */

export interface StaffFormData {

    first_name: string;

    last_name: string;

    phone: string;

    function: string;

    role: string;

}


/* ==========================================================
 * FORMULAIRE RESPONSABILITÉ
 * ========================================================== */

/**
 * Données envoyées au backend
 * lors de la création ou modification
 * d'une responsabilité.
 */
export interface StaffResponsibilityFormData {

    classroom_level: string;

    all_classes: boolean;

    classrooms: string[];

}