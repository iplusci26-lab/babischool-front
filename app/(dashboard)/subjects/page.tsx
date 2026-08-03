"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Hash,
  Plus,
  Trash2,
} from "lucide-react";

import { api } from "@/lib/api";

export default function SubjectsPage() {

  const [subjects, setSubjects] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    code: "",
    coefficient: 1,
  });

  const loadSubjects = async () => {

    const res = await api.get(
      "/academics/subjects/"
    );

    setSubjects(
      res.data.results || res.data
    );
  };

  useEffect(() => {

    loadSubjects();

  }, []);

  const handleCreate = async () => {

    await api.post(
      "/academics/subjects/",
      form
    );

    setForm({
      name: "",
      code: "",
      coefficient: 1,
    });

    loadSubjects();
  };

  const handleDelete = async (
    id: string
  ) => {

    await api.delete(
      `/academics/subjects/${id}/`
    );

    loadSubjects();
  };

  const coefficientColor = (
    coefficient: number
  ) => {

    if (coefficient <= 2)
      return "bg-green-100 text-green-700";

    if (coefficient === 3)
      return "bg-yellow-100 text-yellow-700";

    if (coefficient === 4)
      return "bg-orange-100 text-orange-700";

    return "bg-red-100 text-red-700";
  };

  return (

    <div className="space-y-6 p-6">

      {/* ========================= */}
      {/* HEADER                    */}
      {/* ========================= */}

      <div>

        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des matières
        </h1>

        <p className="mt-1 text-sm text-gray-500">

          Configurez les matières enseignées dans
          votre établissement ainsi que les
          coefficients utilisés dans le calcul des
          moyennes.

        </p>

      </div>

      {/* ========================= */}
      {/* FORMULAIRE                */}
      {/* ========================= */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">

          <Plus
            size={20}
            className="text-[#6214BE]"
          />

          Nouvelle matière

        </h2>

        <div className="grid gap-5 lg:grid-cols-4">

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nom de la matière
            </label>

            <input
              placeholder="Ex : Mathématiques"
              value={form.name}
              onChange={(e)=>
                setForm({
                  ...form,
                  name:e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#6214BE] focus:outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Abréviation
            </label>

            <input
              placeholder="Ex : MATH"
              value={form.code}
              onChange={(e)=>
                setForm({
                  ...form,
                  code:e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#6214BE] focus:outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Coefficient
            </label>

            <input
              type="number"
              min={1}
              value={form.coefficient}
              onChange={(e)=>
                setForm({
                  ...form,
                  coefficient:Number(
                    e.target.value
                  ),
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#6214BE] focus:outline-none"
            />

            

          </div>

          <div className="flex items-center">

            <button
              onClick={handleCreate}
              className="w-70 rounded-xl bg-[#6214BE] px-5 py-3 font-medium text-white transition hover:bg-[#4d0fa0]"
            >

              Ajouter matière

            </button>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* TABLEAU                   */}
      {/* ========================= */}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr className="text-left text-sm font-semibold text-gray-600">

              <th className="px-6 py-4">
                Matière
              </th>

              <th className="px-6 py-4">
                Abréviation
              </th>

              <th className="px-6 py-4">
                Coefficient
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {subjects.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="py-12 text-center text-gray-500"
                >

                  Aucune matière enregistrée.

                </td>

              </tr>

            ) : (

              subjects.map((subject) => (

                <tr
                  key={subject.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="rounded-xl bg-[#6214BE]/10 p-2">

                        <BookOpen
                          size={18}
                          className="text-[#6214BE]"
                        />

                      </div>

                      <span className="font-medium text-gray-800">

                        {subject.name}

                      </span>

                    </div>

                  </td>

                  <td className="px-6 py-4">

                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium">

                      {subject.code}

                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${coefficientColor(subject.coefficient)}`}
                    >

                      Coef. {subject.coefficient}

                    </span>

                  </td>

                  <td className="px-6 py-4 text-right">

                    <button
                      onClick={() =>
                        handleDelete(
                          subject.id
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >

                      <Trash2 size={16} />

                      Supprimer

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}