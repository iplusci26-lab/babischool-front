"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export default function StudentAttendance({
  studentId,
}: {
  studentId: string;
}) {

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAttendance = async () => {

    try {

      const res = await api.get(
        `/students/${studentId}/attendance/`
      );

      setRecords(res.data.results || res.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    loadAttendance();

  }, []);

  const stats = useMemo(() => {

    const total = records.length;

    const present = records.filter(
      r => r.status === "present"
    ).length;

    const absent = records.filter(
      r => r.status === "absent"
    ).length;

    const late = records.filter(
      r => r.status === "late"
    ).length;

    const excused = records.filter(
      r => r.status === "excused"
    ).length;

    const attendanceRate = total > 0
      ? ((present / total) * 100).toFixed(1)
      : "0";

    return {
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate
    };

  }, [records]);

  if (loading) {

    return (
      <div className="p-6">
        Chargement...
      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* STATS */}

      <div className="grid md:grid-cols-5 gap-4">

        <StatCard
          title="Présence"
          value={`${stats.attendanceRate}%`}
        />

        <StatCard
          title="Présents"
          value={stats.present}
        />

        <StatCard
          title="Absents"
          value={stats.absent}
        />

        <StatCard
          title="Retards"
          value={stats.late}
        />

        <StatCard
          title="Justifiés"
          value={stats.excused}
        />

      </div>

      {/* TABLE */}

      <div className="bg-white border rounded-3xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 border-b">

              <tr className="text-left text-sm">

                <th className="p-4">
                  Date
                </th>

                <th className="p-4">
                  Matière
                </th>

                <th className="p-4">
                  Professeur
                </th>

                <th className="p-4">
                  Statut
                </th>

                <th className="p-4">
                  Retard
                </th>

              </tr>

            </thead>

            <tbody>

              {records.map((record) => (

                <tr
                  key={record.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    {record.date}
                  </td>

                  <td className="p-4 font-medium">
                    {record.subject}
                  </td>

                  <td className="p-4">
                    {record.teacher}
                  </td>

                  <td className="p-4">

                    <StatusBadge
                      status={record.status}
                    />

                  </td>

                  <td className="p-4">

                    {record.minutes_late > 0
                      ? `${record.minutes_late} min`
                      : "--"
                    }

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {

  const styles: any = {

    present:
      "bg-green-100 text-green-700",

    absent:
      "bg-red-100 text-red-700",

    late:
      "bg-orange-100 text-orange-700",

    excused:
      "bg-blue-100 text-blue-700",
  };

  const labels: any = {

    present: "Présent",
    absent: "Absent",
    late: "Retard",
    excused: "Justifié",
  };

  return (

    <span
      className={`
        px-3 py-1 rounded-full text-sm font-medium
        ${styles[status]}
      `}
    >
      {labels[status]}
    </span>
  );
}

function StatCard({
  title,
  value,
}: any) {

  return (

    <div className="bg-white border rounded-3xl p-5">

      <div className="text-sm text-gray-500">
        {title}
      </div>

      <div className="text-3xl font-bold mt-2">
        {value}
      </div>

    </div>
  );
}