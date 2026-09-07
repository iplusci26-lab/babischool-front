"use client";

import { toast } from "sonner";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Lock,
  Save,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";

import { api } from "@/lib/api";


type TabType =
  | "assessment"
  | "homework";


export default function GradesPage() {

  // ==========================================================
  // ONGLET ACTIF
  // ==========================================================

  const [
    activeTab,
    setActiveTab,
  ] = useState<TabType>(
    "assessment"
  );


  // ==========================================================
  // ÉVALUATIONS
  // ==========================================================

  const [
    assessments,
    setAssessments,
  ] = useState<any[]>(
    []
  );

  const [
    selected,
    setSelected,
  ] = useState("");

  const [
    assessment,
    setAssessment,
  ] = useState<any | null>(
    null
  );


  // ==========================================================
  // EXERCICES
  // ==========================================================

  const [
    homeworks,
    setHomeworks,
  ] = useState<any[]>(
    []
  );

  const [
    selectedHomework,
    setSelectedHomework,
  ] = useState("");

  const [
    homework,
    setHomework,
  ] = useState<any | null>(
    null
  );

  const [
    homeworkSubmissions,
    setHomeworkSubmissions,
  ] = useState<any[]>(
    []
  );


  // ==========================================================
  // PÉRIODES
  // ==========================================================

  const [
    terms,
    setTerms,
  ] = useState<any[]>(
    []
  );

  const [
    termFilter,
    setTermFilter,
  ] = useState("");


  // ==========================================================
  // NOTES ÉVALUATIONS
  // ==========================================================

  const [
    grades,
    setGrades,
  ] = useState<any[]>(
    []
  );

  const [
    statistics,
    setStatistics,
  ] = useState<any | null>(
    null
  );


  // ==========================================================
  // LOADING
  // ==========================================================

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    publishing,
    setPublishing,
  ] = useState(false);

  const [
    homeworkLoading,
    setHomeworkLoading,
  ] = useState(false);

  const [
    homeworkSaving,
    setHomeworkSaving,
  ] = useState(false);


  // ==========================================================
  // FILTRES ÉVALUATIONS
  // ==========================================================

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    classroomFilter,
    setClassroomFilter,
  ] = useState("");

  const [
    subjectFilter,
    setSubjectFilter,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("");


  // ==========================================================
  // FILTRES EXERCICES
  // ==========================================================

  const [
    homeworkSearch,
    setHomeworkSearch,
  ] = useState("");

  const [
    homeworkTermFilter,
    setHomeworkTermFilter,
  ] = useState("");

  const [
    homeworkClassroomFilter,
    setHomeworkClassroomFilter,
  ] = useState("");

  const [
    homeworkSubjectFilter,
    setHomeworkSubjectFilter,
  ] = useState("");


  // ==========================================================
  // INPUTS
  // ==========================================================

  const inputRefs =
    useRef<
      (HTMLInputElement | null)[]
    >([]);

  const homeworkInputRefs =
    useRef<
      (HTMLInputElement | null)[]
    >([]);


  // ==========================================================
  // FORMATAGE DATE
  // ==========================================================

  function formatDate(
    date:
      | string
      | null
      | undefined
  ) {

    if (!date) {
      return "Date inconnue";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Date inconnue";
    }

    return new Intl.DateTimeFormat(
      "fr-FR",
      {
        day:
          "2-digit",

        month:
          "2-digit",

        year:
          "numeric",

        hour:
          "2-digit",

        minute:
          "2-digit",
      }
    ).format(
      parsedDate
    );
  }


  // ==========================================================
  // CHARGER LES PÉRIODES
  // ==========================================================

  const loadTerms =
    async () => {

      try {

        const res =
          await api.get(
            "/academics/terms/"
          );

        const data =
          res.data?.results ||
          res.data ||
          [];

        setTerms(
          Array.isArray(
            data
          )
            ? data
            : []
        );

      } catch (
        error
      ) {

        console.error(
          "Erreur chargement des périodes :",
          error
        );

        toast.error(
          "Impossible de charger les périodes."
        );

      }

    };


  // ==========================================================
  // CHARGER LES ÉVALUATIONS
  // ==========================================================

  const loadAssessments =
    async () => {

      try {

        const res =
          await api.get(
            "/academics/assessments/"
          );

        const data =
          res.data?.results ||
          res.data ||
          [];

        setAssessments(
          Array.isArray(
            data
          )
            ? data
            : []
        );

      } catch (
        error
      ) {

        console.error(
          "Erreur chargement évaluations :",
          error
        );

        toast.error(
          "Impossible de charger les évaluations."
        );

      }

    };


  // ==========================================================
  // CHARGER LES EXERCICES
  // ==========================================================

  const loadHomeworks =
    async () => {

      try {

        const res =
          await api.get(
            "/homework/"
          );

        const data =
          res.data?.results ||
          res.data ||
          [];

        setHomeworks(
          Array.isArray(
            data
          )
            ? data
            : []
        );

      } catch (
        error
      ) {

        console.error(
          "Erreur chargement exercices :",
          error
        );

        toast.error(
          "Impossible de charger les exercices."
        );

      }

    };


  // ==========================================================
  // CHARGER LES NOTES D'UNE ÉVALUATION
  // ==========================================================

  const loadGrades =
    async (
      assessmentId: string
    ) => {

      if (
        !assessmentId
      ) {

        setAssessment(
          null
        );

        setStatistics(
          null
        );

        setGrades(
          []
        );

        return;

      }

      try {

        setLoading(
          true
        );

        const url =
          `/academics/assessments/${assessmentId}/grades/`;

        const res =
          await api.get(
            url
          );

        setAssessment(
          res.data?.assessment ??
            null
        );

        setStatistics(
          res.data?.statistics ??
            null
        );

        setGrades(
          Array.isArray(
            res.data?.students
          )
            ? res.data.students
            : []
        );

      } catch (
        error: any
      ) {

        console.error(
          "Erreur chargement notes :",
          error
        );

        toast.error(
          error?.response?.data?.detail ||
            "Impossible de charger les notes."
        );

      } finally {

        setLoading(
          false
        );

      }

    };


  // ==========================================================
  // CHARGER LES SOUMISSIONS D'UN EXERCICE
  // ==========================================================

  const loadHomeworkSubmissions =
    async (
      homeworkId: string
    ) => {

      if (
        !homeworkId
      ) {

        setHomework(
          null
        );

        setHomeworkSubmissions(
          []
        );

        return;

      }

      try {

        setHomeworkLoading(
          true
        );

        const selectedItem =
          homeworks.find(
            (
              item
            ) =>
              String(
                item.id
              ) ===
              String(
                homeworkId
              )
          );

        setHomework(
          selectedItem ||
            null
        );

        const res =
          await api.get(
            `/homework/${homeworkId}/submissions/`
          );

        const data =
          res.data?.results ||
          res.data ||
          [];

        setHomeworkSubmissions(
          Array.isArray(
            data
          )
            ? data.map(
                (
                  item: any
                ) => ({

                  ...item,

                  score:
                    item.score ===
                      null ||
                    item.score ===
                      undefined
                      ? ""
                      : item.score,

                  max_score:
                    item.max_score ??
                    20,

                })
              )
            : []
        );

      } catch (
        error: any
      ) {

        console.error(
          "Erreur chargement exercice :",
          error
        );

        toast.error(
          error?.response?.data?.detail ||
            "Impossible de charger les élèves de cet exercice."
        );

      } finally {

        setHomeworkLoading(
          false
        );

      }

    };


  // ==========================================================
  // INITIALISATION
  // ==========================================================

  useEffect(
    () => {

      loadAssessments();

      loadTerms();

      loadHomeworks();

    },
    []
  );


  // ==========================================================
  // FILTRES DISPONIBLES ÉVALUATIONS
  // ==========================================================

  const classrooms =
    useMemo(
      () => {

        return Array.from(
          new Set(
            assessments
              .map(
                (
                  item
                ) =>
                  item.classroom_name
              )
              .filter(
                Boolean
              )
          )
        );

      },
      [
        assessments
      ]
    );


  const subjects =
    useMemo(
      () => {

        return Array.from(
          new Set(
            assessments
              .map(
                (
                  item
                ) =>
                  item.subject_name
              )
              .filter(
                Boolean
              )
          )
        );

      },
      [
        assessments
      ]
    );


  // ==========================================================
  // FILTRES DISPONIBLES EXERCICES
  // ==========================================================

  const homeworkClassrooms =
    useMemo(
      () => {

        return Array.from(
          new Set(
            homeworks
              .map(
                (
                  item
                ) =>
                  item.classroom_name
              )
              .filter(
                Boolean
              )
          )
        );

      },
      [
        homeworks
      ]
    );


  const homeworkSubjects =
    useMemo(
      () => {

        return Array.from(
          new Set(
            homeworks
              .map(
                (
                  item
                ) =>
                  item.subject_name
              )
              .filter(
                Boolean
              )
          )
        );

      },
      [
        homeworks
      ]
    );


  // ==========================================================
  // ÉVALUATIONS FILTRÉES
  // ==========================================================

  const filteredAssessments =
    useMemo(
      () => {

        return assessments.filter(
          (
            item
          ) => {

            const normalizedSearch =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !normalizedSearch ||

              item.title
                ?.toLowerCase()
                .includes(
                  normalizedSearch
                ) ||

              item.subject_name
                ?.toLowerCase()
                .includes(
                  normalizedSearch
                ) ||

              item.classroom_name
                ?.toLowerCase()
                .includes(
                  normalizedSearch
                );


            const matchesTerm =
              !termFilter ||

              String(
                item.term
              ) ===
                String(
                  termFilter
                );


            const matchesClassroom =
              !classroomFilter ||

              item.classroom_name ===
                classroomFilter;


            const matchesSubject =
              !subjectFilter ||

              item.subject_name ===
                subjectFilter;


            const matchesStatus =
              !statusFilter ||

              item.status ===
                statusFilter;


            return (

              matchesSearch &&

              matchesTerm &&

              matchesClassroom &&

              matchesSubject &&

              matchesStatus

            );

          }
        );

      },
      [

        assessments,

        search,

        termFilter,

        classroomFilter,

        subjectFilter,

        statusFilter,

      ]
    );


  // ==========================================================
  // EXERCICES FILTRÉS
  // ==========================================================

  const filteredHomeworks =
    useMemo(
      () => {

        return homeworks.filter(
          (
            item
          ) => {

            const normalizedSearch =
              homeworkSearch
                .trim()
                .toLowerCase();


            const matchesSearch =
              !normalizedSearch ||

              item.title
                ?.toLowerCase()
                .includes(
                  normalizedSearch
                ) ||

              item.description
                ?.toLowerCase()
                .includes(
                  normalizedSearch
                ) ||

              item.subject_name
                ?.toLowerCase()
                .includes(
                  normalizedSearch
                ) ||

              item.classroom_name
                ?.toLowerCase()
                .includes(
                  normalizedSearch
                );


            // -----------------------------------------------
            // PÉRIODE
            // -----------------------------------------------

            const homeworkTermId =
              item.academic_term_id ??
              item.academic_term ??
              item.term;


            const matchesTerm =
              !homeworkTermFilter ||

              String(
                homeworkTermId
              ) ===
                String(
                  homeworkTermFilter
                );


            // -----------------------------------------------
            // CLASSE
            // -----------------------------------------------

            const matchesClassroom =
              !homeworkClassroomFilter ||

              item.classroom_name ===
                homeworkClassroomFilter;


            // -----------------------------------------------
            // MATIÈRE
            // -----------------------------------------------

            const matchesSubject =
              !homeworkSubjectFilter ||

              item.subject_name ===
                homeworkSubjectFilter;


            return (

              matchesSearch &&

              matchesTerm &&

              matchesClassroom &&

              matchesSubject

            );

          }
        );

      },
      [

        homeworks,

        homeworkSearch,

        homeworkTermFilter,

        homeworkClassroomFilter,

        homeworkSubjectFilter,

      ]
    );


  // ==========================================================
  // RÉINITIALISER FILTRES ÉVALUATIONS
  // ==========================================================

  const resetFilters =
    () => {

      setSearch(
        ""
      );

      setTermFilter(
        ""
      );

      setClassroomFilter(
        ""
      );

      setSubjectFilter(
        ""
      );

      setStatusFilter(
        ""
      );

    };


  const hasFilters =

    Boolean(
      search
    ) ||

    Boolean(
      termFilter
    ) ||

    Boolean(
      classroomFilter
    ) ||

    Boolean(
      subjectFilter
    ) ||

    Boolean(
      statusFilter
    );


  // ==========================================================
  // RÉINITIALISER FILTRES EXERCICES
  // ==========================================================

  const resetHomeworkFilters =
    () => {

      setHomeworkSearch(
        ""
      );

      setHomeworkTermFilter(
        ""
      );

      setHomeworkClassroomFilter(
        ""
      );

      setHomeworkSubjectFilter(
        ""
      );

    };


  const hasHomeworkFilters =

    Boolean(
      homeworkSearch
    ) ||

    Boolean(
      homeworkTermFilter
    ) ||

    Boolean(
      homeworkClassroomFilter
    ) ||

    Boolean(
      homeworkSubjectFilter
    );


  // ==========================================================
  // MODIFICATION D'UNE NOTE ÉVALUATION
  // ==========================================================

  const updateScore =
    (
      enrollmentId: string,
      score: string
    ) => {

      if (
        assessment?.is_locked ||
        assessment?.can_edit === false
      ) {

        toast.error(
          "Cette évaluation est publiée. Les notes ne sont plus modifiables."
        );

        return;

      }

      setGrades(
        (
          prev
        ) =>
          prev.map(
            (
              grade
            ) =>
              grade.enrollment_id ===
              enrollmentId
                ? {

                    ...grade,

                    score,

                  }
                : grade
          )
      );

    };


  // ==========================================================
  // MODIFICATION NOTE EXERCICE
  // ==========================================================

  const updateHomeworkScore =
    (
      studentId: string,
      score: string
    ) => {

      setHomeworkSubmissions(
        (
          prev
        ) =>
          prev.map(
            (
              submission
            ) =>
              submission.student_id ===
              studentId
                ? {

                    ...submission,

                    score,

                    status:
                      score !== ""
                        ? "submitted"
                        : "missing",

                  }
                : submission
          )
      );

    };


  // ==========================================================
  // ENREGISTRER NOTES ÉVALUATION
  // ==========================================================

  const save =
    async () => {

      if (
        !selected
      ) {

        toast.error(
          "Veuillez sélectionner une évaluation."
        );

        return;

      }

      if (
        assessment?.is_locked ||
        assessment?.can_edit === false
      ) {

        toast.error(
          "Cette évaluation est publiée. Les notes ne sont plus modifiables."
        );

        return;

      }

      try {

        setSaving(
          true
        );

        await api.post(
          `/academics/assessments/${selected}/grades/`,
          {

            grades,

          }
        );

        await loadGrades(
          selected
        );

        await loadAssessments();

        toast.success(
          "Notes enregistrées avec succès."
        );

      } catch (
        error: any
      ) {

        console.error(
          error
        );

        const detail =
          error?.response?.data?.detail;


        if (
          error?.response?.data?.code ===
          "assessment_locked"
        ) {

          toast.error(
            detail ||
              "Cette évaluation est publiée. Les notes ne sont plus modifiables."
          );

          await loadGrades(
            selected
          );

          return;

        }


        toast.error(
          detail ||
            "Une erreur est survenue lors de l'enregistrement."
        );

      } finally {

        setSaving(
          false
        );

      }

    };


  // ==========================================================
  // ENREGISTRER NOTES EXERCICE
  // ==========================================================

  const saveHomework =
    async () => {

      if (
        !selectedHomework
      ) {

        toast.error(
          "Veuillez sélectionner un exercice."
        );

        return;

      }

      try {

        setHomeworkSaving(
          true
        );

        for (
          const submission of
          homeworkSubmissions
        ) {

          const score =
            submission.score;


          const hasScore =

            score !== "" &&

            score !== null &&

            score !== undefined;


          await api.post(
            `/homework/${selectedHomework}/submissions/`,
            {

              student_id:
                submission.student_id,

              score:
                hasScore
                  ? Number(
                      score
                    )
                  : null,

              max_score:
                submission.max_score ||
                20,

              status:
                hasScore
                  ? "submitted"
                  : "missing",

              teacher_comment:
                submission.teacher_comment ||
                "",

            }
          );

        }


        await loadHomeworkSubmissions(
          selectedHomework
        );

        await loadHomeworks();

        toast.success(
          "Notes des exercices enregistrées avec succès."
        );

      } catch (
        error: any
      ) {

        console.error(
          "Erreur enregistrement exercice :",
          error
        );

        toast.error(
          error?.response?.data?.detail ||
            "Impossible d'enregistrer les notes de l'exercice."
        );

      } finally {

        setHomeworkSaving(
          false
        );

      }

    };


  // ==========================================================
  // PUBLIER
  // ==========================================================

  const publish =
    async () => {

      if (
        !selected
      ) {

        toast.error(
          "Veuillez sélectionner une évaluation."
        );

        return;

      }

      if (
        assessment?.is_locked ||
        assessment?.can_publish === false
      ) {

        toast.error(
          "Cette évaluation ne peut plus être publiée."
        );

        return;

      }

      try {

        setPublishing(
          true
        );

        await api.post(
          `/academics/assessments/${selected}/publish/`
        );

        await loadGrades(
          selected
        );

        await loadAssessments();

        toast.success(
          "Évaluation publiée avec succès. Les notes sont maintenant verrouillées."
        );

      } catch (
        error: any
      ) {

        console.error(
          error
        );

        toast.error(
          error?.response?.data?.detail ||
            "Impossible de publier cette évaluation."
        );

      } finally {

        setPublishing(
          false
        );

      }

    };


  // ==========================================================
  // PROGRESSION ÉVALUATION
  // ==========================================================

  const progress =

    statistics &&
    statistics.total_students >
      0

      ? Math.round(
          (
            statistics.total_grades /
            statistics.total_students
          ) *
            100
        )

      : 0;


  // ==========================================================
  // PROGRESSION EXERCICE
  // ==========================================================

  const homeworkTotalStudents =
    homeworkSubmissions.length;


  const homeworkGradedStudents =
    homeworkSubmissions.filter(
      (
        item
      ) =>
        item.score !== "" &&
        item.score !== null &&
        item.score !== undefined
    ).length;


  const homeworkMissingStudents =

    homeworkTotalStudents -
    homeworkGradedStudents;


  const homeworkProgress =

    homeworkTotalStudents >
      0

      ? Math.round(
          (
            homeworkGradedStudents /
            homeworkTotalStudents
          ) *
            100
        )

      : 0;


  // ==========================================================
  // COULEURS DES STATUTS
  // ==========================================================

  const statusColors:
    Record<
      string,
      string
    > = {

      draft:
        "bg-gray-100 text-gray-700",

      in_progress:
        "bg-orange-100 text-orange-700",

      ready:
        "bg-blue-100 text-blue-700",

      published:
        "bg-green-100 text-green-700",

      republish_required:
        "bg-red-100 text-red-700",

    };


  // ==========================================================
  // LIBELLÉS DES STATUTS
  // ==========================================================

  const statusLabels:
    Record<
      string,
      string
    > = {

      draft:
        "Brouillon",

      in_progress:
        "En cours",

      ready:
        "Prête",

      published:
        "Publiée",

      republish_required:
        "Republication requise",

    };


  // ==========================================================
  // STATUTS EXERCICES
  // ==========================================================

  const homeworkStatusLabels:
    Record<
      string,
      string
    > = {

      missing:
        "À rendre",

      submitted:
        "Rendu",

      late:
        "Rendu en retard",

    };


  const homeworkStatusColors:
    Record<
      string,
      string
    > = {

      missing:
        "bg-orange-100 text-orange-700",

      submitted:
        "bg-green-100 text-green-700",

      late:
        "bg-red-100 text-red-700",

    };


  // ==========================================================
  // COULEUR D'UNE NOTE
  // ==========================================================

  const getScoreColor =
    (
      score:
        | number
        | null,

      maxScore?: number
    ) => {

      if (
        score === null ||
        score === undefined ||
        Number.isNaN(
          score
        )
      ) {

        return "";

      }

      const max =

        Number(
          maxScore ||
          assessment?.max_score
        ) ||

        20;


      const percent =
        (
          score /
          max
        ) *
        100;


      if (
        percent >=
        70
      ) {

        return "text-green-600";

      }


      if (
        percent >=
        50
      ) {

        return "text-orange-500";

      }


      return "text-red-600";

    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="min-h-screen space-y-6 bg-gray-50 p-6">


      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div>

        <h1 className="text-3xl font-bold text-gray-900">

          Gestion des notes

        </h1>

        <p className="mt-1 text-gray-500">

          Saisissez les notes des évaluations
          et des exercices.

        </p>

      </div>


      {/* ================================================== */}
      {/* TABS */}
      {/* ================================================== */}

      <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">


          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "assessment"
              )
            }
            className={`flex items-center justify-center gap-3 rounded-xl px-5 py-4 font-semibold transition ${
              activeTab ===
              "assessment"
                ? "bg-[#6214BE] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >

            <ClipboardCheck
              size={20}
            />

            Noter une évaluation

          </button>


          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "homework"
              )
            }
            className={`flex items-center justify-center gap-3 rounded-xl px-5 py-4 font-semibold transition ${
              activeTab ===
              "homework"
                ? "bg-[#6214BE] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >

            <BookOpen
              size={20}
            />

            Noter un exercice

          </button>

        </div>

      </div>


      {/* ================================================== */}
      {/* ONGLET ÉVALUATIONS */}
      {/* ================================================== */}

      {activeTab ===
        "assessment" && (

          <>


            {/* FILTRES */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                <div>

                  <h2 className="text-lg font-semibold text-gray-900">

                    Rechercher une évaluation

                  </h2>

                  <p className="mt-1 text-sm text-gray-500">

                    Filtrez les évaluations par période,
                    classe, matière ou statut.

                  </p>

                </div>


                {hasFilters && (

                  <button
                    type="button"
                    onClick={
                      resetFilters
                    }
                    className="flex items-center gap-2 self-start rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                  >

                    <X
                      size={16}
                    />

                    Réinitialiser

                  </button>

                )}

              </div>


              <div className="grid gap-4 lg:grid-cols-5">


                <div className="relative lg:col-span-2">

                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={
                      search
                    }
                    onChange={(
                      e
                    ) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="Rechercher une évaluation..."
                    className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 outline-none transition focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
                  />

                </div>


                <select
                  value={
                    termFilter
                  }
                  onChange={(
                    e
                  ) =>
                    setTermFilter(
                      e.target.value
                    )
                  }
                  className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
                >

                  <option value="">

                    Toutes les périodes

                  </option>


                  {terms.map(
                    (
                      term
                    ) => (

                      <option
                        key={
                          term.id
                        }
                        value={
                          term.id
                        }
                      >

                        {
                          term.name
                        }

                      </option>

                    )
                  )}

                </select>


                <select
                  value={
                    classroomFilter
                  }
                  onChange={(
                    e
                  ) =>
                    setClassroomFilter(
                      e.target.value
                    )
                  }
                  className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
                >

                  <option value="">

                    Toutes les classes

                  </option>


                  {classrooms.map(
                    (
                      classroom
                    ) => (

                      <option
                        key={
                          classroom
                        }
                        value={
                          classroom
                        }
                      >

                        {
                          classroom
                        }

                      </option>

                    )
                  )}

                </select>


                <select
                  value={
                    subjectFilter
                  }
                  onChange={(
                    e
                  ) =>
                    setSubjectFilter(
                      e.target.value
                    )
                  }
                  className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
                >

                  <option value="">

                    Toutes les matières

                  </option>


                  {subjects.map(
                    (
                      subject
                    ) => (

                      <option
                        key={
                          subject
                        }
                        value={
                          subject
                        }
                      >

                        {
                          subject
                        }

                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <select
                  value={
                    statusFilter
                  }
                  onChange={(
                    e
                  ) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20 sm:w-64"
                >

                  <option value="">

                    Tous les statuts

                  </option>

                  <option value="draft">

                    Brouillon

                  </option>

                  <option value="in_progress">

                    En cours

                  </option>

                  <option value="ready">

                    Prête

                  </option>

                  <option value="published">

                    Publiée

                  </option>

                  <option value="republish_required">

                    Republication requise

                  </option>

                </select>


                <p className="text-sm text-gray-500">

                  <span className="font-semibold text-gray-900">

                    {
                      filteredAssessments.length
                    }

                  </span>

                  {" "}

                  évaluation
                  {filteredAssessments.length !==
                    1
                    ? "s"
                    : ""}

                </p>

              </div>

            </div>


            {/* CHOIX ÉVALUATION */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <label className="mb-3 block text-sm font-medium text-gray-700">

                Choisir une évaluation

              </label>


              <select
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
                value={
                  selected
                }
                onChange={(
                  e
                ) => {

                  const value =
                    e.target.value;

                  setSelected(
                    value
                  );

                  loadGrades(
                    value
                  );

                }}
              >

                <option value="">

                  Sélectionner une évaluation

                </option>


                {filteredAssessments.map(
                  (
                    item
                  ) => (

                    <option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >

                      {
                        item.subject_name
                      }

                      {" • "}

                      {
                        item.classroom_name
                      }

                      {" • "}

                      {
                        item.term_name
                      }

                      {" • "}

                      {formatDate(
                        item.date_assessment
                      )}

                    </option>

                  )
                )}

              </select>

            </div>


            {loading && (

              <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">

                Chargement des notes...

              </div>

            )}


            {!loading &&
              assessment && (

                <>

                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-2xl font-semibold text-gray-900">

                            {
                              assessment.title
                            }

                          </h2>


                          {assessment.is_locked && (

                            <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                              <Lock
                                size={14}
                              />

                              Notes verrouillées

                            </span>

                          )}

                        </div>


                        <p className="mt-2 text-gray-500">

                          {
                            assessment.subject_name
                          }

                          {" • "}

                          {
                            assessment.classroom_name
                          }

                          {" • "}

                          {formatDate(
                            assessment.date_assessment
                          )}

                        </p>

                      </div>


                      <span
                        className={`self-start rounded-full px-4 py-2 text-sm font-semibold ${
                          statusColors[
                            assessment.status
                          ] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >

                        {assessment.status_label ||
                          statusLabels[
                            assessment.status
                          ] ||
                          assessment.status}

                      </span>

                    </div>


                    <div className="mt-8">

                      <div className="mb-2 flex justify-between text-sm text-gray-600">

                        <span>

                          Progression

                        </span>

                        <span className="font-semibold">

                          {
                            progress
                          }
                          %

                        </span>

                      </div>


                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">

                        <div
                          className="h-full rounded-full bg-[#6214BE] transition-all duration-500"
                          style={{
                            width:
                              `${progress}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>


                  {statistics && (

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


                      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="flex items-center gap-4">

                          <Users className="h-10 w-10 text-[#6214BE]" />

                          <div>

                            <div className="text-3xl font-bold">

                              {
                                statistics.total_students
                              }

                            </div>

                            <div className="text-sm text-gray-500">

                              Élèves

                            </div>

                          </div>

                        </div>

                      </div>


                      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="flex items-center gap-4">

                          <CheckCircle2 className="h-10 w-10 text-green-600" />

                          <div>

                            <div className="text-3xl font-bold">

                              {
                                statistics.total_grades
                              }

                            </div>

                            <div className="text-sm text-gray-500">

                              Notes saisies

                            </div>

                          </div>

                        </div>

                      </div>


                      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="flex items-center gap-4">

                          <BookOpen className="h-10 w-10 text-orange-500" />

                          <div>

                            <div className="text-3xl font-bold">

                              {
                                statistics.missing_grades
                              }

                            </div>

                            <div className="text-sm text-gray-500">

                              Notes restantes

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  )}


                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                    <div className="border-b bg-gray-50 px-6 py-4">

                      <h3 className="text-lg font-semibold">

                        Saisie des notes

                      </h3>

                      <p className="mt-1 text-sm text-gray-500">

                        Saisissez les notes des élèves.

                      </p>

                    </div>


                    <div className="overflow-x-auto">

                      <table className="min-w-full">

                        <thead className="bg-gray-50">

                          <tr>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">

                              Matricule

                            </th>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">

                              Élève

                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">

                              Note

                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {grades.map(
                            (
                              grade,
                              index
                            ) => {

                              const numericScore =

                                grade.score ===
                                  null ||

                                grade.score ===
                                  undefined ||

                                grade.score ===
                                  ""

                                  ? null

                                  : Number(
                                      grade.score
                                    );


                              return (

                                <tr
                                  key={
                                    grade.enrollment_id
                                  }
                                  className="border-t hover:bg-gray-50"
                                >

                                  <td className="px-6 py-4 text-gray-700">

                                    {
                                      grade.student_number
                                    }

                                  </td>


                                  <td className="px-6 py-4 font-medium text-gray-900">

                                    {
                                      grade.student_name
                                    }

                                  </td>


                                  <td className="px-6 py-4 text-center">

                                    <input
                                      ref={(
                                        el
                                      ) => {

                                        inputRefs.current[
                                          index
                                        ] =
                                          el;

                                      }}
                                      type="number"
                                      min={0}
                                      max={
                                        assessment.max_score
                                      }
                                      step="0.01"
                                      value={
                                        grade.score ??
                                        ""
                                      }
                                      placeholder="-"
                                      disabled={
                                        assessment.is_locked
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateScore(
                                          grade.enrollment_id,
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(
                                        e
                                      ) => {

                                        if (
                                          e.key ===
                                          "Enter"
                                        ) {

                                          e.preventDefault();

                                          inputRefs.current[
                                            index +
                                              1
                                          ]?.focus();

                                        }

                                      }}
                                      className={`w-24 rounded-lg border px-3 py-2 text-center font-bold outline-none ${
                                        getScoreColor(
                                          numericScore
                                        )
                                      }`}
                                    />

                                  </td>

                                </tr>

                              );

                            }
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>


                  {grades.length >
                    0 && (

                    <div className="flex justify-end gap-3">


                      {!assessment.is_locked && (

                        <button
                          onClick={
                            save
                          }
                          disabled={
                            saving
                          }
                          className="flex items-center gap-2 rounded-xl bg-[#6214BE] px-6 py-3 text-white transition hover:bg-[#4e10a0]"
                        >

                          <Save
                            size={20}
                          />

                          {saving
                            ? "Enregistrement..."
                            : "Enregistrer"}

                        </button>

                      )}


                      {!assessment.is_locked &&
                        assessment.can_publish && (

                          <button
                            onClick={
                              publish
                            }
                            disabled={
                              publishing
                            }
                            className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
                          >

                            <Send
                              size={20}
                            />

                            {publishing
                              ? "Publication..."
                              : "Publier"}

                          </button>

                        )}

                    </div>

                  )}

                </>

              )}

          </>

        )}


      {/* ================================================== */}
      {/* ONGLET EXERCICES */}
      {/* ================================================== */}

      {activeTab ===
        "homework" && (

          <>


            {/* FILTRES */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <div>

                  <h2 className="text-lg font-semibold text-gray-900">

                    Rechercher un exercice

                  </h2>

                  <p className="mt-1 text-sm text-gray-500">

                    Filtrez les exercices par période,
                    classe ou matière.

                  </p>

                </div>


                {hasHomeworkFilters && (

                  <button
                    type="button"
                    onClick={
                      resetHomeworkFilters
                    }
                    className="flex items-center gap-2 self-start rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                  >

                    <X
                      size={16}
                    />

                    Réinitialiser

                  </button>

                )}

              </div>


              <div className="grid gap-4 md:grid-cols-4">


                {/* RECHERCHE */}

                <div className="relative">

                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={
                      homeworkSearch
                    }
                    onChange={(
                      e
                    ) =>
                      setHomeworkSearch(
                        e.target.value
                      )
                    }
                    placeholder="Rechercher un exercice..."
                    className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
                  />

                </div>


                {/* PÉRIODE */}

                <select
                  value={
                    homeworkTermFilter
                  }
                  onChange={(
                    e
                  ) =>
                    setHomeworkTermFilter(
                      e.target.value
                    )
                  }
                  className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
                >

                  <option value="">

                    Toutes les périodes

                  </option>


                  {terms.map(
                    (
                      term
                    ) => (

                      <option
                        key={
                          term.id
                        }
                        value={
                          term.id
                        }
                      >

                        {
                          term.name
                        }

                      </option>

                    )
                  )}

                </select>


                {/* CLASSE */}

                <select
                  value={
                    homeworkClassroomFilter
                  }
                  onChange={(
                    e
                  ) =>
                    setHomeworkClassroomFilter(
                      e.target.value
                    )
                  }
                  className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
                >

                  <option value="">

                    Toutes les classes

                  </option>


                  {homeworkClassrooms.map(
                    (
                      classroom
                    ) => (

                      <option
                        key={
                          classroom
                        }
                        value={
                          classroom
                        }
                      >

                        {
                          classroom
                        }

                      </option>

                    )
                  )}

                </select>


                {/* MATIÈRE */}

                <select
                  value={
                    homeworkSubjectFilter
                  }
                  onChange={(
                    e
                  ) =>
                    setHomeworkSubjectFilter(
                      e.target.value
                    )
                  }
                  className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
                >

                  <option value="">

                    Toutes les matières

                  </option>


                  {homeworkSubjects.map(
                    (
                      subject
                    ) => (

                      <option
                        key={
                          subject
                        }
                        value={
                          subject
                        }
                      >

                        {
                          subject
                        }

                      </option>

                    )
                  )}

                </select>

              </div>

            </div>


            {/* SÉLECTION EXERCICE */}

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <label className="mb-3 block text-sm font-medium text-gray-700">

                Choisir un exercice

              </label>


              <select
                value={
                  selectedHomework
                }
                onChange={(
                  e
                ) => {

                  const value =
                    e.target.value;

                  setSelectedHomework(
                    value
                  );

                  loadHomeworkSubmissions(
                    value
                  );

                }}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
              >

                <option value="">

                  Sélectionner un exercice

                </option>


                {filteredHomeworks.map(
                  (
                    item
                  ) => (

                    <option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >

                      {
                        item.title
                      }

                      {" • "}

                      {
                        item.subject_name
                      }

                      {" • "}

                      {
                        item.classroom_name
                      }

                      {" • "}

                      {
                        item.academic_term_name ||
                        item.term_name
                      }

                      {" • Date limite : "}

                      {
                        item.due_date
                      }

                    </option>

                  )
                )}

              </select>


              {filteredHomeworks.length ===
                0 && (

                <p className="mt-3 text-sm text-orange-600">

                  Aucun exercice ne correspond aux
                  filtres sélectionnés.

                </p>

              )}

            </div>


            {/* LOADING */}

            {homeworkLoading && (

              <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">

                Chargement des exercices...

              </div>

            )}


            {/* INFORMATIONS EXERCICE */}

            {!homeworkLoading &&
              homework && (

                <>


                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                      <div>

                        <h2 className="text-2xl font-semibold text-gray-900">

                          {
                            homework.title
                          }

                        </h2>


                        <p className="mt-2 text-gray-500">

                          {
                            homework.subject_name
                          }

                          {" • "}

                          {
                            homework.classroom_name
                          }


                          {(homework.academic_term_name ||
                            homework.term_name) && (

                            <>
                              {" • "}

                              {
                                homework.academic_term_name ||
                                homework.term_name
                              }
                            </>

                          )}


                          {homework.classroom_group_name && (

                            <>
                              {" • Groupe : "}

                              {
                                homework.classroom_group_name
                              }
                            </>

                          )}

                        </p>


                        {homework.description && (

                          <p className="mt-4 text-sm text-gray-600">

                            {
                              homework.description
                            }

                          </p>

                        )}

                      </div>


                      <div className="rounded-xl bg-purple-50 px-4 py-3 text-sm text-[#6214BE]">

                        <span className="font-semibold">

                          Date limite :

                        </span>

                        {" "}

                        {
                          homework.due_date
                        }

                      </div>

                    </div>


                    {/* PROGRESSION */}

                    <div className="mt-8">

                      <div className="mb-2 flex justify-between text-sm text-gray-600">

                        <span>

                          Progression de la notation

                        </span>

                        <span className="font-semibold">

                          {
                            homeworkProgress
                          }
                          %

                        </span>

                      </div>


                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">

                        <div
                          className="h-full rounded-full bg-[#6214BE] transition-all duration-500"
                          style={{
                            width:
                              `${homeworkProgress}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>


                  {/* STATISTIQUES */}

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                      <div className="flex items-center gap-4">

                        <Users className="h-10 w-10 text-[#6214BE]" />

                        <div>

                          <div className="text-3xl font-bold">

                            {
                              homeworkTotalStudents
                            }

                          </div>

                          <div className="text-sm text-gray-500">

                            Élèves concernés

                          </div>

                        </div>

                      </div>

                    </div>


                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                      <div className="flex items-center gap-4">

                        <CheckCircle2 className="h-10 w-10 text-green-600" />

                        <div>

                          <div className="text-3xl font-bold">

                            {
                              homeworkGradedStudents
                            }

                          </div>

                          <div className="text-sm text-gray-500">

                            Exercices notés

                          </div>

                        </div>

                      </div>

                    </div>


                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                      <div className="flex items-center gap-4">

                        <BookOpen className="h-10 w-10 text-orange-500" />

                        <div>

                          <div className="text-3xl font-bold">

                            {
                              homeworkMissingStudents
                            }

                          </div>

                          <div className="text-sm text-gray-500">

                            À rendre

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* TABLEAU EXERCICES */}

                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                    <div className="border-b bg-gray-50 px-6 py-4">

                      <h3 className="text-lg font-semibold">

                        Noter les exercices

                      </h3>

                      <p className="mt-1 text-sm text-gray-500">

                        Saisissez la note de chaque élève.
                        Une note enregistrée fait passer
                        automatiquement l'exercice au statut
                        « Rendu ».

                      </p>

                    </div>


                    <div className="overflow-x-auto">

                      <table className="min-w-full">

                        <thead className="bg-gray-50">

                          <tr>

                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">

                              Élève

                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">

                              Note

                            </th>

                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">

                              Statut

                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {homeworkSubmissions.map(
                            (
                              submission,
                              index
                            ) => {

                              const numericScore =

                                submission.score ===
                                  null ||

                                submission.score ===
                                  undefined ||

                                submission.score ===
                                  ""

                                  ? null

                                  : Number(
                                      submission.score
                                    );


                              const currentStatus =

                                submission.score !==
                                  "" &&

                                submission.score !==
                                  null &&

                                submission.score !==
                                  undefined

                                  ? "submitted"

                                  : submission.status ||
                                    "missing";


                              return (

                                <tr
                                  key={
                                    submission.student_id
                                  }
                                  className="border-t transition hover:bg-gray-50"
                                >

                                  <td className="px-6 py-4">

                                    <div className="font-medium text-gray-900">

                                      {
                                        submission.student_name
                                      }

                                    </div>

                                  </td>


                                  <td className="px-6 py-4 text-center">

                                    <div className="flex items-center justify-center gap-2">

                                      <input
                                        ref={(
                                          el
                                        ) => {

                                          homeworkInputRefs.current[
                                            index
                                          ] =
                                            el;

                                        }}
                                        type="number"
                                        min={0}
                                        max={
                                          submission.max_score ||
                                          20
                                        }
                                        step="0.01"
                                        value={
                                          submission.score ??
                                          ""
                                        }
                                        placeholder="-"
                                        onChange={(
                                          e
                                        ) =>
                                          updateHomeworkScore(
                                            submission.student_id,
                                            e.target.value
                                          )
                                        }
                                        onKeyDown={(
                                          e
                                        ) => {

                                          if (
                                            e.key ===
                                            "Enter"
                                          ) {

                                            e.preventDefault();

                                            homeworkInputRefs.current[
                                              index +
                                                1
                                            ]?.focus();

                                          }

                                        }}
                                        className={`w-24 rounded-lg border border-gray-300 px-3 py-2 text-center font-bold outline-none transition focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20 ${getScoreColor(
                                          numericScore,
                                          submission.max_score ||
                                            20
                                        )}`}
                                      />


                                      <span className="text-sm text-gray-500">

                                        /

                                        {" "}

                                        {
                                          submission.max_score ||
                                          20
                                        }

                                      </span>

                                    </div>

                                  </td>


                                  <td className="px-6 py-4 text-center">

                                    <span
                                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                        homeworkStatusColors[
                                          currentStatus
                                        ] ||
                                        "bg-gray-100 text-gray-700"
                                      }`}
                                    >

                                      {homeworkStatusLabels[
                                        currentStatus
                                      ] ||
                                        currentStatus}

                                    </span>

                                  </td>

                                </tr>

                              );

                            }
                          )}


                          {homeworkSubmissions.length ===
                            0 && (

                            <tr>

                              <td
                                colSpan={3}
                                className="py-10 text-center text-gray-500"
                              >

                                Aucun élève concerné par
                                cet exercice.

                              </td>

                            </tr>

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>


                  {/* ACTION */}

                  {homeworkSubmissions.length >
                    0 && (

                    <div className="flex justify-end">

                      <button
                        type="button"
                        onClick={
                          saveHomework
                        }
                        disabled={
                          homeworkSaving
                        }
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#6214BE] px-6 py-3 font-medium text-white transition hover:bg-[#4e10a0] disabled:cursor-not-allowed disabled:bg-gray-400"
                      >

                        <Save
                          size={20}
                        />

                        {homeworkSaving
                          ? "Enregistrement..."
                          : "Enregistrer les notes"}

                      </button>

                    </div>

                  )}

                </>

              )}

          </>

        )}

    </div>

  );

}