// ==============================
// DOMAIN MODELS
// ==============================

export interface Student {
    id: number;
  
    student_number: string;
  
    first_name: string;
    last_name: string;
    display_name: string;
  
    gender: "M" | "F";
  
    date_of_birth?: string;

    is_assigned: boolean;
    is_repeating: boolean;
    birth_place: string;
  
    classroom: number;
    classroom_name: string;
  
    parent?: number;
    parent_name?: string;
    parent_phone?: string;
  
    photo?: string;
  
    status: "ACTIVE" | "INACTIVE" | "TRANSFERRED";
  }
  
  // ==============================
  // CLASSROOM
  // ==============================
  
  export interface Classroom {
    id: number;
    name: string;
  }
  
  // ==============================
  // FILTERS
  // ==============================
  
  export interface StudentFilters {
    search: string;
  
    classroom: string | null;
  
    gender: "" | "M" | "F";
  
    //status: "" | "ACTIVE" | "INACTIVE" | "TRANSFERRED";
  }
  
  // ==============================
  // STATS
  // ==============================
  
  export interface StudentStats {
    total: number;
  
    girls: number;
  
    boys: number;
  
    classrooms: number;
  }
  
  // ==============================
  // PAGINATION
  // ==============================
  
  export interface Pagination {
    page: number;
  
    pageSize: number;
  
    total: number;
  }
  
  // ==============================
  // EXPORT
  // ==============================
  
  export type ExportType =
    | "excel"
    | "pdf";
  
  // ==============================
  // API RESPONSE
  // ==============================
  
  export interface StudentListResponse {
    data: Student[];
  
    total_E: number;
  
    queryset_M: number;
  
    queryset_F: number;
  }