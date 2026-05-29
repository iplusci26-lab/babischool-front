"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function AdmissionForm() {
  const [form, setForm] = useState({
    // student
    student_first_name: "",
    student_last_name: "",
    student_number: "",
    gender: "M",
    date_of_birth: "",
    classroom_id: "",
    academic_year_id: "",

    // parent
    parent_first_name: "",
    parent_last_name: "",
    parent_phone: "",
    parent_email: "",
  });

  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const [classRes, yearRes] = await Promise.all([
        api.get("/students/classrooms/"),
        api.get("/academics/academic-years/")
      ]);
  
      setClassrooms(classRes.data);
      setAcademicYears(yearRes.data);
  
      const active = yearRes.data.find((y: any) => y.is_active);
  
      if (active) {
        setForm((prev) => ({
          ...prev,
          academic_year_id: active.id,
        }));
      }
    };
  
    fetchData();
  }, []);

  const clean = (val: string) => val.trim();
  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);

      const payload = {
        student: {
          student_number: clean(form.student_number),
          first_name: clean(form.student_first_name),
          last_name: clean(form.student_last_name),
          gender: form.gender,
          date_of_birth: form.date_of_birth,
          classroom_id: form.classroom_id,
          academic_year_id: form.academic_year_id,
        },
        parent: {
          first_name: form.parent_first_name,
          last_name: form.parent_last_name,
          phone: form.parent_phone,
          email: form.parent_email,
        },
      };

      await api.post("/students/admissions/", payload);

      alert("Student created successfully");

      // reset
      setForm({
        student_first_name: "",
        student_last_name: "",
        student_number: "",
        gender: "M",
        date_of_birth: "",
        classroom_id: "",
        academic_year_id: form.academic_year_id,

        parent_first_name: "",
        parent_last_name: "",
        parent_phone: "",
        parent_email: "",
      });

    } catch (error: any) {
      console.error(error.response?.data);
      alert("Error creating student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border max-w-xl space-y-4">

      {/* 🎓 STUDENT */}
      <h2 className="font-bold">Student Info</h2>

      <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
        Academic Year: <strong>
          {academicYears.find(
            (y: any) => y.id === form.academic_year_id
          )?.name || "Loading..."}
        </strong>
      </div>

      <input
        name="student_first_name"
        placeholder="First Name"
        className="border p-2 w-full"
        value={form.student_first_name}
        onChange={handleChange}
      />

      <input
        name="student_last_name"
        placeholder="Last Name"
        className="border p-2 w-full"
        value={form.student_last_name}
        onChange={handleChange}
      />

      <input
        name="student_number"
        placeholder="Matricule"
        className="border p-2 w-full"
        value={form.student_number}
        onChange={handleChange}
      />

      <input
        type="date"
        name="date_of_birth"
        className="border p-2 w-full"
        value={form.date_of_birth}
        onChange={handleChange}
      />

      <select
        name="gender"
        className="border p-2 w-full"
        value={form.gender}
        onChange={handleChange}
      >
        <option value="M">Male</option>
        <option value="F">Female</option>
      </select>

      <select
        name="classroom_id"
        className="border p-2 w-full"
        value={form.classroom_id}
        onChange={handleChange}
      >
        <option value="">Select Class</option>
        {classrooms.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

     

      {/* 👨‍👩‍👧 PARENT */}
      <h2 className="font-bold pt-4">Parent Info</h2>

      <input
        name="parent_first_name"
        placeholder="Parent First Name"
        className="border p-2 w-full"
        value={form.parent_first_name}
        onChange={handleChange}
      />

      <input
        name="parent_last_name"
        placeholder="Parent Last Name"
        className="border p-2 w-full"
        value={form.parent_last_name}
        onChange={handleChange}
      />

      <input
        name="parent_phone"
        placeholder="Parent Phone"
        className="border p-2 w-full"
        value={form.parent_phone}
        onChange={handleChange}
      />

      <input
        name="parent_email"
        placeholder="Parent Email (optional)"
        className="border p-2 w-full"
        value={form.parent_email}
        onChange={handleChange}
      />

      <button
        onClick={handleSubmit}
        disabled={loading ||
          !form.student_first_name ||
          !form.student_last_name ||
          !form.student_number ||
          !form.date_of_birth ||
          !form.classroom_id ||
          !form.parent_first_name ||
          !form.parent_phone ||
          !form.academic_year_id}
        className="bg-[#6214BE] text-white w-full p-2 rounded"
      >
        {loading ? "Creating..." : "Create Student"}
      </button>

    </div>
  );
}