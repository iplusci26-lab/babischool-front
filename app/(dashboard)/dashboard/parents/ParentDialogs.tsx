"use client";

import { Copy, KeyRound, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { Parent, ResetParentPasswordResponse } from "./types";

interface ParentDialogsProps {
  selectedParent: Parent | null;

  confirmOpen: boolean;
  resultOpen: boolean;

  loading: boolean;

  resetResult: ResetParentPasswordResponse | null;

  onConfirm: () => void;
  onCloseConfirm: () => void;

  onCloseResult: () => void;
}

export default function ParentDialogs({
  selectedParent,

  confirmOpen,
  resultOpen,

  loading,

  resetResult,

  onConfirm,
  onCloseConfirm,
  onCloseResult,
}: ParentDialogsProps) {
  const [copied, setCopied] = useState(false);

  const copyPassword = async () => {
    if (!resetResult) return;

    await navigator.clipboard.writeText(
      resetResult.temporary_password
    );

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ========================= */}
      {/* Confirmation */}
      {/* ========================= */}

      {confirmOpen && selectedParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            <div className="border-b p-6">

              <div className="mb-3 flex justify-center">

                <div className="rounded-full bg-yellow-100 p-4">

                  <TriangleAlert
                    size={36}
                    className="text-yellow-600"
                  />

                </div>

              </div>

              <h2 className="text-center text-xl font-semibold">

                Réinitialiser le mot de passe ?

              </h2>

              <p className="mt-3 text-center text-gray-500">

                Vous êtes sur le point de générer un nouveau mot de passe
                temporaire pour :

              </p>

              <p className="mt-2 text-center font-semibold">

                {selectedParent.full_name}

              </p>

            </div>

            <div className="flex justify-end gap-3 p-6">

              <button
                onClick={onCloseConfirm}
                className="rounded-lg border px-4 py-2 hover:bg-gray-100"
              >
                Annuler
              </button>

              <button
                disabled={loading}
                onClick={onConfirm}
                className="rounded-lg bg-[#6214BE] px-4 py-2 text-white disabled:opacity-50"
              >
                {loading
                  ? "Réinitialisation..."
                  : "Confirmer"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* Résultat */}
      {/* ========================= */}

      {resultOpen && resetResult && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            <div className="border-b p-6 text-center">

              <div className="mb-4 flex justify-center">

                <div className="rounded-full bg-[#6214BE]/10 p-4">

                  <KeyRound
                    size={34}
                    className="text-[#6214BE]"
                  />

                </div>

              </div>

              <h2 className="text-xl font-semibold">

                Mot de passe réinitialisé

              </h2>

            </div>

            <div className="space-y-5 p-6">

              <div>

                <p className="text-xs text-gray-500">

                  Parent

                </p>

                <p className="font-medium">

                  {resetResult.parent.name}

                </p>

              </div>

              <div>

                <p className="text-xs text-gray-500">

                  Téléphone

                </p>

                <p className="font-medium">

                  {resetResult.parent.phone}

                </p>

              </div>

              <div>

                <p className="mb-2 text-xs text-gray-500">

                  Mot de passe temporaire

                </p>

                <div className="flex items-center justify-between rounded-lg border bg-gray-50 px-4 py-3">

                  <span className="font-mono text-lg font-bold tracking-widest">

                    {resetResult.temporary_password}

                  </span>

                  <button
                    onClick={copyPassword}
                    className="flex items-center gap-2 text-[#6214BE]"
                  >
                    <Copy size={18} />

                    {copied ? "Copié" : "Copier"}

                  </button>

                </div>

              </div>

            </div>

            <div className="border-t p-6">

              <button
                onClick={onCloseResult}
                className="w-full rounded-lg bg-[#6214BE] py-2 text-white"
              >
                Fermer
              </button>

            </div>

          </div>

        </div>

      )}
    </>
  );
}