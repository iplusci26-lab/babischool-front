"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProtectedRoute from "@/components/auth/protected-route";
import RecentActivity
from "../notifications/components/RecentActivity";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  

  const load = async () => {
    const res = await api.get("/attendance/stats/");
    setStats(res.data);

    const result = await api.get("/dashboard/admin/");
      setData(result.data);
      console.log("result ",data)
    
  };


  useEffect(() => {
    load();
   
  }, []);
  
  if (!data) return <div>Loading...</div>;
  if (!stats) return <div className="p-6">Loading...</div>;

  return (

  <ProtectedRoute menu="dashboard">

    <div className="p-6 space-y-6">

      

      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>
      <RecentActivity />
      <div className="grid grid-cols-3 gap-4">
        <Card title="Students" value={data.students_count} />
        <Card title="Payments" value={data.total_payments} />
        <Card title="Messages" value={data.unread_messages} />
      </div>

      {/* 📊 TODAY */}
      <div>
        <h2 className="font-semibold mb-3">Aujourd’hui</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          <div className="bg-white p-4 rounded border">
            <div className="text-xl font-bold">
              {stats.today.total}
            </div>
            <div className="text-sm text-gray-500">
              Cours
            </div>
          </div>

          <div className="bg-green-100 p-4 rounded">
            <div className="text-xl font-bold">
              {stats.today.present}
            </div>
            <div>Présents</div>
          </div>

          <div className="bg-red-100 p-4 rounded">
            <div className="text-xl font-bold">
              {stats.today.absent}
            </div>
            <div>Absents</div>
          </div>

          <div className="bg-yellow-100 p-4 rounded">
            <div className="text-xl font-bold">
              {stats.today.late}
            </div>
            <div>Retards</div>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <div className="text-xl font-bold">
              {stats.today.not_marked}
            </div>
            <div>Non marqués</div>
          </div>

        </div>
      </div>

      {/* 📅 WEEK */}
      <div>
        <h2 className="font-semibold mb-3">Cette semaine</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          <div className="bg-white p-4 rounded border">
            <div className="text-xl font-bold">
              {stats.week.total}
            </div>
            <div className="text-sm text-gray-500">
              Cours
            </div>
          </div>

          <div className="bg-green-100 p-4 rounded">
            <div className="text-xl font-bold">
              {stats.week.present}
            </div>
            <div>Présents</div>
          </div>

          <div className="bg-blue-100 p-4 rounded">
            <div className="text-xl font-bold">
              {stats.week.rate}%
            </div>
            <div>Taux présence</div>
          </div>

        </div>
      </div>

      {/* 🚨 TOP ABSENTS */}
      <div>
        <h2 className="font-semibold mb-3">
          Professeurs les plus absents
        </h2>

        <div className="bg-white p-4 rounded border space-y-2">

          {stats.top_absents.length === 0 && (
            <div className="text-gray-400 text-sm">
              Aucun absent enregistré
            </div>
          )}

          {stats.top_absents.map((t:any, index:number)=>(
            <div
              key={index}
              className="flex justify-between border-b pb-2"
            >
              <span>{t.name}</span>
              <span className="text-red-600 font-medium">
                {t.count} absences
              </span>
            </div>
          ))}

        </div>
      </div>

    </div>
   
  </ProtectedRoute>
    
  );

 
  
}

function Card({ title, value }: any) {
  return (
    <div className="p-4 bg-white border rounded-xl">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  
  );
}

