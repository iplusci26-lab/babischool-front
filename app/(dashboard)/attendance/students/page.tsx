"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AttendancePage() {

  const [schedules, setSchedules] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  

  const loadSchedules = async () => {
    const res = await api.get("/academics/schedules/");
    setSchedules(res.data.results || res.data);
  };

  const loadSession = async (schedule_id:string) => {
    const res = await api.get(
      `/attendance/session/?schedule_id=${schedule_id}`
    );

    setSession(res.data);
    setRecords(res.data.students || []);
    console.log(res.data)
  };
  
  useEffect(()=>{
    loadSchedules();
    
  },[]);

  const updateStatus = (
    id:string, 
    status:string
  ) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.record_id  === id 
        ? { ...r, status } 
        : r
      )
    );
    console.log(status)
  };

  const submit = async () => {

    const payload = records.map(r => ({
      record_id: r.record_id,
      status: r.status,
      minutes_late: r.minutes_late || 0
    }));
    
    await api.post("/attendance/take/", {
      schedule_id: selected,
      updates: payload
    });
    
    alert("Présence enregistrée");
  };
  
  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-bold">
        Appel par cours
      </h1>

      <select
        className="border p-3 rounded-lg w-full max-w-md"
        value={selected}
        onChange={(e)=>{
          setSelected(e.target.value);
          loadSession(e.target.value);
        }}
      >
        <option value="">Choisir cours</option>

        {schedules.map(s=>(
          <option key={s.id} value={s.id}>
            {s.classroom_name} - {s.subject_name} - {s.weekday}
          </option>
        ))}
      </select>
      
       {/* HEADER SESSION */}

       {session && (

          <div className="bg-white rounded-2xl shadow p-5 space-y-3">

            <div className="flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-bold">
                  {session.schedule.subject}
                </h2>

                <p className="text-gray-500">
                  {session.schedule.classroom}
                </p>

              </div>

              <div>

                {session.is_closed ? (

                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                    Session clôturée
                  </span>

                ) : (

                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                    Session ouverte
                  </span>

                )}

              </div>

            </div>

            <div className="text-sm text-gray-600">

              {session.schedule.weekday} •{" "}
              {session.schedule.start_time} -{" "}
              {session.schedule.end_time}

            </div>

            {/* STATS */}

            <div className="grid grid-cols-4 gap-3 pt-2">

              <div className="border rounded-xl p-3 text-center">
                <div className="text-sm text-gray-500">
                  Total
                </div>

                <div className="text-xl font-bold">
                  {session.stats.total}
                </div>
              </div>

              <div className="border rounded-xl p-3 text-center">
                <div className="text-sm text-gray-500">
                  Présents
                </div>

                <div className="text-xl font-bold text-green-600">
                  {records.filter(r => r.status === "present").length}
                </div>
              </div>

              <div className="border rounded-xl p-3 text-center">
                <div className="text-sm text-gray-500">
                  Absents
                </div>

                <div className="text-xl font-bold text-red-600">
                  {records.filter(r => r.status === "absent").length}
                </div>
              </div>

              <div className="border rounded-xl p-3 text-center">
                <div className="text-sm text-gray-500">
                  Retards
                </div>

                <div className="text-xl font-bold text-orange-600">
                  {records.filter(r => r.status === "late").length}
                </div>
              </div>

            </div>

          </div>
          )}
      <div className="space-y-3">
        {records.map((r) => (
          <div
            key={r.record_id}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
          >
            <div className="font-medium">
                {r.student_name}
            </div>
            {records.length > 0 && !session?.is_closed && (
            <div className="flex gap-2">

              <button
                onClick={() => updateStatus(r.record_id, "present")}
                className={`px-3 py-1 rounded-lg ${
                  r.status === "present"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                ✅
              </button>

              <button
                onClick={() => updateStatus(r.record_id, "absent")}
                className={`px-3 py-1 rounded-lg ${
                  r.status === "absent"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                ❌
              </button>

              <button
                onClick={() => updateStatus(r.record_id, "late")}
                className={`px-3 py-1 rounded-lg ${
                  r.status === "late"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                ⏱️
              </button>

            </div>
            )}
          </div>
        ))}
      </div>

      {records.length > 0 && !session?.is_closed && (
        <button
          onClick={submit}
          className="bg-purple-600 text-white p-2 rounded"
        >
          Enregistrer
        </button>
      )}

    </div>
  );
}