"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";

import { toast } from "sonner";

import { api } from "@/lib/api";

import type {
  BulkGroupMembersPayload,
  BulkGroupMembersResponse,
  Classroom,
  ClassroomGroup,
  ClassroomGroupMembersResponse,
  Student,
  StudentClassroom,
  StudentFilters,
  StudentGroupMember,
  StudentListResponse,
  StudentUpdatePayload,
  UUID,
} from "../types";

import {
  initialState,
  reducer,
} from "./reducer";



// ==========================================================
// API RESPONSE TYPES
// ==========================================================

interface PaginatedResponse<T> {
  data?: T[];

  results?: T[];
}



interface ClassroomStudentsResponse {
  data?: Student[];

  results?: Student[];
}



// ==========================================================
// HELPERS
// ==========================================================

function getResponseList<T>(
  data:
    | T[]
    | PaginatedResponse<T>
    | undefined
    | null
): T[] {

  if (!data) {
    return [];
  }



  if (
    Array.isArray(data)
  ) {
    return data;
  }



  if (
    Array.isArray(data.data)
  ) {
    return data.data;
  }



  if (
    Array.isArray(data.results)
  ) {
    return data.results;
  }



  return [];

}



// ==========================================================
// VALIDATE UUID
// ==========================================================

function isValidId(
  id:
    | UUID
    | null
    | undefined
): id is UUID {

  return (
    typeof id === "string" &&
    id.trim().length > 0
  );

}



// ==========================================================
// NORMALIZE IDS
// ==========================================================

function normalizeIds(
  ids: UUID[]
): UUID[] {

  return [
    ...new Set(
      ids.filter(
        isValidId
      )
    ),
  ];

}



// ==========================================================
// NORMALIZE CLASSROOM
// ==========================================================

function normalizeClassroom(
  classroom:
    | StudentClassroom
    | null
    | undefined
): StudentClassroom | null {

  if (!classroom) {
    return null;
  }



  if (
    !isValidId(
      classroom.id
    )
  ) {
    return null;
  }



  if (
    typeof classroom.name !==
    "string"
  ) {
    return null;
  }



  return {
    id:
      classroom.id,

    name:
      classroom.name,
  };

}



// ==========================================================
// NORMALIZE STUDENT
// ==========================================================

function normalizeStudent(
  student: Student
): Student {

  return {
    ...student,

    classroom:
      normalizeClassroom(
        student.classroom
      ),

    payments:
      Array.isArray(
        student.payments
      )
        ? student.payments
        : [],

    groups:
      Array.isArray(
        student.groups
      )
        ? student.groups
        : [],
  };

}



// ==========================================================
// HOOK
// ==========================================================

export function useStudents() {



  // ========================================================
  // REDUCER STATE
  // ========================================================

  const [
    state,
    dispatch,
  ] = useReducer(
    reducer,
    initialState
  );



  // ========================================================
  // STUDENT MODAL
  // ========================================================

  const [
    selectedStudent,
    setSelectedStudent,
  ] = useState<Student | null>(
    null
  );



  const [
    studentModalOpen,
    setStudentModalOpen,
  ] = useState(
    false
  );



  const [
    savingStudent,
    setSavingStudent,
  ] = useState(
    false
  );



  // ========================================================
  // GROUPS
  // ========================================================

  const [
    groups,
    setGroups,
  ] = useState<ClassroomGroup[]>(
    []
  );



  const [
    groupMembers,
    setGroupMembers,
  ] = useState<StudentGroupMember[]>(
    []
  );



  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState<ClassroomGroup | null>(
    null
  );



  const [
    loadingGroups,
    setLoadingGroups,
  ] = useState(
    false
  );



  const [
    loadingGroupMembers,
    setLoadingGroupMembers,
  ] = useState(
    false
  );



  const [
    savingGroupMembers,
    setSavingGroupMembers,
  ] = useState(
    false
  );



  // ========================================================
  // GROUP MANAGER STUDENTS
  // ========================================================

  const [
    groupManagerStudents,
    setGroupManagerStudents,
  ] = useState<Student[]>(
    []
  );



  const [
    loadingGroupManagerStudents,
    setLoadingGroupManagerStudents,
  ] = useState(
    false
  );



  // ========================================================
  // EDIT STUDENT
  // ========================================================

  const editStudent =
    useCallback(
      (
        student: Student
      ) => {

        setSelectedStudent(
          normalizeStudent(
            student
          )
        );



        setStudentModalOpen(
          true
        );

      },
      []
    );



  // ========================================================
  // CLOSE STUDENT MODAL
  // ========================================================

  const closeStudentModal =
    useCallback(
      () => {

        setStudentModalOpen(
          false
        );



        setSelectedStudent(
          null
        );

      },
      []
    );



  // ========================================================
  // LOAD CLASSROOMS
  // ========================================================

  const loadClassrooms =
    useCallback(
      async () => {

        try {

          const response =
            await api.get<
              | Classroom[]
              | PaginatedResponse<Classroom>
            >(
              "/students/classrooms/"
            );



          const classrooms =
            getResponseList<Classroom>(
              response.data
            );



          dispatch({
            type:
              "SET_CLASSROOMS",

            payload:
              classrooms,
          });

        } catch (
          error
        ) {

          console.error(
            "Erreur chargement classes:",
            error
          );



          toast.error(
            "Impossible de charger les classes"
          );

        }

      },
      []
    );



  // ========================================================
  // LOAD STUDENTS
  // ========================================================

  const loadStudents =
    useCallback(
      async () => {

        // ==================================================
        // CLASSROOM REQUIRED
        // ==================================================

        if (
          !isValidId(
            state.filters.classroom
          )
        ) {

          dispatch({
            type:
              "SET_STUDENTS",

            payload:
              [],
          });



          dispatch({
            type:
              "SET_STATS",

            payload: {
              total: 0,

              girls: 0,

              boys: 0,

              classrooms:
                state.classrooms.length,
            },
          });



          dispatch({
            type:
              "SET_PAGINATION",

            payload: {
              page: 1,

              total: 0,
            },
          });



          dispatch({
            type:
              "CLEAR_SELECTION",
          });



          dispatch({
            type:
              "SET_LOADING",

            payload:
              false,
          });



          return;

        }



        // ==================================================
        // LOADING
        // ==================================================

        dispatch({
          type:
            "SET_LOADING",

          payload:
            true,
        });



        try {

          // ==================================================
          // API REQUEST
          // ==================================================

          const response =
            await api.get<
              StudentListResponse
            >(
              "/students/",
              {
                params: {

                  classroom_id:
                    state.filters.classroom,



                  search:
                    state.filters.search ||
                    undefined,



                  gender:
                    state.filters.gender ||
                    undefined,



                  page:
                    state.pagination.page,



                  /**
                   * Maximum 20 élèves par page.
                   */
                  page_size:
                    20,

                },
              }
            );



          // ==================================================
          // RAW STUDENTS
          // ==================================================

          const rawStudents =
            Array.isArray(
              response.data.data
            )
              ? response.data.data
              : [];



          // ==================================================
          // NORMALIZE STUDENTS
          // ==================================================

          const students =
            rawStudents.map(
              (
                student
              ) =>
                normalizeStudent(
                  student
                )
            );



          // ==================================================
          // SET STUDENTS
          // ==================================================

          dispatch({
            type:
              "SET_STUDENTS",

            payload:
              students,
          });



          // ==================================================
          // STATS
          // ==================================================

          dispatch({
            type:
              "SET_STATS",

            payload: {

              total:
                response.data.total_E ??
                0,



              girls:
                response.data.queryset_F ??
                0,



              boys:
                response.data.queryset_M ??
                0,



              classrooms:
                state.classrooms.length,

            },
          });



          // ==================================================
          // PAGINATION
          // ==================================================

          dispatch({
            type:
              "SET_PAGINATION",

            payload: {

              total:
                response.data.total_E ??
                0,

              pageSize:
                20,

            },
          });



          // ==================================================
          // CURRENT PAGE IDS
          // ==================================================

          const studentIds =
            students
              .map(
                (
                  student
                ) =>
                  student.id
              )
              .filter(
                isValidId
              );



          // ==================================================
          // EMPTY PAGE
          // ==================================================

          if (
            studentIds.length === 0 &&
            state.pagination.page === 1
          ) {

            dispatch({
              type:
                "CLEAR_SELECTION",
            });

          }

        } catch (
          error
        ) {

          console.error(
            "Erreur chargement élèves:",
            error
          );



          toast.error(
            "Impossible de charger les élèves"
          );



          dispatch({
            type:
              "SET_STUDENTS",

            payload:
              [],
          });

        } finally {

          dispatch({
            type:
              "SET_LOADING",

            payload:
              false,
          });

        }

      },
      [
        state.filters.classroom,
        state.filters.search,
        state.filters.gender,
        state.pagination.page,
        state.classrooms.length,
      ]
    );



  // ========================================================
  // UPDATE CLASSROOM COUNT
  // ========================================================

  useEffect(
    () => {

      dispatch({
        type:
          "SET_STATS",

        payload: {

          ...state.stats,

          classrooms:
            state.classrooms.length,

        },
      });

    },
    [
      state.classrooms.length,
    ]
  );



  // ========================================================
  // UPDATE STUDENT
  // ========================================================

  const updateStudent =
    useCallback(
      async (
        data:
          StudentUpdatePayload
      ) => {

        if (
          !selectedStudent
        ) {
          return;
        }



        if (
          !isValidId(
            selectedStudent.id
          )
        ) {

          toast.error(
            "Identifiant de l'élève invalide"
          );

          return;

        }



        try {

          setSavingStudent(
            true
          );



          await api.patch(
            `/students/${selectedStudent.id}/`,
            data
          );



          toast.success(
            "Élève modifié avec succès"
          );



          await loadStudents();



          closeStudentModal();

        } catch (
          error
        ) {

          console.error(
            "Erreur modification élève:",
            error
          );



          toast.error(
            "Impossible de modifier l'élève"
          );

        } finally {

          setSavingStudent(
            false
          );

        }

      },
      [
        selectedStudent,
        loadStudents,
        closeStudentModal,
      ]
    );



  // ========================================================
  // LOAD GROUPS
  // ========================================================

  const loadGroups =
    useCallback(
      async (
        classroomId?:
          | UUID
          | null
      ): Promise<ClassroomGroup[]> => {

        try {

          setLoadingGroups(
            true
          );



          const params:
            Record<
              string,
              string | boolean
            > = {

              is_active:
                true,

            };



          if (
            isValidId(
              classroomId
            )
          ) {

            params.classroom =
              classroomId;

          }



          const response =
            await api.get<
              | ClassroomGroup[]
              | PaginatedResponse<ClassroomGroup>
            >(
              "/students/classroom-groups/",
              {
                params,
              }
            );



          const loadedGroups =
            getResponseList<ClassroomGroup>(
              response.data
            );



          setGroups(
            loadedGroups
          );



          return loadedGroups;

        } catch (
          error
        ) {

          console.error(
            "Erreur chargement groupes:",
            error
          );



          toast.error(
            "Impossible de charger les groupes"
          );



          setGroups(
            []
          );



          return [];

        } finally {

          setLoadingGroups(
            false
          );

        }

      },
      []
    );



  // ========================================================
  // SELECT GROUP
  // ========================================================

  const selectGroup =
    useCallback(
      (
        group:
          | ClassroomGroup
          | null
      ) => {

        setSelectedGroup(
          group
        );



        setGroupMembers(
          []
        );

      },
      []
    );



  // ========================================================
  // LOAD GROUP MANAGER STUDENTS
  // ========================================================

  const loadGroupManagerStudents =
    useCallback(
      async (
        classroomId:
          | UUID
          | null
      ): Promise<Student[]> => {

        if (
          !isValidId(
            classroomId
          )
        ) {

          setGroupManagerStudents(
            []
          );

          return [];

        }



        try {

          setLoadingGroupManagerStudents(
            true
          );



          const response =
            await api.get<
              | ClassroomStudentsResponse
              | Student[]
            >(
              "/students/",
              {
                params: {

                  classroom_id:
                    classroomId,



                  page_size:
                    1000,

                },
              }
            );



          const rawStudents =
            getResponseList<Student>(
              response.data
            );



          const students =
            rawStudents.map(
              (
                student
              ) =>
                normalizeStudent(
                  student
                )
            );



          setGroupManagerStudents(
            students
          );



          return students;

        } catch (
          error
        ) {

          console.error(
            "Erreur chargement élèves gestionnaire:",
            error
          );



          toast.error(
            "Impossible de charger les élèves de la classe"
          );



          setGroupManagerStudents(
            []
          );



          return [];

        } finally {

          setLoadingGroupManagerStudents(
            false
          );

        }

      },
      []
    );



  // ========================================================
  // LOAD GROUP MEMBERS
  // ========================================================

  const loadGroupMembers =
    useCallback(
      async (
        groupId:
          UUID
      ): Promise<
        ClassroomGroupMembersResponse
        | null
      > => {

        if (
          !isValidId(
            groupId
          )
        ) {

          setGroupMembers(
            []
          );

          return null;

        }



        try {

          setLoadingGroupMembers(
            true
          );



          const response =
            await api.get<
              ClassroomGroupMembersResponse
            >(
              `/students/classroom-groups/${groupId}/members/`
            );



          const result =
            response.data;



          const members =
            Array.isArray(
              result.data
            )
              ? result.data
              : [];



          setGroupMembers(
            members
          );



          return result;

        } catch (
          error
        ) {

          console.error(
            "Erreur chargement membres:",
            error
          );



          toast.error(
            "Impossible de charger les membres du groupe"
          );



          setGroupMembers(
            []
          );



          return null;

        } finally {

          setLoadingGroupMembers(
            false
          );

        }

      },
      []
    );



  // ========================================================
  // CLEAR GROUP MEMBERS
  // ========================================================

  const clearGroupMembers =
    useCallback(
      () => {

        setGroupMembers(
          []
        );



        setSelectedGroup(
          null
        );

      },
      []
    );



  // ========================================================
  // ADD STUDENTS TO GROUPS
  // ========================================================

  const addStudentsToGroups =
    useCallback(
      async (
        studentIds:
          UUID[],
        groupIds:
          UUID[]
      ): Promise<
        BulkGroupMembersResponse
        | null
      > => {

        const normalizedStudentIds =
          normalizeIds(
            studentIds
          );



        const normalizedGroupIds =
          normalizeIds(
            groupIds
          );



        if (
          normalizedStudentIds.length === 0 ||
          normalizedGroupIds.length === 0
        ) {

          toast.error(
            "Sélectionnez au moins un élève et un groupe"
          );

          return null;

        }



        const payload:
          BulkGroupMembersPayload = {

            student_ids:
              normalizedStudentIds,

            group_ids:
              normalizedGroupIds,

          };



        try {

          setSavingGroupMembers(
            true
          );



          const response =
            await api.post<
              BulkGroupMembersResponse
            >(
              "/students/classroom-groups/members/bulk-add/",
              payload
            );



          const result =
            response.data;



          toast.success(
            result.detail ||
            "Élèves ajoutés aux groupes avec succès"
          );



          if (
            selectedGroup &&
            normalizedGroupIds.includes(
              selectedGroup.id
            )
          ) {

            await loadGroupMembers(
              selectedGroup.id
            );

          }



          return result;

        } catch (
          error
        ) {

          console.error(
            "Erreur ajout élèves aux groupes:",
            error
          );



          toast.error(
            "Impossible d'ajouter les élèves aux groupes"
          );



          return null;

        } finally {

          setSavingGroupMembers(
            false
          );

        }

      },
      [
        selectedGroup,
        loadGroupMembers,
      ]
    );



  // ========================================================
  // REMOVE STUDENTS FROM GROUPS
  // ========================================================

  const removeStudentsFromGroups =
    useCallback(
      async (
        studentIds:
          UUID[],
        groupIds:
          UUID[]
      ): Promise<
        BulkGroupMembersResponse
        | null
      > => {

        const normalizedStudentIds =
          normalizeIds(
            studentIds
          );



        const normalizedGroupIds =
          normalizeIds(
            groupIds
          );



        if (
          normalizedStudentIds.length === 0 ||
          normalizedGroupIds.length === 0
        ) {

          toast.error(
            "Sélectionnez au moins un élève et un groupe"
          );

          return null;

        }



        const payload:
          BulkGroupMembersPayload = {

            student_ids:
              normalizedStudentIds,

            group_ids:
              normalizedGroupIds,

          };



        try {

          setSavingGroupMembers(
            true
          );



          const response =
            await api.post<
              BulkGroupMembersResponse
            >(
              "/students/classroom-groups/members/bulk-remove/",
              payload
            );



          const result =
            response.data;



          toast.success(
            result.detail ||
            "Élèves retirés des groupes avec succès"
          );



          if (
            selectedGroup &&
            normalizedGroupIds.includes(
              selectedGroup.id
            )
          ) {

            await loadGroupMembers(
              selectedGroup.id
            );

          }



          return result;

        } catch (
          error
        ) {

          console.error(
            "Erreur retrait élèves des groupes:",
            error
          );



          toast.error(
            "Impossible de retirer les élèves des groupes"
          );



          return null;

        } finally {

          setSavingGroupMembers(
            false
          );

        }

      },
      [
        selectedGroup,
        loadGroupMembers,
      ]
    );



  // ========================================================
  // ADD SELECTED STUDENTS TO GROUPS
  // ========================================================

  const addSelectedStudentsToGroups =
    useCallback(
      async (
        groupIds:
          UUID[]
      ) => {

        return addStudentsToGroups(
          state.selectedStudents,
          groupIds
        );

      },
      [
        state.selectedStudents,
        addStudentsToGroups,
      ]
    );



  // ========================================================
  // REMOVE SELECTED STUDENTS FROM GROUPS
  // ========================================================

  const removeSelectedStudentsFromGroups =
    useCallback(
      async (
        groupIds:
          UUID[]
      ) => {

        return removeStudentsFromGroups(
          state.selectedStudents,
          groupIds
        );

      },
      [
        state.selectedStudents,
        removeStudentsFromGroups,
      ]
    );



  // ========================================================
  // FILTERS
  // ========================================================

  const setFilters =
    useCallback(
      (
        values:
          Partial<StudentFilters>
      ) => {

        dispatch({
          type:
            "SET_FILTERS",

          payload:
            values,
        });



        /**
         * Retour automatique à la première page
         * après modification d'un filtre.
         */
        dispatch({
          type:
            "SET_PAGINATION",

          payload: {
            page:
              1,
          },
        });



        /**
         * Lors d'un changement de classe,
         * la sélection précédente est supprimée.
         */
        if (
          "classroom" in values
        ) {

          dispatch({
            type:
              "CLEAR_SELECTION",
          });

        }

      },
      []
    );



  const resetFilters =
    useCallback(
      () => {

        dispatch({
          type:
            "RESET_FILTERS",
        });

      },
      []
    );



  // ========================================================
  // SELECTION
  // ========================================================

  const toggleStudentSelection =
    useCallback(
      (
        id:
          UUID
      ) => {

        if (
          !isValidId(
            id
          )
        ) {
          return;
        }



        dispatch({
          type:
            "TOGGLE_STUDENT_SELECTION",

          payload:
            id,
        });

      },
      []
    );



  const clearSelection =
    useCallback(
      () => {

        dispatch({
          type:
            "CLEAR_SELECTION",
        });

      },
      []
    );



  const selectAllStudents =
    useCallback(
      () => {

        dispatch({
          type:
            "SELECT_ALL_STUDENTS",

          payload:
            state.students
              .map(
                (
                  student
                ) =>
                  student.id
              )
              .filter(
                isValidId
              ),
        });

      },
      [
        state.students,
      ]
    );



  // ========================================================
  // PAGINATION
  // ========================================================

  const changePage =
    useCallback(
      (
        page:
          number
      ) => {

        if (
          !Number.isFinite(
            page
          ) ||
          page < 1
        ) {
          return;
        }



        const totalPages =
          Math.max(
            1,
            Math.ceil(
              state.pagination.total /
              state.pagination.pageSize
            )
          );



        if (
          page > totalPages
        ) {
          return;
        }



        dispatch({
          type:
            "SET_PAGINATION",

          payload: {
            page,
          },
        });

      },
      [
        state.pagination.total,
        state.pagination.pageSize,
      ]
    );



  // ========================================================
  // EXPORT EXCEL
  // ========================================================

  const exportExcel =
    useCallback(
      async () => {

        try {

          const params:
            Record<
              string,
              string
              | number
              | undefined
            > = {

              search:
                state.filters.search ||
                undefined,

              classroom_id:
                state.filters.classroom ??
                undefined,

              gender:
                state.filters.gender ||
                undefined,

            };



          if (
            state.selectedStudents.length > 0
          ) {

            params.ids =
              state.selectedStudents.join(
                ","
              );

          }



          const response =
            await api.get(
              "/students/export/excel/",
              {
                params,

                responseType:
                  "blob",
              }
            );



          const blob =
            new Blob(
              [
                response.data,
              ],
              {
                type:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              }
            );



          const url =
            window.URL.createObjectURL(
              blob
            );



          const link =
            document.createElement(
              "a"
            );



          link.href =
            url;



          link.download =
            `eleves_${new Date()
              .toISOString()
              .slice(
                0,
                10
              )}.xlsx`;



          document.body.appendChild(
            link
          );



          link.click();



          link.remove();



          window.URL.revokeObjectURL(
            url
          );

        } catch (
          error
        ) {

          console.error(
            "Erreur export Excel:",
            error
          );



          toast.error(
            "Impossible d'exporter les élèves"
          );

        }

      },
      [
        state.filters.search,
        state.filters.classroom,
        state.filters.gender,
        state.selectedStudents,
      ]
    );



  // ========================================================
  // EXPORT PDF
  // ========================================================

  const exportPDF =
    useCallback(
      async () => {

        try {

          const params:
            Record<
              string,
              string
              | number
              | undefined
            > = {

              search:
                state.filters.search ||
                undefined,

              classroom_id:
                state.filters.classroom ??
                undefined,

              gender:
                state.filters.gender ||
                undefined,

            };



          if (
            state.selectedStudents.length > 0
          ) {

            params.ids =
              state.selectedStudents.join(
                ","
              );

          }



          const response =
            await api.get(
              "/students/export/pdf/",
              {
                params,

                responseType:
                  "blob",
              }
            );



          const blob =
            new Blob(
              [
                response.data,
              ],
              {
                type:
                  "application/pdf",
              }
            );



          const url =
            window.URL.createObjectURL(
              blob
            );



          const link =
            document.createElement(
              "a"
            );



          link.href =
            url;



          link.download =
            `eleves_${new Date()
              .toISOString()
              .slice(
                0,
                10
              )}.pdf`;



          document.body.appendChild(
            link
          );



          link.click();



          link.remove();



          window.URL.revokeObjectURL(
            url
          );

        } catch (
          error
        ) {

          console.error(
            "Erreur export PDF:",
            error
          );



          toast.error(
            "Impossible d'exporter les élèves"
          );

        }

      },
      [
        state.filters.search,
        state.filters.classroom,
        state.filters.gender,
        state.selectedStudents,
      ]
    );



  // ========================================================
  // EFFECTS
  // ========================================================

  /**
   * Chargement initial des classes.
   */
  useEffect(
    () => {

      void loadClassrooms();

    },
    [
      loadClassrooms,
    ]
  );



  /**
   * Chargement initial des groupes.
   */
  useEffect(
    () => {

      void loadGroups();

    },
    [
      loadGroups,
    ]
  );



  /**
   * Chargement des élèves.
   *
   * IMPORTANT :
   *
   * Aucun élève n'est chargé tant qu'aucune
   * classe n'est sélectionnée.
   */
  useEffect(
    () => {

      void loadStudents();

    },
    [
      loadStudents,
    ]
  );



  // ========================================================
  // RETURN
  // ========================================================

  return {

    ...state,



    // ======================================================
    // STUDENT MODAL
    // ======================================================

    studentModal: {

      open:
        studentModalOpen,

      student:
        selectedStudent,

      loading:
        savingStudent,

    },



    // ======================================================
    // GROUPS
    // ======================================================

    groups,

    groupMembers,

    selectedGroup,

    loadingGroups,

    loadingGroupMembers,

    savingGroupMembers,



    // ======================================================
    // GROUP MANAGER STUDENTS
    // ======================================================

    groupManagerStudents,

    loadingGroupManagerStudents,



    // ======================================================
    // ACTIONS
    // ======================================================

    actions: {

      // Students

      loadStudents,

      loadClassrooms,



      // Group manager

      loadGroupManagerStudents,



      // Groups

      loadGroups,

      selectGroup,

      loadGroupMembers,

      clearGroupMembers,

      addStudentsToGroups,

      removeStudentsFromGroups,

      addSelectedStudentsToGroups,

      removeSelectedStudentsFromGroups,



      // Filters

      setFilters,

      resetFilters,



      // Selection

      toggleStudentSelection,

      clearSelection,

      selectAllStudents,



      // Pagination

      changePage,



      // Export

      exportExcel,

      exportPDF,



      // Student modal

      editStudent,

      closeStudentModal,

      updateStudent,

    },

  };

}