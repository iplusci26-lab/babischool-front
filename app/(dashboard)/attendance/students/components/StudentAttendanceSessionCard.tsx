"use client";

import {
  BookOpen,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PlayCircle,
  Lock,
} from "lucide-react";

type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT";

type SessionStatus =
  | "NOT_STARTED"
  | "OPEN"
  | "CLOSED";

interface StudentAttendanceRecord {
  id: string;
  student_name: string;
  status: AttendanceStatus;
}

interface AttendanceSession {
  session_id: string | null;
  schedule_id: string;

  status: SessionStatus;

  student_count: number;

  subject_name: string;
  teacher_name: string;
  classroom_name: string;

  start_time: string;
  end_time: string;

  records: StudentAttendanceRecord[];
}

interface StudentAttendanceSessionCardProps {
  session: AttendanceSession;

  loading?: boolean;

  onStartAttendance: (
    scheduleId: string
  ) => void;

  onAttendanceChange: (
    recordId: string,
    status: AttendanceStatus
  ) => void;
}

export default function StudentAttendanceSessionCard({
  session,
  loading = false,
  onStartAttendance,
  onAttendanceChange,
}: StudentAttendanceSessionCardProps) {
  const isNotStarted =
    session.status === "NOT_STARTED";
  
  const isOpen =
    session.status === "OPEN";

  const isClosed =
    session.status === "CLOSED";

  const presentCount = session.records.filter(
    (r) => r.status === "PRESENT"
  ).length;

  const lateCount = session.records.filter(
    (r) => r.status === "LATE"
  ).length;

  const absentCount = session.records.filter(
    (r) => r.status === "ABSENT"
  ).length;

  const statusButton = (
    active: boolean,
    color: string,
    onClick: () => void,
    label: string
  ) => (
    <button
      disabled={loading}
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition
      ${
        active
          ? `${color} text-white`
          : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
      }
      disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            {/* Header */}

            <div className="border-b bg-gray-50 p-5">

<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

  <div>

    <div className="flex items-center gap-2">

      <BookOpen
        size={18}
        className="text-[#6214BE]"
      />

      <h2 className="text-lg font-semibold text-gray-900">
        {session.subject_name}
      </h2>

    </div>

    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">

      <span className="flex items-center gap-1">

        <User size={15} />

        {session.teacher_name}

      </span>

      <span className="flex items-center gap-1">

        <Clock size={15} />

        {session.start_time} - {session.end_time}

      </span>

      <span>{session.classroom_name}</span>

    </div>

  </div>

  <div className="flex flex-col items-end gap-3">

    <span className="text-sm text-gray-500">
      {session.student_count} élève(s)
    </span>

    {isNotStarted && (
      <button
        disabled={loading}
        onClick={() =>
          onStartAttendance(session.schedule_id)
        }
        className="flex items-center gap-2 rounded-lg bg-[#6214BE] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4d0fa0] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <PlayCircle size={18} />
        Commencer l'appel
      </button>
    )}

    {isOpen && (
      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
        Appel en cours
      </span>
    )}

    {isClosed && (
      <span className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
        <Lock size={14} />
        Séance clôturée
      </span>
    )}

  </div>

</div>

</div>

{/* Résumé */}

<div className="grid grid-cols-3 border-b bg-white">

<div className="flex items-center justify-center gap-2 p-3">

  <CheckCircle2
    size={18}
    className="text-green-600"
  />

  <span className="font-medium text-green-600">
    {presentCount}
  </span>

</div>

<div className="flex items-center justify-center gap-2 border-x p-3">

  <AlertCircle
    size={18}
    className="text-amber-600"
  />

  <span className="font-medium text-amber-600">
    {lateCount}
  </span>

</div>

<div className="flex items-center justify-center gap-2 p-3">

  <XCircle
    size={18}
    className="text-red-600"
  />

  <span className="font-medium text-red-600">
    {absentCount}
  </span>

</div>

</div>
      {/* Corps de la carte */}

      <div>

        {/* Séance non démarrée */}

        {isNotStarted && (

          <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">

            <PlayCircle
              size={42}
              className="text-[#6214BE]"
            />

            <h3 className="text-lg font-semibold text-gray-800">
              L'appel n'a pas encore commencé
            </h3>

            <p className="max-w-md text-sm text-gray-500">
              Cliquez sur <strong>Commencer l'appel</strong> pour générer
              automatiquement les fiches de présence des élèves.
            </p>

          </div>

        )}

        {/* Séance ouverte */}

        {isOpen && (

          <>

            {session.records.map((record) => (

              <div
                key={record.id}
                className="flex flex-col gap-4 border-b p-4 last:border-b-0 lg:flex-row lg:items-center lg:justify-between"
              >

                <div className="font-medium text-gray-900">
                  {record.student_name}
                </div>

                <div className="flex flex-wrap gap-2">

                  {statusButton(
                    record.status === "PRESENT",
                    "bg-green-600",
                    () =>
                      onAttendanceChange(
                        record.id,
                        "PRESENT"
                      ),
                    "Présent"
                  )}

                  {statusButton(
                    record.status === "LATE",
                    "bg-amber-500",
                    () =>
                      onAttendanceChange(
                        record.id,
                        "LATE"
                      ),
                    "Retard"
                  )}

                  {statusButton(
                    record.status === "ABSENT",
                    "bg-red-600",
                    () =>
                      onAttendanceChange(
                        record.id,
                        "ABSENT"
                      ),
                    "Absent"
                  )}

                </div>

              </div>

            ))}

          </>

        )}

        {/* Séance clôturée */}

        {isClosed && (

          <>

            {session.records.map((record) => (

              <div
                key={record.id}
                className="flex items-center justify-between border-b p-4 last:border-b-0"
              >

                <span className="font-medium text-gray-900">
                  {record.student_name}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    record.status === "PRESENT"
                      ? "bg-green-100 text-green-700"
                      : record.status === "LATE"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {record.status === "PRESENT"
                    ? "Présent"
                    : record.status === "LATE"
                    ? "Retard"
                    : "Absent"}
                </span>

              </div>

            ))}

          </>

        )}

      </div>

    </div>
  );
}