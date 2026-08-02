"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT";

type SessionStatus =
  | "NOT_STARTED"
  | "OPEN"
  | "CLOSED";

interface Classroom {
  id: string;
  name: string;
}

interface StudentAttendanceRecord {
  id: string;
  student_name: string;
  status: AttendanceStatus;
}

interface AttendanceSession {
  session_id: string | null;
  schedule_id: string;
  student_count: number;
  subject_name: string;
  teacher_name: string;
  classroom_name: string;
  start_time: string;
  end_time: string;
  status: SessionStatus;
  records: StudentAttendanceRecord[];
}

interface AttendanceSummary {
  total_sessions: number;
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  pending_justifications: number;
}

interface AttendanceDashboard {
  summary: AttendanceSummary;
  sessions: AttendanceSession[];
}

export function useStudentAttendance() {
  const [dashboard, setDashboard] =
    useState<AttendanceDashboard | null>(null);

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  const [selectedClassroom, setSelectedClassroom] =
    useState("");

    const [selectedDate, setSelectedDate] =
    useState(
        new Date().toISOString().split("T")[0]
    );

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  /**
   * Charger les classes
   */
  const loadClassrooms = useCallback(async () => {
    try {
      const response = await api.get(
        "/students/classrooms/"
      );
      console.log("------classroom ",response.data.results)
      setClassrooms(response.data.results);
    } catch {
      setError(
        "Impossible de charger les classes."
      );
    }
  }, []);

  /**
   * Charger le dashboard
   */
  const loadDashboard = useCallback(async () => {
    if (!selectedClassroom) {
      setDashboard(null);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        "/attendance/dashboard/",
        {
          params: {
            classroom_id: selectedClassroom,
            date: selectedDate,
          },
        }
      );
      console.log(response.data);
      setDashboard(response.data);
    } catch {
      setError(
        "Impossible de charger les présences."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedClassroom, selectedDate]);


  /**
 * Démarrer une séance d'appel
 */
const handleStartAttendance = async (
  scheduleId: string
) => {
  try {
    setSubmitting(true);

    await api.post("/attendance/sessions/", {
      schedule_id: scheduleId,
      attendance_date: selectedDate,
    });

    await loadDashboard();

  } catch {
    setError(
      "Impossible de démarrer la séance d'appel."
    );
  } finally {
    setSubmitting(false);
  }
};

  /**
   * Modifier le statut
   */
  const handleAttendance = async (
    recordId: string,
    status: AttendanceStatus
  ) => {
    try {
      setSubmitting(true);

      await api.patch(
        `/attendance/records/${recordId}/`,
        {
          status,
        }
      );

      await loadDashboard();
    } catch {
      setError(
        "Impossible de mettre à jour la présence."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Justification (placeholder)
   */
  const handleJustification = async () => {
    // sera développé plus tard
  };

  /**
   * Chargement initial
   */
  useEffect(() => {
    async function init() {
      setLoading(true);

      await loadClassrooms();

      setLoading(false);
    }

    init();
  }, [loadClassrooms]);

  /**
   * Recharge lorsqu'on change
   * de classe ou de date
   */
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,

    classrooms,

    loading,

    submitting,

    error,

    selectedClassroom,

    selectedDate,

    setSelectedClassroom,

    setSelectedDate,

    handleStartAttendance,

    handleAttendance,

    handleJustification,
  };
}