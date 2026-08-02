"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import type {
  AcademicYear,
  AcademicYearForm,
  AcademicTerm,
  AcademicTermForm,
  ApiListResponse,
} from "../types";

const defaultYearForm: AcademicYearForm = {
  name: "",
  start_date: "",
  end_date: "",
  is_active: true,
};

const defaultTermForm: AcademicTermForm = {
  name: "",
  term_type: "trimester",
  start_date: "",
  end_date: "",
  academic_year: "",
  is_active: true,
};

export function useTerms() {
  /* ==============================
   * States
   * ============================== */

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [terms, setTerms] = useState<AcademicTerm[]>([]);

  const [selectedAcademicYearId, setSelectedAcademicYearId] =
    useState("");

  const [academicYearForm, setAcademicYearForm] =
    useState<AcademicYearForm>(defaultYearForm);

  const [termForm, setTermForm] =
    useState<AcademicTermForm>(defaultTermForm);

  const [editingAcademicYear, setEditingAcademicYear] =
    useState<AcademicYear | null>(null);

  const [editingTerm, setEditingTerm] =
    useState<AcademicTerm | null>(null);

  const [isAcademicYearModalOpen, setIsAcademicYearModalOpen] =
    useState(false);

  /* ==============================
   * Helpers
   * ============================== */

  const extractData = <T,>(
    response: { data: ApiListResponse<T> | T[] }
  ): T[] => {
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return response.data.results ?? [];
  };

  const clearError = () => setError(null);

  /* ==============================
   * Load data
   * ============================== */

  const loadData = async () => {
    try {
      setLoading(true);
      clearError();

      const [yearsResponse, termsResponse] =
        await Promise.all([
          api.get("/academics/academic-years/"),
          api.get("/academics/terms/"),
        ]);

      const years = extractData<AcademicYear>(
        yearsResponse
      ).sort((a, b) =>
        b.start_date.localeCompare(a.start_date)
      );

      const loadedTerms = extractData<AcademicTerm>(
        termsResponse
      ).sort((a, b) =>
        a.start_date.localeCompare(b.start_date)
      );

      setAcademicYears(years);
      setTerms(loadedTerms);

      const activeYear =
        years.find((year) => year.is_active) ??
        years[0];

      if (activeYear) {
        setSelectedAcademicYearId(activeYear.id);
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ==============================
   * Academic Year Modal
   * ============================== */

  const openAcademicYearModal = () => {
    resetAcademicYearForm();
    setIsAcademicYearModalOpen(true);
  };

  const closeAcademicYearModal = () => {
    resetAcademicYearForm();
    setIsAcademicYearModalOpen(false);
  };

  const selectAcademicYear = (id: string) => {
   
    setSelectedAcademicYearId(id);

    setEditingTerm(null);

    setTermForm({
        ...defaultTermForm,
        academic_year: id,
    });
};

  /* ==============================
   * Form Helpers
   * ============================== */

  const updateAcademicYearForm = (
    field: keyof AcademicYearForm,
    value: string | boolean
  ) => {
    setAcademicYearForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateTermForm = (
    field: keyof AcademicTermForm,
    value: string | boolean
  ) => {
    setTermForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

    /* ==============================
   * Academic Year
   * ============================== */

    const resetAcademicYearForm = () => {
        setAcademicYearForm(defaultYearForm);
        setEditingAcademicYear(null);
      };
    
      const editAcademicYear = (year: AcademicYear) => {
        setEditingAcademicYear(year);
    
        setAcademicYearForm({
          name: year.name,
          start_date: year.start_date,
          end_date: year.end_date,
          is_active: year.is_active,
        });
    
        setIsAcademicYearModalOpen(true);
      };
    
      const createAcademicYear = async () => {
        await api.post(
          "/academics/academic-years/",
          academicYearForm
        );
      };
    
      const updateAcademicYear = async () => {
        if (!editingAcademicYear) return;
    
        await api.put(
          `/academics/academic-years/${editingAcademicYear.id}/`,
          academicYearForm
        );
      };
    
      const saveAcademicYear = async () => {
        try {
          setSaving(true);
          clearError();
    
          if (editingAcademicYear) {
            await updateAcademicYear();
          } else {
            await createAcademicYear();
          }
    
          await loadData();
    
          closeAcademicYearModal();
        } catch (err) {
          console.error(err);
          setError(
            "Impossible d'enregistrer l'année académique."
          );
        } finally {
          setSaving(false);
        }
      };
    
      const deleteAcademicYear = async (
        year: AcademicYear
      ) => {
        try {
          clearError();
    
          if (
            !confirm(
              `Supprimer l'année académique "${year.name}" ?`
            )
          ) {
            return;
          }
    
          await api.delete(
            `/academics/academic-years/${year.id}/`
          );
    
          await loadData();
    
          if (selectedAcademicYearId === year.id) {
            const remainingYears = academicYears.filter(
              (item) => item.id !== year.id
            );
    
            if (remainingYears.length > 0) {
              setSelectedAcademicYearId(
                remainingYears[0].id
              );
            } else {
              setSelectedAcademicYearId("");
            }
          }
        } catch (err) {
          console.error(err);
          setError(
            "Impossible de supprimer l'année académique."
          );
        }
      };
    
      /* ==============================
       * Academic Term
       * ============================== */
    
      const resetTermForm = () => {
        setTermForm({
          ...defaultTermForm,
          academic_year: selectedAcademicYearId,
        });
    
        setEditingTerm(null);
      };
    
      const createNewTerm = (academicYearId?: string) => {
        setEditingTerm(null);
      
        setTermForm({
          ...defaultTermForm,
          academic_year: academicYearId ?? selectedAcademicYearId,
        });
      };
    
      const editTerm = (term: AcademicTerm) => {
        setEditingTerm(term);
    
        setTermForm({
          name: term.name,
          term_type: term.term_type,
          start_date: term.start_date,
          end_date: term.end_date,
          academic_year: term.academic_year,
          is_active: term.is_active,
        });
      };
    
      const createTerm = async () => {
        
        await api.post(
          "/academics/terms/",
          termForm
        );
      };
    
      const updateTerm = async () => {
        if (!editingTerm) return;
    
        await api.put(
          `/academics/terms/${editingTerm.id}/`,
          termForm
        );
      };

      const saveTerm = async () => {
        try {
          setSaving(true);
          clearError();
    
          if (editingTerm) {
            await updateTerm();
          } else {
            await createTerm();
          }
    
          await loadData();
          resetTermForm();
        } catch (err) {
          console.error(err);
          setError(
            "Impossible d'enregistrer la période."
          );
        } finally {
          setSaving(false);
        }
      };
    
      const deleteTerm = async (
        term: AcademicTerm
      ) => {
        try {
          clearError();
    
          if (
            !confirm(
              `Supprimer "${term.name}" ?`
            )
          ) {
            return;
          }
    
          await api.delete(
            `/academics/terms/${term.id}/`
          );
    
          await loadData();
        } catch (err) {
          console.error(err);
          setError(
            "Impossible de supprimer la période."
          );
        }
      };
    
      /* ==============================
       * Computed
       * ============================== */
    
      const filteredTerms = terms.filter(
        (term) =>
          term.academic_year ===
          selectedAcademicYearId
      );
    
      /* ==============================
       * Public API
       * ============================== */
      useEffect(() => {
       
      }, [selectedAcademicYearId, termForm]);
      return {
        /* States */
        loading,
        saving,
        error,
    
        /* Data */
        academicYears,
        terms: filteredTerms,
    
        /* Selection */
        selectedAcademicYearId,
        selectAcademicYear,
    
        /* Academic Year Modal */
        isAcademicYearModalOpen,
        openAcademicYearModal,
        closeAcademicYearModal,
    
        /* Forms */
        academicYearForm,
        termForm,
    
        updateAcademicYearForm,
        updateTermForm,
    
        /* Editing */
        editingAcademicYear,
        editingTerm,
    
        /* Academic Year */
        editAcademicYear,
        saveAcademicYear,
        deleteAcademicYear,
        resetAcademicYearForm,
    
        /* Academic Term */
        editTerm,
        saveTerm,
        deleteTerm,
        resetTermForm,
        createNewTerm,
    
        /* Utilities */
        reload: loadData,
      };
    }