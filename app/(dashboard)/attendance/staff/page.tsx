"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function StaffAttendancePage() {

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAttendance = async () => {

    try {

      setLoading(true);

      const res = await api.get(
        "/attendance/staff/today/"
      );

      setRecords(res.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    loadAttendance();

  }, []);

  const updateStatus = (
    id: string,
    status: string
  ) => {

    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
            }
          : r
      )
    );
  };

  const submit = async () => {

    try {

      await api.post(
        "/attendance/staff/mark/",
        {
          attendances: records,
        }
      );

      alert("Présence enregistrée");

    } catch (error) {

      console.error(error);
    }
  };

  const stats = {

    present: records.filter(
      (r) => r.status === "present"
    ).length,

    absent: records.filter(
      (r) => r.status === "absent"
    ).length,

    late: records.filter(
      (r) => r.status === "late"
    ).length,
  };
  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            Présence Personnel
          </h1>

          <p className="text-gray-500 mt-1">
            Gestion RH du personnel scolaire
          </p>

        </div>

        <button
          onClick={submit}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-2xl"
        >
          Enregistrer
        </button>

      </div>

       {/* STATS */}

       <div className="grid md:grid-cols-3 gap-4">

<Card
  title="Présents"
  value={stats.present}
/>

<Card
  title="Absents"
  value={stats.absent}
/>

<Card
  title="Retards"
  value={stats.late}
/>

</div>

{/* TABLE */}

<div className="bg-white border rounded-3xl overflow-hidden">

<div className="overflow-x-auto">

  <table className="w-full">

    <thead className="bg-gray-50">

      <tr className="text-left text-sm text-gray-500">

        <th className="p-4">Personnel</th>
        <th className="p-4">Fonction</th>
        <th className="p-4">Statut</th>
        <th className="p-4">Actions</th>

      </tr>

    </thead>

    <tbody>

{records.map((record) => (

  <tr
    key={record.id}
    className="border-t"
  >

    <td className="p-4 font-medium">
      {record.user_name}
    </td>

    <td className="p-4 capitalize">
      {record.user_type}
    </td>

    <td className="p-4">

      <span
        className={`px-3 py-1 rounded-full text-sm ${
          record.status === "present"
            ? "bg-green-100 text-green-700"
            : record.status === "absent"
            ? "bg-red-100 text-red-700"
            : record.status === "late"
            ? "bg-orange-200 text-orange-500"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {record.status}
      </span>

    </td>
    <td className="p-4">

                    <div className="flex gap-2 flex-wrap">

                      <button
                        onClick={() =>
                          updateStatus(
                            record.id,
                            "present"
                          )
                        }
                        className="px-3 py-2 rounded-xl bg-green-100"
                      >
                        ✅
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            record.id,
                            "absent"
                          )
                        }
                        className="px-3 py-2 rounded-xl bg-red-100"
                      >
                        ❌
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            record.id,
                            "late"
                          )
                        }
                        className="px-3 py-2 rounded-xl bg-orange-100"
                      >
                        ⏱️
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {loading && (
        <div>Chargement...</div>
      )}

    </div>
  );
}

function Card({ title, value }: any) {

  return (

    <div className="bg-white border rounded-3xl p-5">

      <div className="text-gray-500 text-sm">
        {title}
      </div>

      <div className="text-3xl font-bold mt-2">
        {value}
      </div>

    </div>
  );
}