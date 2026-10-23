
"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import {
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  LockKeyhole,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

type Mode = "setup" | "change";

export default function CorrectionPasswordPage() {
  const [mode, setMode] = useState<Mode>("setup");

  const [accountPassword, setAccountPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showGenerated, setShowGenerated] = useState(true);
  const [showAccountPassword, setShowAccountPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    resetMessages();
    setGeneratedPassword("");
    setAccountPassword("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCopied(false);
  };

  const getErrorMessage = (err: any): string => {
    const data = err?.response?.data;

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (typeof data === "string") {
      return data;
    }

    if (err?.message === "Network Error") {
      return "Impossible de contacter le serveur. Vérifiez votre connexion.";
    }

    return "Une erreur est survenue. Veuillez réessayer.";
  };

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();

    if (!accountPassword) {
      setError("Saisissez le mot de passe de votre compte BabiSchool.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/academics/correction/password/",
        {
          account_password: accountPassword,
        }
      );

      const password = response.data?.correction_password;

      if (!password) {
        setError(
          "Le serveur n'a pas retourné le mot de passe généré."
        );
        return;
      }

      setGeneratedPassword(password);
      setShowGenerated(true);
      setCopied(false);
      setAccountPassword("");
      setSuccess(
        "Votre mot de passe de correction a été généré. Conservez-le en lieu sûr."
      );
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();

    if (newPassword.length !== 6) {
      setError(
        "Le nouveau mot de passe doit contenir exactement 6 caractères."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (!currentPassword) {
      setError("Saisissez votre mot de passe de correction actuel.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/academics/correction/password/change/",
        {
          current_password: currentPassword,
          new_password: newPassword,
        }
      );

      setSuccess(
        response.data?.message ||
          "Votre mot de passe de correction a été modifié."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setGeneratedPassword("");
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedPassword) return;

    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setSuccess("Mot de passe copié dans le presse-papiers.");
    } catch {
      setError(
        "La copie automatique a échoué. Sélectionnez le code pour le copier manuellement."
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#6214BE] focus:ring-2 focus:ring-purple-100";

  return (
    <div className="min-h-full bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* En-tête */}
        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-[#6214BE]">
            <KeyRound size={25} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Mot de passe de correction
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Gérez le code de sécurité utilisé pour autoriser la
            modification des notes déjà publiées.
          </p>
        </div>

        {/* Informations de sécurité */}
        <div className="mb-6 flex gap-3 rounded-2xl border border-purple-100 bg-purple-50 p-4">
          <ShieldCheck
            className="mt-0.5 shrink-0 text-[#6214BE]"
            size={22}
          />

          <div>
            <h2 className="font-semibold text-gray-900">
              Votre code de sécurité
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Le code comporte exactement 6 caractères. Il est distinct
              du mot de passe de connexion à votre compte BabiSchool.
              Ne le partagez pas avec des personnes non autorisées.
            </p>
          </div>
        </div>

        {/* Carte principale */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Onglets */}
          <div className="grid grid-cols-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => switchMode("setup")}
              className={`flex items-center justify-center gap-2 px-3 py-4 text-sm font-semibold transition sm:px-5 ${
                mode === "setup"
                  ? "border-b-2 border-[#6214BE] bg-purple-50/50 text-[#6214BE]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <RefreshCw size={17} />
              Générer un code
            </button>

            <button
              type="button"
              onClick={() => switchMode("change")}
              className={`flex items-center justify-center gap-2 px-3 py-4 text-sm font-semibold transition sm:px-5 ${
                mode === "change"
                  ? "border-b-2 border-[#6214BE] bg-purple-50/50 text-[#6214BE]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <LockKeyhole size={17} />
              Modifier le code
            </button>
          </div>

          <div className="p-5 sm:p-8">
            {/* Messages */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 shrink-0" size={19} />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              >
                <CheckCircle2
                  className="mt-0.5 shrink-0"
                  size={19}
                />
                <p>{success}</p>
              </div>
            )}

            {mode === "setup" ? (
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {generatedPassword
                    ? "Votre code a été généré"
                    : "Générer votre code de correction"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {generatedPassword
                    ? "Conservez ce code en lieu sûr. Le serveur ne renvoie le code en clair qu'au moment de sa génération."
                    : "Confirmez votre identité avec le mot de passe de votre compte BabiSchool pour générer un code de correction."}
                </p>

                {!generatedPassword && (
                  <form onSubmit={handleGenerate} className="mt-6 space-y-5">
                    <div>
                      <label
                        htmlFor="accountPassword"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Mot de passe de votre compte BabiSchool
                      </label>

                      <div className="relative">
                        <input
                          id="accountPassword"
                          type={showAccountPassword ? "text" : "password"}
                          autoComplete="current-password"
                          value={accountPassword}
                          onChange={(e) =>
                            setAccountPassword(e.target.value)
                          }
                          placeholder="Saisissez votre mot de passe"
                          className={`${inputClass} pr-12`}
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowAccountPassword((value) => !value)
                          }
                          aria-label={
                            showAccountPassword
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#6214BE]"
                        >
                          {showAccountPassword ? (
                            <EyeOff size={19} />
                          ) : (
                            <Eye size={19} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6214BE] px-5 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <KeyRound size={18} />
                          Générer le code
                        </>
                      )}
                    </button>
                  </form>
                )}

                {generatedPassword && (
                  <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50 p-5 sm:p-6">
                    <label
                      htmlFor="generatedPassword"
                      className="mb-3 block text-sm font-semibold text-gray-700"
                    >
                      Votre mot de passe de correction
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        id="generatedPassword"
                        type={showGenerated ? "text" : "password"}
                        value={generatedPassword}
                        readOnly
                        autoComplete="off"
                        className={`${inputClass} font-mono text-lg font-bold tracking-[0.25em]`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowGenerated((value) => !value)}
                        aria-label={
                          showGenerated ? "Masquer le code" : "Afficher le code"
                        }
                        className="rounded-xl border border-gray-200 bg-white p-3 text-gray-600 hover:text-[#6214BE]"
                      >
                        {showGenerated ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6214BE] px-5 py-3 font-semibold text-white transition hover:bg-purple-800 sm:w-auto"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      {copied ? "Code copié" : "Copier le code"}
                    </button>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      Important : si vous quittez cette page sans conserver
                      le code, vous devrez en générer un nouveau. Une nouvelle
                      génération révoque les déverrouillages temporaires
                      existants.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setGeneratedPassword("");
                        setCopied(false);
                        resetMessages();
                      }}
                      className="mt-4 text-sm font-medium text-[#6214BE] underline underline-offset-4 hover:text-purple-800"
                    >
                      Terminer
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Modifier le code de correction
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Saisissez votre code actuel, puis choisissez un nouveau
                  code de 6 caractères.
                </p>

                <form onSubmit={handleChange} className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Code actuel
                    </label>

                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) =>
                          setCurrentPassword(e.target.value)
                        }
                        placeholder="Votre code actuel"
                        autoComplete="current-password"
                        maxLength={6}
                        className={`${inputClass} pr-12`}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword((value) => !value)
                        }
                        aria-label={
                          showCurrentPassword
                            ? "Masquer le code actuel"
                            : "Afficher le code actuel"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#6214BE]"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Nouveau code
                    </label>

                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        placeholder="6 caractères exactement"
                        autoComplete="new-password"
                        maxLength={6}
                        minLength={6}
                        className={`${inputClass} pr-12`}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword((value) => !value)
                        }
                        aria-label={
                          showNewPassword
                            ? "Masquer le nouveau code"
                            : "Afficher le nouveau code"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#6214BE]"
                      >
                        {showNewPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      6 caractères : lettres et/ou chiffres.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Confirmer le nouveau code
                    </label>

                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Saisissez à nouveau le code"
                      autoComplete="new-password"
                      maxLength={6}
                      minLength={6}
                      className={inputClass}
                      required
                    />

                    {confirmPassword.length > 0 &&
                      newPassword !== confirmPassword && (
                        <p className="mt-2 text-sm text-red-600">
                          Les deux codes ne correspondent pas.
                        </p>
                      )}
                  </div>

                  <div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                    Le changement du code révoquera les déverrouillages
                    temporaires existants. Vous devrez déverrouiller à
                    nouveau les évaluations pour poursuivre les corrections.
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6214BE] px-5 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Modification en cours...
                      </>
                    ) : (
                      <>
                        <LockKeyhole size={18} />
                        Modifier le code
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Rappel de sécurité */}
        <div className="mt-6 flex items-start gap-3 px-1 text-sm text-gray-500">
          <ShieldCheck className="mt-0.5 shrink-0" size={18} />
          <p className="leading-6">
            Cette fonctionnalité est réservée aux utilisateurs autorisés
            à gérer les corrections de notes. Les droits d'accès sont
            également vérifiés par le serveur.
          </p>
        </div>
      </div>
    </div>
  );
}
