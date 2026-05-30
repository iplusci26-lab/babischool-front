"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AssignmentsPage() {

  const [assignments, setAssignments] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  const [form, setForm] = useState({
    classroom_id: "",
    subject_id: "",
    teacher_id: "",
  });

  const loadData = async () => {
    const [a, c, s, t] = await Promise.all([
      api.get("/academics/class-subjects/"),
      api.get("/students/classrooms/"),
      api.get("/academics/subjects/"),
      api.get("/academics/teachers/"),
    ]);

    console.log("Assignments:", a.data);
    setAssignments(a.data.results || a.data);
    setClassrooms(c.data.results || c.data);
    setSubjects(s.data.results || s.data);
    setTeachers(t.data.results || t.data);
  };
 
  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    await api.post("/academics/class-subjects/", {
      classroom: form.classroom_id,
      subject: form.subject_id,
      teacher: form.teacher_id,
    });
    setForm({ classroom_id:"", subject_id:"", teacher_id:"" });
    loadData();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/academics/class-subjects/${id}/`);
    loadData();
  };
  console.log("Form:", form);
  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-bold">Affectations</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded border grid grid-cols-3 gap-2">

        <select
          value={form.classroom_id}
          onChange={(e)=>setForm({...form, classroom_id:e.target.value})}
          className="border p-2"
        >
          <option value="">Classe</option>
          {classrooms.map((c)=>(
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={form.subject_id}
          onChange={(e)=>setForm({...form, subject_id:e.target.value})}
          className="border p-2"
        >
          <option value="">Matière</option>
          {subjects.map((s)=>(
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={form.teacher_id}
          onChange={(e)=>setForm({...form, teacher_id:e.target.value})}
          className="border p-2"
        >
          <option value="">Prof</option>
          {teachers.map((t)=>(
            <option key={t.id} value={t.id}>
              {t.first_name} {t.last_name}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreate}
          className="col-span-3 bg-[#6214BE] text-white p-2 rounded"
        >
          Ajouter
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white p-4 rounded border space-y-2">

        {assignments.map((a)=>(
          <div key={a.id} className="flex justify-between border-b py-2">

            <div>
              <strong>{a.classroom_name}</strong> — {a.subject_name}
            </div>

            <div className="flex gap-4">
              <span className="text-sm text-gray-600">
                {a.teacher_name}
              </span>

              <button
                onClick={()=>handleDelete(a.id)}
                className="text-red-500"
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