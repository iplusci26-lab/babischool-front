"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

export default function SchedulePage() {

  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);

  const [selectedClass, setSelectedClass] = useState("");

  const [form, setForm] = useState({
    classroom_id: "",
    subject_id: "",
    teacher_id: "",
    weekday: "Lundi",
    start_time: "",
    end_time: "",
    date_of_day:"",
  });

  const extract = (res:any)=>res.data.results || res.data;

  const loadData = async () => {
    const [c, s, t] = await Promise.all([
      api.get("/students/classrooms/"),
      api.get("/academics/subjects/"),
      api.get("/academics/teachers/"),
    ]);

    
    setClassrooms(extract(c));
    setSubjects(extract(s));
    setTeachers(extract(t));
  };

  const loadSchedules = async () => {
    if (!selectedClass) return;

    const res = await api.get(
      `/academics/schedules/?classroom_id=${selectedClass}`
    );

    console.log(res)
    setSchedules(extract(res));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [selectedClass]);

  const handleCreate = async () => {

    if (
      !form.subject_id ||
      !form.teacher_id ||
      !form.start_time ||
      !form.end_time ||
      !form.date_of_day||
      !selectedClass
    ) {
      alert("Tous les champs sont obligatoires");
      return;
    }
  
    try{
      await api.post("/academics/schedules/", {
        classroom_id: selectedClass,
        subject_id: form.subject_id,
        teacher_id: form.teacher_id,
        weekday: form.weekday,
        start_time: form.start_time,
        end_time: form.end_time,
        date_of_day:form.date_of_day
      });

    loadSchedules();
  }catch (error: any) {
    const msg =
    error.response?.data?.non_field_errors?.[0] ||
    "Erreur";

  alert(msg);
  }
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/academics/schedules/${id}/`);
    loadSchedules();
  };

  const getCell = (day:string) => {
    return schedules.filter(s => s.weekday === day);
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-bold">Emploi du temps</h1>

      {/* SELECT CLASS */}
      <select
        className="border p-2"
        value={selectedClass}
        onChange={(e)=>setSelectedClass(e.target.value)}
      >
        <option value="">Choisir classe</option>
        {classrooms.map(c=>(
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* FORM */}
      {selectedClass && (
        <div className="bg-white p-4 flex rounded border grid grid-cols-4 gap-4">

          <select
            value={form.weekday}
            onChange={(e)=>setForm({...form, weekday:e.target.value})}
            className="border p-2"
          >
            {DAYS.map(d=>(
              <option key={d} value={d}>{d}</option>
            ))}
          </select>


          <select
            value={form.subject_id}
            onChange={(e)=>setForm({...form, subject_id:e.target.value})}
            className="border p-2"
          >
            <option value="">Matière</option>
            {subjects.map(s=>(
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>


          <select
            value={form.teacher_id}
            onChange={(e)=>setForm({...form, teacher_id:e.target.value})}
            className="border p-2"
          >
            <option value="">Prof</option>
            {teachers.map(t=>(
              <option key={t.id} value={t.id}>
                {t.first_name} {t.last_name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border p-2"
            value={form.date_of_day}
            onChange={(e)=>
              setForm({
                ...form,
                date_of_day: e.target.value
              })
            }
          />

          <input
            type="time"
            value={form.start_time}
            onChange={(e)=>setForm({...form, start_time:e.target.value})}
            className="border p-2"
          />

          <input
            type="time"
            value={form.end_time}
            onChange={(e)=>setForm({...form, end_time:e.target.value})}
            className="border p-2"
          />

        

          <button
            onClick={handleCreate}
            className="col-span-5 bg-[#6214BE] text-white p-2 rounded cursor-pointer"
          >
            Ajouter
          </button>

        </div>
      )}

      {/* GRID */}
      {selectedClass && (
        <div className="grid grid-cols-5 gap-4">

          {DAYS.map(day => (
            <div key={day} className="bg-white p-4 rounded border">

              <h2 className="font-bold mb-2">{day}</h2>

              {getCell(day).map((s:any)=>(
                <div
                  key={s.id}
                  className="border p-2 mb-2 rounded text-sm"
                >
                  <div>{s.start_time} - {s.end_time}</div>
                  <div className="font-medium">{s.subject_name}</div>
                  <div className="text-gray-500">
                    {s.teacher_name}
                  </div>

                  <button
                    onClick={()=>handleDelete(s.id)}
                    className="text-red-500 text-xs mt-1"
                  >
                    supprimer
                  </button>
                </div>
              ))}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}