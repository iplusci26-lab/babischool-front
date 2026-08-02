"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";

import {
  Assessment,
  AssessmentFormData,
  AssessmentFilters,
  AssessmentSummary,
  Classroom,
  Subject,
  Term,
} from "../types";

const INITIAL_FORM: AssessmentFormData = {
  classroom: "",
  subject: "",
  term: "",
  title: "",
  assessment_type: "test",
  max_score: 20,
  weight: 1,
  date_assessment: "",
  category: "class",
};

const INITIAL_FILTERS: AssessmentFilters = {
  search: "",
  classroom: "",
  subject: "",
  term: "",
  assessment_type: "",
};

const INITIAL_SUMMARY: AssessmentSummary = {
  total: 0,
  homework: 0,
  test: 0,
  exam: 0,
};

export function useAssessment(
   category: "class" | "scheduled"
) {

  const [assessments, setAssessments] =
    useState<Assessment[]>([]);

 

  const [classrooms, setClassrooms] =
    useState<Classroom[]>([]);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [terms, setTerms] =
    useState<Term[]>([]);

  const [form, setForm] =
    useState<AssessmentFormData>(INITIAL_FORM);

  const [filters, setFilters] =
    useState<AssessmentFilters>(INITIAL_FILTERS);

  const [editingAssessment, setEditingAssessment] =
    useState<Assessment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  /**
   * Chargement
   */
  const loadData = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const [

        assessmentsRes,

        classroomsRes,

        subjectsRes,

        termsRes,

      ] = await Promise.all([

        api.get("/academics/assessments/", {
          params: {
            category: category,
          },
        }),


        api.get("/students/classrooms/"),

        api.get("/academics/subjects/"),

        api.get("/academics/terms/"),

      ]);
   
      setAssessments(
        assessmentsRes.data ?? []
      );
      console.log("------------",assessmentsRes.data)
     
      setClassrooms(
        classroomsRes.data.results ??
        classroomsRes.data
      );
      
      setSubjects(
        subjectsRes.data.results ??
        subjectsRes.data
      );
     
      setTerms(
        termsRes.data.results ??
        termsRes.data
      );
      
    } catch {

      setError(
        "Impossible de charger les évaluations."
      );

    } finally {

      setLoading(false);

    }

  }, []);

  /**
   * Reset
   */
  const resetForm = () => {

    setEditingAssessment(null);

    setForm(INITIAL_FORM);

  };

  /**
   * Prépare l'édition
   */
  const editAssessment = (
    assessment: Assessment
  ) => {

    setEditingAssessment(
      assessment
    );

    setForm({

      classroom: assessment.classroom,

      subject: assessment.subject,

      term: assessment.term,

      title: assessment.title,

      assessment_type:
        assessment.assessment_type,
      category: category,
      max_score:
        assessment.max_score,

      weight:
        assessment.weight,

        date_assessment:
        assessment.date_assessment,

    });

  };

  /**
   * Création / Modification
   */
  const saveAssessment = async () => {

    try {

      setSubmitting(true);
      setError("");

      if (editingAssessment) {

        await api.patch(

          `/academics/assessments/${editingAssessment.id}/`,

          {
            ...form,
            category,
          }

        );

      } else {

        await api.post(

          "/academics/assessments/",

          {
            ...form,
            category,
          }

        );

      }

      resetForm();

      await loadData();

    } catch {

      setError(

        editingAssessment

          ? "Impossible de modifier l'évaluation."

          : "Impossible de créer l'évaluation."

      );

    } finally {

      setSubmitting(false);

    }

  };

  /**
   * Publication
   */
  const publishAssessment = async (
    id: string
  ) => {

    try {

      await api.post(

        `/academics/assessments/${id}/publish/`

      );

      await loadData();

    } catch {

      setError(
        "Impossible de publier l'évaluation."
      );

    }

  };

  /**
   * Suppression
   */
  const deleteAssessment = async (
    id: string
  ) => {

    if (
      !confirm(
        "Supprimer cette évaluation ?"
      )
    ) return;

    try {

      await api.delete(

        `/academics/assessments/${id}/`

      );

      await loadData();

    } catch {

      setError(
        "Impossible de supprimer l'évaluation."
      );

    }

  };

  /**
   * Fin édition
   */
  const closeEdition = () => {

    resetForm();

  };

  /**
   * Filtres locaux
   */
  const filteredAssessments =
    useMemo(() => {
     
      return assessments.filter(

        (assessment) => {

          const search =
            filters.search.toLowerCase();

          return (

            (

              !search ||

              assessment.title
                .toLowerCase()
                .includes(search)

            )

            &&

            (

              !filters.classroom ||

              assessment.classroom ===
              filters.classroom

            )

            &&

            (

              !filters.subject ||

              assessment.subject ===
              filters.subject

            )

            &&

            (

              !filters.term ||

              assessment.term ===
              filters.term

            )

            &&

            (

              !filters.assessment_type ||

              assessment.assessment_type ===
              filters.assessment_type

            )

          );

        }

      );

    }, [

      assessments,

      filters,

    ]);

    /* Tableau des types d'évaluations */
    const summary = useMemo<AssessmentSummary>(() => ({

      total: filteredAssessments.length,
    
      homework: filteredAssessments.filter(
        a => a.assessment_type === "homework"
      ).length,
    
      test: filteredAssessments.filter(
        a => a.assessment_type === "test"
      ).length,
    
      exam: filteredAssessments.filter(
        a => a.assessment_type === "exam"
      ).length,
    
    }), [filteredAssessments]);

  useEffect(() => {

    loadData();

  }, [loadData]);

  return {

    assessments:
      filteredAssessments,

    classrooms,

    subjects,

    terms,

    form,

    filters,

    summary,

    loading,

    submitting,

    error,

    editingAssessment,

    setForm,

    setFilters,

    editAssessment,

    saveAssessment,

    publishAssessment,

    deleteAssessment,

    resetForm,

    closeEdition,

    reload: loadData,
    

  };
  

}