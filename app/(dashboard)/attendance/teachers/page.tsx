"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TodayAttendancePage() {

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await api.get("/attendance/teacher-attendance/today/");
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const mark = async (status:string, schedule_id:string) => {
    await api.post("/attendance/teacher-attendance/", {
      schedule_id,
      status
    });

    load(); // refresh
  };

  const getColor = (status:any) => {
    if (status === "present") return "bg-green-100";
    if (status === "absent") return "bg-red-100";
    if (status === "late") return "bg-yellow-100";
    return "bg-gray-50";
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-xl font-bold">
        Présence du jour
      </h1>

      {data.length === 0 && (
        <div className="text-gray-400">
          Aucun cours aujourd’hui
        </div>
      )}

      {data.map((item) => (
        <div
          key={item.schedule_id}
          className={`p-4 rounded border ${getColor(item.status)}`}
        >

          <div className="font-medium">
            {item.start_time} - {item.end_time}
          </div>

          <div className="text-sm">
            {item.teacher_name}
          </div>

          <div className="text-xs text-gray-500">
            {item.subject_name} • {item.classroom_name}
          </div>

          {/* 🔥 ACTIONS */}
          <div className="flex gap-2 mt-3">

            <button
              onClick={()=>mark("present", item.schedule_id)}
              className="text-green-700 text-xs"
            >
              Présent
            </button>

            <button
              onClick={()=>mark("absent", item.schedule_id)}
              className="text-red-700 text-xs"
            >
              Absent
            </button>

            <button
              onClick={()=>mark("late", item.schedule_id)}
              className="text-yellow-700 text-xs"
            >
              Retard
            </button>

          </div>

        </div>
      ))}

    </div>
  );
}