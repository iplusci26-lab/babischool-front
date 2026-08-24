"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";

import {
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  Phone,
  UserCheck,
  CalendarDays,
} from "lucide-react";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
  });

  // ============================================================
  // EXTRACTION DES DONNÉES
  // ============================================================

  const extract = (res: any) => {
    return res.data.results || res.data;
  };

  // ============================================================
  // CHARGEMENT DES ENSEIGNANTS
  // ============================================================

  const loadTeachers = async () => {
    try {
      const res = await api.get(
        "/academics/teachers/"
      );

      setTeachers(extract(res));
    } catch (error) {
      console.error(
        "Erreur lors du chargement des enseignants :",
        error
      );
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  // ============================================================
  // CHANGEMENT DES CHAMPS
  // ============================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================================
  // RESET FORMULAIRE
  // ============================================================

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      phone: "",
      date_of_birth: "",
    });

    setSelected(null);
  };

  // ============================================================
  // CRÉATION
  // ============================================================

  const handleCreate = async () => {
    if (
      !form.first_name ||
      !form.last_name ||
      !form.phone ||
      !form.date_of_birth
    ) {
      toast.error(
        "Tous les champs sont obligatoires"
      );

      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/academics/teachers/",
        {
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          date_of_birth: form.date_of_birth,
        }
      );
      toast.success("Enseignant ajouté avec succès")
      resetForm();

      await loadTeachers();

    } catch (error) {
      console.error(error);

      toast.error(
        "Erreur lors de la création de l'enseignant."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // MODIFICATION
  // ============================================================

  const handleUpdate = async () => {
    if (!selected) {
      return;
    }

    if (
      !form.first_name ||
      !form.last_name ||
      !form.phone ||
      !form.date_of_birth
    ) {
      toast.error(
        "Tous les champs sont obligatoires"
      );

      return;
    }

    try {
      setLoading(true);

      await api.put(
        `/academics/teachers/${selected.id}/`,
        {
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          date_of_birth:
            form.date_of_birth,
        }
      );
      toast.success("Modification effectué avec succès")
      resetForm();

      await loadTeachers();

    } catch (error) {
      console.error(error);

      toast.error(
        "Erreur lors de la modification."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SUPPRESSION
  // ============================================================

  const handleDelete = async (
    id: string
  ) => {
    if (
      !confirm(
        "Supprimer cet enseignant ?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/academics/teachers/${id}/`
      );

      await loadTeachers();

    } catch (error) {
      console.error(error);

      toast.error(
        "Erreur lors de la suppression."
      );
    }
  };

  // ============================================================
  // MODIFICATION — CHARGER LES DONNÉES
  // ============================================================

  const handleEdit = (
    teacher: any
  ) => {
    setSelected(teacher);

    setForm({
      first_name:
        teacher.first_name || "",

      last_name:
        teacher.last_name || "",

      phone:
        teacher.phone || "",

      date_of_birth:
        teacher.date_of_birth || "",
    });
  };

  // ============================================================
  // AFFICHAGE
  // ============================================================

  return (
    <div className="space-y-8">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Enseignants
          </h1>

          <p className="mt-1 text-gray-500">
            Gérez les enseignants de votre établissement.
          </p>

        </div>

      </div>

      {/* ======================================================
          FORMULAIRE
      ====================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-2">

          <UserPlus
            className="text-[#6214BE]"
            size={22}
          />

          <h2 className="text-lg font-semibold">

            {selected
              ? "Modifier un enseignant"
              : "Ajouter un enseignant"}

          </h2>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* PRÉNOM */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Prénom
            </label>

            <input
              name="first_name"
              type="text"
              placeholder="Prénom"
              value={form.first_name}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                focus:border-transparent
                focus:outline-none
                focus:ring-2
                focus:ring-[#6214BE]
              "
            />

          </div>

          {/* NOM */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nom
            </label>

            <input
              name="last_name"
              type="text"
              placeholder="Nom"
              value={form.last_name}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                focus:border-transparent
                focus:outline-none
                focus:ring-2
                focus:ring-[#6214BE]
              "
            />

          </div>

          {/* TÉLÉPHONE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Téléphone
            </label>

            <input
              name="phone"
              type="tel"
              placeholder="Téléphone"
              value={form.phone}
              onChange={handleChange}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                focus:border-transparent
                focus:outline-none
                focus:ring-2
                focus:ring-[#6214BE]
              "
            />

          </div>

          {/* DATE DE NAISSANCE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Date de naissance
            </label>

            <div className="relative">

              <CalendarDays
                size={18}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                name="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={handleChange}
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  py-3
                  pl-10
                  pr-4
                  focus:border-transparent
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#6214BE]
                "
              />

            </div>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="flex justify-end mt-6 gap-3">

          <button
            type="button"
            onClick={
              selected
                ? handleUpdate
                : handleCreate
            }
            disabled={loading}
            className="
              rounded-xl
              bg-[#6214BE]
              px-6
              py-3
              font-medium
              text-white
              transition
              cursor-pointer
              hover:bg-[#4f10a0]
              disabled:opacity-50
            "
          >

            {loading
              ? "Chargement..."
              : selected
              ? "Mettre à jour"
              : "Ajouter"}

          </button>

          {selected && (

            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="
                rounded-xl
                border
                border-gray-300
                px-6
                py-3
                cursor-pointer
                transition
                hover:bg-gray-100
                disabled:opacity-50
              "
            >
              Annuler
            </button>

          )}

        </div>

      </div>

      {/* ======================================================
          LISTE DES ENSEIGNANTS
      ====================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-semibold">
          Liste des enseignants
        </h2>

        <div className="space-y-3">

          {teachers.length === 0 && (

            <div className="py-10 text-center text-gray-500">
              Aucun enseignant enregistré.
            </div>

          )}

          {teachers.map(
            (teacher) => (

              <div
                key={teacher.id}
                className="
                  flex
                  flex-col
                  gap-4
                  rounded-xl
                  border
                  border-gray-200
                  p-4
                  transition
                  hover:bg-gray-50
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >

                {/* INFORMATIONS */}

                <div>

                  <div className="flex items-center gap-2 font-semibold text-gray-800">

                    <UserCheck
                      size={18}
                      className="text-[#6214BE]"
                    />

                    {teacher.last_name}{" "}
                    {teacher.first_name}

                  </div>

                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">

                    <Phone size={15} />

                    {teacher.phone}

                  </div>

                  {/* DATE DE NAISSANCE */}

                  {teacher.date_of_birth && (

                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">

                      <CalendarDays
                        size={15}
                      />

                    <span>
                            Né(e) le{" "}
                            {new Date(
                              `${teacher.date_of_birth}T00:00:00`
                            ).toLocaleDateString("fr-FR")}
                          </span>

                    </div>

                  )}

                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-2">

                  <Link
                    href={`/teachers/admin/${teacher.id}`}
                  >

                    <button
                      type="button"
                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-2
                        rounded-lg
                        bg-green-50
                        px-3
                        py-2
                        text-green-700
                        transition
                        hover:bg-green-100
                      "
                    >

                      <Eye size={16} />

                      Voir

                    </button>

                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(
                        teacher
                      )
                    }
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-lg
                      bg-blue-50
                      px-3
                      py-2
                      text-blue-700
                      transition
                      hover:bg-blue-100
                    "
                  >

                    <Pencil size={16} />

                    Modifier

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        teacher.id
                      )
                    }
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-lg
                      bg-red-50
                      px-3
                      py-2
                      text-red-700
                      transition
                      hover:bg-red-100
                    "
                  >

                    <Trash2 size={16} />

                    Supprimer

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}