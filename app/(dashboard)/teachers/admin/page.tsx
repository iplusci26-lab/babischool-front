"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  Phone,
  GraduationCap,
  UserCheck,
} from "lucide-react";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const extract = (res: any) => res.data.results || res.data;

  const loadTeachers = async () => {
    const res = await api.get("/academics/teachers/");
    setTeachers(extract(res));
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      phone: "",
    });

    setSelected(null);
  };

  // CREATE
  const handleCreate = async () => {
    if (!form.first_name || !form.last_name || !form.phone) {
      alert("Tous les champs sont obligatoires");
      return;
    }

    try {
      setLoading(true);

      await api.post("/academics/teachers/", form);

      resetForm();
      loadTeachers();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await api.put(`/academics/teachers/${selected.id}/`, {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      });

      resetForm();
      loadTeachers();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification.");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet enseignant ?")) return;

    try {
      await api.delete(`/academics/teachers/${id}/`);
      loadTeachers();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
    }
  };

  // EDIT
  const handleEdit = (teacher: any) => {
    setSelected(teacher);

    setForm({
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      phone: teacher.phone,
    });
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Enseignants
          </h1>

          <p className="text-gray-500 mt-1">
            Gérez les enseignants de votre établissement.
          </p>

        </div>

      </div>

      {/* FORMULAIRE */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

        <div className="flex items-center gap-2 mb-6">

          <UserPlus className="text-[#6214BE]" size={22} />

          <h2 className="text-lg font-semibold">

            {selected
              ? "Modifier un enseignant"
              : "Ajouter un enseignant"}

          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            name="first_name"
            placeholder="Prénom"
            value={form.first_name}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6214BE] focus:border-transparent"
          />

          <input
            name="last_name"
            placeholder="Nom"
            value={form.last_name}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6214BE] focus:border-transparent"
          />

          <input
            name="phone"
            placeholder="Téléphone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6214BE] focus:border-transparent"
          />

        </div>

        <div className="flex gap-3 mt-6">

          <button
            onClick={selected ? handleUpdate : handleCreate}
            disabled={loading}
            className="bg-[#6214BE] hover:bg-[#4f10a0] text-white px-6 py-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            {loading
              ? "Chargement..."
              : selected
              ? "Mettre à jour"
              : "Ajouter"}
          </button>

          {selected && (

            <button
              onClick={resetForm}
              className="border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-xl transition"
            >
              Annuler
            </button>

          )}

        </div>

      </div>

      {/* LISTE */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

        <h2 className="text-lg font-semibold mb-5">
          Liste des enseignants
        </h2>

        <div className="space-y-3">

          {teachers.length === 0 && (

            <div className="text-center text-gray-500 py-10">
              Aucun enseignant enregistré.
            </div>

          )}

          {teachers.map((teacher) => (

            <div
              key={teacher.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition"
            >

              <div>

                <div className="flex items-center gap-2 font-semibold text-gray-800">

                  <UserCheck
                    size={18}
                    className="text-[#6214BE]"
                  />

                  {teacher.last_name} {teacher.first_name} 

                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">

                  <Phone size={15} />

                  {teacher.phone}

                </div>

              </div>

              <div className="flex flex-wrap gap-2">

                <Link href={`/teachers/admin/${teacher.id}`}>

                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition">

                    <Eye size={16} />

                    Voir

                  </button>

                </Link>

                <button
                  onClick={() => handleEdit(teacher)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                >

                  <Pencil size={16} />

                  Modifier

                </button>

                <button
                  onClick={() => handleDelete(teacher.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
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