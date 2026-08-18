"use client";

import { useCallback,useEffect, useReducer } from "react";

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
 * CRUD Services
 * ========================================================== */



const levelService = new CrudService<
  ClassroomLevel,
  ClassroomLevelForm
>("/students/classroom-levels/");

const classroomService = new CrudService<
  Classroom,
  ClassroomForm
>("/students/classrooms/");

const groupService = new CrudService<
  ClassroomGroup,
  ClassroomGroupForm
>("/students/classroom-groups/");

/* ==========================================================
 * Hook
 * ========================================================== */

/*function generateCycleCode(name: string): string {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9 ]/g, "")
      .trim()
      .split(/\s+/)
      .map((word) => word.substring(0, 4))
      .join("")
      .toUpperCase()
      .substring(0, 10);
  }*/

export function useAcademicStructure() {
  const [state, dispatch] = useReducer(
    academicStructureReducer,
    initialState
  );

  /* ==========================================================
   * Helpers
   * ========================================================== */

  const setLoading = (value: boolean) =>
    dispatch({
      type: "SET_LOADING",
      payload: value,
    });

  const setSaving = (value: boolean) =>
    dispatch({
      type: "SET_SAVING",
      payload: value,
    });

  const setError = (message: string | null) =>
    dispatch({
      type: "SET_ERROR",
      payload: message,
    });

  const handleError = (error: any) => {
    console.error(error);

    setError(
      error?.response?.data?.detail ??
      error?.message ??
      "Une erreur est survenue."
    );
  };

  /* ==========================================================
   * Loaders
   * ========================================================== */

 

  const loadLevels = useCallback(async () => {
    try {
      const response = await levelService.list();

      dispatch({
        type: "SET_LEVELS",
        payload: response.results,
      });
    } catch (error) {
      handleError(error);
    }
  }, []);

  const loadClassrooms = useCallback(async () => {
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
  }, []);

  const loadGroups = useCallback(async () => {
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
  }, []);

  const loadAll = useCallback(async () => {
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
  }, [
    loadLevels,
    loadClassrooms,
    loadGroups,
  ]);

    /* ==========================================================
   * Generic CRUD Helpers
   * ========================================================== */

    const saveEntity = async <TForm>(
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
            await service.update(id, data);
          } else {
            await service.create(data);
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
          await service.remove(id);
          await loadAll();
        } catch (error) {
          handleError(error);
        } finally {
          setSaving(false);
        }
      };
    
      const editEntity = <T>(
        entity: T,
        action:
         
          | "SET_LEVEL_FORM"
          | "SET_CLASSROOM_FORM"
          | "SET_GROUP_FORM"
      ) => {
        dispatch({
          type: action,
          payload: entity as any,
        });
      };
    
     
    
      /* ==========================================================
       * Classroom Level
       * ========================================================== */
      const openLevelForm = (
        level: ClassroomLevel
    ) => {
    
        dispatch({
    
            type: "SET_LEVEL_FORM",
    
            payload: {
    
                id: level.id,
    
                name: level.name,
    
                description: level.description ?? "",
    
                display_order: level.display_order,
    
                is_active: level.is_active,
    
            },
    
        });
    
    };

    const resetLevelForm = () => {
      dispatch({
        type: "SET_LEVEL_FORM",
        payload: {
         
          name: "",
          description: "",
          display_order: 1,
          is_active: true,
        },
      });
    };

    const saveLevel = async () =>
      saveEntity(
        state.levelForm.id,
        state.levelForm,
        levelService,
        "RESET_LEVEL_FORM"
      );
    
      const deleteLevel = async (id: string) =>
        deleteEntity(id, levelService);
    
      const editLevel = (level: ClassroomLevel) =>
        editEntity(
          {
            id: level.id,
           
            name: level.name,
            description: level.description,
            display_order: level.display_order,
            is_active: level.is_active,
          },
          "SET_LEVEL_FORM"
        );
    
      /* ==========================================================
       * Classroom
       * ========================================================== */
      const openClassroomForm = (
        classroom: Classroom
        ) => {
        
            dispatch({
        
                type: "SET_CLASSROOM_FORM",
        
                payload: {
        
                    id: classroom.id,
        
                    classroom_level:
                        classroom.classroom_level,
        
                    name: classroom.name,
        
                    annual_tuition_fee:
                        classroom.annual_tuition_fee,
        
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
    
      const deleteClassroom = async (id: string) =>
        deleteEntity(id, classroomService);
    
      const editClassroom = (classroom: Classroom) =>
        editEntity(
          {
            id: classroom.id,
            classroom_level: classroom.classroom_level,
            next_classroom: classroom.next_classroom,
            name: classroom.name,
            annual_tuition_fee:
              classroom.annual_tuition_fee,
          },
          "SET_CLASSROOM_FORM"
        );
    
      /* ==========================================================
       * Classroom Group
       * ========================================================== */
      const openGroupForm = (
        group: ClassroomGroup
    ) => {
    
        dispatch({
    
            type: "SET_GROUP_FORM",
    
            payload: {
    
                id: group.id,
    
                classroom: group.classroom,
    
                name: group.name,
    
                code: group.code,
    
                description:
                    group.description,
    
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
    
      const deleteGroup = async (id: string) =>
        deleteEntity(id, groupService);
    
      const editGroup = (group: ClassroomGroup) =>
        editEntity(
          {
            id: group.id,
            classroom: group.classroom,
            name: group.name,
            code: group.code,
            description: group.description,
            display_order: group.display_order,
            is_active: group.is_active,
          },
          "SET_GROUP_FORM"
        );

      /* ==========================================================
   * Selection
   * ========================================================== */

  const selectLevel = (levelId: string | null) => {
    dispatch({
      type: "SET_SELECTED_LEVEL",
      payload: levelId,
    });
  };

  const selectClassroom = (classroomId: string | null) => {
    dispatch({
      type: "SET_SELECTED_CLASSROOM",
      payload: classroomId,
    });
  };

  /* ==========================================================
   * Forms
   * ========================================================== */



  const setLevelForm = (form: Partial<ClassroomLevelForm>) => {
    dispatch({
      type: "SET_LEVEL_FORM",
      payload: form as ClassroomLevelForm,
    });
  };

  const setClassroomForm = (form: Partial<ClassroomForm>) => {
    dispatch({
      type: "SET_CLASSROOM_FORM",
      payload: form,
    });
  };

  const setGroupForm = (form: Partial<ClassroomGroupForm>) => {
    dispatch({
      type: "SET_GROUP_FORM",
      payload: form as ClassroomGroupForm,
    });
  };

  /* ==========================================================
   * Lifecycle
   * ========================================================== */

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /* ==========================================================
   * Public API
   * ========================================================== */

  const actions = {
    loadAll,

    // Sélection
  
    selectLevel,
    selectClassroom,

   
    // Niveau
    openLevelForm,
    resetLevelForm,
    setLevelForm,
    saveLevel,
    deleteLevel,

    // Classe
    openClassroomForm,
    resetClassroomForm,
    setClassroomForm,
    saveClassroom,
    deleteClassroom,

    // Groupe
    openGroupForm,
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