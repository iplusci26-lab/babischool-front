"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    school_name: "",
    school_code: "",
    school_sigle: "",
    email: "",
    phone_fix: "",
    phone: "",
    password: "",
  });

  const [logo, setLogo] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (logo) {
      formData.append("logo", logo);
    } else {
      formData.append("logo", "");
    }

    try {
      // Register
      await api.post("/auth/register/", formData);
      router.push("/pending");
      // Auto login
      /*const res = await api.post("/auth/login/", {
        phone: form.phone,
        password: form.password,
      });

      localStorage.setItem("token", res.data.access);*/

      

    } catch (err: any) {
      console.error(err.response?.data?.detail);
      alert(err.response?.data?.detail);

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

          {/* Logo */}
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
              La plateforme intelligente pour simplifier
              la gestion des établissements scolaires.
            </p>

            <div className="mt-8 h-1 w-20 rounded-full bg-yellow-400" />

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8 lg:p-14">

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl"
          >

            <div className="mb-8">

              <h2 className="text-4xl font-bold text-gray-900">
                Créer un compte
              </h2>

              <p className="mt-2 text-gray-500">
                Enregistrez votre établissement sur BabiSchool
              </p>

            </div>

            <div className="grid gap-4">

              <input
                name="school_name"
                placeholder="Nom de l'établissement"
                className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  name="school_code"
                  placeholder="Code"
                  className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                  onChange={handleChange}
                  required
                />

                <input
                  name="school_sigle"
                  placeholder="Sigle"
                  className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                  onChange={handleChange}
                  required
                />

              </div>

              <input
                name="phone"
                placeholder="Téléphone principal"
                className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                  onChange={handleChange}
                />

                <input
                  name="phone_fix"
                  placeholder="Téléphone fixe"
                  className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                  onChange={handleChange}
                />

              </div>

              <div className="rounded-xl border border-dashed border-gray-300 p-4">

                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Logo de l'établissement
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm"
                  onChange={(e) =>
                    setLogo(e.target.files?.[0] || null)
                  }
                />

              </div>

              <input
                name="password"
                type="password"
                placeholder="Mot de passe"
                className="h-12 rounded-xl border border-gray-200 px-4 outline-none transition focus:border-[#6214BE]"
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-4 h-12 rounded-xl bg-[#6214BE] font-semibold text-white transition hover:scale-[1.02] hover:bg-[#4e10a0]"
              >
                {loading ? "Création..." : "Créer mon compte"}
              </button>
                
              <p className="pt-4 text-center text-sm text-gray-500">

                Vous avez déjà un compte ?

                <Link
                  href="/login"
                  className="ml-2 font-semibold text-[#6214BE] hover:underline"
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