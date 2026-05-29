"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ClassroomsPage() {
  const [classes, setClasses] = useState([]);
  const [classroomlevel, setClassroomlevel] = useState([]);
  const [form, setForm] = useState({
    name: "",
    classroom_level: "",
    capacity: "",
    annual_tuition_fee: "",
  });

  const fetchClasses = async () => {
    const res = await api.get("/students/classrooms/");
    setClasses(res.data);
  };

  const createClass = async () => {

    await api.post("/students/classrooms/",form);
  
    fetchClasses();
  };

  useEffect(() => {
    fetchClasses();
    api.get("/students/classlevel/").then((res) => {
      setClassroomlevel(res.data);
      });
  }, []);

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Classes</h1>

      {/* ➕ CREATE */}
      <div className="space-y-4 max-w-xl">
        <input
          placeholder="Class name (ex: 6ème A)"
          className="border p-2 w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
        placeholder="Capacité de la classe"
        type="number"
        className="border p-2 w-full"
        value={form.capacity}
        onChange={(e) =>
            setForm({ ...form, capacity: Number(e.target.value) })
        }
        />

        <input
        placeholder="Scolarité annuelle"
        type="number"
        className="border p-2 w-full"
        value={form.annual_tuition_fee}
        onChange={(e) =>
            setForm({ ...form, annual_tuition_fee: Number(e.target.value) })
        }
        />

        <select
        className="border p-2 w-full"
        value={form.classroom_level}
        onChange={(e) =>
            setForm({ ...form, classroom_level: e.target.value })
        }
        >
        <option value="">Select cycle</option>

        {classroomlevel.map((c: any) => (
            <option key={c.id} value={c.id}>
            {c.name}
            </option>
        ))}
        </select>

        <button
          onClick={createClass}
          className="bg-purple-700 w-full text-white p-2 rounded cursor-pointer"
        >
          Ajouter
        </button>
      </div>

      {/* 📋 LIST */}
      <div className="bg-white border rounded-xl">
        {classes.map((c: any) => (
          <div key={c.id} className="p-3 border-b">
            {c.name}
          </div>
        ))}
      </div>

    </div>
  );
}