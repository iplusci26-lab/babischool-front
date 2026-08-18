import {
    AcademicStructureState,
    Classroom,
    ClassroomForm,
    ClassroomGroup,
    ClassroomGroupForm,
    ClassroomLevel,
    ClassroomLevelForm,

  } from "../types";
  
  /* ==========================================================
   * Initial Forms
   * ========================================================== */
  

  
  export const initialLevelForm: ClassroomLevelForm = {
   
    name: "",
    description: "",
    display_order: 0,
    is_active: true,
  };
  
  export const initialClassroomForm: ClassroomForm = {
    classroom_level: "",
    next_classroom: null,
    name: "",
    annual_tuition_fee: 0,
  };
  
  export const initialGroupForm: ClassroomGroupForm = {
    classroom: "",
    name: "",
    code: "",
    description: "",
    display_order: 0,
    is_active: true,
  };
  
  /* ==========================================================
   * Initial State
   * ========================================================== */
  
  export const initialState: AcademicStructureState = {
    loading: false,
    saving: false,
    error: null,

    levels: [],
    classrooms: [],
    groups: [],

    selectedLevelId: null,
    selectedClassroomId: null,

    levelForm: initialLevelForm,
    classroomForm: initialClassroomForm,
    groupForm: initialGroupForm,
  };
  
  /* ==========================================================
   * Actions
   * ========================================================== */
  
  export type AcademicStructureAction =
    | {
        type: "SET_LOADING";
        payload: boolean;
      }
    | {
        type: "SET_SAVING";
        payload: boolean;
      }
    | {
        type: "SET_ERROR";
        payload: string | null;
      }
  
    
    | {
        type: "SET_LEVELS";
        payload: ClassroomLevel[];
      }
    | {
        type: "SET_CLASSROOMS";
        payload: Classroom[];
      }
    | {
        type: "SET_GROUPS";
        payload: ClassroomGroup[];
      }
  
    
    | {
        type: "SET_SELECTED_LEVEL";
        payload: string | null;
      }
    | {
        type: "SET_SELECTED_CLASSROOM";
        payload: string | null;
      }
  
    
    | {
        type: "SET_LEVEL_FORM";
        payload: Partial<ClassroomLevelForm>;
      }
    | {
        type: "SET_CLASSROOM_FORM";
        payload: Partial<ClassroomForm>;
      }
    | {
        type: "SET_GROUP_FORM";
        payload: Partial<ClassroomGroupForm>;
      }
  
    
    | {
        type: "RESET_LEVEL_FORM";
      }
    | {
        type: "RESET_CLASSROOM_FORM";
      }
    | {
        type: "RESET_GROUP_FORM";
      };
  
  /* ==========================================================
   * Reducer
   * ========================================================== */
  
  export function academicStructureReducer(
    state: AcademicStructureState,
    action: AcademicStructureAction
  ): AcademicStructureState {
    switch (action.type) {
      case "SET_LOADING":
        return {
          ...state,
          loading: action.payload,
        };
  
      case "SET_SAVING":
        return {
          ...state,
          saving: action.payload,
        };
  
      case "SET_ERROR":
        return {
          ...state,
          error: action.payload,
        };
  
      
      case "SET_LEVELS":
        return {
          ...state,
          levels: action.payload,
        };
  
      case "SET_CLASSROOMS":
        return {
          ...state,
          classrooms: action.payload,
        };
  
      case "SET_GROUPS":
        return {
          ...state,
          groups: action.payload,
        };
  
   
  
      case "SET_SELECTED_LEVEL":
        return {
          ...state,
          selectedLevelId: action.payload,
        };
  
      case "SET_SELECTED_CLASSROOM":
        return {
          ...state,
          selectedClassroomId: action.payload,
        };
  
    
  
      case "SET_LEVEL_FORM":
        return {
          ...state,
          levelForm: {
            ...state.levelForm,
            ...action.payload,
          }
        };
  
      case "SET_CLASSROOM_FORM":
        return {
          ...state,
          classroomForm: {
            ...state.classroomForm,
            ...action.payload,
          },
        };
  
      case "SET_GROUP_FORM":
        return {
          ...state,
          groupForm: {
            ...state.groupForm,
            ...action.payload,
          },
        };
  
    
      case "RESET_LEVEL_FORM":
        return {
          ...state,
          levelForm: initialLevelForm,
        };
  
      case "RESET_CLASSROOM_FORM":
        return {
          ...state,
          classroomForm: initialClassroomForm,
        };
  
      case "RESET_GROUP_FORM":
        return {
          ...state,
          groupForm: initialGroupForm,
        };
  
      default:
        return state;
    }
  }