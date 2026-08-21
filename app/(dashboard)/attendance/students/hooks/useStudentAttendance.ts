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

  option_type: "schedule" | "period";

  option_value: string;

  option_label: string;

  teacher_name: string;

  classroom_name: string;

  student_count: number;

  status: SessionStatus;

  records: StudentAttendanceRecord[];

}

interface AttendanceOption {

  type: "schedule" | "period";

  value: string;

  label: string;

  start_time: string | null;

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
    const [currentTime, setCurrentTime] = useState(
      new Date()
    );

  const [pendingChanges, setPendingChanges] =
    useState<
      Record<
        string,
        {
          status: AttendanceStatus;
          minutes_late?: number;
          remarks?: string;
        }
      >
    >({});

  
  const [attendanceOptions, setAttendanceOptions] =
    useState<AttendanceOption[]>([]);

  const [selectedOption, setSelectedOption] =
    useState("");

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

  const loadAttendanceOptions = useCallback(
    async () => {
  
      if (!selectedClassroom) {
  
        setAttendanceOptions([]);
  
        setSelectedOption("");
  
        return;
  
      }
  
      try {
  
        const response = await api.get(
          "/attendance/options/",
          {
  
            params: {
  
              classroom: selectedClassroom,
  
              date: selectedDate,
  
            },
  
          }
        );
        
        setAttendanceOptions(response.data);
        console.log("Attendance options :", response.data);
        
        if (response.data.length > 0) {

          setSelectedOption(
            response.data[0].value
          );
          console.log("Selected option :", selectedOption);
        } else {
        
          setSelectedOption("");
        
        }
  
      } catch {
  
        setAttendanceOptions([]);
  
      }
  
    },
    [
  
      selectedClassroom,
  
      selectedDate,
  
    ]
  );


  /* Verification l'heure appel est arrivé */

  const canStartAttendance = (
    option: AttendanceOption | undefined
  ) => {
    if (!option) {
      return false;
    }
  
    // Certaines périodes n'ont pas encore
    // d'heure configurée.
    if (!option.start_time) {
      return true;
    }
  
    const now = new Date();
  
    const [
      hours,
      minutes,
      seconds = 0,
    ] = option.start_time
      .split(":")
      .map(Number);
  
    const start = new Date();
  
    start.setHours(
      hours,
      minutes,
      seconds,
      0
    );
  
    return now >= start;
  };

  /**
   * Charger le dashboard
   */
  const loadDashboard = useCallback(async () => {
    if (!selectedClassroom || !selectedOption ) {
      setDashboard(null);
      return;
    }

    const option = attendanceOptions.find(
      (o) => o.value === selectedOption
    );
  
    if (!option) {
  
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
      
            option_type: option.type,
      
            option_value: option.value,
      
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
  }, [selectedClassroom,

    selectedDate,
  
    selectedOption,
  
    attendanceOptions,
  ]);


  /**
 * Démarrer une séance d'appel
 */
  
  const handleStartAttendance = async () => {

    try {
  
      const option = attendanceOptions.find(
        (o) => o.value === selectedOption
      );
  
      if (!option) {
  
        setError(
          "Veuillez sélectionner une séance."
        );
  
        return;
      }
  
      // ==========================================
      // Vérification de l'heure
      // ==========================================
  
      if (!canStartAttendance(option)) {
  
        const startTime =
          option.start_time?.slice(0, 5);
  
        setError(
          `L'appel ne peut pas commencer avant ${startTime}.`
        );
  
        return;
      }
  
      setSubmitting(true);
  
      const payload: any = {
  
        classroom_id: selectedClassroom,
  
        attendance_date: selectedDate,
  
      };
  
      if (option.type === "schedule") {
  
        payload.schedule_id = option.value;
  
      } else {
  
        payload.period = option.value;
  
      }
  
      await api.post(
        "/attendance/sessions/",
        payload,
      );
  
      await loadDashboard();
  
    } catch {
  
      setError(
        "Impossible de démarrer l'appel."
      );
  
    } finally {
  
      setSubmitting(false);
  
    }
  };

  const canStartSelectedAttendance = () => {

    const option = attendanceOptions.find(
      (o) => o.value === selectedOption
    );
  
    if (!option) {
      return false;
    }
  
    if (!option.start_time) {
      return true;
    }
  
   
  
    const [
      hours,
      minutes,
      seconds = 0,
    ] = option.start_time
      .split(":")
      .map(Number);
  
      const start = new Date(currentTime);
  
    start.setHours(
      hours,
      minutes,
      seconds,
      0
    );
  
    return currentTime >= start;
  };

  /**
   * Modifier le statut
   */
  const handleAttendance = (
    recordId: string,
    status: AttendanceStatus
  ) => {
  
      setPendingChanges((current) => ({
        ...current,
    
        [recordId]: {
          ...current[recordId],
          status,
        },
      }));
    
      setDashboard((current) => {
    
        if (!current) {
          return current;
        }
    
        return {
          ...current,
    
          sessions: current.sessions.map(
            (session) => ({
              ...session,
    
              records: session.records.map(
                (record) => {
    
                  if (record.id !== recordId) {
                    return record;
                  }
    
                  return {
                    ...record,
                    status,
                  };
    
                }
              ),
    
            })
          ),
        };
    
      });
    };

  
    const saveAttendance = async () => {

      const changes = Object.entries(
        pendingChanges
      );
    
      if (changes.length === 0) {
        return;
      }
    
      try {
    
        setSubmitting(true);
    
        setError("");
    
        const records = changes.map(
          ([recordId, change]) => ({
            record_id: recordId,
            status: change.status,
            minutes_late:
              change.minutes_late ?? 0,
            remarks:
              change.remarks ?? "",
          })
        );
    
        await api.post(
          "/attendance/records/bulk-update/",
          {
            records,
          }
        );
    
        setPendingChanges({});
    
        await loadDashboard();
    
      } catch (error) {
    
        setError(
          "Impossible d'enregistrer les présences."
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

  useEffect(() => {

    const interval = setInterval(() => {
  
      setCurrentTime(new Date());
  
    }, 1000);
  
    return () => clearInterval(interval);
  
  }, []);

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

  useEffect(() => {

    loadAttendanceOptions();
  
  }, [
  
    loadAttendanceOptions,
  
  ]);

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

  saveAttendance,

  handleJustification,

  attendanceOptions,

  selectedOption,

  setSelectedOption,
  
  canStartSelectedAttendance,

  hasPendingChanges:
    Object.keys(pendingChanges).length > 0,
  };
}