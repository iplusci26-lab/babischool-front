"use client";

import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import {
  BookOpen,
  CheckCircle2,
  Save,
  Send,
  Users,
} from "lucide-react";

import { api } from "@/lib/api";

export default function GradesPage() {
  const [assessments, setAssessments] = useState<any[]>([]);

  const [selected, setSelected] = useState("");

  const [assessment, setAssessment] = useState<any | null>(null);

  const [statistics, setStatistics] = useState<any | null>(null);

  const [grades, setGrades] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [publishing, setPublishing] = useState(false);

  const loadAssessments = async () => {
    try {
      const res = await api.get("/academics/assessments/");

      setAssessments(res.data.results || res.data);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les évaluations.");
    }
  };
  const inputRefs =
    useRef<(HTMLInputElement | null)[]>([]);
  const loadGrades = async (assessmentId: string) => {
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

      setAssessment(res.data.assessment);

      setStatistics(res.data.statistics);

      setGrades(res.data.students);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les notes.");
    } finally {
      setLoading(false);
    }
  };

  const updateScore = (
    enrollmentId: string,
    score: string
  ) => {
    setGrades((prev) =>
      prev.map((grade) =>
        grade.enrollment_id === enrollmentId
          ? {
              ...grade,
              score,
            }
          : grade
      )
    );
  };

  const save = async () => {
    if (!selected) return;

    try {
      setSaving(true);

      await api.post(
        `/academics/assessments/${selected}/grades/`,
        {
          grades,
        }
      );

      await loadGrades(selected);

      await loadAssessments();

      toast.success("Notes enregistrées avec succès.");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!selected) return;

    try {
      setPublishing(true);

      await api.post(
        `/academics/assessments/${selected}/publish/`
      );

      await loadGrades(selected);

      await loadAssessments();

      toast.success("Évaluation publiée avec succès.");
    } catch (error) {
      console.error(error);
      toast.error("Impossible de publier cette évaluation.");
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const progress =
    statistics && statistics.total_students > 0
      ? Math.round(
          (statistics.total_grades /
            statistics.total_students) *
            100
        )
      : 0;

  const statusColors: Record<string, string> = {
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

  const getScoreColor = (
    score: number | null
) => {

    if (
        score === null ||
        score === undefined
    )
        return "";

    const max = assessment?.max_score ?? 20;

    const percent =
        (score / max) * 100;

    if (percent >= 70)
        return "text-green-600";

    if (percent >= 50)
        return "text-orange-500";

    return "text-red-600";
};

  return (

    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

  {/* ================= HEADER ================= */}

  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    <div>

      <h1 className="text-3xl font-bold text-gray-900">

        Gestion des notes

      </h1>

      <p className="text-gray-500 mt-1">

        Saisissez les notes puis publiez les résultats aux parents.

      </p>

    </div>

  </div>

  {/* ================= CHOIX DE L'ÉVALUATION ================= */}

  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

    <label className="block text-sm font-medium text-gray-700 mb-3">

      Choisir une évaluation

    </label>

    <select

      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"

      value={selected}

      onChange={(e) => {

        setSelected(e.target.value);

        loadGrades(e.target.value);

      }}

    >

      <option value="">

        Sélectionner une évaluation

      </option>

      {assessments.map((assessment) => (

        <option

          key={assessment.id}

          value={assessment.id}

        >

          {assessment.title} • {assessment.subject_name} • {assessment.classroom_name}

        </option>

      ))}

    </select>

  </div>

  {/* ================= LOADING ================= */}

  {loading && (

    <div className="bg-white rounded-2xl shadow-sm border p-8 text-center text-gray-500">

      Chargement...

    </div>

  )}

  {/* ================= INFOS ÉVALUATION ================= */}

  {!loading && assessment && (

    <>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">

          <div>

            <h2 className="text-2xl font-semibold text-gray-900">

              {assessment.title}

            </h2>

            <p className="text-gray-500 mt-2">

              {assessment.subject_name}

              {" • "}

              {assessment.classroom_name}

            </p>

          </div>

          <span

            className={`px-4 py-2 rounded-full text-sm font-semibold self-start ${statusColors[assessment.status]}`}

          >

            {assessment.status_label}

          </span>

        </div>

        {/* Progression */}

        <div className="mt-8">

          <div className="flex justify-between text-sm text-gray-600 mb-2">

            <span>

              Progression

            </span>

            <span>

              {progress}%

            </span>

          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

            <div

              className="h-full bg-purple-600 rounded-full transition-all duration-500"

              style={{

                width: `${progress}%`

              }}

            />

          </div>

        </div>

      </div>

      {/* ================= STATISTIQUES ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-4">

            <Users className="w-10 h-10 text-purple-600" />

            <div>

              <div className="text-3xl font-bold">

                {statistics.total_students}

              </div>

              <div className="text-gray-500 text-sm">

                Élèves

              </div>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-4">

            <CheckCircle2 className="w-10 h-10 text-green-600" />

            <div>

              <div className="text-3xl font-bold">

                {statistics.total_grades}

              </div>

              <div className="text-gray-500 text-sm">

                Notes saisies

              </div>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center gap-4">

            <BookOpen className="w-10 h-10 text-orange-500" />

            <div>

              <div className="text-3xl font-bold">

                {statistics.missing_grades}

              </div>

              <div className="text-gray-500 text-sm">

                Notes restantes

              </div>

            </div>

          </div>

        </div>

      </div>

            {/* ================= TABLEAU DES NOTES ================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

<div className="px-6 py-4 border-b bg-gray-50">

  <h3 className="text-lg font-semibold">

    Saisie des notes

  </h3>

  <p className="text-sm text-gray-500 mt-1">

    Saisissez les notes des élèves puis cliquez sur
    <strong> Enregistrer</strong>.

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

    {grades.map((grade, index) => (

        <tr
            key={grade.enrollment_id}
            className="border-t hover:bg-gray-50 transition-colors"
        >

            <td className="px-6 py-4 text-gray-700">
                {grade.student_number}
            </td>

            <td className="px-6 py-4 font-medium text-gray-900">
                {grade.student_name}
            </td>

            <td className="px-6 py-4 text-center">

                <input
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="number"
                    min={0}
                    max={assessment?.max_score}
                    value={grade.score ?? ""}
                    placeholder="-"
                    onChange={(e) =>
                        updateScore(
                            grade.enrollment_id,
                            e.target.value
                        )
                    }
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {

                            e.preventDefault();

                            inputRefs.current[index + 1]?.focus();

                        }

                    }}
                    className={`
                        w-24
                        rounded-lg
                        border
                        border-gray-300
                        px-3
                        py-2
                        text-center
                        font-bold
                        ${getScoreColor(Number(grade.score))}
                        focus:outline-none
                        focus:ring-2
                        focus:ring-purple-500
                    `}
                />

            </td>

        </tr>

        ))}

      {grades.length === 0 && (

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

{/* ================= ACTIONS ================= */}

{grades.length > 0 && (

<div className="flex flex-col sm:flex-row justify-end gap-3">

  <button

    onClick={save}

    disabled={saving}

    className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl transition-colors"

  >

    <Save className="w-5 h-5" />

    {

      saving

        ? "Enregistrement..."

        : "Enregistrer"

    }

  </button>

  {assessment?.can_publish && (

    <button

      onClick={publish}

      disabled={publishing}

      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl transition-colors"

    >

      <Send className="w-5 h-5" />

      {

        publishing

          ? "Publication..."

          : assessment.status === "republish_required"

            ? "Republier"

            : "Publier"

      }

    </button>

  )}

</div>

)}

</>

)}

</div>

);
}