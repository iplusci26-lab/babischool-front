import {
    Pagination,
    Student,
    StudentFilters,
    StudentStats,
    Classroom,
  } from "../types";
  
  /* ============================================
   * STATE
   * ============================================ */
  
  export interface StudentsState {
    loading: boolean;
  
    students: Student[];
  
    classrooms: Classroom[];
  
    filters: StudentFilters;
  
    stats: StudentStats;
  
    pagination: Pagination;
  
    selectedStudents: number[];
  }
  
  /* ============================================
   * INITIAL STATE
   * ============================================ */
  
  export const initialState: StudentsState = {
    loading: false,
  
    students: [],
  
    classrooms: [],
  
    filters: {
      search: "",
      classroom: null,
      gender: "",
      //status: "",
    },
  
    stats: {
      total: 0,
      girls: 0,
      boys: 0,
      classrooms: 0,
    },
  
    pagination: {
      page: 1,
      pageSize: 25,
      total: 0,
    },
  
    selectedStudents: [],
  };
  
  /* ============================================
   * ACTIONS
   * ============================================ */
  
  export type StudentsAction =
    | {
        type: "SET_LOADING";
        payload: boolean;
      }
    | {
        type: "SET_STUDENTS";
        payload: Student[];
      }
    | {
        type: "SET_CLASSROOMS";
        payload: Classroom[];
      }
    | {
        type: "SET_FILTERS";
        payload: Partial<StudentFilters>;
      }
    | {
        type: "RESET_FILTERS";
      }
    | {
        type: "SET_STATS";
        payload: StudentStats;
      }
    | {
        type: "SET_PAGINATION";
        payload: Partial<Pagination>;
      }
    | {
        type: "SET_SELECTED_STUDENTS";
        payload: number[];
      }
    | {
        type: "TOGGLE_STUDENT_SELECTION";
        payload: number;
      }
    | {
        type: "CLEAR_SELECTION";
      }
    
    | {
        type: "SELECT_ALL_STUDENTS";
        payload: number[];
    };
  
  /* ============================================
   * REDUCER
   * ============================================ */
  
  export function reducer(
    state: StudentsState,
    action: StudentsAction
  ): StudentsState {
    switch (action.type) {
      case "SET_LOADING":
        return {
          ...state,
          loading: action.payload,
        };
  
      case "SET_STUDENTS":
        return {
          ...state,
          students: action.payload,
        };
  
      case "SET_CLASSROOMS":
        return {
          ...state,
          classrooms: action.payload,
        };
  
      case "SET_FILTERS":
        return {
          ...state,
          filters: {
            ...state.filters,
            ...action.payload,
          },
        };
  
      case "RESET_FILTERS":
        return {
          ...state,
          filters: initialState.filters,
        };
  
      case "SET_STATS":
        return {
          ...state,
          stats: action.payload,
        };
  
      case "SET_PAGINATION":
        return {
          ...state,
          pagination: {
            ...state.pagination,
            ...action.payload,
          },
        };
  
      case "SET_SELECTED_STUDENTS":
        return {
          ...state,
          selectedStudents: action.payload,
        };
  
      case "TOGGLE_STUDENT_SELECTION":
        return {
          ...state,
          selectedStudents: state.selectedStudents.includes(action.payload)
            ? state.selectedStudents.filter((id) => id !== action.payload)
            : [...state.selectedStudents, action.payload],
        };
  
      case "CLEAR_SELECTION":
        return {
          ...state,
          selectedStudents: [],
        };

      case "SELECT_ALL_STUDENTS":
            return {
                ...state,
                selectedStudents: action.payload,
            };
  
      default:
        return state;
    }
  }