"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";
import { api } from "@/lib/api";

import {
  Homework,
  HomeworkFormData,
  HomeworkFilters,
  HomeworkSummary,
  Classroom,
  Subject,
  Term,
} from "../types";

// ===========================================================
// FORMULAIRE INITIAL
// ===========================================================

const INITIAL_FORM: HomeworkFormData = {
  classroom: "",
  classroom_group: "",
  subject: "",
  term: "",
  title: "",
  description: "",
  assigned_date: new Date().toLocaleDateString("en-CA"),
  due_date: "",
  max_score: "20",
  is_published: false,
};

// ===========================================================
// FILTRES INITIAUX
// ===========================================================

const INITIAL_FILTERS: HomeworkFilters = {
  search: "",
  classroom: "",
  subject: "",
  term: "",
  status: "",
};

// ===========================================================
// NORMALISATION RÉPONSE API
// ===========================================================

function normalizeApiList<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (
    data &&
    typeof data === "object" &&
    "results" in data
  ) {
    const results = (data as { results?: unknown }).results;

    if (Array.isArray(results)) {
      return results as T[];
    }
  }

  return [];
}

// ===========================================================
// EXTRACTION MESSAGE ERREUR
// ===========================================================

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  const data = (error as any)?.response?.data;

  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data?.detail)) {
    return data.detail[0] || fallback;
  }

  if (data && typeof data === "object") {
    const firstKey = Object.keys(data)[0];

    if (firstKey) {
      const value = data[firstKey];

      if (Array.isArray(value)) {
        return String(value[0] || fallback);
      }

      if (typeof value === "string") {
        return value;
      }
    }
  }

  return fallback;
}

// ===========================================================
// NORMALISATION DATE
// ===========================================================

function getLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ===========================================================
// HOOK
// ===========================================================

export function useHomework() {
  // =========================================================
  // STATES
  // =========================================================

  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);

  const [form, setForm] = useState<HomeworkFormData>({
    ...INITIAL_FORM,
    assigned_date: getLocalDate(),
  });

  const [filters, setFilters] =
    useState<HomeworkFilters>(INITIAL_FILTERS);

  const [editingHomework, setEditingHomework] =
    useState<Homework | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // CHARGEMENT DES DONNÉES
  // =========================================================

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [
        homeworkRes,
        classroomRes,
        subjectRes,
        termRes,
      ] = await Promise.all([
        api.get("/homework/"),
        api.get("/students/classrooms/"),
        api.get("/academics/subjects/"),
        api.get("/academics/terms/"),
      ]);

      setHomeworks(
        normalizeApiList<Homework>(homeworkRes.data)
      );

      setClassrooms(
        normalizeApiList<Classroom>(classroomRes.data)
      );

      setSubjects(
        normalizeApiList<Subject>(subjectRes.data)
      );

      setTerms(
        normalizeApiList<Term>(termRes.data)
      );
    } catch (error: unknown) {
      console.error("Erreur chargement homework:", error);

      const message = getErrorMessage(
        error,
        "Impossible de charger les exercices."
      );

      setError(message);
      toast.error(message);

      setTerms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // RESET FORMULAIRE
  // =========================================================

  function resetForm() {
    setEditingHomework(null);

    setForm({
      ...INITIAL_FORM,
      assigned_date: getLocalDate(),
    });

    setError("");
  }

  // =========================================================
  // ÉDITION
  // =========================================================

  function editHomework(homework: Homework) {
    setEditingHomework(homework);

    setForm({
      classroom: homework.classroom,
      classroom_group: homework.classroom_group ?? "",
      subject: homework.subject,

      term:
        homework.academic_term ??
        homework.term ??
        "",

      title: homework.title,
      description: homework.description,

      assigned_date:
        homework.assigned_date || getLocalDate(),

      due_date: homework.due_date,

      max_score: String(homework.max_score ?? 20),

      is_published: homework.is_published,
    });

    setError("");
  }

  // =========================================================
  // CRÉATION / MODIFICATION
  // =========================================================

  async function saveHomework(): Promise<boolean> {
    const isEditing = Boolean(editingHomework);

    try {
      setSubmitting(true);
      setError("");

      // VALIDATION CLASSE
      if (!form.classroom) {
        throw new Error("Veuillez sélectionner une classe.");
      }

      // VALIDATION MATIÈRE
      if (!form.subject) {
        throw new Error("Veuillez sélectionner une matière.");
      }

      // VALIDATION PÉRIODE
      if (!form.term) {
        throw new Error(
          "Veuillez sélectionner une période académique."
        );
      }

      // VALIDATION TITRE
      if (!form.title.trim()) {
        throw new Error(
          "Veuillez renseigner le titre de l'exercice."
        );
      }

      // VALIDATION DESCRIPTION
      if (!form.description.trim()) {
        throw new Error(
          "Veuillez renseigner la description."
        );
      }

      // VALIDATION DATE EXERCICE
      if (!form.assigned_date) {
        throw new Error(
          "Veuillez renseigner la date de l'exercice."
        );
      }

      // VALIDATION DATE LIMITE
      if (!form.due_date) {
        throw new Error(
          "Veuillez renseigner la date limite."
        );
      }

      if (form.due_date < form.assigned_date) {
        throw new Error(
          "La date limite ne peut pas être antérieure à la date de l'exercice."
        );
      }

      // VALIDATION NOTE MAXIMALE
      const maxScore = Number(form.max_score);

      if (!Number.isFinite(maxScore) || maxScore <= 0) {
        throw new Error(
          "La note maximale doit être supérieure à zéro."
        );
      }

      // PAYLOAD
      const payload = {
        classroom_id: form.classroom,
        classroom_group_id: form.classroom_group || null,
        subject_id: form.subject,
        academic_term_id: form.term,

        title: form.title.trim(),
        description: form.description.trim(),

        assigned_date: form.assigned_date,
        max_score: maxScore,

        due_date: form.due_date,
        is_published: form.is_published,
      };

      // MODIFICATION
      if (editingHomework) {
        await api.patch(
          `/homework/${editingHomework.id}/`,
          payload
        );
      } else {
        // CRÉATION
        await api.post("/homework/", payload);
      }

      toast.success(
        isEditing
          ? "Exercice modifié avec succès."
          : "Exercice créé avec succès."
      );

      resetForm();
      await loadData();

      return true;
    } catch (error: unknown) {
      console.error("Erreur sauvegarde homework:", error);

      const fallback = isEditing
        ? "Impossible de modifier l'exercice."
        : "Impossible de créer l'exercice.";

      const message =
        error instanceof Error &&
        !(error as any)?.response
          ? error.message
          : getErrorMessage(error, fallback);

      setError(message);
      toast.error(message);

      return false;
    } finally {
      setSubmitting(false);
    }
  }

  // =========================================================
  // SUPPRESSION
  // =========================================================

  async function deleteHomework(id: string) {
    const confirmed = confirm("Supprimer cet exercice ?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/homework/${id}/`);

      toast.success("Exercice supprimé avec succès.");

      await loadData();
    } catch (error: unknown) {
      console.error("Erreur suppression homework:", error);

      const message = getErrorMessage(
        error,
        "Impossible de supprimer l'exercice."
      );

      setError(message);
      toast.error(message);
    }
  }

  // =========================================================
  // FERMETURE ÉDITION
  // =========================================================

  function closeEdition() {
    resetForm();
  }

  // =========================================================
  // FILTRES
  // =========================================================

  const filteredHomeworks = useMemo(() => {
    return homeworks.filter((hw) => {
      const search = filters.search.toLowerCase().trim();

      const matchesSearch =
        !search ||
        hw.title.toLowerCase().includes(search) ||
        hw.description.toLowerCase().includes(search);

      const matchesClassroom =
        !filters.classroom ||
        hw.classroom === filters.classroom;

      const matchesSubject =
        !filters.subject ||
        hw.subject === filters.subject;

      const matchesTerm =
        !filters.term ||
        (hw.academic_term ?? hw.term) === filters.term;

      const matchesStatus =
        !filters.status ||
        hw.status === filters.status;

      return (
        matchesSearch &&
        matchesClassroom &&
        matchesSubject &&
        matchesTerm &&
        matchesStatus
      );
    });
  }, [homeworks, filters]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const summary = useMemo<HomeworkSummary>(() => ({
    total: filteredHomeworks.length,

    pending: filteredHomeworks.filter(
      (homework) => homework.status === "pending"
    ).length,

    completed: filteredHomeworks.filter(
      (homework) => homework.status === "completed"
    ).length,

    overdue: filteredHomeworks.filter(
      (homework) => homework.status === "overdue"
    ).length,
  }), [filteredHomeworks]);

  // =========================================================
  // CHARGEMENT INITIAL
  // =========================================================

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================================================
  // RETURN
  // =========================================================

  return {
    homeworks: filteredHomeworks,
    classrooms,
    subjects,
    terms,

    form,
    setForm,

    filters,
    setFilters,

    summary,

    loading,
    submitting,
    error,
    editingHomework,

    editHomework,
    saveHomework,
    deleteHomework,
    resetForm,
    closeEdition,

    reload: loadData,
  };
}