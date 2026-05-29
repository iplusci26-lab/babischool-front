"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

export default function ReEnrollmentPage() {

  const [students, setStudents] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [preview, setPreview] = useState<any>(null);

  const [classrooms, setClassrooms] = useState<any[]>([]);

  const [academicYears, setAcademicYears] = useState<any[]>([]);

  const [selectedClassroom, setSelectedClassroom] =
    useState("");

  const [selectedYear, setSelectedYear] =
    useState("");

  // =========================
  // LOAD STUDENTS
  // =========================

  const loadStudents = async () => {

    const res = await api.get(
      `/students/?search=${search}`
    );
    
    setStudents(
      res.data.data || res.data
    );
  };

  // =========================
  // LOAD CLASSROOMS
  // =========================

  const loadClassrooms = async () => {

    const res = await api.get(
      "/students/classrooms/"
    );

    setClassrooms(
      res.data.results || res.data
    );
  };

  // =========================
  // LOAD YEARS
  // =========================

  const loadYears = async () => {

    const res = await api.get(
      "/academics/academic-years/"
    );

    setAcademicYears(
      res.data.results || res.data
    );
  };

  // =========================
  // LOAD PREVIEW
  // =========================

  const loadPreview = async (
    studentId: string
  ) => {

    const res = await api.get(
      `/academics/re-enrollment/${studentId}/`
    );

    setPreview(res.data);

    if (res.data.suggested_classroom) {

      setSelectedClassroom(
        res.data.suggested_classroom
      );
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const submit = async () => {

    if (
      !selectedStudent ||
      !selectedClassroom ||
      !selectedYear
    ) {
      alert("Missing fields");
      return;
    }

    await api.post(
      "/academics/re-enrollment/",
      {

        student_id:
          selectedStudent.id,

        classroom_id:
          selectedClassroom,

        academic_year_id:
          selectedYear
      }
    );

    alert("Elève re-inscrit");

    setPreview(null);

    setSelectedStudent(null);

    setSelectedClassroom("");
  };

  // =========================
  // EFFECTS
  // =========================

  useEffect(() => {

    loadStudents();

    loadClassrooms();

    loadYears();

  }, []);

  useEffect(() => {

    const delay = setTimeout(() => {

      loadStudents();

    }, 300);

    return () => clearTimeout(delay);

  }, [search]);

  // =========================
  // UI
  // =========================

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-2xl font-bold">
          Réinscription académique
        </h1>

        <p className="text-gray-500 text-sm">
          Réinscrire un ancien élève
          pour une nouvelle année scolaire
        </p>

      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-2xl border p-4">

        <input
          type="text"
          placeholder="Rechercher élève..."
          className="w-full border rounded-xl p-3"

          value={search}

          onChange={(e)=>
            setSearch(e.target.value)
          }
        />

        <div className="mt-4 space-y-2">

          {students.map((student)=>(

            <button

              key={student.id}

              onClick={() => {

                setSelectedStudent(student);

                loadPreview(student.id);

              }}

              className="
                w-full
                border
                rounded-xl
                p-3
                text-left
                hover:bg-gray-50
              "
            >

              <div className="font-medium">
                {student.first_name}{" "}
                {student.last_name}
              </div>

              <div className="text-sm text-gray-500">
                {student.matricule}
              </div>

            </button>

          ))}

        </div>

      </div>

      {/* PREVIEW */}

      {preview && (

        <div className="bg-white rounded-2xl border p-6 space-y-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                {preview.student_name}
              </h2>

              <p className="text-gray-500">
                Ancienne classe :
                {" "}
                {preview.previous_classroom}
              </p>

            </div>

            <div className="text-right">

              <div className="text-sm text-gray-500">
                Moyenne annuelle
              </div>

              <div className="text-2xl font-bold">
                {preview.annual_average}/20
              </div>

            </div>

          </div>

          {/* CLASSROOM */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Nouvelle classe
            </label>

            <select

              className="
                w-full
                border
                rounded-xl
                p-3
              "

              value={selectedClassroom}

              onChange={(e)=>
                setSelectedClassroom(
                  e.target.value
                )
              }
            >

              <option value="">
                Choisir classe
              </option>

              {classrooms.map((c)=>(

                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.name}
                </option>

              ))}

            </select>

          </div>

          {/* YEAR */}

          <div>

            <label className="block mb-2 text-sm font-medium">
              Année scolaire
            </label>

            <select

              className="
                w-full
                border
                rounded-xl
                p-3
              "

              value={selectedYear}

              onChange={(e)=>
                setSelectedYear(
                  e.target.value
                )
              }
            >

              <option value="">
                Choisir année
              </option>

              {academicYears.map((year)=>(

                <option
                  key={year.id}
                  value={year.id}
                >
                  {year.name}
                </option>

              ))}

            </select>

          </div>

          {/* ACTION */}

          <button

            onClick={submit}

            className="
              bg-primary
              text-white
              px-6
              py-3
              rounded-xl
              font-medium
            "
          >
            Réinscrire élève
          </button>

        </div>

      )}

    </div>
  );
}