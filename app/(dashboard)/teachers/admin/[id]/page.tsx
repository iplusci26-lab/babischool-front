"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import TeacherHeader from "./components/TeacherHeader";
import TeacherSubjects from "./components/TeacherSubjects";
import TeacherSchedule from "./components/TeacherSchedule";
import TeacherStats from "./components/TeacherStats";
const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

export default function TeacherDetailPage() {
  const { id } = useParams();

  const [teacher, setTeacher] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"subjects" | "schedule">("subjects");
  const extract = (res: any) => res.data.results || res.data;

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const teachers = await api.get("/academics/teachers/");
    const found = extract(teachers).find((t: any) => t.id === id);

    setTeacher(found);

    const schedulesRes = await api.get(
      `/academics/schedules/?teacher_id=${id}`
    );

    setSchedules(extract(schedulesRes));

    const assignmentsRes = await api.get(
      `/academics/teaching-assignments/?teacher_id=${id}`
    );

    setAssignments(extract(assignmentsRes));
  };

  const getByDay = (day: string) =>
    schedules
      .filter((schedule) => schedule.weekday === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <div className="space-y-6 p-6">
      <TeacherHeader teacher={teacher} />
      <TeacherStats
        assignments={assignments}
        schedules={schedules}
      />

      <div className="rounded-xl bg-gray-100 p-1 flex w-fit">

      <button
        onClick={() => setActiveTab("subjects")}
        className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
          activeTab === "subjects"
            ? "bg-[#6214BE] text-white shadow"
            : "text-gray-600 hover:text-[#6214BE]"
        }`}
      >
        Matières
      </button>

      <button
        onClick={() => setActiveTab("schedule")}
        className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
          activeTab === "schedule"
            ? "bg-[#6214BE] text-white shadow"
            : "text-gray-600 hover:text-[#6214BE]"
        }`}
      >
        Emploi du temps
      </button>

      </div>
      {activeTab === "subjects" && (
          <TeacherSubjects
            assignments={assignments}
            schedules={schedules}
          />
        )}

      {activeTab === "schedule" && (
        <TeacherSchedule
          schedules={schedules}
        />
      )}
    </div>
  );
}