"use client";

import { useEffect, useRef, useState } from "react";
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

interface TeacherForm {
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
}

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string | null;
}

const INITIAL_FORM: TeacherForm = {
  first_name: "",
  last_name: "",
  phone: "",
  date_of_birth: "",
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selected, setSelected] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<TeacherForm>(INITIAL_FORM);

  // Référence vers le formulaire
  const formRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // EXTRACTION DES DONNÉES
  // ============================================================

  const extract = (res: any): Teacher[] => {
    const data = res.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    return [];
  };

  // ============================================================
  // CHARGEMENT DES ENSEIGNANTS
  // ============================================================

  const loadTeachers = async () => {
    try {
      const res = await api.get("/academics/teachers/");
      setTeachers(extract(res));
    } catch (error) {
      console.error(
        "Erreur lors du chargement des enseignants :",
        error
      );

      toast.error(
        "Impossible de charger la liste des enseignants."
      );
    }
  };

  useEffect(() => {
    void loadTeachers();
  }, []);

  // ============================================================
  // CHANGEMENT DES CHAMPS
  // ============================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // RESET FORMULAIRE
  // ============================================================

  const resetForm = () => {
    setForm({ ...INITIAL_FORM });
    setSelected(null);
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = (): boolean => {
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.phone.trim()
    ) {
      toast.error(
        "Le prénom, le nom et le téléphone sont obligatoires."
      );

      return false;
    }

    return true;
  };

  // ============================================================
  // DONNÉES ENVOYÉES AU BACKEND
  // ============================================================

  const getPayload = () => ({
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    phone: form.phone.trim(),

    // La date de naissance est facultative.
    // Une chaîne vide devient null.
    date_of_birth: form.date_of_birth || null,
  });

  // ============================================================
  // CRÉATION
  // ============================================================

  const handleCreate = async () => {
    if (loading || !validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/academics/teachers/",
        getPayload()
      );

      toast.success("Enseignant ajouté avec succès.");

      resetForm();
      await loadTeachers();
    } catch (error: any) {
      console.error(
        "Erreur lors de la création de l'enseignant :",
        error
      );

      const backendMessage =
        error?.response?.data?.date_of_birth?.[0];

      toast.error(
        backendMessage ||
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
    if (!selected || loading || !validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await api.put(
        `/academics/teachers/${selected.id}/`,
        getPayload()
      );

      toast.success(
        "Modification effectuée avec succès."
      );

      resetForm();
      await loadTeachers();
    } catch (error: any) {
      console.error(
        "Erreur lors de la modification :",
        error
      );

      const backendMessage =
        error?.response?.data?.date_of_birth?.[0];

      toast.error(
        backendMessage ||
          "Erreur lors de la modification de l'enseignant."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SUPPRESSION
  // ============================================================

  const handleDelete = async (id: string) => {
    if (loading) {
      return;
    }

    if (!window.confirm("Supprimer cet enseignant ?")) {
      return;
    }

    try {
      setLoading(true);

      await api.delete(
        `/academics/teachers/${id}/`
      );

      toast.success("Enseignant supprimé avec succès.");

      if (selected?.id === id) {
        resetForm();
      }

      await loadTeachers();
    } catch (error) {
      console.error(
        "Erreur lors de la suppression :",
        error
      );

      toast.error(
        "Erreur lors de la suppression de l'enseignant."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // MODIFICATION — CHARGER LES DONNÉES
  // ============================================================

  const handleEdit = (teacher: Teacher) => {
    if (loading) {
      return;
    }

    setSelected(teacher);

    setForm({
      first_name: teacher.first_name || "",
      last_name: teacher.last_name || "",
      phone: teacher.phone || "",

      // Un input type="date" attend une chaîne vide
      // et non null lorsqu'aucune date n'est renseignée.
      date_of_birth: teacher.date_of_birth || "",
    });

    // Faire défiler la page jusqu'au formulaire.
    // Le défilement est fluide et le formulaire
    // se positionne en haut de la zone visible.
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ============================================================
  // AFFICHAGE
  // ============================================================

  return (
    <div className="space-y-8">
      {/* HEADER */}

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

      {/* FORMULAIRE */}

      <div
        ref={formRef}
        className="
          scroll-mt-24
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
        "
      >
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
              disabled={loading}
              className="
                w-full rounded-xl border border-gray-300
                px-4 py-3
                focus:border-transparent focus:outline-none
                focus:ring-2 focus:ring-[#6214BE]
                disabled:opacity-50
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
              disabled={loading}
              className="
                w-full rounded-xl border border-gray-300
                px-4 py-3
                focus:border-transparent focus:outline-none
                focus:ring-2 focus:ring-[#6214BE]
                disabled:opacity-50
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
              disabled={loading}
              className="
                w-full rounded-xl border border-gray-300
                px-4 py-3
                focus:border-transparent focus:outline-none
                focus:ring-2 focus:ring-[#6214BE]
                disabled:opacity-50
              "
            />
          </div>

          {/* DATE DE NAISSANCE — FACULTATIVE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Date de naissance
              <span className="ml-1 font-normal text-gray-400">
                (facultative)
              </span>
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="
                  absolute left-3 top-1/2
                  -translate-y-1/2 text-gray-400
                "
              />

              <input
                name="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={handleChange}
                disabled={loading}
                className="
                  w-full rounded-xl border border-gray-300
                  py-3 pl-10 pr-4
                  focus:border-transparent focus:outline-none
                  focus:ring-2 focus:ring-[#6214BE]
                  disabled:opacity-50
                "
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={
              selected ? handleUpdate : handleCreate
            }
            disabled={loading}
            className="
              rounded-xl bg-[#6214BE] px-6 py-3
              font-medium text-white transition
              hover:bg-[#4f10a0]
              disabled:cursor-not-allowed
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
                rounded-xl border border-gray-300
                px-6 py-3 transition hover:bg-gray-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* LISTE DES ENSEIGNANTS */}

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

          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="
                flex flex-col gap-4 rounded-xl
                border border-gray-200 p-4
                transition hover:bg-gray-50
                md:flex-row md:items-center
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

                {teacher.date_of_birth && (
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays size={15} />

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
                  className="
                    flex cursor-pointer items-center gap-2
                    rounded-lg bg-green-50 px-3 py-2
                    text-green-700 transition hover:bg-green-100
                  "
                >
                  <Eye size={16} />
                  Voir
                </Link>

                <button
                  type="button"
                  onClick={() => handleEdit(teacher)}
                  disabled={loading}
                  className="
                    flex cursor-pointer items-center gap-2
                    rounded-lg bg-blue-50 px-3 py-2
                    text-blue-700 transition hover:bg-blue-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Pencil size={16} />
                  Modifier
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(teacher.id)}
                  disabled={loading}
                  className="
                    flex cursor-pointer items-center gap-2
                    rounded-lg bg-red-50 px-3 py-2
                    text-red-700 transition hover:bg-red-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}