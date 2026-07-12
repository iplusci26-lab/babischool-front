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

  const [successModal, setSuccessModal] = useState({
    open: false,
    phone: "",
    password: "",
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

      const res = await api.post("/students/admissions/", payload);

      setSuccessModal({
        open: true,
        phone:
          res.data.results?.parent_phone ??
          res.data.parent_phone ??
          form.parent_phone,
        password:
          res.data.results?.parent_temp_password ??
          res.data.parent_temp_password ??
          "",
      });
      console.log("11111 ",res.data)
      console.log("2222 ", res.data.results)
      
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

  const copyCredentials = async () => {
    await navigator.clipboard.writeText(
  `Téléphone : ${successModal.phone}
  Mot de passe : ${successModal.password}`
    );
  
    alert("Identifiants copiés.");
  };

  return (
    <div>
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
    {successModal.open && (

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

          <div className="flex justify-center mb-4">

            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">

              <span className="text-4xl">✅</span>

            </div>

          </div>

          <h2 className="text-2xl font-bold text-center">

            Admission réussie

          </h2>

          <p className="text-gray-500 text-center mt-2">

            Le compte parent a été créé avec succès.

          </p>

          <div className="bg-gray-100 rounded-xl p-4 mt-6 space-y-3">

            <div>

              <p className="text-xs text-gray-500">

                Téléphone

              </p>

              <p className="font-bold text-lg">

                {successModal.phone}

              </p>

            </div>

            <div>

              <p className="text-xs text-gray-500">

                Mot de passe

              </p>

              <p className="font-bold text-lg text-[#6214BE]">

                {successModal.password}

              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">

            <button

              onClick={copyCredentials}

              className="border rounded-lg py-3 font-semibold"

            >

              Copier

            </button>

            <button

              onClick={() =>
                setSuccessModal({
                  open: false,
                  phone: "",
                  password: "",
                })
              }

              className="bg-[#6214BE] text-white rounded-lg py-3 font-semibold"

            >

              Fermer

            </button>

          </div>

        </div>

      </div>

      )}
    </div>
    
  );

  
}