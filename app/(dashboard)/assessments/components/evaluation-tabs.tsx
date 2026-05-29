"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AssessmentsPage() {

  const [assessments, setAssessments] = useState<any[]>([]);

  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);

  const [form, setForm] = useState({
    classroom: "",
    subject: "",
    term: "",
    title: "",
    assessment_type: "test",
    max_score: "",
    weight: "",
    date_assessment:"",
  });

  const loadData = async () => {

    const [
      assessmentsRes,
      classroomsRes,
      subjectsRes,
      termsRes
    ] = await Promise.all([
      api.get("/academics/assessments/"),
      api.get("/students/classrooms/"),
      api.get("/academics/subjects/"),
      api.get("/academics/terms/")
    ]);

    setAssessments(
      assessmentsRes.data.results ||
      assessmentsRes.data
    );

    setClassrooms(
      classroomsRes.data.results ||
      classroomsRes.data
    );

    setSubjects(
      subjectsRes.data.results ||
      subjectsRes.data
    );

    setTerms(
      termsRes.data.results ||
      termsRes.data
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async () => {

    await api.post(
      "/academics/assessments/",
      form
    );

    setForm({
      classroom: "",
      subject: "",
      term: "",
      title: "",
      assessment_type: "test",
      max_score: "",
      weight: "",
      date_assessment:""
    });

    loadData();
  };

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-2xl font-bold">
        Évaluations
      </h1>

      {/* FORM */}

      <div className="bg-white p-5 rounded-2xl shadow space-y-4">

        <h2 className="font-semibold">
          Nouvelle évaluation
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <select
            className="border p-3 rounded-xl"
            value={form.classroom}
            onChange={(e)=>
              setForm({
                ...form,
                classroom: e.target.value
              })
            }
          >
            <option value="">
              Classe
            </option>

            {classrooms.map(c=>(
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="border p-3 rounded-xl"
            value={form.subject}
            onChange={(e)=>
              setForm({
                ...form,
                subject: e.target.value
              })
            }
          >
            <option value="">
              Matière
            </option>

            {subjects.map(s=>(
              <option
                key={s.id}
                value={s.id}
              >
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="border p-3 rounded-xl"
            value={form.term}
            onChange={(e)=>
              setForm({
                ...form,
                term: e.target.value
              })
            }
          >
            <option value="">
              Période
            </option>

            {terms.map(t=>(
              <option
                key={t.id}
                value={t.id}
              >
                {t.name}
              </option>
            ))}
          </select>

          <input
            className="border p-3 rounded-xl"
            placeholder="Titre"
            value={form.title}
            onChange={(e)=>
              setForm({
                ...form,
                title: e.target.value
              })
            }
          />

          <select
            className="border p-3 rounded-xl"
            value={form.assessment_type}
            onChange={(e)=>
              setForm({
                ...form,
                assessment_type: e.target.value
              })
            }
          >
            <option value="homework">
              Devoir
            </option>

            <option value="test">
              Interrogation
            </option>

            <option value="exam">
              Examen
            </option>
          </select>

          <input
            type="number"
            className="border p-3 rounded-xl"
            placeholder="Note max"
            value={form.max_score}
            onChange={(e)=>
              setForm({
                ...form,
                max_score: Number(e.target.value)
              })
            }
          />

          <input
            type="number"
            className="border p-3 rounded-xl"
            placeholder="Coefficient "
            value={form.weight}
            onChange={(e)=>
              setForm({
                ...form,
                weight: Number(e.target.value)
              })
            }
          />

          <input
            type="date"
            className="border p-2 w-full"
            value={form.date_assessment}
            onChange={(e)=>
              setForm({
                ...form,
                date_assessment: e.target.value
              })
            }
          />

        </div>

        <button
          onClick={submit}
          className="bg-purple-600 text-white px-5 py-3 rounded-xl"
        >
          Créer
        </button>

      </div>

      {/* LISTE */}

      <div className="space-y-3">

        {assessments.map(a=>(

          <div
            key={a.id}
            className="bg-white p-4 rounded-2xl shadow flex justify-between items-center"
          >

            <div>

              <div className="font-semibold">
                {a.title}
              </div>

              <div className="text-sm text-gray-500">
                {a.classroom_name} • {a.subject_name}
              </div>

            </div>

            <div className="text-sm">

              /{a.max_score}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}