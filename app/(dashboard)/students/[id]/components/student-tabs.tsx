"use client";

import { useState } from "react";
import StudentFinance from './student-finance';
import StudentGrades from './student-grades';
import StudentOverview from './students-overview';
import StudentAttendance from "./student-attendance";
import StudentHomework from "./student-homework"

export default function StudentTabs({ student }: any) {
  const [tab, setTab] = useState("overview");

  return (
    <div className="space-y-4">

      {/* NAV */}
      <div className="flex gap-4 border-b pb-2">
        <Tab label="Générale" value="overview" tab={tab} setTab={setTab} />
        <Tab label="Grades" value="grades" tab={tab} setTab={setTab} />
        <Tab label="Présence" value="attendance" tab={tab} setTab={setTab} />
        {/*<Tab label="Finance" value="finance" tab={tab} setTab={setTab}/>*/}
        <Tab label="Homework" value="homework" tab={tab} setTab={setTab} />
      </div>

      {/* CONTENT */}
      <div className="bg-white p-4 rounded-xl border">

        {tab === "overview" && (
          <StudentOverview studentId={student.id} />
        )}

        {tab === "grades" && (
          
            <StudentGrades studentId={student.id} />
         
        )}

        {tab === "attendance" && (
          <StudentAttendance studentId={student.id} />
        )}

        {/*tab === "finance" && (
          <StudentFinance studentId={student.id} />
        )*/}

        {tab === "homework" && (
          <StudentHomework studentId={student.id} />
        )}

      </div>

    </div>
  );
}

function Tab({ label, value, tab, setTab }: any) {
  return (
    <button
      onClick={() => setTab(value)}
      className={`pb-2 ${
        tab === value
          ? "border-b-2 border-primary font-medium"
          : "text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}