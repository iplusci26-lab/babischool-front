"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function SubjectsPage() {

  const [subjects, setSubjects] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    code: "",
    coefficient: 1,
  });

  const loadSubjects = async () => {
    const res = await api.get("/academics/subjects/");
    setSubjects(res.data.results || res.data);
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleCreate = async () => {
    await api.post("/academics/subjects/", form);
    setForm({ name: "", code: "", coefficient: 1 });
    loadSubjects();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/academics/subjects/${id}/`);
    loadSubjects();
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-bold">Matières</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded border flex gap-2">
        <input
          placeholder="Nom"
          className="border p-2"
          value={form.name}
          onChange={(e)=>setForm({...form, name:e.target.value})}
        />

        <input
          placeholder="Code"
          className="border p-2"
          value={form.code}
          onChange={(e)=>setForm({...form, code:e.target.value})}
        />

        <input
          type="number"
          className="border p-2 w-20"
          value={form.coefficient}
          onChange={(e)=>setForm({...form, coefficient:Number(e.target.value)})}
        />

        <button
          onClick={handleCreate}
          className="bg-[#6214BE] text-white px-4 rounded"
        >
          Ajouter
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded border space-y-2">
        {subjects.map((s) => (
          <div key={s.id} className="flex justify-between border-b py-2">
            <div>
              <strong>{s.name}</strong> ({s.code})
            </div>

            <button
              onClick={()=>handleDelete(s.id)}
              className="text-red-500"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}