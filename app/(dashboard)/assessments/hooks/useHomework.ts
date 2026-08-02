"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "@/lib/api";

import {
  Homework,
  HomeworkFormData,
  HomeworkFilters,
  HomeworkSummary,
  Classroom,
  Subject,
} from "../types";

const INITIAL_FORM: HomeworkFormData = {
  classroom: "",
  subject: "",
  title: "",
  description: "",
  due_date: "",
  is_published: false,
};

const INITIAL_FILTERS: HomeworkFilters = {
  search: "",
  classroom: "",
  subject: "",
  status: "",
};

export function useHomework() {

  const [homeworks, setHomeworks] =
    useState<Homework[]>([]);

  const [classrooms, setClassrooms] =
    useState<Classroom[]>([]);

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [form, setForm] =
    useState<HomeworkFormData>(
      INITIAL_FORM
    );

  const [filters, setFilters] =
    useState<HomeworkFilters>(
      INITIAL_FILTERS
    );

  const [
    editingHomework,
    setEditingHomework,
  ] = useState<Homework | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  /**
   * Chargement
   */
  const loadData = useCallback(async () => {

    try {

      setLoading(true);

      const [

        homeworkRes,

        classroomRes,

        subjectRes,

      ] = await Promise.all([

        api.get("/homework/create/"),

        api.get("/students/classrooms/"),

        api.get("/academics/subjects/"),

      ]);

      setHomeworks(
        homeworkRes.data.results ??
        homeworkRes.data
      );

      setClassrooms(
        classroomRes.data.results ??
        classroomRes.data
      );

      setSubjects(
        subjectRes.data.results ??
        subjectRes.data
      );

    }

    catch {

      setError(
        "Impossible de charger les exercices."
      );

    }

    finally {

      setLoading(false);

    }

  }, []);

  /**
   * Reset
   */
  function resetForm() {

    setEditingHomework(null);

    setForm(INITIAL_FORM);

  }

  /**
   * Edition
   */
  function editHomework(
    homework: Homework
  ) {

    setEditingHomework(homework);

    setForm({

      classroom:
        homework.classroom,

      subject:
        homework.subject,

      title:
        homework.title,

      description:
        homework.description,

      due_date:
        homework.due_date,

      is_published:
        homework.is_published,

    });

  }

  /**
   * Sauvegarde
   */
  async function saveHomework() {

    try {

      setSubmitting(true);

      if (editingHomework) {

        await api.patch(

          `/homework/create/${editingHomework.id}/`,

          form

        );

      }

      else {

        await api.post(

          "/homework/create/",

          {
            classroom_id: form.classroom,
            subject_id: form.subject,
            title: form.title,
            description: form.description,
            due_date: form.due_date,
            is_published: form.is_published,
          }

        );

      }

      resetForm();

      await loadData();

    }

    catch {

      setError(

        editingHomework

          ? "Impossible de modifier l'exercice."

          : "Impossible de créer l'exercice."

      );

    }

    finally {

      setSubmitting(false);

    }

  }

  /**
   * Suppression
   */
  async function deleteHomework(
    id: string
  ) {

    if (
      !confirm(
        "Supprimer cet exercice ?"
      )
    ) return;

    try {

      await api.delete(

        `/homework/create/${id}/`

      );

      await loadData();

    }

    catch {

      setError(
        "Impossible de supprimer l'exercice."
      );

    }

  }

  /**
   * Fin édition
   */
  function closeEdition() {

    resetForm();

  }

  /**
   * Filtres
   */
  const filteredHomeworks =
    useMemo(() => {

      return homeworks.filter(
        (hw) => {

          const search =
            filters.search.toLowerCase();

          return (

            (

              !search ||

              hw.title
                .toLowerCase()
                .includes(search)

            )

            &&

            (

              !filters.classroom ||

              hw.classroom ===
              filters.classroom

            )

            &&

            (

              !filters.subject ||

              hw.subject ===
              filters.subject

            )

            &&

            (

              !filters.status ||

              hw.status ===
              filters.status

            )

          );

        }

      );

    }, [

      homeworks,

      filters,

    ]);

  /**
   * Dashboard
   */
  const summary =
    useMemo<HomeworkSummary>(() => ({

      total:
        filteredHomeworks.length,

      pending:
        filteredHomeworks.filter(
          h => h.status === "pending"
        ).length,

      completed:
        filteredHomeworks.filter(
          h => h.status === "completed"
        ).length,

      overdue:
        filteredHomeworks.filter(
          h => h.status === "overdue"
        ).length,

    }), [

      filteredHomeworks,

    ]);

  useEffect(() => {

    loadData();

  }, [

    loadData,

  ]);

  return {

    homeworks:
      filteredHomeworks,

    classrooms,

    subjects,

    form,

    filters,

    summary,

    loading,

    submitting,

    error,

    editingHomework,

    setForm,

    setFilters,

    editHomework,

    saveHomework,

    deleteHomework,

    resetForm,

    closeEdition,

    reload:
      loadData,

  };

}