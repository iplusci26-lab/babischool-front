"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { api } from "@/lib/api";

export default function ChangePassword() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================================
  // VISIBILITÉ DES MOTS DE PASSE
  // ==========================================================

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const submit = async () => {
    if (
      !form.current_password ||
      !form.new_password ||
      !form.confirm_password
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    if (form.current_password.length !== 6) {
      alert(
        "Le mot de passe actuel doit contenir exactement 6 caractères."
      );
      return;
    }

    if (form.new_password.length !== 6) {
      alert(
        "Le nouveau mot de passe doit contenir exactement 6 caractères."
      );
      return;
    }

    if (form.confirm_password.length !== 6) {
      alert(
        "La confirmation doit contenir exactement 6 caractères."
      );
      return;
    }

    if (
      form.new_password !==
      form.confirm_password
    ) {
      alert(
        "Les nouveaux mots de passe ne correspondent pas."
      );
      return;
    }

    setLoading(true);

    try {
      await api.post(
        "/auth/change-password/",
        form
      );

      alert(
        "Mot de passe modifié"
      );

      setForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

    } catch (err: any) {
      console.log(
        "erreur---- ",
        err?.response?.data
      );

      alert(
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Erreur lors de la modification du mot de passe"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div
      className="
        bg-white
        border
        rounded-3xl
        p-6
        space-y-6
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>
        <h2 className="text-xl font-bold">
          Changer mot de passe
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Sécurisez votre compte utilisateur
        </p>
      </div>

      {/* ======================================================
          CURRENT PASSWORD
      ====================================================== */}

      <div>
        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Mot de passe actuel
        </label>

        <div className="relative">

          <input
            type={
              showCurrentPassword
                ? "text"
                : "password"
            }

            value={
              form.current_password
            }

            maxLength={6}

            onChange={(e) =>
              setForm({
                ...form,
                current_password:
                  e.target.value,
              })
            }

            className="
              w-full
              border
              rounded-2xl
              p-3
              pr-12
              outline-none
              focus:ring-2
              focus:ring-[#6214BE]
            "

            placeholder="6 caractères"
          />

          <button
            type="button"
            onClick={() =>
              setShowCurrentPassword(
                !showCurrentPassword
              )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-gray-500
              hover:text-[#6214BE]
              cursor-pointer
            "
            aria-label={
              showCurrentPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showCurrentPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>

        </div>

        <p className="mt-1 text-xs text-gray-400">
          {form.current_password.length}/6 caractères
        </p>
      </div>

      {/* ======================================================
          NEW PASSWORD
      ====================================================== */}

      <div>
        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Nouveau mot de passe
        </label>

        <div className="relative">

          <input
            type={
              showNewPassword
                ? "text"
                : "password"
            }

            value={
              form.new_password
            }

            maxLength={6}

            onChange={(e) =>
              setForm({
                ...form,
                new_password:
                  e.target.value,
              })
            }

            className="
              w-full
              border
              rounded-2xl
              p-3
              pr-12
              outline-none
              focus:ring-2
              focus:ring-[#6214BE]
            "

            placeholder="6 caractères"
          />

          <button
            type="button"
            onClick={() =>
              setShowNewPassword(
                !showNewPassword
              )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-gray-500
              hover:text-[#6214BE]
              cursor-pointer
            "
            aria-label={
              showNewPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showNewPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>

        </div>

        <p className="mt-1 text-xs text-gray-400">
          {form.new_password.length}/6 caractères
        </p>
      </div>

      {/* ======================================================
          CONFIRM PASSWORD
      ====================================================== */}

      <div>
        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Confirmation
        </label>

        <div className="relative">

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }

            value={
              form.confirm_password
            }

            maxLength={6}

            onChange={(e) =>
              setForm({
                ...form,
                confirm_password:
                  e.target.value,
              })
            }

            className="
              w-full
              border
              rounded-2xl
              p-3
              pr-12
              outline-none
              focus:ring-2
              focus:ring-[#6214BE]
            "

            placeholder="6 caractères"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-gray-500
              hover:text-[#6214BE]
              cursor-pointer
            "
            aria-label={
              showConfirmPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showConfirmPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>

        </div>

        <p className="mt-1 text-xs text-gray-400">
          {form.confirm_password.length}/6 caractères
        </p>
      </div>

      {/* ======================================================
          ACTION
      ====================================================== */}

      <button
        onClick={submit}
        disabled={loading}
        className="
          text-white
          bg-[#6214BE]
          hover:bg-[#4E0EA0]
          disabled:bg-gray-400
          disabled:cursor-not-allowed
          px-6
          py-3
          rounded-2xl
          font-medium
          transition
        "
      >
        {loading
          ? "Modification..."
          : "Modifier mot de passe"}
      </button>

    </div>
  );
}