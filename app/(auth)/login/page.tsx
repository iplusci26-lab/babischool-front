"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {

    try {

      setLoading(true);

      const res = await api.post("/auth/login/", {
        phone,
        password,
      });

      localStorage.setItem("token", res.data.access);
      console.log(res.data.school_active);
      if (res.data.school_active.active == true) {
        router.push("/profile");
      } else {
        router.push("/pending");
      }
      //

    } catch (err: any) {

      console.error(err.response?.data);

      alert(
        err.response?.data?.detail ||
        "Numéro ou mot de passe incorrect"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4EEFF] p-6">

      {/* Main Card */}
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[40px] bg-white shadow-2xl lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden flex-col items-center justify-center bg-[#6214BE] p-16 text-white lg:flex">

          {/* Decorative Blur */}
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">

            {/* Replace with your logo */}
            <Image
              src="/logo.png"
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

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Téléphone
                </label>

                <input
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                  placeholder="Entrez votre numéro"
                  onChange={(e) => setPhone(e.target.value)}
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Mot de passe
                </label>

                <input
                  type="password"
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                  placeholder="Entrez votre mot de passe"
                  onChange={(e) => setPassword(e.target.value)}
                />

              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="mt-4 h-12 w-full rounded-xl bg-[#6214BE] font-semibold text-white transition hover:scale-[1.02] hover:bg-[#4e10a0]"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>

              {/* Register Link */}
              <p className="pt-4 text-center text-sm text-gray-500">

                Vous n'avez pas encore de compte ?

                <Link
                  href="/register"
                  className="ml-2 font-semibold text-[#6214BE] hover:underline"
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