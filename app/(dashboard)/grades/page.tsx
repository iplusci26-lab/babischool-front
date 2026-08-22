"use client";

import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  BookOpen,
  CheckCircle2,
  Lock,
  Save,
  Search,
  Send,
  Users,
  X,
} from "lucide-react";

import { api } from "@/lib/api";

export default function GradesPage() {
  // ==========================================================
  // ÉVALUATIONS
  // ==========================================================

  const [assessments, setAssessments] = useState<any[]>([]);

  const [selected, setSelected] = useState("");

  const [assessment, setAssessment] =
    useState<any | null>(null);

  // ==========================================================
  // NOTES
  // ==========================================================

  const [grades, setGrades] = useState<any[]>([]);

  const [statistics, setStatistics] =
    useState<any | null>(null);

  // ==========================================================
  // LOADING
  // ==========================================================

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [publishing, setPublishing] =
    useState(false);

  // ==========================================================
  // FILTRES
  // ==========================================================

  const [search, setSearch] =
    useState("");

  const [termFilter, setTermFilter] =
    useState("");

  const [classroomFilter, setClassroomFilter] =
    useState("");

  const [subjectFilter, setSubjectFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  // ==========================================================
  // INPUTS
  // ==========================================================

  const inputRefs =
    useRef<(HTMLInputElement | null)[]>([]);

  // ==========================================================
  // CHARGER LES ÉVALUATIONS
  // ==========================================================

  const loadAssessments = async () => {
    try {
      const res = await api.get(
        "/academics/assessments/"
      );

      console.log("------------------- ",res.data)
      setAssessments(
        res.data.results || res.data
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible de charger les évaluations."
      );
    }
  };

  // ==========================================================
  // CHARGER LES NOTES
  // ==========================================================

  const loadGrades = async (
    assessmentId: string
  ) => {
    if (!assessmentId) {
      setAssessment(null);
      setStatistics(null);
      setGrades([]);
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(
        `/academics/assessments/${assessmentId}/grades/`
      );

      setAssessment(
        res.data.assessment
      );

      setStatistics(
        res.data.statistics
      );

      setGrades(
        res.data.students || []
      );
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
          "Impossible de charger les notes."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIALISATION
  // ==========================================================

  useEffect(() => {
    loadAssessments();
  }, []);

  // ==========================================================
  // FILTRES DISPONIBLES
  // ==========================================================

  const terms = useMemo(() => {
    return Array.from(
      new Set(
        assessments
          .map(
            (item) =>
              item.term_name
          )
          .filter(Boolean)
      )
    );
  }, [assessments]);

  const classrooms = useMemo(() => {
    return Array.from(
      new Set(
        assessments
          .map(
            (item) =>
              item.classroom_name
          )
          .filter(Boolean)
      )
    );
  }, [assessments]);

  const subjects = useMemo(() => {
    return Array.from(
      new Set(
        assessments
          .map(
            (item) =>
              item.subject_name
          )
          .filter(Boolean)
      )
    );
  }, [assessments]);

  // ==========================================================
  // ÉVALUATIONS FILTRÉES
  // ==========================================================

  const filteredAssessments =
    useMemo(() => {
      return assessments.filter(
        (item) => {
          const matchesSearch =
            !search ||
            item.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            item.subject_name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            item.classroom_name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesTerm =
            !termFilter ||
            item.term_name ===
              termFilter;

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
    }, [
      assessments,
      search,
      termFilter,
      classroomFilter,
      subjectFilter,
      statusFilter,
    ]);

  // ==========================================================
  // RÉINITIALISER LES FILTRES
  // ==========================================================

  const resetFilters = () => {
    setSearch("");
    setTermFilter("");
    setClassroomFilter("");
    setSubjectFilter("");
    setStatusFilter("");
  };

  const hasFilters =
    search ||
    termFilter ||
    classroomFilter ||
    subjectFilter ||
    statusFilter;

  // ==========================================================
  // MODIFICATION D'UNE NOTE
  // ==========================================================

  const updateScore = (
    enrollmentId: string,
    score: string
  ) => {
    // --------------------------------------------------------
    // PROTECTION FRONTEND
    // --------------------------------------------------------

    if (
      assessment?.is_locked ||
      assessment?.can_edit === false
    ) {
      toast.error(
        "Cette évaluation est publiée. Les notes ne sont plus modifiables."
      );

      return;
    }

    setGrades((prev) =>
      prev.map((grade) =>
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
  // ENREGISTRER
  // ==========================================================

  const save = async () => {
    if (!selected) {
      toast.error(
        "Veuillez sélectionner une évaluation."
      );

      return;
    }

    // --------------------------------------------------------
    // VERROUILLAGE
    // --------------------------------------------------------

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
      setSaving(true);

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
    } catch (error: any) {
      console.error(error);

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

        // On recharge l'évaluation
        // pour synchroniser l'interface.
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
      setSaving(false);
    }
  };

  // ==========================================================
  // PUBLIER
  // ==========================================================

  const publish = async () => {
    if (!selected) {
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
      setPublishing(true);

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
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
          "Impossible de publier cette évaluation."
      );
    } finally {
      setPublishing(false);
    }
  };

  // ==========================================================
  // PROGRESSION
  // ==========================================================

  const progress =
    statistics &&
    statistics.total_students > 0
      ? Math.round(
          (statistics.total_grades /
            statistics.total_students) *
            100
        )
      : 0;

  // ==========================================================
  // COULEURS DES STATUTS
  // ==========================================================

  const statusColors: Record<
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

  const statusLabels: Record<
    string,
    string
  > = {
    draft: "Brouillon",
    in_progress: "En cours",
    ready: "Prête",
    published: "Publiée",
    republish_required:
      "Republication requise",
  };

  // ==========================================================
  // COULEUR D'UNE NOTE
  // ==========================================================

  const getScoreColor = (
    score: number | null
  ) => {
    if (
      score === null ||
      score === undefined ||
      Number.isNaN(score)
    ) {
      return "";
    }

    const max =
      Number(
        assessment?.max_score
      ) || 20;

    const percent =
      (score / max) * 100;

    if (percent >= 70) {
      return "text-green-600";
    }

    if (percent >= 50) {
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

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des notes
          </h1>

          <p className="mt-1 text-gray-500">
            Saisissez les notes puis publiez
            les résultats aux parents.
          </p>
        </div>

      </div>

      {/* ================================================== */}
      {/* FILTRES */}
      {/* ================================================== */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Rechercher une évaluation
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Filtrez les évaluations par
              trimestre, classe, matière ou statut.
            </p>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-2 self-start rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <X size={16} />

              Réinitialiser
            </button>
          )}

        </div>

        <div className="grid gap-4 lg:grid-cols-5">

          {/* RECHERCHE */}

          <div className="relative lg:col-span-2">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Rechercher une évaluation..."
              className="h-11 w-full rounded-xl border border-gray-300 pl-10 pr-4 outline-none transition focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
            />

          </div>

          {/* TRIMESTRE */}

          <select
            value={termFilter}
            onChange={(e) =>
              setTermFilter(
                e.target.value
              )
            }
            className="h-11 rounded-xl border border-gray-300 px-4 outline-none transition focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
          >

            <option value="">
              Tous les trimestres
            </option>

            {terms.map(
              (term) => (
                <option
                  key={term}
                  value={term}
                >
                  {term}
                </option>
              )
            )}

          </select>

          {/* CLASSE */}

          <select
            value={classroomFilter}
            onChange={(e) =>
              setClassroomFilter(
                e.target.value
              )
            }
            className="h-11 rounded-xl border border-gray-300 px-4 outline-none transition focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
          >

            <option value="">
              Toutes les classes
            </option>

            {classrooms.map(
              (classroom) => (
                <option
                  key={classroom}
                  value={classroom}
                >
                  {classroom}
                </option>
              )
            )}

          </select>

          {/* MATIÈRE */}

          <select
            value={subjectFilter}
            onChange={(e) =>
              setSubjectFilter(
                e.target.value
              )
            }
            className="h-11 rounded-xl border border-gray-300 px-4 outline-none transition focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
          >

            <option value="">
              Toutes les matières
            </option>

            {subjects.map(
              (subject) => (
                <option
                  key={subject}
                  value={subject}
                >
                  {subject}
                </option>
              )
            )}

          </select>

        </div>

        {/* STATUT */}

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20 sm:w-64"
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
              {filteredAssessments.length}
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

      {/* ================================================== */}
      {/* CHOIX DE L'ÉVALUATION */}
      {/* ================================================== */}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

        <label className="mb-3 block text-sm font-medium text-gray-700">
          Choisir une évaluation
        </label>

        <select
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6214BE] focus:ring-2 focus:ring-[#6214BE]/20"
          value={selected}
          onChange={(e) => {

            const value =
              e.target.value;

            setSelected(value);

            loadGrades(value);
          }}
        >

          <option value="">
            Sélectionner une évaluation
          </option>

          {filteredAssessments.map(
            (item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.title}
                {" • "}
                {item.subject_name}
                {" • "}
                {item.classroom_name}
                {" • "}
                {item.term_name}
              </option>
            )
          )}

        </select>

        {filteredAssessments.length ===
          0 && (
          <p className="mt-3 text-sm text-orange-600">
            Aucune évaluation ne
            correspond aux filtres sélectionnés.
          </p>
        )}

      </div>

      {/* ================================================== */}
      {/* LOADING */}
      {/* ================================================== */}

      {loading && (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">
          Chargement des notes...
        </div>
      )}

      {/* ================================================== */}
      {/* INFORMATIONS ÉVALUATION */}
      {/* ================================================== */}

      {!loading &&
        assessment && (
          <>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <h2 className="text-2xl font-semibold text-gray-900">
                      {assessment.title}
                    </h2>

                    {assessment.is_locked && (
                      <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        <Lock size={14} />

                        Notes verrouillées
                      </span>
                    )}

                  </div>

                  <p className="mt-2 text-gray-500">

                    {assessment.subject_name}

                    {" • "}

                    {assessment.classroom_name}

                    {assessment.term_name && (
                      <>
                        {" • "}
                        {assessment.term_name}
                      </>
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

              {/* ------------------------------------------------ */}
              {/* MESSAGE DE VERROUILLAGE */}
              {/* ------------------------------------------------ */}

              {assessment.is_locked && (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">

                  <Lock
                    size={20}
                    className="mt-0.5 shrink-0"
                  />

                  <div>

                    <p className="font-semibold">
                      Évaluation publiée
                    </p>

                    <p className="mt-1">
                      Cette évaluation a été publiée
                      aux parents. Les notes sont
                      maintenant verrouillées et ne
                      peuvent plus être modifiées.
                    </p>

                  </div>

                </div>
              )}

              {/* ------------------------------------------------ */}
              {/* PROGRESSION */}
              {/* ------------------------------------------------ */}

              <div className="mt-8">

                <div className="mb-2 flex justify-between text-sm text-gray-600">

                  <span>
                    Progression
                  </span>

                  <span className="font-semibold">
                    {progress}%
                  </span>

                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">

                  <div
                    className="h-full rounded-full bg-[#6214BE] transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {/* ================================================== */}
            {/* STATISTIQUES */}
            {/* ================================================== */}

            {statistics && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* ÉLÈVES */}

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

                {/* NOTES SAISIES */}

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

                {/* NOTES RESTANTES */}

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

            {/* ================================================== */}
            {/* TABLEAU */}
            {/* ================================================== */}

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

              <div className="border-b bg-gray-50 px-6 py-4">

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="text-lg font-semibold">
                      Saisie des notes
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">

                      {assessment.is_locked
                        ? "Les notes de cette évaluation sont verrouillées."
                        : "Saisissez les notes des élèves puis cliquez sur Enregistrer."}

                    </p>

                  </div>

                  {assessment.is_locked && (
                    <div className="flex items-center gap-2 rounded-xl bg-green-100 px-3 py-2 text-sm font-medium text-green-700">

                      <Lock size={16} />

                      Publiée

                    </div>
                  )}

                </div>

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
                            className={`border-t transition-colors ${
                              assessment.is_locked
                                ? "bg-gray-50"
                                : "hover:bg-gray-50"
                            }`}
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

                              <div className="flex items-center justify-center gap-2">

                                <input
                                  ref={(el) => {
                                    inputRefs.current[
                                      index
                                    ] = el;
                                  }}
                                  type="number"
                                  min={0}
                                  max={
                                    assessment?.max_score
                                  }
                                  step="0.01"
                                  value={
                                    grade.score ??
                                    ""
                                  }
                                  placeholder="-"
                                  disabled={
                                    assessment.is_locked ||
                                    assessment.can_edit ===
                                      false
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    updateScore(
                                      grade.enrollment_id,
                                      e.target
                                        .value
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
                                  className={`
                                    w-24
                                    rounded-lg
                                    border
                                    px-3
                                    py-2
                                    text-center
                                    font-bold
                                    outline-none
                                    transition
                                    ${
                                      assessment.is_locked
                                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500"
                                        : "border-gray-300 focus:ring-2 focus:ring-[#6214BE]"
                                    }
                                    ${getScoreColor(
                                      numericScore
                                    )}
                                  `}
                                />

                                {assessment.is_locked && (
                                  <Lock
                                    size={15}
                                    className="text-gray-400"
                                  />
                                )}

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                    {grades.length ===
                      0 && (
                      <tr>

                        <td
                          colSpan={3}
                          className="py-10 text-center text-gray-500"
                        >
                          Aucun élève trouvé.
                        </td>

                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* ================================================== */}
            {/* ACTIONS */}
            {/* ================================================== */}

            {grades.length > 0 && (
              <div className="flex flex-col justify-end gap-3 sm:flex-row">

                {/* ---------------------------------------------- */}
                {/* ENREGISTRER */}
                {/* ---------------------------------------------- */}

                {!assessment.is_locked && (
                  <button
                    onClick={save}
                    disabled={
                      saving ||
                      assessment.can_edit ===
                        false
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#6214BE] px-6 py-3 text-white transition-colors hover:bg-[#4e10a0] disabled:cursor-not-allowed disabled:bg-gray-400"
                  >

                    <Save className="h-5 w-5" />

                    {saving
                      ? "Enregistrement..."
                      : "Enregistrer"}

                  </button>
                )}

                {/* ---------------------------------------------- */}
                {/* PUBLIER */}
                {/* ---------------------------------------------- */}

                {!assessment.is_locked &&
                  assessment.can_publish && (
                    <button
                      onClick={publish}
                      disabled={
                        publishing
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >

                      <Send className="h-5 w-5" />

                      {publishing
                        ? "Publication..."
                        : assessment.status ===
                            "republish_required"
                          ? "Republier"
                          : "Publier"}

                    </button>
                  )}

                {/* ---------------------------------------------- */}
                {/* ÉVALUATION PUBLIÉE */}
                {/* ---------------------------------------------- */}

                {assessment.is_locked && (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-6 py-3 font-medium text-green-700">

                    <Lock size={18} />

                    Notes verrouillées

                  </div>
                )}

              </div>
            )}

          </>
        )}

    </div>
  );
}