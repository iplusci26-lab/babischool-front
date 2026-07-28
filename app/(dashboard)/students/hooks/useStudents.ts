"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

import {
  Classroom,
  Student,
  StudentFilters,
  StudentListResponse,
  StudentStats,
} from "../types";

import {
  initialState,
  reducer,
} from "./reducer";

export function useStudents() {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [selectedStudent, setSelectedStudent] =
  useState<Student | null>(null);

  const [studentModalOpen, setStudentModalOpen] =
    useState(false);

  const [savingStudent, setSavingStudent] =
    useState(false);

  const editStudent = (student: Student) => {
      setSelectedStudent(student);
      setStudentModalOpen(true);
    };


  const closeStudentModal = () => {
    setStudentModalOpen(false);
    setSelectedStudent(null);
  };


  const updateStudent = async (
    data: Partial<Student>
  ) => {
    if (!selectedStudent) return;
  
    try {
      setSavingStudent(true);
  
      await api.patch(
        `/students/${selectedStudent.id}/`,
        data
      );
      
      toast.success("Élève modifié avec succès");
      await loadStudents();
      
      closeStudentModal();
    } catch (error) {
      
      console.error(error);
      toast.error("Impossible de modifier l'élève");
    } finally {
      setSavingStudent(false);
    }
  };

  /* ==========================================
   * LOAD STUDENTS
   * ========================================== */

  const selectAllStudents = () => {
    dispatch({
        type: "SELECT_ALL_STUDENTS",
        payload: state.students.map(
            (student) => student.id
        ),
    });
};


  const loadStudents = useCallback(async () => {
    dispatch({
      type: "SET_LOADING",
      payload: true,
    });

    try {
      const { search, classroom, gender } =
        state.filters;
      
      const res =
        await api.get<StudentListResponse>(
          "/students/",
          {
            params: {
              search,
              classroom_id: classroom || undefined,
              gender,
              //status,
              page: state.pagination.page,
            },
          }
        );
        
      dispatch({
        type: "SET_STUDENTS",
        payload: res.data.data,
      });

      dispatch({
        type: "SET_STATS",
        payload: {
          total: res.data.total_E,
          girls: res.data.queryset_F,
          boys: res.data.queryset_M,
          classrooms: state.classrooms.length,
        },
      });

      dispatch({
        type: "SET_PAGINATION",
        payload: {
          total: res.data.total_E,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  }, [
    state.filters,
    state.pagination.page,
    state.classrooms.length,
  ]);

  /* ==========================================
   * LOAD CLASSROOMS
   * ========================================== */

  const loadClassrooms = useCallback(async () => {
    try {
      const res = await api.get<any>(
        "/students/classrooms/"
      );
     

      dispatch({
        type: "SET_CLASSROOMS",
        payload: res.data.results,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  /* ==========================================
   * FILTERS
   * ========================================== */

  const setFilters = (
    values: Partial<StudentFilters>
  ) => {
    dispatch({
      type: "SET_FILTERS",
      payload: values,
    });

    dispatch({
      type: "SET_PAGINATION",
      payload: {
        page: 1,
      },
    });
  };

  const resetFilters = () => {
    dispatch({
      type: "RESET_FILTERS",
    });

    dispatch({
      type: "SET_PAGINATION",
      payload: {
        page: 1,
      },
    });
  };

  /* ==========================================
   * SELECTION
   * ========================================== */

  const toggleStudentSelection = (
    id: number
  ) => {
    dispatch({
      type: "TOGGLE_STUDENT_SELECTION",
      payload: id,
    });
  };

  const clearSelection = () => {
    dispatch({
      type: "CLEAR_SELECTION",
    });
  };

  /* ==========================================
   * PAGINATION
   * ========================================== */

  const changePage = (page: number) => {
    dispatch({
      type: "SET_PAGINATION",
      payload: {
        page,
      },
    });
  };

  /* ==========================================
   * EXPORTS
   * ========================================== */

  const exportExcel = async () => {
    try {
        const params: Record<string, any> = {
          search: state.filters.search || undefined,
          classroom_id: state.filters.classroom || undefined,
          gender: state.filters.gender || undefined,
        };
    
        // Si des élèves sont sélectionnés, on exporte uniquement ceux-là
        if (state.selectedStudents.length > 0) {
          params.ids = state.selectedStudents.join(",");
        }
    
        const response = await api.get(
          "/students/export/excel/",
          {
            params,
            responseType: "blob",
          }
        );
    
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
    
        const url = window.URL.createObjectURL(blob);
    
        const link = document.createElement("a");
    
        link.href = url;
    
        link.download = `eleves_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`;
    
        document.body.appendChild(link);
    
        link.click();
    
        link.remove();
    
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
      }
  };

  const exportPDF = async () => {
    try {
      const params: Record<string, any> = {
        search: state.filters.search || undefined,
        classroom_id: state.filters.classroom || undefined,
        gender: state.filters.gender || undefined,
      };
  
      // Si des élèves sont sélectionnés, on exporte uniquement ceux-là
      if (state.selectedStudents.length > 0) {
        params.ids = state.selectedStudents.join(",");
      }
  
      const response = await api.get(
        "/students/export/pdf/",
        {
          params,
          responseType: "blob",
        }
      );
  
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });
  
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
  
      link.href = url;
  
      link.download = `eleves_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
  
      document.body.appendChild(link);
  
      link.click();
  
      link.remove();
  
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================================
   * EFFECTS
   * ========================================== */

  useEffect(() => {
    loadClassrooms();
  }, [loadClassrooms]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  /* ==========================================
   * RETURN
   * ========================================== */

  return {
    ...state,
    studentModal: {
      open: studentModalOpen,
      student: selectedStudent,
      loading: savingStudent,
    },
    actions: {
      loadStudents,

      loadClassrooms,

      setFilters,

      resetFilters,

      toggleStudentSelection,

      clearSelection,

      changePage,

      exportExcel,

      exportPDF,

      selectAllStudents,

      editStudent,

      closeStudentModal,

      updateStudent,

      
    },
  };
}

