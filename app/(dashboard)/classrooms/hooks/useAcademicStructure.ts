"use client";

import {
  useCallback,
  useEffect,
  useReducer,
} from "react";

import { CrudService } from "@/lib/crud";

import {
  Classroom,
  ClassroomForm,
  ClassroomGroup,
  ClassroomGroupForm,
  ClassroomLevel,
  ClassroomLevelForm,
} from "../types";

import {
  academicStructureReducer,
  initialState,
} from "./reducer";


/* ==========================================================
 * CRUD SERVICES
 * ========================================================== */

const levelService = new CrudService<
  ClassroomLevel,
  ClassroomLevelForm
>(
  "/students/classroom-levels/"
);

const classroomService = new CrudService<
  Classroom,
  ClassroomForm
>(
  "/students/classrooms/"
);

const groupService = new CrudService<
  ClassroomGroup,
  ClassroomGroupForm
>(
  "/students/classroom-groups/"
);


/* ==========================================================
 * HOOK
 * ========================================================== */

export function useAcademicStructure() {

  const [
    state,
    dispatch,
  ] = useReducer(
    academicStructureReducer,
    initialState
  );


  /* ==========================================================
   * HELPERS
   * ========================================================== */

  const setLoading = (
    value: boolean
  ) => {

    dispatch({
      type: "SET_LOADING",
      payload: value,
    });

  };


  const setSaving = (
    value: boolean
  ) => {

    dispatch({
      type: "SET_SAVING",
      payload: value,
    });

  };


  const setError = (
    message: string | null
  ) => {

    dispatch({
      type: "SET_ERROR",
      payload: message,
    });

  };


  const handleError = (
    error: any
  ) => {

    console.error(error);

    setError(

      error?.response?.data?.detail ??

      error?.message ??

      "Une erreur est survenue."

    );

  };


  /* ==========================================================
   * LOADERS
   * ========================================================== */

  const loadLevels = useCallback(
    async () => {

      try {

        const response =
          await levelService.list();

        dispatch({
          type: "SET_LEVELS",
          payload: response.results,
        });

      } catch (error) {

        handleError(error);

      }

    },
    []
  );


  const loadClassrooms = useCallback(
    async () => {

      try {

        const response =
          await classroomService.list();

        dispatch({
          type: "SET_CLASSROOMS",
          payload: response.results,
        });

      } catch (error) {

        handleError(error);

      }

    },
    []
  );


  const loadGroups = useCallback(
    async () => {

      try {

        const response =
          await groupService.list();

        dispatch({
          type: "SET_GROUPS",
          payload: response.results,
        });

      } catch (error) {

        handleError(error);

      }

    },
    []
  );


  const loadAll = useCallback(
    async () => {

      setLoading(true);

      setError(null);

      try {

        await Promise.all([

          loadLevels(),

          loadClassrooms(),

          loadGroups(),

        ]);

      } finally {

        setLoading(false);

      }

    },
    [

      loadLevels,

      loadClassrooms,

      loadGroups,

    ]
  );


  /* ==========================================================
   * GENERIC CRUD HELPERS
   * ========================================================== */

  const saveEntity = async <TForm,>(

    id: string | undefined,

    data: TForm,

    service: CrudService<any, TForm>,

    resetAction:

      | "RESET_LEVEL_FORM"
      | "RESET_CLASSROOM_FORM"
      | "RESET_GROUP_FORM"

  ) => {

    setSaving(true);

    setError(null);

    try {

      if (id) {

        await service.update(
          id,
          data
        );

      } else {

        await service.create(
          data
        );

      }


      dispatch({
        type: resetAction,
      });


      await loadAll();

    } catch (error) {

      handleError(error);

    } finally {

      setSaving(false);

    }

  };


  const deleteEntity = async (

    id: string,

    service: CrudService<any, any>

  ) => {

    setSaving(true);

    setError(null);

    try {

      await service.remove(
        id
      );

      await loadAll();

    } catch (error) {

      handleError(error);

    } finally {

      setSaving(false);

    }

  };


  /* ==========================================================
   * CLASSROOM LEVEL
   * ========================================================== */

  const openLevelForm = (
    level: ClassroomLevel
  ) => {

    dispatch({

      type: "SET_LEVEL_FORM",

      payload: {

        id: level.id,

        name: level.name,

        description:
          level.description ?? "",

        display_order:
          level.display_order,

        is_active:
          level.is_active,

      },

    });

  };


  const resetLevelForm = () => {

    dispatch({
      type: "RESET_LEVEL_FORM",
    });

  };


  const saveLevel = async () =>

    saveEntity(

      state.levelForm.id,

      state.levelForm,

      levelService,

      "RESET_LEVEL_FORM"

    );


  const deleteLevel = async (
    id: string
  ) =>

    deleteEntity(
      id,
      levelService
    );


  const editLevel = (
    level: ClassroomLevel
  ) => {

    openLevelForm(level);

  };


  /* ==========================================================
   * CLASSROOM
   * ========================================================== */

  const openClassroomForm = (
    classroom: Classroom
  ) => {

    dispatch({

      type: "SET_CLASSROOM_FORM",

      payload: {

        id:
          classroom.id,

        classroom_level:
          classroom.classroom_level,

        name:
          classroom.name,


        /* ================================================
         * FRAIS ÉLÈVE AFFECTÉ
         * ================================================ */

        annual_tuition_fee_assigned:
          Number(
            classroom.annual_tuition_fee_assigned
          ),


        /* ================================================
         * FRAIS ÉLÈVE NON AFFECTÉ
         * ================================================ */

        annual_tuition_fee_unassigned:
          Number(
            classroom.annual_tuition_fee_unassigned
          ),


        next_classroom:
          classroom.next_classroom,

      },

    });

  };


  const resetClassroomForm = () => {

    dispatch({
      type: "RESET_CLASSROOM_FORM",
    });

  };


  const saveClassroom = async () =>

    saveEntity(

      state.classroomForm.id,

      state.classroomForm,

      classroomService,

      "RESET_CLASSROOM_FORM"

    );


  const deleteClassroom = async (
    id: string
  ) =>

    deleteEntity(
      id,
      classroomService
    );


  const editClassroom = (
    classroom: Classroom
  ) => {

    openClassroomForm(
      classroom
    );

  };


  /* ==========================================================
   * CLASSROOM GROUP
   * ========================================================== */

  const openGroupForm = (
    group: ClassroomGroup
  ) => {

    dispatch({

      type: "SET_GROUP_FORM",

      payload: {

        id:
          group.id,

        classroom:
          group.classroom,

        name:
          group.name,

        code:
          group.code,

        description:
          group.description ?? "",

        display_order:
          group.display_order,

        is_active:
          group.is_active,

      },

    });

  };


  const resetGroupForm = () => {

    dispatch({
      type: "RESET_GROUP_FORM",
    });

  };


  const saveGroup = async () =>

    saveEntity(

      state.groupForm.id,

      state.groupForm,

      groupService,

      "RESET_GROUP_FORM"

    );


  const deleteGroup = async (
    id: string
  ) =>

    deleteEntity(
      id,
      groupService
    );


  const editGroup = (
    group: ClassroomGroup
  ) => {

    openGroupForm(
      group
    );

  };


  /* ==========================================================
   * SELECTION
   * ========================================================== */

  const selectLevel = (
    levelId: string | null
  ) => {

    dispatch({

      type: "SET_SELECTED_LEVEL",

      payload:
        levelId,

    });

  };


  const selectClassroom = (
    classroomId: string | null
  ) => {

    dispatch({

      type:
        "SET_SELECTED_CLASSROOM",

      payload:
        classroomId,

    });

  };


  /* ==========================================================
   * FORMS
   * ========================================================== */

  const setLevelForm = (
    form: Partial<ClassroomLevelForm>
  ) => {

    dispatch({

      type:
        "SET_LEVEL_FORM",

      payload:
        form,

    });

  };


  const setClassroomForm = (
    form: Partial<ClassroomForm>
  ) => {

    dispatch({

      type:
        "SET_CLASSROOM_FORM",

      payload:
        form,

    });

  };


  const setGroupForm = (
    form: Partial<ClassroomGroupForm>
  ) => {

    dispatch({

      type:
        "SET_GROUP_FORM",

      payload:
        form,

    });

  };


  /* ==========================================================
   * LIFECYCLE
   * ========================================================== */

  useEffect(() => {

    loadAll();

  }, [
    loadAll,
  ]);


  /* ==========================================================
   * PUBLIC API
   * ========================================================== */

  const actions = {

    /* ------------------------------------------------------
     * LOAD
     * ------------------------------------------------------ */

    loadAll,


    /* ------------------------------------------------------
     * SELECTION
     * ------------------------------------------------------ */

    selectLevel,

    selectClassroom,


    /* ------------------------------------------------------
     * LEVEL
     * ------------------------------------------------------ */

    openLevelForm,

    editLevel,

    resetLevelForm,

    setLevelForm,

    saveLevel,

    deleteLevel,


    /* ------------------------------------------------------
     * CLASSROOM
     * ------------------------------------------------------ */

    openClassroomForm,

    editClassroom,

    resetClassroomForm,

    setClassroomForm,

    saveClassroom,

    deleteClassroom,


    /* ------------------------------------------------------
     * GROUP
     * ------------------------------------------------------ */

    openGroupForm,

    editGroup,

    resetGroupForm,

    setGroupForm,

    saveGroup,

    deleteGroup,

  };


  return {

    ...state,

    actions,

  };

}