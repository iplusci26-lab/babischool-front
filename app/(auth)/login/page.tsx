"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    // ----------------------------------------------------------
    // VALIDATION MOT DE PASSE
    // ----------------------------------------------------------

    if (password.length !== 6) {
      alert("Le mot de passe doit contenir exactement 6 caractères.");
      return;
    }

    // ----------------------------------------------------------
    // CONNEXION
    // ----------------------------------------------------------

    try {
      setLoading(true);

      const res = await api.post("/auth/login/", {
        phone,
        password,
      });

      localStorage.setItem("token", res.data.access);

      if (res.data.school_active.active === true) {
        router.push("/profile");
      } else {
        router.push("/pending");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: {
            detail?: string;
          };
        };
      };

      alert(
        error.response?.data?.detail ||
          "Numéro ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      {/* Main Card */}
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[40px] bg-white shadow-2xl lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden flex-col items-center justify-center bg-[#6214BE] p-16 text-white lg:flex">

          {/* Decorative Blur */}
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute bottom-10 right-0 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">

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
              Connectez-vous à votre espace scolaire
              et gérez votre établissement facilement.
            </p>

            <div className="mt-8 h-1 w-20 rounded-full bg-yellow-400" />

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8 lg:p-14">

          <div className="w-full max-w-md">

            {/* Header */}
            <div className="mb-10">

              <h2 className="text-4xl font-bold text-gray-900">
                Connexion
              </h2>

              <p className="mt-2 text-gray-500">
                Accédez à votre tableau de bord BabiSchool
              </p>

            </div>

            {/* Form */}
            <div className="space-y-5">

              {/* Téléphone */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Téléphone
                </label>

                <input
                  type="tel"
                  value={phone}
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                  placeholder="Entrez votre numéro"
                  onChange={(e) => setPhone(e.target.value)}
                />

              </div>

              {/* Mot de passe */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Mot de passe
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    maxLength={6}
                    inputMode="numeric"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 pr-12 outline-none transition focus:border-[#6214BE]"
                    placeholder="6 caractères"
                    onChange={(e) => {
                      const value = e.target.value;

                      // Maximum 6 caractères
                      if (value.length <= 6) {
                        setPassword(value);
                      }
                    }}
                  />

                  {/* Bouton afficher / masquer */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-[#6214BE]"
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

                {/* Compteur */}
                <div className="mt-2 flex justify-between text-xs">

                  <span className="text-gray-400">
                    6 caractères requis
                  </span>

                  <span
                    className={
                      password.length === 6
                        ? "font-medium text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {password.length}/6
                  </span>

                </div>

              </div>

              {/* Connexion */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="mt-4 h-12 w-full cursor-pointer rounded-xl bg-[#6214BE] font-semibold text-white transition hover:scale-[1.02] hover:bg-[#4e10a0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Connexion..."
                  : "Se connecter"}
              </button>

              {/* Register Link */}
              <p className="pt-4 text-center text-sm text-gray-500">

                Vous n'avez pas encore de compte ?

                <Link
                  href="/register"
                  className="ml-2 cursor-pointer font-semibold text-[#6214BE] hover:underline"
                >
                  Inscription
                </Link>

              </p>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}