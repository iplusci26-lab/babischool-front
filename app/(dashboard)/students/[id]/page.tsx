"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

import StudentHeader from "./components/student-header";
import StudentTabs from "./components/student-tabs";

export default function StudentDetailPage() {
  const { id } = useParams();

  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    api.get(`/students/${id}/`).then((res) => {
      setStudent(res.data);
    });
  }, [id]);

  if (!student) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <StudentHeader student={student} />
      <StudentTabs student={student} />
    </div>
  );
}