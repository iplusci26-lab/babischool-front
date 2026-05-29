"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function HomeworkTab() {

  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [selectedHomework, setSelectedHomework] = useState<any>(null);

  const [form, setForm] = useState({
    classroom_id: "",
    subject_id: "",
    title: "",
    description: "",
    due_date: "",
  });

  const loadData = async () => {

    const [
      hwRes,
      classRes,
      subjectRes
    ] = await Promise.all([

      api.get("/homework/create"),
      api.get("/students/classrooms/"),
      api.get("/academics/subjects/"),
    ]);

    setHomeworks(hwRes.data.results || hwRes.data);

    setClassrooms(
      classRes.data.results || classRes.data
    );

    setSubjects(
      subjectRes.data.results || subjectRes.data
    );
  };

  useEffect(() => {

    loadData();

  }, []);

  const createHomework = async () => {

    await api.post("/homework/create/", form);

    setForm({
      classroom_id: "",
      subject_id: "",
      title: "",
      description: "",
      due_date: "",
    });

    loadData();
  };

  return (

    <div className="grid lg:grid-cols-3 gap-6">

      {/* CREATE */}

      <div className="bg-white border rounded-3xl p-6 space-y-4 h-fit">

        <h2 className="text-xl font-bold">
          Nouveau devoir
        </h2>

        <select
          className="w-full border rounded-xl p-3"
          value={form.classroom_id}
          onChange={(e) =>
            setForm({
              ...form,
              classroom_id: e.target.value
            })
          }
        >
          <option value="">
            Classe
          </option>

          {classrooms.map((c) => (

            <option
              key={c.id}
              value={c.id}
            >
              {c.name}
            </option>
          ))}

        </select>

        <select
          className="w-full border rounded-xl p-3"
          value={form.subject_id}
          onChange={(e) =>
            setForm({
              ...form,
              subject_id: e.target.value
            })
          }
        >
          <option value="">
            Matière
          </option>

          {subjects.map((s) => (

            <option
              key={s.id}
              value={s.id}
            >
              {s.name}
            </option>
          ))}

        </select>

        <input
          placeholder="Titre"
          className="w-full border rounded-xl p-3"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value
            })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full border rounded-xl p-3 h-32"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value
            })
          }
        />

        <input
          type="date"
          className="w-full border rounded-xl p-3"
          value={form.due_date}
          onChange={(e) =>
            setForm({
              ...form,
              due_date: e.target.value
            })
          }
        />

        <button
          onClick={createHomework}
          className="
            w-full
            bg-[#6214BE]
            text-white
            rounded-xl
            cursor-pointer
            p-3
            font-medium
          "
        >
          Créer devoir
        </button>

      </div>

      {/* LIST */}

      <div className="lg:col-span-2 space-y-4">

        {homeworks.map((hw) => (

          <div
            key={hw.id}
            onClick={() => setSelectedHomework(hw)}
            className="
              bg-white
              border
              rounded-3xl
              p-5
              cursor-pointer
              hover:border-primary
            "
          >

            <div className="flex justify-between">

              <div>

                <h3 className="font-bold text-lg">
                  {hw.title}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {hw.classroom_name}
                  {" • "}
                  {hw.subject_name}
                </p>

              </div>

              <div className="text-sm text-gray-500">
                {hw.due_date}
              </div>

            </div>

            <p className="mt-4 text-gray-700">
              {hw.description}
            </p>

          </div>

        ))}

      </div>

      {/* DETAILS */}

      {selectedHomework && (     

        <HomeworkDetails
          homework={selectedHomework}
        />

      )}

    </div>
  );
}

function HomeworkDetails({
  homework
}: any) {

  const [students, setStudents] = useState<any[]>([]);

  const loadStudents = async () => {

    const res = await api.get(
      `/homework/${homework.id}/submissions/`
    );

    setStudents(
      res.data.results || res.data
    );
  };

  useEffect(() => {

    loadStudents();

  }, [homework.id]);

  const updateStatus = async (
    student_id: string,
    status: string
  ) => {

    await api.post(
      `/homework/${homework.id}/submissions/`,
      {
        student_id,
        status
      }
    );

    loadStudents();
  };

  return (

    <div className="lg:col-span-3 bg-white border rounded-3xl p-6">

      <h2 className="text-2xl font-bold mb-6">
        Remise devoir
      </h2>

      <div className="space-y-4">

        {students.map((student) => (

          <div
            key={student.student_id}
            className="
              flex
              items-center
              justify-between
              border
              rounded-2xl
              p-4
            "
          >

            <div>

              <div className="font-medium">
                {student.student_name}
              </div>

              <div className="text-sm text-gray-500">
                {student.status === "submitted"
                ? "Soumis"
                :student.status === "late"
                ? "Retard"
                :student.status === "missing"? "Manquant":""}
              </div>

            </div>

            <div className="flex gap-2">

              <button
                onClick={() =>
                  updateStatus(
                    student.student_id,
                    "submitted"
                  )
                }
                className="
                  px-4 py-2 rounded-xl cursor-pointer
                  bg-green-100 text-green-700
                "
              >
                ✔ Remis
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    student.student_id,
                    "late"
                  )
                }
                className="
                  px-4 py-2 rounded-xl cursor-pointer
                  bg-orange-500 text-orange-100
                "
              >
                ⏰ Retard
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    student.student_id,
                    "missing"
                  )
                }
                className="
                  px-4 py-2 rounded-xl cursor-pointer
                  bg-red-100 text-red-700
                "
              >
                ❌ Manquant
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}