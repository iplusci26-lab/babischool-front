export interface Role {
    id: string;
    name: string;
}

export interface Staff {
    id: string;

    first_name: string;

    last_name: string;

    phone: string;

    user_type: string;

    role?: Role;

    /**
     * Sera utilisé lorsque nous ajouterons
     * le champ Fonction.
     */
    function?: string;
}

export interface StaffFormData {

    first_name: string;

    last_name: string;

    phone: string;

    function: string;
    
    role: string;

}