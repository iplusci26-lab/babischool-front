export interface AcademicYear {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
  }
  
  export type TermType = "trimester" | "semester";
  
  export interface AcademicTerm {
    id: string;
    name: string;
    term_type: TermType;
    start_date: string;
    end_date: string;
    academic_year: string;
    is_active: boolean;
  }
  
  export interface AcademicYearForm {
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
  }
  
  export interface AcademicTermForm {
    name: string;
    term_type: TermType;
    start_date: string;
    end_date: string;
    academic_year: string;
    is_active: boolean;
  }
  
  export interface ApiListResponse<T> {
    results?: T[];
  }