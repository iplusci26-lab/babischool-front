"use client";

import Link from "next/link";

import {
  UserPlus,
  Wallet,
  ClipboardCheck,
  Megaphone,
} from "lucide-react";

export default function DashboardQuickActions() {

  const actions = [

    {
      title: "Nouvel élève",
      description: "Inscrire un nouvel élève",
      href: "/admissions",
      icon: UserPlus,
      color: "bg-violet-100 text-violet-700",
    },

    {
      title: "Paiement",
      description: "Enregistrer un paiement",
      href: "/finance",
      icon: Wallet,
      color: "bg-emerald-100 text-emerald-700",
    },

    {
      title: "Faire l'appel",
      description: "Présence des élèves",
      href: "/attendance/students",
      icon: ClipboardCheck,
      color: "bg-blue-100 text-blue-700",
    },

    {
      title: "Annonce",
      description: "Publier une annonce",
      href: "/announcements",
      icon: Megaphone,
      color: "bg-orange-100 text-orange-700",
    },

  ];

  return (

    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <div className="mb-6">

        <p className="text-sm font-medium text-[#6214BE]">
          Actions rapides
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          Accès direct
        </h2>

      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        {actions.map((action) => {

          const Icon = action.icon;

          return (

            <Link
              key={action.title}
              href={action.href}
              className="group rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-[#6214BE] hover:shadow-md"
            >

              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
              >

                <Icon size={22} />

              </div>

              <h3 className="font-semibold">

                {action.title}

              </h3>

              <p className="mt-1 text-sm text-gray-500">

                {action.description}

              </p>

            </Link>

          );

        })}

      </div>

    </div>

  );

}