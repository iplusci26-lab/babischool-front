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

export default function StudentModal({
  open,
  student,
  loading = false,
  onClose,
  onSubmit,
}: StudentModalProps) {
  // ==========================================================
  // FORMULAIRE
  // ==========================================================

  const [form, setForm] = useState<{
    student_number: string;
    first_name: string;
    last_name: string;
    gender: "M" | "F";
    date_of_birth: string;
    birth_place: string;
    is_assigned: boolean;
    is_repeating: boolean;
  }>({
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
  // CHARGEMENT DES DONNÉES DE L'ÉLÈVE
  // ==========================================================

  useEffect(() => {
    if (!student) {
      return;
    }

    setForm({
      student_number:
        student.student_number ?? "",

      first_name:
        student.first_name ?? "",

      last_name:
        student.last_name ?? "",

      gender:
        student.gender === "F"
          ? "F"
          : "M",

      date_of_birth:
        student.date_of_birth ?? "",

      birth_place:
        student.birth_place ?? "",

      is_assigned:
        student.is_assigned ?? false,

      is_repeating:
        student.is_repeating ?? false,
    });
  }, [student]);

  // ==========================================================
  // MODIFICATION D'UN CHAMP
  // ==========================================================

  const handleChange = <
    K extends keyof typeof form
  >(
    field: K,
    value: (typeof form)[K]
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
      <div className="space-y-4">

        {/* ================================================== */}
        {/* MATRICULE */}
        {/* ================================================== */}

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

        {/* ================================================== */}
        {/* NOM */}
        {/* ================================================== */}

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

        {/* ================================================== */}
        {/* PRÉNOM */}
        {/* ================================================== */}

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

        {/* ================================================== */}
        {/* SEXE */}
        {/* ================================================== */}

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

        {/* ================================================== */}
        {/* DATE DE NAISSANCE */}
        {/* ================================================== */}

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

        {/* ================================================== */}
        {/* LIEU DE NAISSANCE */}
        {/* ================================================== */}

        <Input
          label="Lieu de naissance"
          placeholder="Exemple : Abidjan"
          value={form.birth_place}
          onChange={(e) =>
            handleChange(
              "birth_place",
              e.target.value
            )
          }
        />

        {/* ================================================== */}
        {/* AFFECTÉ */}
        {/* ================================================== */}

        <Select
          label="Statut d'affectation"
          value={
            form.is_assigned
              ? "true"
              : "false"
          }
          options={[
            {
              label: "Affecté",
              value: "true",
            },
            {
              label: "Non affecté",
              value: "false",
            },
          ]}
          onChange={(e) =>
            handleChange(
              "is_assigned",
              e.target.value === "true"
            )
          }
        />

        {/* ================================================== */}
        {/* REDOUBLANT */}
        {/* ================================================== */}

        <Select
          label="Statut scolaire"
          value={
            form.is_repeating
              ? "true"
              : "false"
          }
          options={[
            {
              label: "Non redoublant",
              value: "false",
            },
            {
              label: "Redoublant",
              value: "true",
            },
          ]}
          onChange={(e) =>
            handleChange(
              "is_repeating",
              e.target.value === "true"
            )
          }
        />

        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

        <div className="flex justify-end gap-3 pt-4">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-[#6214BE] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
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