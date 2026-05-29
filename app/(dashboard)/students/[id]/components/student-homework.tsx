"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export default function StudentHomework({
  studentId,
}: {
  studentId: string;
}) {

  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHomeworks = async () => {

    try {

      const res = await api.get(
        `/homework/${studentId}/student/`
      );

      setHomeworks(
        res.data.results || res.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    loadHomeworks();

  }, []);

  const stats = useMemo(() => {

    const total = homeworks.length;

    const submitted = homeworks.filter(
      h => h.status === "submitted"
    ).length;

    const late = homeworks.filter(
      h => h.status === "late"
    ).length;

    const missing = homeworks.filter(
      h => h.status === "missing"
    ).length;

    return {
      total,
      submitted,
      late,
      missing,
    };

  }, [homeworks]);

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

      <div className="grid md:grid-cols-4 gap-4">

        <StatCard
          title="Total"
          value={stats.total}
        />

        <StatCard
          title="Remis"
          value={stats.submitted}
        />

        <StatCard
          title="En retard"
          value={stats.late}
        />

        <StatCard
          title="Manquants"
          value={stats.missing}
        />

      </div>

      {/* HOMEWORK LIST */}

      <div className="space-y-4">

        {homeworks.map((homework) => (

          <div
            key={homework.id}
            className="
              bg-white
              border
              rounded-3xl
              p-5
              space-y-4
            "
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <h3 className="text-lg font-semibold">

                  {homework.title}

                </h3>

                <p className="text-gray-500 text-sm">

                  {homework.subject}

                </p>

              </div>

              <StatusBadge
                status={homework.status}
              />

            </div>

            <p className="text-gray-700">

              {homework.description}

            </p>

            <div className="grid md:grid-cols-3 gap-4 text-sm">

              <InfoCard
                label="Professeur"
                value={homework.teacher}
              />

              <InfoCard
                label="Assigné le"
                value={homework.assigned_date}
              />

              <InfoCard
                label="Deadline"
                value={homework.due_date}
              />

            </div>

            {homework.teacher_comment && (

              <div className="bg-gray-50 border rounded-2xl p-4">

                <div className="font-medium mb-1">
                  Commentaire professeur
                </div>

                <div className="text-gray-600">
                  {homework.teacher_comment}
                </div>

              </div>

            )}

            {homework.attachment && (

              <a
                href={homework.attachment}
                target="_blank"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-primary
                  font-medium
                "
              >
                📎 Télécharger pièce jointe
              </a>

            )}

          </div>

        ))}

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

    submitted:
      "bg-green-100 text-green-700",

    late:
      "bg-orange-500 text-orange-700",

    missing:
      "bg-red-100 text-red-700",
  };

  const labels: any = {

    submitted: "Remis",
    late: "Retard",
    missing: "Manquant",
  };

  return (

    <span
      className={`
        px-4 py-2 rounded-full text-sm font-medium
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

function InfoCard({
  label,
  value,
}: any) {

  return (

    <div className="bg-gray-50 rounded-2xl p-4">

      <div className="text-gray-500 text-xs">
        {label}
      </div>

      <div className="font-medium mt-1">
        {value || "--"}
      </div>

    </div>
  );
}