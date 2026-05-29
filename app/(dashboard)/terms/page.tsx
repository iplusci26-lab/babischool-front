"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TermsPage() {

  const [terms, setTerms] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    term_type: "trimester",
    start_date: "",
    end_date: "",
    academic_year: "",
    is_active: true,
  });

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const loadData = async () => {

    try {

      const [
        termsRes,
        yearsRes
      ] = await Promise.all([
        api.get("/academics/terms/"),
        api.get("/academics/academic-years/")
      ]);

      setTerms(
        termsRes.data.results ||
        termsRes.data
      );

      setYears(
        yearsRes.data.results ||
        yearsRes.data
      );

    } catch (error) {

      console.error(error);

    }
  };

  useEffect(() => {

    loadData();

  }, []);

  const resetForm = () => {

    setForm({
      name: "",
      term_type: "trimester",
      start_date: "",
      end_date: "",
      academic_year: "",
      is_active: true,
    });

    setEditingId(null);
  };

  const submit = async () => {

    try {

      if (editingId) {

        await api.put(
          `/academics/terms/${editingId}/`,
          form
        );

      } else {

        await api.post(
          "/academics/terms/",
          form
        );
      }

      resetForm();

      loadData();

    } catch (error) {

      console.error(error);

    }
  };

  const editTerm = (term:any) => {

    setEditingId(term.id);

    setForm({
      name: term.name,
      term_type: term.term_type,
      start_date: term.start_date,
      end_date: term.end_date,
      academic_year: term.academic_year,
      is_active: term.is_active,
    });
  };

  const deleteTerm = async (id:string) => {

    const confirmDelete = confirm(
      "Supprimer cette période ?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/academics/terms/${id}/`
      );

      loadData();

    } catch (error) {

      console.error(error);

    }
  };

  return (

    <div className="p-6 space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-2xl font-bold">
          Périodes Académiques
        </h1>

        <p className="text-gray-500">
          Trimestres et semestres
        </p>

      </div>

      {/* FORM */}

      <div className="bg-white rounded-2xl shadow p-6 space-y-5">

        <h2 className="font-semibold text-lg">

          {editingId
            ? "Modifier période"
            : "Nouvelle période"}

        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          {/* NOM */}

          <input
            type="text"
            placeholder="Nom"
            className="border p-3 rounded-xl"
            value={form.name}
            onChange={(e)=>
              setForm({
                ...form,
                name: e.target.value
              })
            }
          />

          {/* TYPE */}

          <select
            className="border p-3 rounded-xl"
            value={form.term_type}
            onChange={(e)=>
              setForm({
                ...form,
                term_type: e.target.value
              })
            }
          >
            

            <option value="trimester">
              Trimestre
            </option>

            <option value="semester">
              Semestre
            </option>
          </select>

          {/* DATE DEBUT */}

          <input
            type="date"
            className="border p-3 rounded-xl"
            value={form.start_date}
            onChange={(e)=>
              setForm({
                ...form,
                start_date: e.target.value
              })
            }
          />

          {/* DATE FIN */}

          <input
            type="date"
            className="border p-3 rounded-xl"
            value={form.end_date}
            onChange={(e)=>
              setForm({
                ...form,
                end_date: e.target.value
              })
            }
          />

          {/* ANNEE */}

          <select
            className="border p-3 rounded-xl"
            value={form.academic_year}
            onChange={(e)=>
              setForm({
                ...form,
                academic_year: e.target.value
              })
            }
          >
            <option value="">
              Année académique
            </option>

            {years.map((y)=>(

              <option
                key={y.id}
                value={y.id}
              >
                {y.name}
              </option>

            ))}

          </select>

          {/* ACTIVE */}

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e)=>
                setForm({
                  ...form,
                  is_active: e.target.checked
                })
              }
            />

            <span>
              Période active
            </span>

          </label>

        </div>

        {/* ACTIONS */}

        <div className="flex gap-3">

          <button
            onClick={submit}
            className="bg-purple-600 text-white px-5 py-3 rounded-xl"
          >
            {editingId
              ? "Mettre à jour"
              : "Créer"}
          </button>

          {editingId && (

            <button
              onClick={resetForm}
              className="border px-5 py-3 rounded-xl"
            >
              Annuler
            </button>

          )}

        </div>

      </div>

      {/* LISTE */}

      <div className="space-y-4">

        {terms.map((term)=>(

          <div
            key={term.id}
            className="bg-white rounded-2xl shadow p-5 flex justify-between items-center"
          >

            <div>

              <div className="font-semibold text-lg">
                {term.name}
              </div>

              <div className="text-sm text-gray-500">
                {term.term_type === "trimester"
                  ? "Trimestre"
                  : "Semestre"}
              </div>

              <div className="text-sm text-gray-400 mt-1">

                {term.start_date}
                {" → "}
                {term.end_date}

              </div>

            </div>

            <div className="flex items-center gap-3">

              {term.is_active && (

                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  Active
                </span>

              )}

              <button
                onClick={()=>
                  editTerm(term)
                }
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-xl"
              >
                Modifier
              </button>

              <button
                onClick={()=>
                  deleteTerm(term.id)
                }
                className="bg-red-100 text-red-600 px-4 py-2 rounded-xl"
              >
                Supprimer
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}