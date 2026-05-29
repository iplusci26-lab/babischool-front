"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function GradesPage() {

  const [assessments, setAssessments] = useState<any[]>([]);

  const [selected, setSelected] = useState("");

  const [grades, setGrades] = useState<any[]>([]);

  const loadAssessments = async () => {

    const res = await api.get(
      "/academics/assessments/"
    );

    setAssessments(
      res.data.results ||
      res.data
    );
  };

  const loadGrades = async (
    assessment_id: string
  ) => {

    const res = await api.get(
      `/academics/assessments/${assessment_id}/grades/`
    );

    setGrades(res.data);
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const updateScore = (
    enrollment_id: string,
    score: string
  ) => {

    setGrades(prev =>
      prev.map(g =>
        g.enrollment_id === enrollment_id
          ? {
              ...g,
              score
            }
          : g
      )
    );
  };

  const save = async () => {

    await api.post(
      `/academics/assessments/${selected}/grades/`,
      {
        grades
      }
    );

    alert("Notes enregistrées");
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Notes
      </h1>

      <select
        className="border p-3 rounded-xl w-full max-w-lg"
        value={selected}
        onChange={(e)=>{
          setSelected(e.target.value);
          loadGrades(e.target.value);
        }}
      >
        <option value="">
          Choisir une évaluation
        </option>

        {assessments.map(a=>(

          <option
            key={a.id}
            value={a.id}
          >
            {a.title} - {a.classroom_name}
          </option>

        ))}

      </select>

      <div className="space-y-3">

        {grades.map((g,index)=>(

          <div
            key={g.enrollment_id}
            className="bg-white p-4 rounded-2xl shadow flex justify-between items-center"
          >

            <div className="font-medium">
              {g.student_name}
            </div>

            <input
              type="number"
              value={g.score || ""}
              onChange={(e)=>
                updateScore(
                  g.enrollment_id,
                  e.target.value
                )
              }
              className="border-2 border-purple-300 p-2 rounded-xl w-28"
              max={20}
            />

          </div>

        ))}

      </div>

      {grades.length > 0 && (

        <button
          onClick={save}
          className="bg-purple-600 text-white px-5 py-3 rounded-xl"
        >
          Enregistrer les notes
        </button>

      )}

    </div>
  );
}