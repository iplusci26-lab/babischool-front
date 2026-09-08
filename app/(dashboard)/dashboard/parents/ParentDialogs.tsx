"use client";

import {
  Copy,
  KeyRound,
  TriangleAlert,
  UserCheck,
  UserX,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  Parent,
  ResetParentPasswordResponse,
} from "./types";


// ==========================================================
// PROPS
// ==========================================================

interface ParentDialogsProps {


  // ========================================================
  // PARENT
  // ========================================================

  selectedParent:
    Parent | null;


  // ========================================================
  // RESET PASSWORD
  // ========================================================

  confirmOpen:
    boolean;

  resultOpen:
    boolean;


  // ========================================================
  // ACTIVATE / DEACTIVATE
  // ========================================================

  deactivateOpen:
    boolean;


  // ========================================================
  // LOADING
  // ========================================================

  loading:
    boolean;


  // ========================================================
  // RESULT
  // ========================================================

  resetResult:
    ResetParentPasswordResponse | null;


  // ========================================================
  // RESET ACTIONS
  // ========================================================

  onConfirm:
    () => void;

  onCloseConfirm:
    () => void;

  onCloseResult:
    () => void;


  // ========================================================
  // STATUS ACTIONS
  // ========================================================

  onConfirmDeactivate:
    () => void;

  onCloseDeactivate:
    () => void;

}


// ==========================================================
// COMPONENT
// ==========================================================

export default function ParentDialogs({

  selectedParent,

  confirmOpen,

  resultOpen,

  deactivateOpen,

  loading,

  resetResult,

  onConfirm,

  onCloseConfirm,

  onCloseResult,

  onConfirmDeactivate,

  onCloseDeactivate,

}: ParentDialogsProps) {


  // ========================================================
  // COPY STATE
  // ========================================================

  const [

    copied,

    setCopied,

  ] = useState(
    false
  );


  // ========================================================
  // COPY PASSWORD
  // ========================================================

  const copyPassword =
    async () => {

      if (
        !resetResult
      ) {
        return;
      }


      await navigator.clipboard.writeText(

        resetResult.temporary_password

      );


      setCopied(
        true
      );


      setTimeout(

        () => {

          setCopied(
            false
          );

        },

        2000

      );

    };


  // ========================================================
  // STATUS
  // ========================================================

  const isActive =
    selectedParent?.is_active ?? false;


  const statusTitle =
    isActive
      ? "Désactiver ce compte ?"
      : "Réactiver ce compte ?";


  const statusDescription =
    isActive
      ? "Le parent ne pourra plus se connecter à son compte."
      : "Le parent pourra à nouveau se connecter à son compte.";


  const statusWarning =
    isActive
      ? "Cette action empêchera le parent d'accéder à son compte."
      : "Cette action rétablira l'accès du parent à son compte.";


  const statusButtonLabel =
    isActive
      ? "Désactiver"
      : "Réactiver";


  const statusLoadingLabel =
    isActive
      ? "Désactivation..."
      : "Réactivation...";


  // ========================================================
  // RENDER
  // ========================================================

  return (

    <>


      {/* ================================================= */}
      {/* RESET CONFIRMATION */}
      {/* ================================================= */}

      {confirmOpen && selectedParent && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-md
              rounded-xl
              bg-white
              shadow-xl
            "
          >

            <div
              className="
                border-b
                p-6
              "
            >

              <div
                className="
                  mb-3
                  flex
                  justify-center
                "
              >

                <div
                  className="
                    rounded-full
                    bg-yellow-100
                    p-4
                  "
                >

                  <TriangleAlert
                    size={36}
                    className="
                      text-yellow-600
                    "
                  />

                </div>

              </div>


              <h2
                className="
                  text-center
                  text-xl
                  font-semibold
                "
              >
                Réinitialiser le mot de passe ?
              </h2>


              <p
                className="
                  mt-3
                  text-center
                  text-gray-500
                "
              >
                Vous êtes sur le point de générer
                un nouveau mot de passe temporaire
                pour :
              </p>


              <p
                className="
                  mt-2
                  text-center
                  font-semibold
                "
              >
                {selectedParent.full_name}
              </p>

            </div>


            <div
              className="
                flex
                justify-end
                gap-3
                p-6
              "
            >

              <button
                type="button"

                onClick={
                  onCloseConfirm
                }

                disabled={
                  loading
                }

                className="
                  rounded-lg
                  border
                  px-4
                  py-2
                  hover:bg-gray-100
                  disabled:opacity-50
                "
              >
                Annuler
              </button>


              <button
                type="button"

                disabled={
                  loading
                }

                onClick={
                  onConfirm
                }

                className="
                  rounded-lg
                  bg-[#6214BE]
                  px-4
                  py-2
                  text-white
                  disabled:opacity-50
                "
              >

                {
                  loading
                    ? "Réinitialisation..."
                    : "Confirmer"
                }

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ================================================= */}
      {/* RESET RESULT */}
      {/* ================================================= */}

      {resultOpen && resetResult && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-md
              rounded-xl
              bg-white
              shadow-xl
            "
          >

            <div
              className="
                border-b
                p-6
                text-center
              "
            >

              <div
                className="
                  mb-4
                  flex
                  justify-center
                "
              >

                <div
                  className="
                    rounded-full
                    bg-[#6214BE]/10
                    p-4
                  "
                >

                  <KeyRound
                    size={34}
                    className="
                      text-[#6214BE]
                    "
                  />

                </div>

              </div>


              <h2
                className="
                  text-xl
                  font-semibold
                "
              >
                Mot de passe réinitialisé
              </h2>

            </div>


            <div
              className="
                space-y-5
                p-6
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Parent
                </p>


                <p
                  className="
                    font-medium
                  "
                >
                  {
                    resetResult
                      .parent
                      .name
                  }
                </p>

              </div>


              <div>

                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Téléphone
                </p>


                <p
                  className="
                    font-medium
                  "
                >
                  {
                    resetResult
                      .parent
                      .phone
                  }
                </p>

              </div>


              <div>

                <p
                  className="
                    mb-2
                    text-xs
                    text-gray-500
                  "
                >
                  Mot de passe temporaire
                </p>


                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    border
                    bg-gray-50
                    px-4
                    py-3
                  "
                >

                  <span
                    className="
                      font-mono
                      text-lg
                      font-bold
                      tracking-widest
                    "
                  >
                    {
                      resetResult
                        .temporary_password
                    }
                  </span>


                  <button
                    type="button"

                    onClick={
                      copyPassword
                    }

                    className="
                      flex
                      items-center
                      gap-2
                      text-[#6214BE]
                    "
                  >

                    <Copy
                      size={18}
                    />

                    {
                      copied
                        ? "Copié"
                        : "Copier"
                    }

                  </button>

                </div>

              </div>

            </div>


            <div
              className="
                border-t
                p-6
              "
            >

              <button
                type="button"

                onClick={
                  onCloseResult
                }

                className="
                  w-full
                  rounded-lg
                  bg-[#6214BE]
                  py-2
                  text-white
                "
              >
                Fermer
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ================================================= */}
      {/* ACTIVATE / DEACTIVATE PARENT */}
      {/* ================================================= */}

      {deactivateOpen && selectedParent && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-md
              rounded-xl
              bg-white
              shadow-xl
            "
          >


            {/* =========================================== */}
            {/* CONTENT */}
            {/* =========================================== */}

            <div
              className="
                border-b
                p-6
              "
            >

              <div
                className="
                  mb-4
                  flex
                  justify-center
                "
              >

                <div
                  className={
                    isActive
                      ? `
                        rounded-full
                        bg-red-100
                        p-4
                      `
                      : `
                        rounded-full
                        bg-green-100
                        p-4
                      `
                  }
                >

                  {
                    isActive
                      ? (

                        <UserX
                          size={36}
                          className="
                            text-red-600
                          "
                        />

                      )
                      : (

                        <UserCheck
                          size={36}
                          className="
                            text-green-600
                          "
                        />

                      )
                  }

                </div>

              </div>


              <h2
                className="
                  text-center
                  text-xl
                  font-semibold
                  text-gray-900
                "
              >
                {statusTitle}
              </h2>


              <p
                className="
                  mt-3
                  text-center
                  text-gray-500
                "
              >
                {statusDescription}
              </p>


              <div
                className="
                  mt-4
                  rounded-lg
                  bg-gray-50
                  p-4
                  text-center
                "
              >

                <p
                  className="
                    font-semibold
                    text-gray-900
                  "
                >
                  {selectedParent.full_name}
                </p>


                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-500
                  "
                >
                  {selectedParent.phone}
                </p>

              </div>


              <p
                className={
                  isActive
                    ? `
                      mt-4
                      text-center
                      text-sm
                      text-red-600
                    `
                    : `
                      mt-4
                      text-center
                      text-sm
                      text-green-600
                    `
                }
              >
                {statusWarning}
              </p>

            </div>


            {/* =========================================== */}
            {/* ACTIONS */}
            {/* =========================================== */}

            <div
              className="
                flex
                justify-end
                gap-3
                p-6
              "
            >

              <button
                type="button"

                onClick={
                  onCloseDeactivate
                }

                disabled={
                  loading
                }

                className="
                  rounded-lg
                  border
                  px-4
                  py-2
                  hover:bg-gray-100
                  disabled:opacity-50
                "
              >
                Annuler
              </button>


              <button
                type="button"

                onClick={
                  onConfirmDeactivate
                }

                disabled={
                  loading
                }

                className={
                  isActive
                    ? `
                      rounded-lg
                      bg-red-600
                      px-4
                      py-2
                      text-white
                      transition
                      hover:bg-red-700
                      disabled:opacity-50
                    `
                    : `
                      rounded-lg
                      bg-green-600
                      px-4
                      py-2
                      text-white
                      transition
                      hover:bg-green-700
                      disabled:opacity-50
                    `
                }
              >

                {
                  loading
                    ? statusLoadingLabel
                    : statusButtonLabel
                }

              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}