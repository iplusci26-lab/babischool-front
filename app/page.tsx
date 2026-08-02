"use client";

import Link from "next/link";
import Image from "next/image";


export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* Purple Overlay */}
      <div className="absolute inset-0 bg-[#6214BE]/80 backdrop-blur-[3px]" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">


        {/* Logo / Title */}

            <div className="mb-8 flex flex-col items-center">

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-md shadow-2xl">

              <Image
                src="/images/babischool_logo.png"
                alt="Logo BabiSchool"
                width={110}
                height={110}
                priority
                className="h-auto w-auto"
              />

            </div>

            
            </div>



        {/* Welcome Text */}
        <h2 className="mb-6 max-w-4xl text-3xl font-bold leading-tight md:text-6xl">
          Bienvenue sur BabiSchool
        </h2>

        <p className="mb-4 max-w-2xl text-lg text-white/90 md:text-2xl">
          La plateforme tout-en-un conçue pour accompagner les
          écoles vers une gestion simple, efficace et moderne.
        </p>

        <div className="mb-8 h-1 w-24 rounded-full bg-gradient-to-r from-yellow-300 via-white to-yellow-300" />

        <p className="mb-12 max-w-3xl text-base text-white/80 md:text-xl">
          Gérez vos élèves, enseignants, classes et bien plus encore,
          en toute simplicité.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">

          <Link
            href="/register"
            className="rounded-2xl bg-white px-10 py-4 text-lg font-semibold text-[#6214BE] shadow-xl transition hover:scale-105 hover:bg-gray-100"
          >
            Inscription
          </Link>

          <Link
            href="/login"
            className="rounded-2xl border border-white/30 bg-white/10 px-10 py-4 text-lg font-semibold text-white backdrop-blur-md transition hover:scale-105 hover:bg-white/20"
          >
            Connexion
          </Link>

        </div>
      </div>
    </main>
  );
}