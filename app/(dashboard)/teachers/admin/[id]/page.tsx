"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

const DAYS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi"];

const DAY_LABELS:any = {
  Lundi:"Lundi",
  Mardi:"Mardi",
  Mercredi:"Mercredi",
  Jeudi:"Jeudi",
  Vendredi:"Vendredi"
};

export default function TeacherDetailPage() {
  const { id } = useParams();

  const [teacher, setTeacher] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  const [form, setForm] = useState({
    classroom_id: "",
    subject_id: "",
  });
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const extract = (res:any) => res.data.results || res.data;

  useEffect(() => {
    api.get("/students/classrooms/").then(r => setClassrooms(r.data.results || r.data));
    api.get("/academics/subjects/").then(r => setSubjects(r.data.results || r.data));
    load();
  }, []);

  const load = async () => {
    const t = await api.get(`/academics/teachers/`);
    const found = extract(t).find((x:any)=>x.id===id);
    setTeacher(found);

    const s = await api.get(`/academics/schedules/?teacher_id=${id}`);
    setSchedules(extract(s));

    const a = await api.get(`/academics/class-subjects/?teacher_id=${id}`);
    console.log("teacher ",id);
    setAssignments(extract(a));
  };

  const getByDay = (day:string) =>
    schedules
      .filter(s=>s.weekday===day)
      .sort((a,b)=>a.start_time.localeCompare(b.start_time));

 const mark = async (status:string, schedule_id:string) => {
        try {
          await api.post("/attendance/teacher-attendance/", {
            schedule_id,
            status
          });
      
          alert("Statut enregistré");
        } catch (e) {
          console.error(e);
          alert("Erreur");
        }
      };

  const affecter = async ()=> {
      try{
        const res = await api.post("/academics/class-subjects/", {
          classroom: form.classroom_id,
          subject: form.subject_id,
          teacher: id
      });
        if(res.data=="null"){
          alert("Cette liaison existe déjà ");
        }else{
          alert("Affectation enregistré ");
        }
       
        load(); // reload page
      }
      catch (e) {
        console.error(e);
        alert("Erreur d'affectation");
      }
    }
    
  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-white p-4 rounded border">
        <h1 className="text-xl font-bold">
          {teacher?.first_name} {teacher?.last_name}
        </h1>
        <p className="text-sm text-gray-500">
          {teacher?.phone}
        </p>
      </div>

      {/* 📊 MINI DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded border text-center">
          <div className="text-xl font-bold">
            {assignments.length}
          </div>
          <div className="text-sm text-gray-500">
            Classes en charge
          </div>
        </div>

        <div className="bg-white p-4 rounded border text-center">
          <div className="text-xl font-bold">
            {schedules.length}
          </div>
          <div className="text-sm text-gray-500">
            Cours aujourd'hui
          </div>
        </div>

      </div>

      {/* 📚 AFFECTATIONS */}
      <div className="bg-white p-4 rounded border space-y-3">
        <h2 className="font-bold">Affecter une matière</h2>

        <select
            value={form.classroom_id}
            onChange={(e)=>setForm({...form, classroom_id:e.target.value})}
            className="border p-2 w-full"
        >
            <option value="">Classe</option>
            {classrooms.map((c:any)=>(
            <option key={c.id} value={c.id}>{c.name}</option>
            ))}
        </select>

        <select
            value={form.subject_id}
            onChange={(e)=>setForm({...form, subject_id:e.target.value})}
            className="border p-2 w-full"
        >
            <option value="">Matière</option>
            {subjects.map((s:any)=>(
            <option key={s.id} value={s.id}>{s.name}</option>
            ))}
        </select>

        <button
            onClick={affecter}
            className="bg-[#6214BE] text-white p-2 rounded w-full"
        >
            Affecter
        </button>
        </div>


      <div className="bg-white p-4 rounded border">
        <h2 className="font-bold mb-3">
          Matières affectées
        </h2>

        {assignments.length === 0 && (
          <div className="text-gray-400 text-sm">
            Aucune affectation
          </div>
        )}

        <div className="space-y-2">
          {assignments.map((a:any)=>(
            <div key={a.id} className="border p-3 rounded">
              <div className="font-medium">
                {a.subject_name}
              </div>
              <div className="text-sm text-gray-500">
                {a.classroom_name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📅 EMPLOI DU TEMPS */}
      <div className="bg-white p-4 rounded border">

        <h2 className="font-bold mb-3">
          Emploi du temps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {DAYS.map(day=>(
            <div key={day} className="border p-3 rounded">

              <h3 className="font-medium mb-2">
                {DAY_LABELS[day]}
              </h3>

              {getByDay(day).map((s:any)=>(
                <div key={s.id} className="bg-gray-100 p-2 rounded mb-2 text-sm">

                <div className="font-medium">
                  {s.start_time} - {s.end_time}
                </div>
            
                <div>{s.subject_name}</div>
            
                <div className="text-xs text-gray-500">
                  {s.classroom_name}
                </div>
            
                {/* ✅ BOUTONS PRÉSENCE */}
                <div className="flex gap-2 mt-2">
            
                  <button
                    onClick={()=>mark("present", s.id)}
                    className="text-green-600 text-xs"
                  >
                    Présent
                  </button>
            
                  <button
                    onClick={()=>mark("absent", s.id)}
                    className="text-red-600 text-xs"
                  >
                    Absent
                  </button>
            
                  <button
                    onClick={()=>mark("late", s.id)}
                    className="text-yellow-600 text-xs"
                  >
                    Retard
                  </button>
            
                </div>
            
              </div>
              ))}

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}