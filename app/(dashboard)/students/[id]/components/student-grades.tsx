"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function StudentGrades({
    studentId
}: any) {

  const [terms, setTerms] = useState<any[]>([]);
  const [selectedTerm, setSelectedTerm] = useState("");

  const [report, setReport] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD TERMS
  // =========================

  const loadTerms = async () => {

    try {

      const res = await api.get(
        "/academics/terms/"
      );

      const data =
        res.data.results || res.data;

      setTerms(data);

      // auto select first term
      if (data.length > 0) {

        setSelectedTerm(data[0].id);

      }

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // LOAD REPORT
  // =========================

  const loadReport = async (
    termId: string
  ) => {

    if (!termId) return;
    
    try {

      setLoading(true);

      const res = await api.get(

        `/academics/reports/${studentId}/?term_id=${termId}`

      );

      setReport(res.data);
      console.log("doneee ",res.data);

    } catch (error) {

      console.error(error);

      setReport(null);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // EFFECTS
  // =========================

  useEffect(() => {

    loadTerms();

  }, []);

  useEffect(() => {

    if (selectedTerm) {

      loadReport(selectedTerm);

    }

  }, [selectedTerm]);

  // =========================
  // GROUP BY SUBJECT
  // =========================

  const groupedGrades = report?.grades?.reduce(
    (acc:any, item:any) => {

      if (!acc[item.subject]) {

        acc[item.subject] = [];

      }

      acc[item.subject].push(item);

      return acc;

    },
    {}
  );

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h2 className="text-xl font-bold">
            Résultats Académiques
          </h2>

          <p className="text-gray-500">
            Notes et moyennes
          </p>

        </div>

        {/* TERM SELECT */}

        <select
          className="border rounded-xl p-3"
          value={selectedTerm}
          onChange={(e)=>
            setSelectedTerm(
              e.target.value
            )
          }
        >

          {terms.map((term)=>(

            <option
              key={term.id}
              value={term.id}
            >
              {term.name}
            </option>

          ))}

        </select>

      </div>

      {/* LOADING */}

      {loading && (

        <div className="bg-white rounded-2xl p-8 border text-center">

          Chargement...

        </div>

      )}

      {/* EMPTY */}

      {!loading && !report && (

        <div className="bg-white rounded-2xl p-8 border text-center text-gray-500">

          Aucun bulletin disponible

        </div>

      )}

      {/* REPORT */}

      {!loading && report && (

        <>

          {/* STATS */}

          <div className="grid md:grid-cols-3 gap-4">

            {/* MOYENNE */}

            <div className="bg-white border rounded-2xl p-5">

              <div className="text-sm text-gray-500">
                Moyenne Générale
              </div>

              <div className="text-3xl font-bold mt-2">
                {report.average}/20
              </div>

            </div>

            {/* RANG */}

            <div className="bg-white border rounded-2xl p-5">

              <div className="text-sm text-gray-500">
                Rang
              </div>

              <div className="text-3xl font-bold mt-2">
                #{report.rank}
              </div>

            </div>

            {/* STATUS */}

            <div className="bg-white border rounded-2xl p-5">

              <div className="text-sm text-gray-500">
                Statut
              </div>

              <div className="text-3xl font-bold mt-2">

                {report.average >= 10
                  ? "Admis"
                  : "Insuffisant"}

              </div>

            </div>

          </div>

          {/* SUBJECTS */}

          <div className="space-y-6">

            {Object.keys(groupedGrades || {}).map(

              (subject:any)=>(

                <div
                  key={subject}
                  className="bg-white border rounded-2xl overflow-hidden"
                >

                  {/* SUBJECT HEADER */}

                  <div className="bg-gray-50 border-b px-5 py-4 flex justify-between items-center">

                    <div>

                      <div className="font-semibold text-lg">
                        {subject}
                      </div>

                    </div>

                  </div>

                  {/* TABLE */}

                  <div className="overflow-x-auto">

                    <table className="w-full">

                      <thead className="bg-gray-50">

                        <tr className="text-left">

                          <th className="p-4">
                            Evaluation
                          </th>

                          <th className="p-4">
                            Note
                          </th>

                          <th className="p-4">
                            /Max
                          </th>

                          <th className="p-4">
                            Coef
                          </th>

                          <th className="p-4">
                            %
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {groupedGrades[
                          subject
                        ].map((grade:any,index:number)=>(

                          <tr
                            key={index}
                            className="border-t"
                          >

                            <td className="p-4">
                              {grade.assessment}
                            </td>

                            <td className="p-4 font-semibold">

                              {grade.score}

                            </td>

                            <td className="p-4">

                              {grade.max_score}

                            </td>

                            <td className="p-4">

                              {grade.coefficient}

                            </td>

                            <td className="p-4">

                              {(
                                (
                                  grade.score /
                                  grade.max_score
                                ) * 100
                              ).toFixed(1)}%

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                </div>

              )

            )}

          </div>

        </>

      )}

    </div>
  );
}