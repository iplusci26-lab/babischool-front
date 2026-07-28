// ===============================
// Cycle
// ===============================

export interface Cycle {
    id: string;
    name: string;
    code: string;
    display_order: number;
    is_active: boolean;
  
    created_at: string;
    updated_at: string;
  }
  
  // ===============================
  // Classroom Level
  // ===============================
  
  export interface ClassroomLevel {
    id: string;
  
    cycle: string;
    cycle_name: string;
  
    name: string;
    description: string;
  
    display_order: number;
    is_active: boolean;
  
    created_at: string;
    updated_at: string;
  }
  
  // ===============================
  // Classroom
  // ===============================
  
  export interface Classroom {
    id: string;
  
    classroom_level: string;
    classroom_level_name: string;
  
    cycle_name: string;
  
    next_classroom: string | null;
    next_classroom_name: string | null;
  
    name: string;
  
    annual_tuition_fee: number;
  
    created_at: string;
    updated_at: string;
  }
  
  // ===============================
  // Classroom Group
  // ===============================
  
  export interface ClassroomGroup {
    id: string;
  
    classroom: string;
    classroom_name: string;
  
    classroom_level_name: string;
  
    name: string;
    code: string;
  
    description: string;
  
    display_order: number;
    is_active: boolean;
  
    created_at: string;
    updated_at: string;
  }
  
  // ===============================
  // Forms
  // ===============================
  
  export interface CycleForm {
    id?: string;
  
    name: string;
    code: string;
  
    display_order: number;
    is_active: boolean;
    codeManuallyEdited?: boolean;
  }
  
  export interface ClassroomLevelForm {
    id?: string;
  
    cycle: string;
  
    name: string;
    description: string;
  
    display_order: number;
    is_active: boolean;
  }
  
  export interface ClassroomForm {
    id?: string;
  
    classroom_level: string;
  
    next_classroom: string | null;
  
    name: string;
  
    annual_tuition_fee: number;
  }
  
  export interface ClassroomGroupForm {
    id?: string;
  
    classroom: string;
  
    name: string;
    code: string;
  
    description: string;
  
    display_order: number;
    is_active: boolean;
  }
  
  // ===============================
  // API Pagination
  // ===============================
  
  export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }
  
  // ===============================
  // Hook State
  // ===============================
  
  export interface AcademicStructureState {
    loading: boolean;
    saving: boolean;
    error: string | null;
  
    cycles: Cycle[];
    levels: ClassroomLevel[];
    classrooms: Classroom[];
    groups: ClassroomGroup[];
  
    selectedCycleId: string | null;
    selectedLevelId: string | null;
    selectedClassroomId: string | null;
  
    cycleForm: CycleForm;
    levelForm: ClassroomLevelForm;
    classroomForm: ClassroomForm;
    groupForm: ClassroomGroupForm;
  }