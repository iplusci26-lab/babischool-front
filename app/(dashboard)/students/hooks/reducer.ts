import {
  Classroom,
  Pagination,
  Student,
  StudentFilters,
  StudentStats,
} from "../types";

// ==========================================================
// STATE
// ==========================================================

export interface StudentsState {
  loading: boolean;

  students: Student[];

  classrooms: Classroom[];

  filters: StudentFilters;

  stats: StudentStats;

  pagination: Pagination;

  /**
   * IDs UUID des élèves actuellement sélectionnés.
   *
   * La sélection est volontairement conservée indépendamment
   * de la liste actuellement affichée afin d'éviter de perdre
   * les sélections lors d'un rechargement ou changement de page.
   */
  selectedStudents: string[];
}

// ==========================================================
// INITIAL STATE
// ==========================================================

export const initialState: StudentsState = {
  loading: false,

  students: [],

  classrooms: [],

  filters: {
    search: "",
    classroom: null,
    gender: "",
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

// ==========================================================
// ACTIONS
// ==========================================================

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
      payload: string[];
    }

  | {
      type: "TOGGLE_STUDENT_SELECTION";
      payload: string;
    }

  | {
      type: "CLEAR_SELECTION";
    }

  | {
      type: "SELECT_ALL_STUDENTS";
      payload: string[];
    };

// ==========================================================
// REDUCER
// ==========================================================

export function reducer(
  state: StudentsState,
  action: StudentsAction
): StudentsState {
  switch (action.type) {
    // ======================================================
    // LOADING
    // ======================================================

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    // ======================================================
    // STUDENTS
    // ======================================================

    case "SET_STUDENTS":
      return {
        ...state,
        students: action.payload,
      };

    // ======================================================
    // CLASSROOMS
    // ======================================================

    case "SET_CLASSROOMS":
      return {
        ...state,

        classrooms: action.payload,

        stats: {
          ...state.stats,

          classrooms:
            action.payload.length,
        },
      };

    // ======================================================
    // FILTERS
    // ======================================================

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

        filters: {
          search: "",
          classroom: null,
          gender: "",
        },
      };

    // ======================================================
    // STATS
    // ======================================================

    case "SET_STATS":
      return {
        ...state,

        stats: action.payload,
      };

    // ======================================================
    // PAGINATION
    // ======================================================

    case "SET_PAGINATION":
      return {
        ...state,

        pagination: {
          ...state.pagination,

          ...action.payload,
        },
      };

    // ======================================================
    // SELECTION
    // ======================================================

    case "SET_SELECTED_STUDENTS":
      return {
        ...state,

        selectedStudents: [
          ...new Set(
            action.payload.filter(
              (id) =>
                typeof id === "string" &&
                id.trim().length > 0
            )
          ),
        ],
      };

    case "TOGGLE_STUDENT_SELECTION": {
      const studentId =
        action.payload;

      const isSelected =
        state.selectedStudents.includes(
          studentId
        );

      return {
        ...state,

        selectedStudents:
          isSelected
            ? state.selectedStudents.filter(
                (id) =>
                  id !== studentId
              )
            : [
                ...state.selectedStudents,
                studentId,
              ],
      };
    }

    case "CLEAR_SELECTION":
      return {
        ...state,

        selectedStudents: [],
      };

    case "SELECT_ALL_STUDENTS":
      return {
        ...state,

        selectedStudents: [
          ...new Set([
            ...state.selectedStudents,

            ...action.payload.filter(
              (id) =>
                typeof id === "string" &&
                id.trim().length > 0
            ),
          ]),
        ],
      };

    // ======================================================
    // DEFAULT
    // ======================================================

    default:
      return state;
  }
}