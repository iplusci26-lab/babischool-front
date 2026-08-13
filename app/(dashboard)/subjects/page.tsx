"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Plus,
  Trash2,
} from "lucide-react";

import { api } from "@/lib/api";

interface Subject {
  id: string;
  name: string;
  code: string;
  coefficient: number | string;
  pass_mark?: number | string;
}

export default function SubjectsPage() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [loading, setLoading] = useState(false);

  const [creating, setCreating] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [form, setForm] = useState({
    name: "",
    code: "",
    coefficient: "1",
  });

  // ==========================================================
  // CHARGEMENT DES MATIÈRES
  // ==========================================================

  const loadSubjects = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/academics/subjects/"
      );

      setSubjects(
        res.data.results || res.data
      );

    } catch (error) {
      console.error(
        "Erreur chargement matières :",
        error
      );

      toast.error(
        "Impossible de charger les matières."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIALISATION
  // ==========================================================

  useEffect(() => {
    loadSubjects();
  }, []);

  // ==========================================================
  // CREATION
  // ==========================================================

  const handleCreate = async () => {
    // --------------------------------------------------------
    // NOM
    // --------------------------------------------------------

    if (!form.name.trim()) {
      toast.error(
        "Veuillez renseigner le nom de la matière."
      );

      return;
    }

    // --------------------------------------------------------
    // CODE
    // --------------------------------------------------------

    if (!form.code.trim()) {
      toast.error(
        "Veuillez renseigner l'abréviation de la matière."
      );

      return;
    }

    // --------------------------------------------------------
    // COEFFICIENT
    // --------------------------------------------------------

    if (!form.coefficient.trim()) {
      toast.error(
        "Veuillez renseigner le coefficient."
      );

      return;
    }

    const coefficient = Number(
      form.coefficient.replace(",", ".")
    );

    if (!Number.isFinite(coefficient)) {
      toast.error(
        "Le coefficient doit être un nombre valide."
      );

      return;
    }

    if (coefficient <= 0) {
      toast.error(
        "Le coefficient doit être supérieur à 0."
      );

      return;
    }

    // Maximum compatible avec DecimalField(max_digits=4, decimal_places=2)
    if (coefficient > 99.99) {
      toast.error(
        "Le coefficient ne peut pas dépasser 99.99."
      );

      return;
    }

    try {
      setCreating(true);

      await api.post(
        "/academics/subjects/",
        {
          name: form.name.trim(),

          code: form.code
            .trim()
            .toUpperCase(),

          coefficient,
        }
      );

      toast.success(
        "Matière ajoutée avec succès."
      );

      // ------------------------------------------------------
      // RESET
      // ------------------------------------------------------

      setForm({
        name: "",
        code: "",
        coefficient: "1",
      });

      await loadSubjects();

    } catch (error: any) {
      console.error(
        "Erreur création matière :",
        error?.response?.data || error
      );

      const data =
        error?.response?.data;

      if (data?.name) {
        toast.error(
          Array.isArray(data.name)
            ? data.name[0]
            : data.name
        );

      } else if (data?.code) {
        toast.error(
          Array.isArray(data.code)
            ? data.code[0]
            : data.code
        );

      } else if (data?.coefficient) {
        toast.error(
          Array.isArray(data.coefficient)
            ? data.coefficient[0]
            : data.coefficient
        );

      } else if (data?.detail) {
        toast.error(
          data.detail
        );

      } else {
        toast.error(
          "Impossible d'ajouter la matière."
        );
      }

    } finally {
      setCreating(false);
    }
  };

  // ==========================================================
  // SUPPRESSION
  // ==========================================================

  const handleDelete = async (
    id: string
  ) => {
    try {
      setDeletingId(id);

      await api.delete(
        `/academics/subjects/${id}/`
      );

      toast.success(
        "Matière supprimée avec succès."
      );

      await loadSubjects();

    } catch (error: any) {
      console.error(
        "Erreur suppression matière :",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.detail ||
        "Impossible de supprimer cette matière."
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================================
  // COEFFICIENT
  // ==========================================================

  const coefficientColor = (
    coefficient: number | string
  ) => {
    const value = Number(
      String(coefficient).replace(",", ".")
    );

    if (value <= 2) {
      return "bg-green-100 text-green-700";
    }

    if (value <= 3) {
      return "bg-yellow-100 text-yellow-700";
    }

    if (value <= 4) {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-red-100 text-red-700";
  };

  const formatCoefficient = (
    coefficient: number | string
  ) => {
    const value = Number(
      String(coefficient).replace(",", ".")
    );

    if (!Number.isFinite(value)) {
      return coefficient;
    }

    return value
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(/(\.\d)0$/, "$1");
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des matières
        </h1>

        <p className="mt-1 max-w-3xl text-sm text-gray-500">
          Configurez les matières enseignées dans votre
          établissement ainsi que les coefficients utilisés
          dans le calcul des moyennes.
        </p>
      </div>

      {/* ================================================== */}
      {/* FORMULAIRE */}
      {/* ================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">

          <Plus
            size={20}
            className="text-[#6214BE]"
          />

          Nouvelle matière

        </h2>

        <div className="grid gap-5 lg:grid-cols-4">

          {/* ================================================== */}
          {/* NOM */}
          {/* ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nom de la matière
            </label>

            <input
              type="text"
              placeholder="Ex : Mathématiques"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              disabled={creating}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                outline-none
                transition
                focus:border-[#6214BE]
                focus:ring-2
                focus:ring-[#6214BE]/10
                disabled:bg-gray-100
              "
            />

          </div>

          {/* ================================================== */}
          {/* CODE */}
          {/* ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Abréviation
            </label>

            <input
              type="text"
              placeholder="Ex : MATH"
              value={form.code}
              onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value,
                })
              }
              disabled={creating}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                uppercase
                outline-none
                transition
                focus:border-[#6214BE]
                focus:ring-2
                focus:ring-[#6214BE]/10
                disabled:bg-gray-100
              "
            />

          </div>

          {/* ================================================== */}
          {/* COEFFICIENT */}
          {/* ================================================== */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Coefficient
            </label>

            <input
              type="number"
              min="0.01"
              max="99.99"
              step="0.01"
              inputMode="decimal"
              placeholder="Ex : 1.5"
              value={form.coefficient}
              onChange={(e) =>
                setForm({
                  ...form,
                  coefficient:
                    e.target.value,
                })
              }
              disabled={creating}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                outline-none
                transition
                focus:border-[#6214BE]
                focus:ring-2
                focus:ring-[#6214BE]/10
                disabled:bg-gray-100
              "
            />

            <p className="mt-1 text-xs text-gray-500">
              Exemples : 0.5, 1, 1.5, 2, 2.5
            </p>

          </div>

          {/* ================================================== */}
          {/* BOUTON */}
          {/* ================================================== */}

          <div className="flex items-end">

            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="
                w-full
                rounded-xl
                bg-[#6214BE]
                px-5
                py-3
                font-medium
                text-white
                transition
                hover:bg-[#4d0fa0]
                disabled:cursor-not-allowed
                disabled:bg-gray-400
              "
            >

              {creating
                ? "Ajout..."
                : "Ajouter matière"}

            </button>

          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* TABLEAU */}
      {/* ================================================== */}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        <div className="border-b bg-gray-50 px-6 py-4">

          <h2 className="font-semibold text-gray-800">
            Matières enregistrées
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {subjects.length} matière
            {subjects.length > 1 ? "s" : ""}
          </p>

        </div>

        <div className="overflow-x-auto">

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

              {/* ================================================== */}
              {/* LOADING */}
              {/* ================================================== */}

              {loading ? (

                <tr>

                  <td
                    colSpan={4}
                    className="py-12 text-center text-gray-500"
                  >

                    Chargement des matières...

                  </td>

                </tr>

              ) : subjects.length === 0 ? (

                /* ================================================== */
                /* EMPTY */
                /* ================================================== */

                <tr>

                  <td
                    colSpan={4}
                    className="py-12 text-center text-gray-500"
                  >

                    <div className="flex flex-col items-center gap-3">

                      <BookOpen
                        size={32}
                        className="text-gray-300"
                      />

                      <span>
                        Aucune matière enregistrée.
                      </span>

                    </div>

                  </td>

                </tr>

              ) : (

                /* ================================================== */
                /* DATA */
                /* ================================================== */

                subjects.map((subject) => (

                  <tr
                    key={subject.id}
                    className="
                      border-t
                      hover:bg-gray-50
                      transition-colors
                    "
                  >

                    {/* MATIÈRE */}

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

                    {/* CODE */}

                    <td className="px-6 py-4">

                      <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium">

                        {subject.code}

                      </span>

                    </td>

                    {/* COEFFICIENT */}

                    <td className="px-6 py-4">

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-sm
                          font-semibold
                          ${coefficientColor(
                            subject.coefficient
                          )}
                        `}
                      >

                        Coef.{" "}
                        {formatCoefficient(
                          subject.coefficient
                        )}

                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            subject.id
                          )
                        }
                        disabled={
                          deletingId ===
                          subject.id
                        }
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-lg
                          border
                          border-red-200
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-red-600
                          transition
                          hover:bg-red-50
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >

                        <Trash2
                          size={16}
                        />

                        {deletingId ===
                        subject.id
                          ? "Suppression..."
                          : "Supprimer"}

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}