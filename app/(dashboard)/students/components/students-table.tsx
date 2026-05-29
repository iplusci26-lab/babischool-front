"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function StudentsTable() {
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [classe, setClasse] = useState("");
  const [effectif, setEffectif] = useState("");
  const [effectifGirl, setEffectifGirl] = useState("");
  const [effectifBoy, setEffectifBoy] = useState("");
  const [search, setSearch] = useState("");
  const [classroom, setClassroom] = useState("");

  const [loading, setLoading] = useState(false);
  const fetchStudents = async () => {
    setLoading(true);
   
    try {
      console.log("eeee",classroom)
      const res = await api.get("/students/", {
        params: {
          search,
          classroom_id: classroom,
        },
      });

      setStudents(res.data.data);
      setEffectif(res.data.data.length)
      setEffectifBoy(res.data.queryset_M)
      setEffectifGirl(res.data.queryset_F)

     

      
      if (classroom) {
        
        setClasse(classe);
        setEffectif(res.data.data.length)
        setEffectifBoy(res.data.queryset_M)
        setEffectifGirl(res.data.queryset_F)
        
      }else{
        setEffectif(res.data.total_E)
        setClasse("Effectif écoles");
      }
      
      console.log(res.data);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, classroom]);

  useEffect(() => {
    api.get("/students/classrooms/").then((res) => {
      setClassrooms(res.data);
    });
  }, []);

  return (
    <div className="space-y-4">

      {/* 🔍 FILTERS */}
      <div className="flex gap-4">

        <input
          placeholder="Search student..."
          className="border p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2"
          value={classroom}
          onChange={(e) => {
            console.log("Valeur :", e.target.value);
            setClassroom(e.target.value);
            setClasse(e.target.options[e.target.selectedIndex].text)
          }
          }

        >
          <option value="">Toutes les classes</option>

          {classrooms.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
              
            </option>
          ))}
        </select>

      </div>
      <div className="max-w-sm rounded overflow-hidden shadow-lg">
          <div className="flex flex-row px-6 py-4">
            <div className="font-bold text-xl mb-2 basis-2/3">{classe}</div>
            <div className="basis-2/3 font-bold text-xl text-gray-500 mb-2 text-right">
              {effectif} élèves
            </div>
            
          </div>
        <div className="px-4  pb-1">
          
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #{effectifGirl} filles
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #{effectifBoy} garçons
          </span>
        </div>
      </div>

      {/* 📊 TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Matricule</th>
                <th className="p-3">Name</th>
                <th className="p-3">Class</th>
                <th className="p-3">Parent</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s: any) => (
                <tr
                  key={s.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    window.location.href = `/students/${s.id}`;
                  }}
                >
                  <td className="p-3">{s.student_number}</td>
                  <td className="p-3">
                    {s.first_name} {s.last_name}
                  </td>
                  <td className="p-3">{s.classroom_name}</td>
                  <td className="p-3">{s.parent_phone}</td>
                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}