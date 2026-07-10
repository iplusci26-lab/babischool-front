"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      phone: "",
      password: "",
    });
    setSelected(null);
  };

  // CREATE
  const handleCreate = async () => {
    
    if (!form.first_name || !form.last_name || !form.phone || !form.password) {
      alert("Tous les champs sont obligatoires");
      return;
    }

    setLoading(true);
    
    const res = await api.post("/academics/teachers/", form);
    console.log("------- CREATE data ",res)
    resetForm();
    loadTeachers();
    setLoading(false);
    
  };

  
  // UPDATE
  const handleUpdate = async () => {
    console.log("------- UPDATE ")
    setLoading(true);

    await api.put(`/academics/teachers/${selected.id}/`, {
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
    });

    resetForm();
    loadTeachers();
    setLoading(false);
  };

  // DELETE
  const handleDelete = async (id: string) => {
    console.log("------- DELETE ")
    if (!confirm("Supprimer ce professeur ?")) return;

    await api.delete(`/academics/teachers/${id}/`);
    loadTeachers();
  };

  // SELECT
  const handleEdit = (t: any) => {
    console.log("------- EDITE ")
    setSelected(t);
    setForm({
      first_name: t.first_name,
      last_name: t.last_name,
      phone: t.phone,
      password: "",
    });
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-bold">Professeurs</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded border max-w-md space-y-3">

        <h2 className="font-medium">
          {selected ? "Modifier" : "Ajouter"} un professeur
        </h2>

        <input
          name="first_name"
          placeholder="Prénom"
          className="border p-2 w-full"
          value={form.first_name}
          onChange={handleChange}
        />

        <input
          name="last_name"
          placeholder="Nom"
          className="border p-2 w-full"
          value={form.last_name}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Téléphone"
          className="border p-2 w-full"
          value={form.phone}
          onChange={handleChange}
        />

        {!selected && (
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            className="border p-2 w-full"
            value={form.password}
            onChange={handleChange}
          />
        )}

        <button
          onClick={selected ? handleUpdate : handleCreate}
          className="bg-[#6214BE] text-white w-full p-2 rounded"
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
            className="w-full p-2 border rounded"
          >
            Annuler
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded border">

        <h2 className="font-medium mb-3">
          Liste des professeurs
        </h2>

        <div className="space-y-2">
          {teachers.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <div className="font-medium">
                  {t.first_name} {t.last_name}
                </div>
                <div className="text-sm text-gray-500">
                  {t.phone}
                </div>
              </div>

              <div className="flex gap-2">

              <Link href={`/teachers/admin/${t.id}`}>
                  <div className="text-green-600 text-sm ">
                    Voir
                  </div>
                </Link>

                <button
                  onClick={() => handleEdit(t)}
                  className="text-blue-600 text-sm"
                >
                  Modifier
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-600 text-sm"
                >
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