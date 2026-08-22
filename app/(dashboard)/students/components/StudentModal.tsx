"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

import { Student } from "../types";

interface StudentModalProps {
  open: boolean;
  student: Student | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Student>) => void;
}

type StudentForm = {
  student_number: string;
  first_name: string;
  last_name: string;
  gender: "M" | "F";
  date_of_birth: string;
  birth_place: string;
  is_assigned: boolean;
  is_repeating: boolean;
};

export default function StudentModal({
  open,
  student,
  loading = false,
  onClose,
  onSubmit,
}: StudentModalProps) {
  const [form, setForm] = useState<StudentForm>({
    student_number: "",
    first_name: "",
    last_name: "",
    gender: "M",
    date_of_birth: "",
    birth_place: "",
    is_assigned: false,
    is_repeating: false,
  });

  // ==========================================================
  // INITIALISATION
  // ==========================================================

  useEffect(() => {
    if (!student) {
      return;
    }

    setForm({
      student_number: student.student_number ?? "",
      first_name: student.first_name ?? "",
      last_name: student.last_name ?? "",
      gender: student.gender ?? "M",
      date_of_birth: student.date_of_birth ?? "",
      birth_place: student.birth_place ?? "",
      is_assigned: student.is_assigned ?? false,
      is_repeating: student.is_repeating ?? false,
    });
  }, [student]);

  // ==========================================================
  // MODIFICATION DES CHAMPS
  // ==========================================================

  const handleChange = <K extends keyof StudentForm>(
    field: K,
    value: StudentForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================================
  // SOUMISSION
  // ==========================================================

  const handleSubmit = () => {
    onSubmit(form);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Modifier un élève"
    >
      <div className="flex max-h-[calc(100vh-7rem)] flex-col">

        {/* ==================================================== */}
        {/* FORMULAIRE */}
        {/* ==================================================== */}

        <div className="overflow-y-auto pr-1 sm:pr-2">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* ================================================= */}
            {/* LIGNE 1 : NOM / PRÉNOM */}
            {/* ================================================= */}

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

            {/* ================================================= */}
            {/* LIGNE 2 : MATRICULE / SEXE */}
            {/* ================================================= */}

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
                  e.target.value as "M" | "F"
                )
              }
            />

            {/* ================================================= */}
            {/* LIGNE 3 : DATE / LIEU DE NAISSANCE */}
            {/* ================================================= */}

            <Input
              type="date"
              label="Date de naissance"
              value={form.date_of_birth}
              onChange={(e) =>
                handleChange(
                  "date_of_birth",
                  e.target.value
                )
              }
            />

            <Input
              label="Lieu de naissance"
              value={form.birth_place}
              placeholder="Ex : Abidjan"
              onChange={(e) =>
                handleChange(
                  "birth_place",
                  e.target.value
                )
              }
            />

            {/* ================================================= */}
            {/* LIGNE 4 : AFFECTÉ / REDOUBLANT */}
            {/* ================================================= */}

            <div className="flex min-h-[76px] items-center rounded-xl border border-gray-200 bg-gray-50 px-4">

              <label className="flex w-full cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  checked={form.is_assigned}
                  onChange={(e) =>
                    handleChange(
                      "is_assigned",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 shrink-0 rounded border-gray-300 text-[#6214BE] focus:ring-[#6214BE]"
                />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    Élève affecté
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    L'élève est affecté.
                  </p>
                </div>

              </label>

            </div>

            <div className="flex min-h-[76px] items-center rounded-xl border border-gray-200 bg-gray-50 px-4">

              <label className="flex w-full cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  checked={form.is_repeating}
                  onChange={(e) =>
                    handleChange(
                      "is_repeating",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 shrink-0 rounded border-gray-300 text-[#6214BE] focus:ring-[#6214BE]"
                />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    Élève redoublant
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    L'élève est redoublant.
                  </p>
                </div>

              </label>

            </div>

          </div>

        </div>

        {/* ==================================================== */}
        {/* ACTIONS */}
        {/* ==================================================== */}

        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-md bg-[#6214BE] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4f0f9c] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading
              ? "Enregistrement..."
              : "Enregistrer"}
          </button>

        </div>

      </div>
    </Modal>
  );
}