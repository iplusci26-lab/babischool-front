"use client";

import {
  useEffect,
  useState,
} from "react";

import Modal from "@/components/ui/Modal";

import Input from "@/components/ui/Input";

import type {
  Parent,
} from "./types";

import type {
  UpdateParentPayload,
} from "./services/parent.service";

// ==========================================================
// PROPS
// ==========================================================

interface ParentEditModalProps {

  open: boolean;

  parent: Parent | null;

  loading?: boolean;

  onClose: () => void;

  onSubmit: (
    data: UpdateParentPayload
  ) => void | Promise<void>;

}

// ==========================================================
// FORM TYPE
// ==========================================================

interface ParentForm {

  first_name: string;

  last_name: string;

  phone: string;

}

// ==========================================================
// INITIAL FORM
// ==========================================================

const INITIAL_FORM: ParentForm = {

  first_name: "",

  last_name: "",

  phone: "",

};

// ==========================================================
// COMPONENT
// ==========================================================

export default function ParentEditModal({

  open,

  parent,

  loading = false,

  onClose,

  onSubmit,

}: ParentEditModalProps) {

  // ========================================================
  // STATE
  // ========================================================

  const [
    form,
    setForm,
  ] = useState<ParentForm>(
    INITIAL_FORM
  );

  // ========================================================
  // INITIALIZE FORM
  // ========================================================

  useEffect(() => {

    if (
      !open ||
      !parent
    ) {
      return;
    }

    // ======================================================
    // FULL NAME
    //
    // Exemple :
    //
    // KOUASSI Jean Pierre
    //
    // last_name = KOUASSI
    // first_name = Jean Pierre
    // ======================================================

    const nameParts =
      parent.full_name
        .trim()
        .split(
          /\s+/
        );

    const lastName =
      nameParts.length > 0
        ? nameParts[0]
        : "";

    const firstName =
      nameParts.length > 1
        ? nameParts
            .slice(1)
            .join(" ")
        : "";

    setForm({

      first_name:
        firstName,

      last_name:
        lastName,

      phone:
        parent.phone ?? "",

    });

  }, [
    open,
    parent,
  ]);

  // ========================================================
  // RESET FORM
  // ========================================================

  useEffect(() => {

    if (
      open
    ) {
      return;
    }

    setForm(
      INITIAL_FORM
    );

  }, [
    open,
  ]);

  // ========================================================
  // HANDLE CHANGE
  // ========================================================

  const handleChange = (

    field:
      keyof ParentForm,

    value:
      string

  ) => {

    setForm(
      (
        previous
      ) => ({

        ...previous,

        [field]:
          value,

      })
    );

  };

  // ========================================================
  // CLOSE
  // ========================================================

  const handleClose = () => {

    if (
      loading
    ) {
      return;
    }

    onClose();

  };

  // ========================================================
  // SUBMIT
  // ========================================================

  const handleSubmit = async () => {

    if (
      loading ||
      !parent
    ) {
      return;
    }

    const payload:
      UpdateParentPayload = {

        first_name:
          form.first_name.trim(),

        last_name:
          form.last_name.trim(),

        phone:
          form.phone.trim(),

      };

    await onSubmit(
      payload
    );

  };

  // ========================================================
  // RENDER
  // ========================================================

  return (

    <Modal
      open={
        open
      }
      onClose={
        handleClose
      }
      title="
        Modifier le parent
      "
    >

      <div
        className="
          flex
          flex-col
          gap-5
        "
      >

        {/* ================================================== */}
        {/* FORM */}
        {/* ================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
          "
        >

          {/* ================================================ */}
          {/* NOM */}
          {/* ================================================ */}

          <Input
            label="
              Nom
            "
            value={
              form.last_name
            }
            disabled={
              loading
            }
            onChange={(
              event
            ) =>
              handleChange(
                "last_name",
                event.target.value
              )
            }
          />

          {/* ================================================ */}
          {/* PRENOM */}
          {/* ================================================ */}

          <Input
            label="
              Prénom
            "
            value={
              form.first_name
            }
            disabled={
              loading
            }
            onChange={(
              event
            ) =>
              handleChange(
                "first_name",
                event.target.value
              )
            }
          />

          {/* ================================================ */}
          {/* TELEPHONE */}
          {/* ================================================ */}

          <div
            className="
              sm:col-span-2
            "
          >

            <Input
              label="
                Téléphone
              "
              value={
                form.phone
              }
              disabled={
                loading
              }
              onChange={(
                event
              ) =>
                handleChange(
                  "phone",
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

        <div
          className="
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

          {/* ================================================ */}
          {/* CANCEL */}
          {/* ================================================ */}

          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              loading
            }
            className="
              w-full
              rounded-lg
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

          {/* ================================================ */}
          {/* SUBMIT */}
          {/* ================================================ */}

          <button
            type="button"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={
              loading ||
              !parent ||
              !form.first_name.trim() ||
              !form.last_name.trim() ||
              !form.phone.trim()
            }
            className="
              w-full
              rounded-lg
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
            {
              loading
                ? "Enregistrement..."
                : "Enregistrer"
            }
          </button>

        </div>

      </div>

    </Modal>

  );

}