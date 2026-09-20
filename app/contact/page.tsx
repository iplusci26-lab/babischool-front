"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#6214BE] px-6 py-5 text-white shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-white/10"
          >
            <ArrowLeft size={18} />
            Retour à l'accueil
          </Link>

          <div className="text-lg font-bold">BabiSchool</div>
        </div>
      </header>

      {/* Content */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          {/* Intro */}
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6214BE]/10">
              <Building2 className="text-[#6214BE]" size={32} />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
              Nous contacter
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              Vous souhaitez équiper votre établissement avec BabiSchool ?<br></br>
              Notre équipe vous accompagne dans la création et la configuration
              de votre espace scolaire.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-1">
            {/* Informations de contact */}
            <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Parlons de votre établissement
              </h2>

              <p className="mt-2 leading-6 text-gray-500">
                Contactez-nous directement pour obtenir des informations sur
                BabiSchool, demander une démonstration ou créer votre espace
                établissement.
              </p>

              <div className="mt-8 space-y-5">
                {/* Téléphone */}
                <a
                  href="tel:+2250749200389"
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4 transition hover:border-[#6214BE]/20 hover:bg-[#6214BE]/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6214BE]/10">
                    <Phone className="text-[#6214BE]" size={21} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-semibold text-gray-900">
                      +225 07 09 59 26 62
                    </p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/2250749200389"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4 transition hover:border-green-200 hover:bg-green-50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50">
                    <MessageCircle className="text-green-600" size={21} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="font-semibold text-gray-900">
                      +225 07 09 59 26 62
                    </p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:contact@babischool.com"
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4 transition hover:border-[#6214BE]/20 hover:bg-[#6214BE]/5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6214BE]/10">
                    <Mail className="text-[#6214BE]" size={21} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">
                      iplus.26@gmail.com
                    </p>
                  </div>
                </a>

                {/* Adresse */}
                <div className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6214BE]/10">
                    <MapPin className="text-[#6214BE]" size={21} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="font-semibold text-gray-900">
                      Abidjan, Côte d'Ivoire
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA WhatsApp */}
              <a
                href="https://wa.me/2250749200389?text=Bonjour%20BabiSchool%2C%20je%20souhaite%20obtenir%20des%20informations%20pour%20mon%20%C3%A9tablissement."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6214BE] px-6 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#5310a5]"
              >
                <MessageCircle size={20} />
                Nous contacter sur WhatsApp
              </a>
            </div>

            {/* Demande de création */}
            {/*<div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-gray-900">
                  Laissez-nous un message
                </h2>

                <p className="mt-2 leading-6 text-gray-500">
                  Remplissez ce formulaire et notre équipe vous recontactera
                  pour vous accompagner.
                </p>
              </div>

              <form
                action="mailto:contact@babischool.com"
                method="post"
                encType="text/plain"
                className="space-y-5"
              >
                // Nom établissement 
                <div>
                  <label
                    htmlFor="schoolName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Nom de l'établissement
                  </label>

                  <input
                    id="schoolName"
                    name="Etablissement"
                    type="text"
                    placeholder="Ex : Groupe Scolaire Excellence"
                    required
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6214BE] focus:ring-4 focus:ring-[#6214BE]/10"
                  />
                </div>

                // Nom responsable 
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Nom du responsable
                  </label>

                  <input
                    id="name"
                    name="Responsable"
                    type="text"
                    placeholder="Votre nom complet"
                    required
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6214BE] focus:ring-4 focus:ring-[#6214BE]/10"
                  />
                </div>

                // Téléphone 
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Téléphone
                  </label>

                  <input
                    id="phone"
                    name="Telephone"
                    type="tel"
                    placeholder="+225 07 00 00 00 00"
                    required
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6214BE] focus:ring-4 focus:ring-[#6214BE]/10"
                  />
                </div>

                //Email 
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Adresse email
                  </label>

                  <input
                    id="email"
                    name="Email"
                    type="email"
                    placeholder="exemple@ecole.com"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6214BE] focus:ring-4 focus:ring-[#6214BE]/10"
                  />
                </div>

                {/* Message
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="Message"
                    rows={4}
                    placeholder="Décrivez brièvement votre besoin..."
                    required
                    className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#6214BE] focus:ring-4 focus:ring-[#6214BE]/10"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6214BE] px-6 py-4 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#5310a5]"
                >
                  <Send size={19} />
                  Envoyer ma demande
                </button>
              </form>
            </div> */}
          </div>

          

          {/* Pourquoi nous contacter */}
          <div className="mt-10 rounded-3xl bg-[#6214BE] p-6 text-white shadow-xl md:p-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 shrink-0 text-yellow-300" size={24} />
                <div>
                  <h3 className="font-semibold">Configuration personnalisée</h3>
                  <p className="mt-1 text-sm leading-6 text-white/75">
                    Votre établissement est configuré selon son organisation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 shrink-0 text-yellow-300" size={24} />
                <div>
                  <h3 className="font-semibold">Accompagnement</h3>
                  <p className="mt-1 text-sm leading-6 text-white/75">
                    Nous vous accompagnons lors de la mise en place.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="mt-1 shrink-0 text-yellow-300" size={24} />
                <div>
                  <h3 className="font-semibold">Solution adaptée aux écoles</h3>
                  <p className="mt-1 text-sm leading-6 text-white/75">
                    BabiSchool centralise la gestion et la communication de
                    votre établissement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} BabiSchool. Tous droits réservés.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}