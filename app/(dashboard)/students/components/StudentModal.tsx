"use client";

import {
  useEffect,
  useState,
} from "react";

import Modal from "@/components/ui/Modal";

import Input from "@/components/ui/Input";

import Select from "@/components/ui/Select";

import type { Student } from "../types";


// ==========================================================
// PROPS
// ==========================================================

interface StudentModalProps {
  open: boolean;

  student: Student | null;

  loading?: boolean;

  onClose: () => void;

  onSubmit: (
    data: Partial<Student>
  ) => void | Promise<void>;
}


// ==========================================================
// FORM TYPE
// ==========================================================

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


// ==========================================================
// INITIAL FORM
// ==========================================================

const INITIAL_FORM: StudentForm = {
  student_number: "",

  first_name: "",

  last_name: "",

  gender: "M",

  date_of_birth: "",

  birth_place: "",

  is_assigned: false,

  is_repeating: false,
};


// ==========================================================
// COMPONENT
// ==========================================================

export default function StudentModal({
  open,
  student,
  loading = false,
  onClose,
  onSubmit,
}: StudentModalProps) {


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    form,
    setForm,
  ] = useState<StudentForm>(
    INITIAL_FORM
  );


  // ==========================================================
  // INITIALIZE FORM
  // ==========================================================

  useEffect(() => {
    if (
      !open ||
      !student
    ) {
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
        Boolean(
          student.is_assigned
        ),

      is_repeating:
        Boolean(
          student.is_repeating
        ),
    });

  }, [
    open,
    student,
  ]);


  // ==========================================================
  // RESET WHEN MODAL CLOSES
  // ==========================================================

  useEffect(() => {
    if (open) {
      return;
    }

    setForm(
      INITIAL_FORM
    );

  }, [
    open,
  ]);


  // ==========================================================
  // HANDLE FIELD CHANGE
  // ==========================================================

  const handleChange = <
    K extends keyof StudentForm
  >(
    field: K,
    value: StudentForm[K]
  ) => {

    setForm(
      (previous) => ({
        ...previous,

        [field]:
          value,
      })
    );
  };


  // ==========================================================
  // HANDLE CLOSE
  // ==========================================================

  const handleClose = () => {
    if (loading) {
      return;
    }

    onClose();
  };


  // ==========================================================
  // HANDLE SUBMIT
  // ==========================================================

  const handleSubmit = async () => {
    if (
      loading ||
      !student
    ) {
      return;
    }

    await onSubmit({
      student_number:
        form.student_number.trim(),

      first_name:
        form.first_name.trim(),

      last_name:
        form.last_name.trim(),

      gender:
        form.gender,

      date_of_birth:
        form.date_of_birth,

      birth_place:
        form.birth_place.trim(),

      is_assigned:
        form.is_assigned,

      is_repeating:
        form.is_repeating,
    });
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Modifier un élève"
    >

      <div
        className="
          flex
          max-h-[calc(100vh-7rem)]
          flex-col
        "
      >


        {/* ==================================================== */}
        {/* FORM */}
        {/* ==================================================== */}

        <div
          className="
            overflow-y-auto
            pr-1
            sm:pr-2
          "
        >

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
            "
          >


            {/* ================================================= */}
            {/* NOM */}
            {/* ================================================= */}

            <Input
              label="Nom"
              value={form.last_name}
              disabled={loading}
              onChange={(event) =>
                handleChange(
                  "last_name",
                  event.target.value
                )
              }
            />


            {/* ================================================= */}
            {/* PRENOM */}
            {/* ================================================= */}

            <Input
              label="Prénom"
              value={form.first_name}
              disabled={loading}
              onChange={(event) =>
                handleChange(
                  "first_name",
                  event.target.value
                )
              }
            />


            {/* ================================================= */}
            {/* MATRICULE */}
            {/* ================================================= */}

            <Input
              label="Matricule"
              value={
                form.student_number
              }
              placeholder="12345678M"
              maxLength={20}
              disabled={loading}
              onChange={(event) =>
                handleChange(
                  "student_number",
                  event.target.value
                )
              }
            />


            {/* ================================================= */}
            {/* SEXE */}
            {/* ================================================= */}

            <Select
              label="Sexe"
              value={form.gender}
              disabled={loading}
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
              onChange={(event) =>
                handleChange(
                  "gender",
                  event.target.value as
                    | "M"
                    | "F"
                )
              }
            />


            {/* ================================================= */}
            {/* DATE DE NAISSANCE */}
            {/* ================================================= */}

            <Input
              type="date"
              label="Date de naissance"
              value={
                form.date_of_birth
              }
              disabled={loading}
              onChange={(event) =>
                handleChange(
                  "date_of_birth",
                  event.target.value
                )
              }
            />


            {/* ================================================= */}
            {/* LIEU DE NAISSANCE */}
            {/* ================================================= */}

            <Input
              label="Lieu de naissance"
              value={
                form.birth_place
              }
              placeholder="Ex : Abidjan"
              disabled={loading}
              onChange={(event) =>
                handleChange(
                  "birth_place",
                  event.target.value
                )
              }
            />


            {/* ================================================= */}
            {/* AFFECTATION */}
            {/* ================================================= */}

            <div
              className="
                flex
                min-h-[76px]
                items-center
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
              "
            >

              <label
                className="
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  gap-3
                "
              >

                <input
                  type="checkbox"
                  checked={
                    form.is_assigned
                  }
                  disabled={loading}
                  onChange={(event) =>
                    handleChange(
                      "is_assigned",
                      event.target.checked
                    )
                  }
                  className="
                    h-4
                    w-4
                    shrink-0
                    rounded
                    border-gray-300
                    text-[#6214BE]
                    focus:ring-[#6214BE]
                  "
                />

                <div className="min-w-0">

                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-800
                    "
                  >
                    Élève affecté
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-gray-500
                    "
                  >
                    L'élève est actuellement
                    affecté à une classe.
                  </p>

                </div>

              </label>

            </div>


            {/* ================================================= */}
            {/* REDOUBLANT */}
            {/* ================================================= */}

            <div
              className="
                flex
                min-h-[76px]
                items-center
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
              "
            >

              <label
                className="
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  gap-3
                "
              >

                <input
                  type="checkbox"
                  checked={
                    form.is_repeating
                  }
                  disabled={loading}
                  onChange={(event) =>
                    handleChange(
                      "is_repeating",
                      event.target.checked
                    )
                  }
                  className="
                    h-4
                    w-4
                    shrink-0
                    rounded
                    border-gray-300
                    text-[#6214BE]
                    focus:ring-[#6214BE]
                  "
                />

                <div className="min-w-0">

                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-800
                    "
                  >
                    Élève redoublant
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-gray-500
                    "
                  >
                    L'élève reprend
                    la même classe.
                  </p>

                </div>

              </label>

            </div>

          </div>

        </div>


        {/* ==================================================== */}
        {/* ACTIONS */}
        {/* ==================================================== */}

        <div
          className="
            mt-5
            flex
            flex-col-reverse
            gap-3
            border-t
            border-gray-100
            pt-4
            sm:flex-row
            sm:justify-end
          "
        >

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="
              w-full
              rounded-md
              border
              border-gray-300
              px-4
              py-2.5
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-100
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >
            Annuler
          </button>


          <button
            type="button"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={
              loading ||
              !student
            }
            className="
              w-full
              rounded-md
              bg-[#6214BE]
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-[#4f0f9c]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
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