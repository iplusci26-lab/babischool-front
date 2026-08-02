"use client";

interface StaffAttendanceRecord {
  id: string;

  user_name: string;

  function: string;

  role: string;

  status: "present" | "absent" | "late";
}

interface StaffAttendanceTableProps {
  records: StaffAttendanceRecord[];

  loading?: boolean;

  onStatusChange: (
    id: string,
    status: "present" | "absent" | "late"
  ) => void;
}

export default function StaffAttendanceTable({
  records,
  loading = false,
  onStatusChange,
}: StaffAttendanceTableProps) {
  const badge = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700";

      case "absent":
        return "bg-red-100 text-red-700";

      case "late":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const rowColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-50";

      case "absent":
        return "bg-red-50";

      case "late":
        return "bg-orange-50";

      default:
        return "";
    }
  };

  const label = (status: string) => {
    switch (status) {
      case "present":
        return "Présent";

      case "absent":
        return "Absent";

      case "late":
        return "Retard";

      default:
        return "-";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr className="text-left text-sm font-semibold text-gray-600">

              <th className="px-5 py-4">
                Employé
              </th>

              <th className="px-5 py-4">
                Fonction
              </th>

              <th className="px-5 py-4">
                Accès
              </th>

              <th className="px-5 py-4">
                Statut
              </th>

              <th className="px-5 py-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {records.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="py-12 text-center text-gray-500"
                >
                  Aucun employé trouvé.
                </td>

              </tr>

            ) : (

              records.map((record) => (

                <tr
                  key={record.id}
                  className="border-t transition"
                >

                  <td className="px-5 py-4 font-semibold text-gray-900">

                    {record.user_name}

                  </td>

                  <td className="px-5 py-4 text-gray-600">

                    {record.function}

                  </td>

                  <td className="px-5 py-4 text-gray-600">

                    {record.role}

                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${badge(
                        record.status
                      )}`}
                    >
                      {label(record.status)}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                        <div className="flex justify-center">

                            <div className="inline-flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                            {/* Présent */}

                            <button
                                disabled={loading}
                                onClick={() =>
                                onStatusChange(
                                    record.id,
                                    "present"
                                )
                                }
                                className={`px-4 py-2 text-sm font-medium transition-all duration-200
                                ${
                                record.status === "present"
                                    ? "bg-green-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-700"
                                }`}
                            >
                                Présent
                            </button>

                            {/* Absent */}

                            <button
                                disabled={loading}
                                onClick={() =>
                                onStatusChange(
                                    record.id,
                                    "absent"
                                )
                                }
                                className={`border-l border-gray-200 px-4 py-2 text-sm font-medium transition-all duration-200
                                ${
                                record.status === "absent"
                                    ? "bg-red-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-700"
                                }`}
                            >
                                Absent
                            </button>

                            {/* Retard */}

                            <button
                                disabled={loading}
                                onClick={() =>
                                onStatusChange(
                                    record.id,
                                    "late"
                                )
                                }
                                className={`border-l border-gray-200 px-4 py-2 text-sm font-medium transition-all duration-200
                                ${
                                record.status === "late"
                                    ? "bg-orange-500 text-white"
                                    : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                }`}
                            >
                                Retard
                            </button>

                            </div>

                        </div>

                        </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}