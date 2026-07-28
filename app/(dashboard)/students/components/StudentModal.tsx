"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
//import { Button } from "@/components/ui/button";

import { Student } from "../types";

interface StudentModalProps {
  open: boolean;
  student: Student | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Student>) => void;
}

export default function StudentModal({
  open,
  student,
  loading = false,
  onClose,
  onSubmit,
}: StudentModalProps) {
  const [form, setForm] = useState({
    student_number: "",
    first_name: "",
    last_name: "",
    gender: "M",
    birth_date: "",
  });

  useEffect(() => {
    if (!student) return;

    setForm({
      student_number: student.student_number ?? "",
      first_name: student.first_name ?? "",
      last_name: student.last_name ?? "",
      gender: student.gender ?? "M",
      birth_date: student.date_of_birth ?? "",
    });
  }, [student]);

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Modifier un élève"
     
    > 
      <div className="space-y-4">

        <Input
          label="Matricule"
          value={form.student_number}
          onChange={(e) =>
            handleChange(
              "student_number",
              e.target.value
            )
          }
        />

        <Input
          label="Nom"
          value={form.last_name}
          onChange={(e) =>
            handleChange(
              "last_name",
              e.target.value
            )
          }
        />

        <Input
          label="Prénom"
          value={form.first_name}
          onChange={(e) =>
            handleChange(
              "first_name",
              e.target.value
            )
          }
        />

        <Select
          label="Sexe"
          value={form.gender}
          options={[
            {
              label: "Garçon",
              value: "M",
            },
            {
              label: "Fille",
              value: "F",
            },
          ]}
          onChange={(e) =>
            handleChange(
              "gender",
              e.target.value
            )
          }
        />

        <Input
          type="date"
          label="Date de naissance"
          value={form.birth_date}
          onChange={(e) =>
            handleChange(
              "birth_date",
              e.target.value
            )
          }
        />

        <div className="flex justify-end gap-3 pt-4">

        <button
          type="button"
          onClick={onClose}
          className="rounded-md border px-4 py-2 hover:bg-gray-100"
        >
          Annuler
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-md bg-[#6214BE] px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>

        </div>

      </div>
    </Modal>
  );
}