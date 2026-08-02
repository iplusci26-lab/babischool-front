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
      r => r.status === "PRESENT"
    ).length;

    const absent = records.filter(
      r => r.status === "ABSENT"
    ).length;

    const late = records.filter(
      r => r.status === "LATE"
    ).length;

    const excused = records.filter(
      r => r.status === "EXCUSE"
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

      <div className="grid gap-4 md:grid-cols-4">

        <StatCard
          title="Présence"
          value={`${stats.attendanceRate}%`}
          color="purple"
        />

        <StatCard
          title="Présents"
          value={stats.present}
          color="green"
        />

        <StatCard
          title="Absents"
          value={stats.absent}
          color="red"
        />

        <StatCard
          title="Retards"
          value={stats.late}
          color="orange"
        />
        {/*<StatCard
                title="Justifiés"
                value={stats.excused}
        />*/}
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



interface StatCardProps {
  title: string;
  value: string | number;
  color?: "purple" | "green" | "red" | "orange";
}

function StatCard({
  title,
  value,
  color = "purple",
}: StatCardProps) {

  const colors = {
    purple: {
      bg: "bg-[#6214BE]/5",
      border: "border-[#6214BE]/20",
      title: "text-[#6214BE]",
      value: "text-[#6214BE]",
    },

    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      title: "text-green-700",
      value: "text-green-800",
    },

    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      title: "text-red-700",
      value: "text-red-800",
    },

    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      title: "text-orange-700",
      value: "text-orange-800",
    },
  };

  const style = colors[color];

  return (

    <div
      className={`
        rounded-2xl
        border
        ${style.border}
        ${style.bg}
        p-6
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-md
      `}
    >

      <p className={`text-sm font-medium ${style.title}`}>
        {title}
      </p>

      <h2 className={`mt-3 text-4xl font-bold ${style.value}`}>
        {value}
      </h2>

    </div>

  );

}