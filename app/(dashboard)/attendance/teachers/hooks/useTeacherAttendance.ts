"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getTodayAttendance,
  justifyAttendance,
  markAttendance,
} from "../services/attendanceApi";

import {
  AttendanceStatus,
  JustifyAttendancePayload,
  MarkAttendancePayload,
  TeacherAttendanceDashboard,
} from "../types";

export function useTeacherAttendance() {
  const [dashboard, setDashboard] =
    useState<TeacherAttendanceDashboard | null>(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const ATTENDANCE_MESSAGES = {
    present: "Présence enregistrée.",
    late: "Retard enregistré.",
    absent: "Absence enregistrée.",
  };

  /**
   * Charge les données du tableau de bord.
   */
  const loadAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getTodayAttendance();
      console.log(data);
      setDashboard(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les présences.");
      toast.error(
        "Impossible de charger les présences."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Marque la présence d'un enseignant.
   */
  const handleAttendance = useCallback(
    async (
      scheduleId: string,
      attendanceStatus: Exclude<AttendanceStatus, null>
    ) => {
      try {
        setSubmitting(true);

        const payload: MarkAttendancePayload = {
          schedule_id: scheduleId,
          attendance_status: attendanceStatus,
        };

        await markAttendance(payload);
        toast.success(
        ATTENDANCE_MESSAGES[attendanceStatus]
        );
        await loadAttendance();

      } catch (err) {
        console.error(err);
        toast.error(
            "Impossible d'enregistrer la présence."
          );
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [loadAttendance]
  );

  /**
   * Valide une justification.
   */
  const handleJustification = useCallback(
    async (
      attendanceId: string,
      justificationStatus: JustifyAttendancePayload["justification_status"]
    ) => {
      try {
        setSubmitting(true);

        await justifyAttendance(attendanceId, {
          justification_status: justificationStatus,
        });
        toast.success("Justification enregistrée avec succès.");
        await loadAttendance();

      } catch (err) {
        console.error(err);
        toast.error(
            "Impossible d'enregistrer la justification."
          );
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [loadAttendance]
  );

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  return {
    dashboard,

    loading,

    submitting,

    error,

    refresh: loadAttendance,

    handleAttendance,

    handleJustification,
  };
}