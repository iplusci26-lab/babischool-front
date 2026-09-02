import Link from "next/link";

const CONTACT_EMAIL = "iplus.ci26@gmail.com";

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="bg-[#6214BE] px-6 py-8 text-white sm:px-10">
            <h1 className="text-3xl font-bold sm:text-4xl">
              Demande de suppression de compte
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90 sm:text-base">
              Vous pouvez demander la suppression de votre compte BabiSchool et
              des données personnelles associées.
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Comment demander la suppression de votre compte ?
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Pour demander la suppression de votre compte BabiSchool,
                envoyez une demande à l&apos;adresse suivante :
              </p>

              <div className="mt-5 rounded-xl border border-purple-200 bg-purple-50 p-5">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=Demande de suppression de compte BabiSchool`}
                  className="break-all text-base font-semibold text-[#6214BE] hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>

              <p className="mt-5 leading-7 text-slate-600">
                Dans votre demande, veuillez indiquer les informations
                nécessaires pour identifier votre compte, notamment votre nom,
                votre numéro de téléphone ou votre adresse e-mail utilisée sur
                BabiSchool.
              </p>
            </section>

            <hr className="my-10 border-slate-200" />

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Que se passe-t-il après votre demande ?
              </h2>

              <div className="mt-5 space-y-4 text-slate-600">
                <p>
                  1. Votre demande est examinée afin de vérifier votre identité
                  et de protéger votre compte contre toute suppression non
                  autorisée.
                </p>

                <p>
                  2. Une fois la demande validée, votre compte BabiSchool est
                  supprimé ou désactivé conformément aux procédures applicables.
                </p>

                <p>
                  3. Les données personnelles associées à votre compte sont
                  supprimées ou anonymisées lorsqu&apos;elles ne doivent plus
                  être conservées.
                </p>
              </div>
            </section>

            <hr className="my-10 border-slate-200" />

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Données pouvant être concernées
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Selon votre utilisation de BabiSchool, la suppression peut
                concerner notamment :
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-slate-600">
                <li>les informations de votre profil ;</li>
                <li>les informations de connexion associées à votre compte ;</li>
                <li>les données personnelles directement associées à votre compte ;</li>
                <li>certaines préférences et informations de l&apos;application.</li>
              </ul>
            </section>

            <hr className="my-10 border-slate-200" />

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Données pouvant être conservées
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Certaines informations peuvent être conservées pendant une
                période limitée lorsqu&apos;elles sont nécessaires au respect
                d&apos;obligations légales, administratives, comptables ou de
                sécurité.
              </p>

              <p className="mt-4 leading-7 text-slate-600">
                Les informations scolaires liées à un établissement peuvent
                également être soumises aux règles de conservation applicables
                à cet établissement et ne sont pas automatiquement supprimées
                lorsqu&apos;elles doivent être conservées conformément aux
                obligations administratives ou légales.
              </p>
            </section>

            <hr className="my-10 border-slate-200" />

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                Délai de traitement
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Votre demande de suppression est traitée dans un délai
                raisonnable après vérification de votre identité et prise en
                compte des éventuelles obligations de conservation des données.
              </p>
            </section>

            <div className="mt-10 rounded-xl bg-slate-50 p-5">
              <p className="text-sm leading-6 text-slate-600">
                Pour plus d&apos;informations sur la manière dont BabiSchool
                traite et protège vos données, consultez notre{" "}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-[#6214BE] hover:underline"
                >
                  Politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} BabiSchool. Tous droits réservés.
        </p>
      </div>
    </main>
  );
}