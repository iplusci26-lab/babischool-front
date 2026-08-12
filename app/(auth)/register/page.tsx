"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  // ==========================================================
  // FORMULAIRE
  // ==========================================================

  const [form, setForm] = useState({
    school_name: "",
    school_code: "",
    school_sigle: "",
    email: "",
    phone_fix: "",
    phone: "",
    password: "",
  });

  // ==========================================================
  // LOGO
  // ==========================================================

  const [logo, setLogo] = useState<File | null>(null);

  // ==========================================================
  // LOADING
  // ==========================================================

  const [loading, setLoading] = useState(false);

  // ==========================================================
  // VISIBILITÉ MOT DE PASSE
  // ==========================================================

  const [showPassword, setShowPassword] = useState(false);

  // ==========================================================
  // CHANGE
  // ==========================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // --------------------------------------------------------
    // Éviter les doubles soumissions
    // --------------------------------------------------------

    if (loading) {
      return;
    }

    // ========================================================
    // VALIDATION DES CHAMPS OBLIGATOIRES
    // ========================================================

    if (!form.school_name.trim()) {
      toast.error(
        "Le nom de l'établissement est obligatoire."
      );
      return;
    }

    if (!form.school_code.trim()) {
      toast.error(
        "Le code de l'établissement est obligatoire."
      );
      return;
    }

    if (!form.school_sigle.trim()) {
      toast.error(
        "Le sigle de l'établissement est obligatoire."
      );
      return;
    }

    if (!form.phone.trim()) {
      toast.error(
        "Le téléphone principal est obligatoire."
      );
      return;
    }

    // ========================================================
    // VALIDATION TÉLÉPHONE
    // ========================================================

    const phone = form.phone.trim();

    if (!/^\d{10}$/.test(phone)) {
      toast.error(
        "Le numéro de téléphone doit contenir exactement 10 chiffres."
      );
      return;
    }

    // ========================================================
    // VALIDATION MOT DE PASSE
    // ========================================================

    if (!form.password) {
      toast.error(
        "Le mot de passe est obligatoire."
      );
      return;
    }

    if (form.password.length !== 6) {
      toast.error(
        "Le mot de passe doit contenir exactement 6 caractères."
      );
      return;
    }

    // ========================================================
    // ENVOI
    // ========================================================

    try {
      setLoading(true);

      // ------------------------------------------------------
      // FormData
      // ------------------------------------------------------

      const formData = new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          if (
            value !== undefined &&
            value !== null
          ) {
            formData.append(
              key,
              key === "password"
                ? String(value)
                : String(value).trim()
            );
          }
        }
      );

      // ------------------------------------------------------
      // Logo
      // ------------------------------------------------------

      if (logo) {
        formData.append(
          "logo",
          logo
        );
      }

      // ======================================================
      // REQUÊTE
      // ======================================================

      await api.post(
        "/auth/register/",
        formData
      );

      // ======================================================
      // SUCCÈS
      // ======================================================

      toast.success(
        "Établissement enregistré avec succès."
      );

      // Petite pause pour laisser apparaître le toast
      setTimeout(() => {
        router.push("/pending");
      }, 500);

    } catch (err: any) {

      console.error(
        "Erreur inscription :",
        err?.response?.data
      );

      const data =
        err?.response?.data;

      // ======================================================
      // ERREUR DETAIL
      // ======================================================

      if (data?.detail) {
        toast.error(
          data.detail
        );

        return;
      }

      // ======================================================
      // ERREURS DE VALIDATION DRF
      // ======================================================

      if (
        data &&
        typeof data === "object"
      ) {

        const firstError =
          Object.values(data)
            .flat()
            .find(
              (message) =>
                typeof message === "string"
            );

        if (firstError) {

          toast.error(
            firstError as string
          );

          return;
        }
      }

      // ======================================================
      // ERREUR GÉNÉRIQUE
      // ======================================================

      toast.error(
        "Une erreur est survenue lors de l'inscription."
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      {/* ================================================== */}
      {/* MAIN CARD */}
      {/* ================================================== */}

      <div className="grid w-full max-w-6xl overflow-hidden rounded-[40px] bg-white shadow-2xl lg:grid-cols-2">

        {/* ================================================== */}
        {/* LEFT SIDE */}
        {/* ================================================== */}

        <div className="relative hidden flex-col items-center justify-center bg-[#6214BE] p-16 text-white lg:flex">

          {/* Decorative Blur */}

          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute bottom-10 right-0 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl" />

          {/* Content */}

          <div className="relative z-10 flex flex-col items-center text-center">

            {/* Logo */}

            <Image
              src="/images/babischool_logo.png"
              alt="BabiSchool"
              width={140}
              height={140}
              className="mb-8"
            />

            <h1 className="mb-4 text-5xl font-extrabold">
              BabiSchool
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-white/90">
              La plateforme intelligente pour simplifier
              la gestion des établissements scolaires.
            </p>

            <div className="mt-8 h-1 w-20 rounded-full bg-yellow-400" />

          </div>

        </div>

        {/* ================================================== */}
        {/* RIGHT SIDE */}
        {/* ================================================== */}

        <div className="flex items-center justify-center p-8 lg:p-14">

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl"
          >

            {/* ================================================== */}
            {/* HEADER */}
            {/* ================================================== */}

            <div className="mb-8">

              <h2 className="text-4xl font-bold text-gray-900">
                Créer un compte
              </h2>

              <p className="mt-2 text-gray-500">
                Enregistrez votre établissement sur BabiSchool
              </p>

            </div>

            {/* ================================================== */}
            {/* FORM */}
            {/* ================================================== */}

            <div className="grid gap-4">

              {/* ================================================== */}
              {/* NOM ÉTABLISSEMENT */}
              {/* ================================================== */}

              <input
                name="school_name"
                value={form.school_name}
                placeholder="Nom de l'établissement"
                className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                onChange={handleChange}
                required
              />

              {/* ================================================== */}
              {/* CODE + SIGLE */}
              {/* ================================================== */}

              <div className="grid grid-cols-2 gap-4">

                <input
                  name="school_code"
                  value={form.school_code}
                  placeholder="Code"
                  className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                  onChange={handleChange}
                  required
                />

                <input
                  name="school_sigle"
                  value={form.school_sigle}
                  placeholder="Sigle"
                  className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                  onChange={handleChange}
                  required
                />

              </div>

              {/* ================================================== */}
              {/* TÉLÉPHONE */}
              {/* ================================================== */}

              <input
                name="phone"
                value={form.phone}
                placeholder="Téléphone principal"
                inputMode="numeric"
                maxLength={10}
                className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                onChange={handleChange}
                required
              />

              {/* ================================================== */}
              {/* EMAIL + DEUXIÈME CONTACT */}
              {/* ================================================== */}

              <div className="grid grid-cols-2 gap-4">

                <input
                  name="email"
                  value={form.email}
                  type="email"
                  placeholder="Email"
                  className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                  onChange={handleChange}
                />

                <input
                  name="phone_fix"
                  value={form.phone_fix}
                  placeholder="Deuxième contact"
                  inputMode="numeric"
                  maxLength={10}
                  className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                  onChange={handleChange}
                />

              </div>

              {/* ================================================== */}
              {/* LOGO */}
              {/* ================================================== */}

              <div className="rounded-xl border border-dashed border-gray-300 p-4">

                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Logo de l'établissement
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm"
                  onChange={(e) =>
                    setLogo(
                      e.target.files?.[0] || null
                    )
                  }
                />

                {logo && (
                  <p className="mt-2 text-xs text-gray-500">
                    Fichier sélectionné : {logo.name}
                  </p>
                )}

              </div>

              {/* ================================================== */}
              {/* MOT DE PASSE */}
              {/* ================================================== */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Mot de passe
                </label>

                <div className="relative">

                  <input
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password}
                    placeholder="Mot de passe"
                    maxLength={6}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 pr-12 outline-none transition focus:border-[#6214BE]"
                  />

                  {/* ================================================== */}
                  {/* AFFICHER / MASQUER */}
                  {/* ================================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-[#6214BE]"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}

                  </button>

                </div>

                {/* ================================================== */}
                {/* COMPTEUR */}
                {/* ================================================== */}

                <div className="mt-1 flex justify-end">

                  <span
                    className={`text-xs ${
                      form.password.length === 6
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {form.password.length}/6
                  </span>

                </div>

                {/* ================================================== */}
                {/* INFORMATION */}
                {/* ================================================== */}

                <p className="mt-1 text-xs text-gray-500">
                  Le mot de passe doit contenir exactement
                  6 caractères.
                </p>

              </div>

              {/* ================================================== */}
              {/* SUBMIT */}
              {/* ================================================== */}

              <button
                type="submit"
                disabled={
                  loading ||
                  form.password.length !== 6
                }
                className="mt-4 h-12 cursor-pointer rounded-xl bg-[#6214BE] font-semibold text-white transition hover:scale-[1.02] hover:bg-[#4e10a0] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:scale-100"
              >

                {loading
                  ? "Création..."
                  : "Créer mon compte"}

              </button>

              {/* ================================================== */}
              {/* LOGIN */}
              {/* ================================================== */}

              <p className="pt-4 text-center text-sm text-gray-500">

                Vous avez déjà un compte ?

                <Link
                  href="/login"
                  className="ml-2 cursor-pointer font-semibold text-[#6214BE] hover:underline"
                >
                  Connexion
                </Link>

              </p>

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}