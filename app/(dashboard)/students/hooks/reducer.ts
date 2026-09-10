import type {
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
   * La sélection est conservée indépendamment de la page
   * actuellement affichée.
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

    /**
     * Aucune classe sélectionnée au départ.
     *
     * Les élèves ne seront donc pas chargés tant que
     * l'utilisateur ne sélectionne pas une classe.
     */
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

    /**
     * Maximum 20 élèves par page.
     */
    pageSize: 20,

    total: 0,
  },

  selectedStudents: [],
};



// ==========================================================
// ACTIONS
// ==========================================================

export type StudentsAction =

  // ========================================================
  // LOADING
  // ========================================================

  | {
      type: "SET_LOADING";

      payload: boolean;
    }



  // ========================================================
  // STUDENTS
  // ========================================================

  | {
      type: "SET_STUDENTS";

      payload: Student[];
    }



  // ========================================================
  // CLASSROOMS
  // ========================================================

  | {
      type: "SET_CLASSROOMS";

      payload: Classroom[];
    }



  // ========================================================
  // FILTERS
  // ========================================================

  | {
      type: "SET_FILTERS";

      payload: Partial<StudentFilters>;
    }

  | {
      type: "RESET_FILTERS";
    }



  // ========================================================
  // STATS
  // ========================================================

  | {
      type: "SET_STATS";

      payload: StudentStats;
    }



  // ========================================================
  // PAGINATION
  // ========================================================

  | {
      type: "SET_PAGINATION";

      payload: Partial<Pagination>;
    }



  // ========================================================
  // SELECTION
  // ========================================================

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

          classrooms: action.payload.length,
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

        /**
         * On vide immédiatement la liste puisque
         * aucune classe n'est sélectionnée.
         */
        students: [],

        stats: {
          ...state.stats,

          total: 0,

          girls: 0,

          boys: 0,
        },

        pagination: {
          ...state.pagination,

          page: 1,

          total: 0,
        },

        selectedStudents: [],
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