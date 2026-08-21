"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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

  classroom_group: "",

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

export function useAssessment(
  category: "class" | "scheduled"
) {

  const [
    assessments,
    setAssessments,
  ] = useState<Assessment[]>([]);

  const [
    classrooms,
    setClassrooms,
  ] = useState<Classroom[]>([]);

  const [
    subjects,
    setSubjects,
  ] = useState<Subject[]>([]);

  const [
    terms,
    setTerms,
  ] = useState<Term[]>([]);

  const [
    form,
    setForm,
  ] = useState<AssessmentFormData>(
    INITIAL_FORM
  );

  const [
    filters,
    setFilters,
  ] = useState<AssessmentFilters>(
    INITIAL_FILTERS
  );

  const [
    editingAssessment,
    setEditingAssessment,
  ] = useState<Assessment | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // CHARGEMENT
  // ==========================================================

  const loadData = useCallback(
    async () => {

      try {

        setLoading(true);

        setError("");

        const [

          assessmentsRes,

          classroomsRes,

          subjectsRes,

          termsRes,

        ] = await Promise.all([

          api.get(
            "/academics/assessments/",
            {
              params: {
                category,
              },
            }
          ),

          api.get(
            "/students/classrooms/"
          ),

          api.get(
            "/academics/subjects/"
          ),

          api.get(
            "/academics/terms/"
          ),

        ]);

        setAssessments(
          assessmentsRes.data ?? []
        );

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

      } catch (error) {
        console.log("---------------------- ,",error)
        console.error(
          "Erreur chargement évaluations :",
          error
        );

        setError(
          "Impossible de charger les évaluations."
        );

      } finally {

        setLoading(false);

      }

    },
    [category]
  );

  // ==========================================================
  // RESET
  // ==========================================================

  const resetForm = () => {

    setEditingAssessment(null);

    setForm({

      ...INITIAL_FORM,

      category,

    });

  };

  // ==========================================================
  // ÉDITION
  // ==========================================================

  const editAssessment = (
    assessment: Assessment
  ) => {

    setEditingAssessment(
      assessment
    );

    setForm({

      classroom:
        assessment.classroom,

      /**
       * Si aucune groupe n'est associé,
       * on utilise une chaîne vide pour
       * le SearchSelect.
       */
      classroom_group:
        assessment.classroom_group ??
        "",

      subject:
        assessment.subject,

      term:
        assessment.term,

      title:
        assessment.title,

      assessment_type:
        assessment.assessment_type,

      max_score:
        assessment.max_score,

      weight:
        assessment.weight,

      date_assessment:
        assessment.date_assessment,

      category,

    });

  };

  // ==========================================================
  // PAYLOAD
  // ==========================================================

  const buildPayload = () => {

    return {

      classroom:
        form.classroom,

      /**
       * "" signifie toute la classe.
       *
       * On envoie donc null au backend.
       */
      classroom_group:
        form.classroom_group
          ? form.classroom_group
          : null,

      subject:
        form.subject,

      term:
        form.term,

      title:
        form.title,

      assessment_type:
        form.assessment_type,

      max_score:
        form.max_score,

      weight:
        form.weight,

      date_assessment:
        form.date_assessment,

      category,

    };

  };

  // ==========================================================
  // CRÉATION / MODIFICATION
  // ==========================================================

  const saveAssessment =
    async () => {

      try {

        setSubmitting(true);

        setError("");

        const payload =
          buildPayload();

        // ----------------------------------------------------
        // MODIFICATION
        // ----------------------------------------------------

        if (editingAssessment) {

          await api.patch(

            `/academics/assessments/${editingAssessment.id}/`,

            payload

          );

        }

        // ----------------------------------------------------
        // CRÉATION
        // ----------------------------------------------------

        else {

          await api.post(

            "/academics/assessments/",

            payload

          );

        }

        resetForm();

        await loadData();

      } catch (error: any) {

        console.error(
          "Erreur sauvegarde évaluation :",
          error?.response?.data ||
          error.non_field_errors
        );

        const data =
          error?.response?.data;
        let errorss = error.non_field_errors
        let message =
          editingAssessment
            ? "Impossible de modifier l'évaluation."
            : "Impossible de créer l'évaluation.";

        if (data?.classroom_group) {

          message = Array.isArray(
            data.classroom_group
          )
            ? data.classroom_group[0]
            : data.classroom_group;

        } else if (data?.classroom) {

          message = Array.isArray(
            data.classroom
          )
            ? data.classroom[0]
            : data.classroom;

        } else if (data?.subject) {

          message = Array.isArray(
            data.subject
          )
            ? data.subject[0]
            : data.subject;

        } else if (data?.detail) {

          message =
            data.detail;

        }

        setError(errorss);

      } finally {

        setSubmitting(false);

      }

    };

  // ==========================================================
  // PUBLICATION
  // ==========================================================

  const publishAssessment =
    async (
      id: string
    ) => {

      try {

        setError("");

        await api.post(

          `/academics/assessments/${id}/publish/`

        );

        await loadData();

      } catch (error: any) {

        console.error(
          "Erreur publication :",
          error?.response?.data ||
          error
        );

        setError(
          error?.response?.data?.detail ||
          "Impossible de publier l'évaluation."
        );

      }

    };

  // ==========================================================
  // SUPPRESSION
  // ==========================================================

  const deleteAssessment =
    async (
      id: string
    ) => {

      if (
        !confirm(
          "Supprimer cette évaluation ?"
        )
      ) {

        return;

      }

      try {

        setError("");

        await api.delete(

          `/academics/assessments/${id}/`

        );

        await loadData();

      } catch (error: any) {

        console.error(
          "Erreur suppression :",
          error?.response?.data ||
          error
        );

        setError(
          error?.response?.data?.detail ||
          "Impossible de supprimer l'évaluation."
        );

      }

    };

  // ==========================================================
  // FERMETURE ÉDITION
  // ==========================================================

  const closeEdition = () => {

    resetForm();

  };

  // ==========================================================
  // FILTRES
  // ==========================================================

  const filteredAssessments =
    useMemo(
      () => {

        return assessments.filter(
          (assessment) => {

            const search =
              filters.search
                .toLowerCase();

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

      },
      [
        assessments,
        filters,
      ]
    );

  // ==========================================================
  // SUMMARY
  // ==========================================================

  const summary =
    useMemo<AssessmentSummary>(
      () => ({

        total:
          filteredAssessments.length,

        homework:
          filteredAssessments.filter(
            (assessment) =>
              assessment.assessment_type ===
              "homework"
          ).length,

        test:
          filteredAssessments.filter(
            (assessment) =>
              assessment.assessment_type ===
              "test"
          ).length,

        exam:
          filteredAssessments.filter(
            (assessment) =>
              assessment.assessment_type ===
              "exam"
          ).length,

      }),
      [
        filteredAssessments,
      ]
    );

  // ==========================================================
  // INITIALISATION
  // ==========================================================

  useEffect(
    () => {

      loadData();

    },
    [loadData]
  );

  // ==========================================================
  // RETURN
  // ==========================================================

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

    reload:
      loadData,

  };

}