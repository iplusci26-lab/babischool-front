"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";


/* ============================================================
 * TYPES
 * ============================================================ */

interface PaymentModalProps {
  student: any;

  onClose: () => void;

  onSuccess: () => void;
}


/* ============================================================
 * PAYMENT MODAL
 * ============================================================ */

export default function PaymentModal({
  student,
  onClose,
  onSuccess,
}: PaymentModalProps) {

  const [amount, setAmount] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  /* ==========================================================
   * SUBMIT
   * ========================================================== */

  const submit = async () => {

    if (!amount) {

        toast.error(
            "Veuillez saisir le montant."
          );
      return;
    }


    if (Number(amount) <= 0) {

        toast.error(
        "Le montant doit être supérieur à 0."
      );

      return;
    }


    if (!paymentMethod) {

        toast.error(
        "Veuillez sélectionner un moyen de paiement."
      );

      return;
    }


    try {

      setLoading(true);


      await api.post(
        "/finance/payments/",
        {

          enrollment_id:
            student.id,

          amount,

          payment_date:
            new Date()
              .toISOString()
              .split("T")[0],

          payment_method:
            paymentMethod,

          notes,

        }
      );


      toast.success(
        "Paiement enregistré avec succès."
      );


      onSuccess();

    } catch (error) {

      console.error(
        "Erreur paiement :",
        error
      );


      toast.error(
        "Erreur lors de l'enregistrement du paiement."
      );

    } finally {

      setLoading(false);

    }

  };


  /* ==========================================================
   * UI
   * ========================================================== */

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-start
        justify-center
        overflow-y-auto
        bg-black/40
        p-3
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
    >

      {/* ====================================================
       * MODAL
       * ==================================================== */}

      <div
        className="
          flex
          w-full
          max-w-lg
          max-h-[calc(100vh-1.5rem)]
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
          sm:max-h-[90vh]
          sm:rounded-3xl
        "
      >

        {/* ==================================================
         * HEADER
         * ================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            bg-gradient-to-r
            from-indigo-500
            to-purple-600
            p-4
            text-white
            sm:p-6
          "
        >

          <div className="min-w-0">

            <h2
              className="
                truncate
                text-xl
                font-bold
                sm:text-2xl
              "
            >
              Nouveau paiement
            </h2>


            <p
              className="
                mt-1
                truncate
                text-sm
                text-indigo-100
                sm:text-base
              "
            >
              {student.student_name}
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Fermer"
            className="
              ml-3
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/20
              transition
              hover:bg-white/30
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:h-10
              sm:w-10
            "
          >

            <X size={20} />

          </button>

        </div>


        {/* ==================================================
         * BODY
         * ================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            p-4
            sm:p-6
          "
        >

          <div className="space-y-5">

            {/* ==============================================
             * INFORMATIONS FINANCIÈRES
             * ============================================== */}

            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                sm:gap-4
              "
            >

              {/* FRAIS */}

              <div
                className="
                  rounded-2xl
                  bg-gray-50
                  p-4
                "
              >

                <p className="text-sm text-gray-500">
                  Frais
                </p>


                <h3
                  className="
                    mt-1
                    text-lg
                    font-bold
                  "
                >

                  {Number(
                    student.tuition_fee
                  ).toLocaleString()}{" "}
                  FCFA

                </h3>

              </div>


              {/* SOLDE */}

              <div
                className="
                  rounded-2xl
                  bg-red-50
                  p-4
                "
              >

                <p className="text-sm text-red-500">
                  Solde
                </p>


                <h3
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-red-600
                  "
                >

                  {Number(
                    student.balance
                  ).toLocaleString()}{" "}
                  FCFA

                </h3>

              </div>

            </div>


            {/* ==============================================
             * MONTANT
             * ============================================== */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Montant
              </label>


              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  px-4
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-2
                  focus:ring-indigo-500/20
                  sm:h-14
                "
                placeholder="50000"
              />

            </div>


            {/* ==============================================
             * MOYEN DE PAIEMENT
             * ============================================== */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Moyen de paiement
              </label>


              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-2
                  focus:ring-indigo-500/20
                  sm:h-14
                "
              >

                <option value="">
                  Sélectionner un moyen de paiement
                </option>

                <option value="wave">
                  Wave
                </option>

                <option value="omoney">
                  Orange Money
                </option>

                <option value="momo">
                  MoMo
                </option>

                <option value="cheque">
                  Chèque
                </option>

                <option value="espece">
                  Espèce
                </option>

              </select>

            </div>


            {/* ==============================================
             * NOTES
             * ============================================== */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Notes
              </label>


              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
                rows={4}
                className="
                  min-h-[110px]
                  w-full
                  resize-y
                  rounded-2xl
                  border
                  border-gray-200
                  p-4
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-2
                  focus:ring-indigo-500/20
                "
                placeholder="Informations supplémentaires"
              />

            </div>

          </div>

        </div>


        {/* ==================================================
         * FOOTER
         * ================================================== */}

        <div
          className="
            flex
            shrink-0
            flex-col-reverse
            gap-3
            border-t
            bg-white
            p-4
            sm:flex-row
            sm:justify-end
            sm:p-6
          "
        >

          {/* ANNULER */}

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              w-full
              rounded-2xl
              border
              px-5
              py-3
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >
            Annuler
          </button>


          {/* VALIDER */}

          <button
            type="button"
            onClick={submit}
            disabled={
              loading ||
              !amount ||
              !paymentMethod
            }
            className="
              w-full
              rounded-2xl
              bg-indigo-600
              px-5
              py-3
              font-medium
              text-white
              transition
              hover:bg-indigo-700
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >

            {loading
              ? "Enregistrement..."
              : "Valider paiement"}

          </button>

        </div>

      </div>

    </div>

  );

}