"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function StudentOverview({
  studentId,
}: {
  studentId: string;
}) {

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadOverview = async () => {

    try {

      const res = await api.get(
        `/students/${studentId}/overview/`
      );

      setData(res.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    loadOverview();

  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Chargement...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-red-500">
        Impossible de charger les données.
      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">

            {data.first_name?.charAt(0)}
            {data.last_name?.charAt(0)}

          </div>

          <div>

            <h2 className="text-2xl font-bold">

              {data.first_name} {data.last_name}

            </h2>

            <p className="text-gray-500">
              Matricule : {data.registration_number}
            </p>

            <p className="text-gray-500">
              Classe : {data.classroom}
            </p>

          </div>

        </div>

        <div className="bg-gray-50 border rounded-2xl px-5 py-3">

          <div className="text-sm text-gray-500">
            Contact Parent
          </div>

          <div className="font-medium">
            {data.parent_phone || "N/A"}
          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-4 gap-4">

        <StatCard
          title="Moyenne générale annuelle"
          value={data.average || "--"}
        />

        <StatCard
          title="Rang"
          value={
            data.rank
              ? `${data.rank}e`
              : "--"
          }
        />

        <StatCard
          title="Présence"
          value={`${data.attendance_rate}%`}
        />

        <StatCard
          title="Paiement restant"
          value={`${data.balance} FCFA`}
        />

      </div>

      {/* DETAILS */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Academic */}

        <div className="bg-white border rounded-3xl p-5 space-y-4">

          <h3 className="text-lg font-semibold">
            Informations académiques
          </h3>

          <InfoRow
            label="Classe"
            value={data.classroom}
          />

          <InfoRow
            label="Année scolaire"
            value={data.academic_year}
          />

          <InfoRow
            label="Moyenne annuelle"
            value={data.average}
          />

          <InfoRow
            label="Classement"
            value={
              data.rank
                ? `${data.rank}e`
                : "--"
            }
          />

        </div>

        {/* Finance */}

        <div className="bg-white border rounded-3xl p-5 space-y-4">

          <h3 className="text-lg font-semibold">
            Informations financières
          </h3>

          <InfoRow
            label="Frais scolaires"
            value={`${data.tuition_fee} FCFA`}
          />

          <InfoRow
            label="Montant payé"
            value={`${data.amount_paid} FCFA`}
          />

          <InfoRow
            label="Montant restant"
            value={`${data.balance} FCFA`}
          />

        </div>

      </div>

    </div>
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

function InfoRow({
  label,
  value,
}: any) {

  return (

    <div className="flex justify-between border-b pb-2">

      <span className="text-gray-500">
        {label}
      </span>

      <span className="font-medium">
        {value || "--"}
      </span>

    </div>
  );
}