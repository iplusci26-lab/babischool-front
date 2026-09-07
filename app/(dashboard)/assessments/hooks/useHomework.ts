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


/* ===========================================================
 * FORMULAIRE INITIAL
 * =========================================================== */

const INITIAL_FORM: HomeworkFormData = {
  classroom: "",
  classroom_group: "",
  subject: "",
  term: "",
  title: "",
  description: "",
  due_date: "",
  is_published: false,
};


/* ===========================================================
 * FILTRES INITIAUX
 * =========================================================== */

const INITIAL_FILTERS: HomeworkFilters = {
  search: "",
  classroom: "",
  subject: "",
  term: "",
  status: "",
};


/* ===========================================================
 * HELPER — NORMALISATION RÉPONSE API
 * =========================================================== */

function normalizeApiList<T>(
  data: unknown
): T[] {

  if (
    Array.isArray(data)
  ) {

    return data as T[];

  }


  if (
    data &&
    typeof data === "object" &&
    "results" in data
  ) {

    const results =
      (
        data as {
          results?: unknown;
        }
      ).results;


    if (
      Array.isArray(results)
    ) {

      return results as T[];

    }

  }


  return [];

}


/* ===========================================================
 * HELPER — EXTRACTION MESSAGE D'ERREUR API
 * =========================================================== */

function getErrorMessage(
  error: unknown,
  fallback: string
): string {

  const data =
    (
      error as any
    )?.response?.data;


  /* ---------------------------------------------------------
   * DETAIL STRING
   * --------------------------------------------------------- */

  if (
    typeof data?.detail ===
    "string"
  ) {

    return data.detail;

  }


  /* ---------------------------------------------------------
   * DETAIL ARRAY
   * --------------------------------------------------------- */

  if (
    Array.isArray(
      data?.detail
    )
  ) {

    return (
      data.detail[0] ||
      fallback
    );

  }


  /* ---------------------------------------------------------
   * ERREURS PAR CHAMP
   * --------------------------------------------------------- */

  if (
    data &&
    typeof data ===
    "object"
  ) {

    const firstKey =
      Object.keys(data)[0];


    if (
      firstKey
    ) {

      const value =
        data[firstKey];


      if (
        Array.isArray(value)
      ) {

        return (
          value[0] ||
          fallback
        );

      }


      if (
        typeof value ===
        "string"
      ) {

        return value;

      }

    }

  }


  return fallback;

}


/* ===========================================================
 * HOOK
 * =========================================================== */

export function useHomework() {


  /* ===========================================================
   * STATES
   * =========================================================== */

  const [
    homeworks,
    setHomeworks,
  ] = useState<Homework[]>([]);


  const [
    classrooms,
    setClassrooms,
  ] = useState<Classroom[]>([]);


  const [
    subjects,
    setSubjects,
  ] = useState<Subject[]>([]);


  /*
   * Toujours un tableau.
   *
   * Évite :
   *
   * Cannot read properties of undefined
   * (reading 'map')
   */

  const [
    terms,
    setTerms,
  ] = useState<Term[]>([]);


  const [
    form,
    setForm,
  ] = useState<HomeworkFormData>(
    INITIAL_FORM
  );


  const [
    filters,
    setFilters,
  ] = useState<HomeworkFilters>(
    INITIAL_FILTERS
  );


  const [
    editingHomework,
    setEditingHomework,
  ] = useState<Homework | null>(
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


  /* ===========================================================
   * CHARGEMENT DES DONNÉES
   * =========================================================== */

  const loadData =
    useCallback(async () => {

      try {

        setLoading(true);

        setError("");


        const [

          homeworkRes,

          classroomRes,

          subjectRes,

          termRes,

        ] = await Promise.all([

          api.get(
            "/homework/"
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


        /* -------------------------------------------------------
         * HOMEWORKS
         * ------------------------------------------------------- */

        setHomeworks(

          normalizeApiList<Homework>(
            homeworkRes.data
          )

        );


        /* -------------------------------------------------------
         * CLASSES
         * ------------------------------------------------------- */

        setClassrooms(

          normalizeApiList<Classroom>(
            classroomRes.data
          )

        );


        /* -------------------------------------------------------
         * MATIÈRES
         * ------------------------------------------------------- */

        setSubjects(

          normalizeApiList<Subject>(
            subjectRes.data
          )

        );


        /* -------------------------------------------------------
         * PÉRIODES ACADÉMIQUES
         * ------------------------------------------------------- */

        console.log(
          "TERM RESPONSE:",
          termRes.data
        );
        
        
        const normalizedTerms =
          normalizeApiList<Term>(
            termRes.data
          );
        
        
        console.log(
          "NORMALIZED TERMS:",
          normalizedTerms
        );
        
        
        setTerms(
          normalizedTerms
        );
      }

      catch (
        error: unknown
      ) {

        console.error(
          "Erreur chargement homework:",
          error
        );


        const message =
          getErrorMessage(

            error,

            "Impossible de charger les exercices."

          );


        setError(
          message
        );


        toast.error(
          message
        );


        /*
         * Sécurité :
         * terms reste toujours un tableau.
         */

        setTerms([]);

      }

      finally {

        setLoading(false);

      }

    }, []);


  /* ===========================================================
   * RESET FORMULAIRE
   * =========================================================== */

  function resetForm() {

    setEditingHomework(
      null
    );


    setForm(
      INITIAL_FORM
    );

  }


  /* ===========================================================
   * ÉDITION
   * =========================================================== */

  function editHomework(
    homework: Homework
  ) {

    setEditingHomework(
      homework
    );


    setForm({

      /* -------------------------------------------------------
       * CLASSE
       * ------------------------------------------------------- */

      classroom:
        homework.classroom,


      /* -------------------------------------------------------
       * GROUPE
       * ------------------------------------------------------- */

      classroom_group:
        homework.classroom_group ?? "",


      /* -------------------------------------------------------
       * MATIÈRE
       * ------------------------------------------------------- */

      subject:
        homework.subject,


      /* -------------------------------------------------------
       * PÉRIODE
       *
       * Convention frontend :
       * term
       * ------------------------------------------------------- */

      term:
        homework.term,


      /* -------------------------------------------------------
       * CONTENU
       * ------------------------------------------------------- */

      title:
        homework.title,


      description:
        homework.description,


      /* -------------------------------------------------------
       * DATE
       * ------------------------------------------------------- */

      due_date:
        homework.due_date,


      /* -------------------------------------------------------
       * PUBLICATION
       * ------------------------------------------------------- */

      is_published:
        homework.is_published,

    });

  }


  /* ===========================================================
   * CRÉATION / MODIFICATION
   * =========================================================== */

  async function saveHomework() {

    const isEditing =
      Boolean(
        editingHomework
      );


    try {

      setSubmitting(
        true
      );


      setError("");


      /* -------------------------------------------------------
       * VALIDATION FRONTEND
       * ------------------------------------------------------- */

      if (
        !form.classroom
      ) {

        throw new Error(
          "Veuillez sélectionner une classe."
        );

      }


      if (
        !form.subject
      ) {

        throw new Error(
          "Veuillez sélectionner une matière."
        );

      }


      if (
        !form.term
      ) {

        throw new Error(
          "Veuillez sélectionner une période académique."
        );

      }


      if (
        !form.title.trim()
      ) {

        throw new Error(
          "Veuillez renseigner le titre de l'exercice."
        );

      }


      if (
        !form.description.trim()
      ) {

        throw new Error(
          "Veuillez renseigner la description."
        );

      }


      if (
        !form.due_date
      ) {

        throw new Error(
          "Veuillez renseigner la date limite."
        );

      }


      /* -------------------------------------------------------
       * PAYLOAD
       *
       * Le frontend utilise :
       *
       * form.term
       *
       * Le backend Django reçoit :
       *
       * academic_term_id
       * ------------------------------------------------------- */

      const payload = {

        classroom_id:
          form.classroom,


        classroom_group_id:

          form.classroom_group ||

          null,


        subject_id:
          form.subject,


        academic_term_id:
          form.term,


        title:
          form.title.trim(),


        description:
          form.description.trim(),


        due_date:
          form.due_date,


        is_published:
          form.is_published,

      };


      /* -------------------------------------------------------
       * MODIFICATION
       * ------------------------------------------------------- */

      if (
        editingHomework
      ) {

        await api.patch(

          `/homework/${editingHomework.id}/`,

          payload

        );

      }


      /* -------------------------------------------------------
       * CRÉATION
       * ------------------------------------------------------- */

      else {

        await api.post(

          "/homework/",

          payload

        );

      }


      /* -------------------------------------------------------
       * SUCCESS
       * ------------------------------------------------------- */

      toast.success(

        isEditing

          ? "Exercice modifié avec succès."

          : "Exercice créé avec succès."

      );


      /* -------------------------------------------------------
       * RESET
       * ------------------------------------------------------- */

      resetForm();


      /* -------------------------------------------------------
       * RECHARGEMENT
       * ------------------------------------------------------- */

      await loadData();

    }

    catch (
      error: unknown
    ) {

      console.error(
        "Erreur sauvegarde homework:",
        error
      );


      /* -------------------------------------------------------
       * ERREUR DE VALIDATION FRONTEND
       * ------------------------------------------------------- */

      if (
        error instanceof Error &&
        !(
          error as any
        )?.response
      ) {

        setError(
          error.message
        );


        toast.error(
          error.message
        );


        return;

      }


      const fallback =

        isEditing

          ? "Impossible de modifier l'exercice."

          : "Impossible de créer l'exercice.";


      const message =
        getErrorMessage(

          error,

          fallback

        );


      setError(
        message
      );


      toast.error(
        message
      );

    }

    finally {

      setSubmitting(
        false
      );

    }

  }


  /* ===========================================================
   * SUPPRESSION
   * =========================================================== */

  async function deleteHomework(
    id: string
  ) {

    const confirmed =
      confirm(
        "Supprimer cet exercice ?"
      );


    if (
      !confirmed
    ) {

      return;

    }


    try {

      setError("");


      await api.delete(

        `/homework/${id}/`

      );


      toast.success(
        "Exercice supprimé avec succès."
      );


      await loadData();

    }

    catch (
      error: unknown
    ) {

      console.error(
        "Erreur suppression homework:",
        error
      );


      const message =
        getErrorMessage(

          error,

          "Impossible de supprimer l'exercice."

        );


      setError(
        message
      );


      toast.error(
        message
      );

    }

  }


  /* ===========================================================
   * FERMETURE ÉDITION
   * =========================================================== */

  function closeEdition() {

    resetForm();

  }


  /* ===========================================================
   * FILTRES
   * =========================================================== */

  const filteredHomeworks =
    useMemo(() => {

      return homeworks.filter(

        (hw) => {

          const search =

            filters.search
              .toLowerCase()
              .trim();


          /* ---------------------------------------------------
           * RECHERCHE
           * --------------------------------------------------- */

          const matchesSearch =

            !search ||

            hw.title
              .toLowerCase()
              .includes(search) ||

            hw.description
              .toLowerCase()
              .includes(search);


          /* ---------------------------------------------------
           * CLASSE
           * --------------------------------------------------- */

          const matchesClassroom =

            !filters.classroom ||

            hw.classroom ===
            filters.classroom;


          /* ---------------------------------------------------
           * MATIÈRE
           * --------------------------------------------------- */

          const matchesSubject =

            !filters.subject ||

            hw.subject ===
            filters.subject;


          /* ---------------------------------------------------
           * PÉRIODE
           * --------------------------------------------------- */

          const matchesTerm =

            !filters.term ||

            hw.term ===
            filters.term;


          /* ---------------------------------------------------
           * STATUT
           * --------------------------------------------------- */

          const matchesStatus =

            !filters.status ||

            hw.status ===
            filters.status;


          return (

            matchesSearch &&

            matchesClassroom &&

            matchesSubject &&

            matchesTerm &&

            matchesStatus

          );

        }

      );

    }, [

      homeworks,

      filters,

    ]);


  /* ===========================================================
   * SUMMARY
   * =========================================================== */

  const summary =
    useMemo<HomeworkSummary>(() => ({

      total:
        filteredHomeworks.length,


      pending:

        filteredHomeworks.filter(

          (homework) =>

            homework.status ===
            "pending"

        ).length,


      completed:

        filteredHomeworks.filter(

          (homework) =>

            homework.status ===
            "completed"

        ).length,


      overdue:

        filteredHomeworks.filter(

          (homework) =>

            homework.status ===
            "overdue"

        ).length,

    }), [

      filteredHomeworks,

    ]);


  /* ===========================================================
   * CHARGEMENT INITIAL
   * =========================================================== */

  useEffect(() => {

    loadData();

  }, [

    loadData,

  ]);


  /* ===========================================================
   * RETURN
   * =========================================================== */

  return {


    /* ---------------------------------------------------------
     * DONNÉES
     * --------------------------------------------------------- */

    homeworks:
      filteredHomeworks,


    classrooms,


    subjects,


    terms,


    /* ---------------------------------------------------------
     * FORMULAIRE
     * --------------------------------------------------------- */

    form,


    setForm,


    /* ---------------------------------------------------------
     * FILTRES
     * --------------------------------------------------------- */

    filters,


    setFilters,


    /* ---------------------------------------------------------
     * SUMMARY
     * --------------------------------------------------------- */

    summary,


    /* ---------------------------------------------------------
     * ÉTATS
     * --------------------------------------------------------- */

    loading,


    submitting,


    error,


    editingHomework,


    /* ---------------------------------------------------------
     * ACTIONS
     * --------------------------------------------------------- */

    editHomework,


    saveHomework,


    deleteHomework,


    resetForm,


    closeEdition,


    reload:
      loadData,

  };

}