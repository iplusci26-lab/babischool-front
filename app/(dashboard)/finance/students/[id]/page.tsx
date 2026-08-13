"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Wallet,
  CreditCard,
  Receipt,
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  X,
} from "lucide-react";

import { api } from "@/lib/api";
import { useParams } from "next/navigation";

export default function StudentFinanceDetailPage() {
  const [data, setData] = useState<any>(null);

  const [tab, setTab] =
    useState("payments");

  const [openPayment, setOpenPayment] =
    useState(false);

  const params = useParams();

  // ==========================================================
  // CHARGEMENT DES DONNÉES
  // ==========================================================

  const loadData = async () => {
    try {
      const res = await api.get(
        `/finance/students/${params.id}/`
      );

      console.log(res.data);

      setData(res.data);
    } catch (error) {
      console.error(
        "Erreur chargement finance :",
        error
      );
    }
  };

  useEffect(() => {
    if (params?.id) {
      loadData();
    }
  }, [params]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (!data) {
    return (
      <div className="p-6">
        Chargement...
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          rounded-3xl
          bg-gradient-to-r
          from-indigo-500
          to-purple-600
          p-5
          text-white
          sm:p-6
          md:flex-row
          md:items-start
          md:justify-between
          md:p-8
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
              sm:text-3xl
            "
          >
            {data.student.name}
          </h1>

          <p className="mt-2 text-indigo-100">
            {data.student.classroom}
          </p>

        </div>

        <button
          onClick={() =>
            setOpenPayment(true)
          }
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-white
            px-5
            py-3
            font-medium
            text-indigo-600
            transition
            hover:bg-indigo-50
            sm:w-auto
          "
        >
          <Plus size={18} />

          Nouveau paiement
        </button>

      </div>

      {/* ====================================================== */}
      {/* KPI */}
      {/* ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-3
        "
      >

        <Card
          title="Frais"
          value={`${Number(
            data.finance.tuition_fee
          ).toLocaleString()} FCFA`}
          icon={
            <Wallet size={20} />
          }
        />

        <Card
          title="Payé"
          value={`${Number(
            data.finance.amount_paid
          ).toLocaleString()} FCFA`}
          icon={
            <CreditCard size={20} />
          }
        />

        <Card
          title="Solde"
          value={`${Number(
            data.finance.balance
          ).toLocaleString()} FCFA`}
          icon={
            <Receipt size={20} />
          }
        />

      </div>

      {/* ====================================================== */}
      {/* NAVIGATION */}
      {/* ====================================================== */}

      <div
        className="
          flex
          gap-5
          overflow-x-auto
          border-b
        "
      >

        <Tab
          label="Paiements"
          value="payments"
          tab={tab}
          setTab={setTab}
        />

        <Tab
          label="Ledger"
          value="ledger"
          tab={tab}
          setTab={setTab}
        />

        <Tab
          label="Factures"
          value="invoices"
          tab={tab}
          setTab={setTab}
        />

      </div>

      {/* ====================================================== */}
      {/* PAYMENTS */}
      {/* ====================================================== */}

      {tab === "payments" && (

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            bg-white
          "
        >

          <div className="divide-y">

            {data.payments.map(
              (p: any) => (

                <div
                  key={p.id}
                  className="
                    flex
                    flex-col
                    gap-3
                    p-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <div>

                    <p className="font-medium">
                      Paiement
                    </p>

                    <p className="text-sm text-gray-500">
                      {p.reference ||
                        "Sans référence"}
                    </p>

                  </div>

                  <div
                    className="
                      text-left
                      sm:text-right
                    "
                  >

                    <p className="font-semibold text-green-600">
                      +{" "}
                      {Number(
                        p.amount
                      ).toLocaleString()}{" "}
                      FCFA
                    </p>

                    <p className="text-sm text-gray-500">
                      {p.payment_date}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>
      )}

      {/* ====================================================== */}
      {/* LEDGER */}
      {/* ====================================================== */}

      {tab === "ledger" && (

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            bg-white
          "
        >

          <div className="divide-y">

            {data.ledger.map(
              (l: any) => (

                <div
                  key={l.id}
                  className="
                    flex
                    flex-col
                    gap-3
                    p-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        ${
                          l.entry_type ===
                          "credit"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }
                      `}
                    >

                      {l.entry_type ===
                      "credit" ? (
                        <ArrowDownCircle
                          size={18}
                        />
                      ) : (
                        <ArrowUpCircle
                          size={18}
                        />
                      )}

                    </div>

                    <div>

                      <p className="font-medium">
                        {l.description}
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(
                          l.created_at
                        ).toLocaleDateString()}
                      </p>

                    </div>

                  </div>

                  <p
                    className={`
                      font-semibold
                      sm:text-right
                      ${
                        l.entry_type ===
                        "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    `}
                  >
                    {Number(
                      l.amount
                    ).toLocaleString()}{" "}
                    FCFA
                  </p>

                </div>

              )
            )}

          </div>

        </div>
      )}

      {/* ====================================================== */}
      {/* INVOICES */}
      {/* ====================================================== */}

      {tab === "invoices" && (

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            bg-white
          "
        >

          <div className="divide-y">

            {data.invoices.map(
              (i: any) => (

                <div
                  key={i.id}
                  className="
                    flex
                    flex-col
                    gap-3
                    p-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <div>

                    <p className="font-medium">
                      Facture
                    </p>

                    <p className="text-sm text-gray-500">
                      Échéance :{" "}
                      {i.due_date}
                    </p>

                  </div>

                  <div
                    className="
                      text-left
                      sm:text-right
                    "
                  >

                    <p className="font-semibold">
                      {Number(
                        i.amount_due
                      ).toLocaleString()}{" "}
                      FCFA
                    </p>

                    <span
                      className={`
                        inline-block
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        ${
                          i.is_paid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {i.is_paid
                        ? "Payée"
                        : "Impayée"}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </div>
      )}

      {/* ====================================================== */}
      {/* PAYMENT MODAL */}
      {/* ====================================================== */}

      {openPayment && (

        <PaymentModal
          enrollmentId={params.id}
          studentName={
            data.student.name
          }
          balance={
            data.finance.balance
          }
          onClose={() =>
            setOpenPayment(false)
          }
          onSuccess={() => {

            setOpenPayment(false);

            loadData();

          }}
        />

      )}

    </div>
  );
}


// ============================================================
// CARD
// ============================================================

function Card({
  title,
  value,
  icon,
}: any) {

  return (

    <div
      className="
        rounded-3xl
        border
        bg-white
        p-5
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3
            className="
              mt-2
              text-2xl
              font-bold
            "
          >
            {value}
          </h3>

        </div>

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-indigo-50
            text-indigo-600
          "
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


// ============================================================
// TAB
// ============================================================

function Tab({
  label,
  value,
  tab,
  setTab,
}: any) {

  return (

    <button
      type="button"
      onClick={() =>
        setTab(value)
      }
      className={`
        whitespace-nowrap
        pb-3
        ${
          tab === value
            ? "border-b-2 border-indigo-600 font-semibold text-indigo-600"
            : "text-gray-500"
        }
      `}
    >
      {label}
    </button>

  );
}


// ============================================================
// PAYMENT MODAL
// ============================================================

function PaymentModal({
  enrollmentId,
  studentName,
  balance,
  onClose,
  onSuccess,
}: any) {

  const [amount, setAmount] =
    useState("");

  const [reference, setReference] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const submit = async () => {

    try {

      setLoading(true);

      await api.post(
        "/finance/payments/",
        {
          enrollment_id:
            enrollmentId,

          amount,

          payment_date:
            new Date()
              .toISOString()
              .split("T")[0],

          reference,

          notes,
        }
      );

      alert(
        "Paiement enregistré"
      );

      onSuccess();

    } catch (error) {

      console.error(error);

      alert(
        "Erreur paiement"
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================================
  // UI
  // ==========================================================

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

      {/* ==================================================== */}
      {/* MODAL */}
      {/* ==================================================== */}

      <div
        className="
          flex
          w-full
          max-w-lg
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
          sm:rounded-3xl
          max-h-[calc(100vh-1.5rem)]
          sm:max-h-[90vh]
        "
      >

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

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
              {studentName}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
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
              sm:h-10
              sm:w-10
            "
            aria-label="Fermer"
          >

            <X size={20} />

          </button>

        </div>

        {/* ================================================== */}
        {/* BODY */}
        {/* ================================================== */}

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

            {/* ============================================ */}
            {/* BALANCE */}
            {/* ============================================ */}

            <div
              className="
                rounded-2xl
                border
                border-red-100
                bg-red-50
                p-4
                sm:p-5
              "
            >

              <p className="text-sm text-red-500">
                Solde restant
              </p>

              <h3
                className="
                  mt-1
                  text-xl
                  font-bold
                  text-red-600
                  sm:text-2xl
                "
              >
                {Number(
                  balance
                ).toLocaleString()}{" "}
                FCFA
              </h3>

            </div>

            {/* ============================================ */}
            {/* MONTANT */}
            {/* ============================================ */}

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

            {/* ============================================ */}
            {/* REFERENCE */}
            {/* ============================================ */}

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
                placeholder="Ex : Wave, Orange Money..."
              />

            </div>

            {/* ============================================ */}
            {/* NOTES */}
            {/* ============================================ */}

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

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

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
            disabled={loading}
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