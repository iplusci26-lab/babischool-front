"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

type AttendanceStatus =
  | "present"
  | "absent"
  | "late";

interface StaffAttendanceRecord {
  id: string;

  user_name: string;

  function: string;

  role: string;

  status: AttendanceStatus;
}

export function useStaffAttendance() {

  const [records, setRecords] = useState<
    StaffAttendanceRecord[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  /**
   * ============================
   * Chargement des présences
   * ============================
   */

  const loadAttendance = useCallback(
    async () => {

      try {

        setLoading(true);

        const response = await api.get(
          "/attendance/staff/today/"
        );

        setRecords(response.data);

      } catch {

        setError(
          "Impossible de charger les présences."
        );

      } finally {

        setLoading(false);

      }

    },
    []
  );

  /**
   * ============================
   * Recherche
   * ============================
   */

  const filteredRecords = useMemo(() => {

    if (!search.trim()) {
      return records;
    }

    const value =
      search.toLowerCase();

    return records.filter(
      (record) =>

        record.user_name
          .toLowerCase()
          .includes(value)

        ||

        record.function
          ?.toLowerCase()
          .includes(value)

        ||

        record.role
          ?.toLowerCase()
          .includes(value)

    );

  }, [records, search]);

  /**
   * ============================
   * Statistiques
   * ============================
   */

  const stats = useMemo(() => ({

    present:
      records.filter(
        (r) =>
          r.status === "present"
      ).length,

    absent:
      records.filter(
        (r) =>
          r.status === "absent"
      ).length,

    late:
      records.filter(
        (r) =>
          r.status === "late"
      ).length,

  }), [records]);

  /**
   * ============================
   * Changement de statut
   * ============================
   */

  const updateStatus = (

    id: string,

    status: AttendanceStatus

  ) => {

    setRecords((previous) =>

      previous.map((record) =>

        record.id === id

          ? {
              ...record,
              status,
            }

          : record

      )

    );

  };

  /**
   * ============================
   * Sauvegarde
   * ============================
   */

  const submit = async () => {

    try {

      setSubmitting(true);

      await api.post(

        "/attendance/staff/mark/",

        {

          attendances: records,

        }

      );

      console.log(records)
      await loadAttendance();
      toast.success(
        "La feuille de présence du jour a été enregistrée "
      );

    } catch {

      toast.error(
        "L'appel a echoué, veuillez reprendre svp, si l'erreur insite veuillez contacter l'administrateur"
      );
      setError(
        "Impossible d'enregistrer les présences."
      );

    } finally {

      setSubmitting(false);

    }

  };

  /**
   * ============================
   * Chargement initial
   * ============================
   */

  useEffect(() => {

    loadAttendance();

  }, [loadAttendance]);

  return {

    records: filteredRecords,

    loading,

    submitting,

    error,

    search,

    setSearch,

    stats,

    updateStatus,

    submit,

    reload: loadAttendance,

  };

}