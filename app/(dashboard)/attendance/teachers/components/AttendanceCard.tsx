"use client";

import { useState } from "react";

import AttendanceActionButtons from "./AttendanceActionButtons";
import AttendanceStatusBadge from "./AttendanceStatusBadge";
import CourseStatusBadge from "./CourseStatusBadge";
import JustificationStatusBadge from "./JustificationStatusBadge";
import JustificationActionButtons from "./JustificationActionButtons";

import { formatDate } from "@/lib/date";

import {
  TeacherAttendanceCourse,
  AttendanceStatus,
} from "../types";

interface AttendanceCardProps {
  course: TeacherAttendanceCourse;
  loading?: boolean;
  canJustify?: boolean;

  onAttendanceChange: (
    scheduleId: string,
    status: Exclude<AttendanceStatus, null>
  ) => void;

  onJustificationChange?: (
    attendanceId: string,
    status: "justified" | "unjustified"
  ) => void;
}

export default function AttendanceCard({
  course,
  loading = false,
  canJustify = false,
  onAttendanceChange,
  onJustificationChange,
}: AttendanceCardProps) {
  const [activeTab, setActiveTab] = useState<
    "attendance" | "justification"
  >("attendance");

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between mb-5">

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {course.subject_name}
          </h3>

          <p className="text-sm text-gray-500">
            {course.teacher_first_name} {course.teacher_last_name}
          </p>
        </div>

        <CourseStatusBadge
          status={course.course_status}
        />

      </div>

      <div className="space-y-1 text-sm text-gray-600 mb-5">

        <p>
          <span className="font-medium">
            Classe :
          </span>{" "}
          {course.classroom_name}
        </p>

        {course.room && (
          <p>
            <span className="font-medium">
              Salle :
            </span>{" "}
            {course.room}
          </p>
        )}

        <p>
          <span className="font-medium">
            Horaire :
          </span>{" "}
          {course.time_range}
        </p>

      </div>

      {/* Tabs */}

      <div className="mb-5 flex rounded-xl bg-gray-100 p-1">

        <button
          onClick={() => setActiveTab("attendance")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "attendance"
              ? "bg-[#6214BE] text-white shadow"
              : "text-gray-600 hover:text-[#6214BE]"
          }`}
        >
          Présence
        </button>

        <button
          onClick={() => setActiveTab("justification")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "justification"
              ? "bg-[#6214BE] text-white shadow"
              : "text-gray-600 hover:text-[#6214BE]"
          }`}
        >
          Justification
        </button>

      </div>

      {/* =======================
            ONGLET PRESENCE
      ======================== */}

      {activeTab === "attendance" && (
        <div className="space-y-4">

          <AttendanceStatusBadge
            status={course.attendance_status}
          />

          <AttendanceActionButtons
            value={course.attendance_status}
            loading={loading}
            onChange={(status) =>
              onAttendanceChange(
                course.schedule_id,
                status
              )
            }
          />

        </div>
      )}

      {/* =======================
          ONGLET JUSTIFICATION
      ======================== */}

      {activeTab === "justification" && (
        <div className="space-y-4">

          {course.justification_status && (
            <JustificationStatusBadge
              status={course.justification_status}
            />
          )}

          {course.justification_status ===
            "justified" && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              <div className="font-medium mb-1">
                Justification validée
              </div>

              <div>
                <strong>Par :</strong>{" "}
                {course.validated_by_name}
              </div>

              <div>
                <strong>Le :</strong>{" "}
                {formatDate(course.validated_at)}
              </div>
            </div>
          )}

          {course.justification_status ===
            "unjustified" && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              <div className="font-medium mb-1">
                Justification refusée
              </div>

              <div>
                <strong>Par :</strong>{" "}
                {course.validated_by_name}
              </div>

              <div>
                <strong>Le :</strong>{" "}
                {formatDate(course.validated_at)}
              </div>
            </div>
          )}

          {canJustify &&
            onJustificationChange && (
              <JustificationActionButtons
                status={
                  course.justification_status
                }
                loading={loading}
                onJustify={(status) => {
                  if (!course.attendance_id)
                    return;

                  onJustificationChange(
                    course.attendance_id,
                    status
                  );
                }}
              />
            )}

        </div>
      )}

    </div>
  );
}