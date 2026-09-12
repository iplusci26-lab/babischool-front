"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

/* ============================================================
 * TYPES
 * ============================================================ */

interface Payment {
  id: string;
  student_name?: string;
  classroom_name?: string;
  amount: string | number;
  payment_date: string;
  payment_method?: string | null;
  reference?: string | null;
  notes?: string | null;
}

interface EditPaymentModalProps {
  payment: Payment;
  onClose: () => void;
  onSuccess: () => void;
}

/* ============================================================
 * EDIT PAYMENT MODAL
 * ============================================================ */

export default function EditPaymentModal({
  payment,
  onClose,
  onSuccess,
}: EditPaymentModalProps) {
  const [amount, setAmount] =
    useState("");

  const [paymentDate, setPaymentDate] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [reference, setReference] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* ==========================================================
   * INITIALISATION
   * ========================================================== */

  useEffect(() => {
    if (!payment) {
      return;
    }

    setAmount(
      String(payment.amount ?? "")
    );

    setPaymentDate(
      payment.payment_date ?? ""
    );

    setPaymentMethod(
      payment.payment_method ?? ""
    );

    setReference(
      payment.reference ?? ""
    );

    setNotes(
      payment.notes ?? ""
    );
  }, [payment]);

  /* ==========================================================
   * SUBMIT
   * ========================================================== */

  const submit = async () => {
    if (!amount || Number(amount) <= 0) {
        toast.error(
        "Veuillez saisir un montant valide."
      );

      return;
    }

    if (!paymentDate) {
        toast.error(
        "Veuillez sélectionner la date du paiement."
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

      await api.patch(
        `/finance/payments/${payment.id}/`,
        {
          amount,
          payment_date:
            paymentDate,

          payment_method:
            paymentMethod,

          reference,

          notes,
        }
      );

      toast.success(
        "Paiement modifié avec succès."
      );

      onSuccess();
    } catch (error) {
      console.error(
        "Erreur modification paiement :",
        error
      );

      toast.error(
        "Erreur lors de la modification du paiement."
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
              Modifier le paiement
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
              {payment.student_name}
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
                min="1"
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
             * DATE
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
                Date du paiement
              </label>

              <input
                type="date"
                value={paymentDate}
                onChange={(e) =>
                  setPaymentDate(
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
              />
            </div>

            {/* ==============================================
             * PAYMENT METHOD
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
             * REFERENCE
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
                Référence
              </label>

              <input
                type="text"
                value={reference}
                onChange={(e) =>
                  setReference(
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
                placeholder="Référence du paiement"
              />
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

          <button
            type="button"
            onClick={submit}
            disabled={
              loading ||
              !amount ||
              !paymentDate ||
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
              ? "Modification..."
              : "Modifier le paiement"}
          </button>
        </div>
      </div>
    </div>
  );
}