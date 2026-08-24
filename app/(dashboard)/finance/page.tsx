"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  CreditCard,
  Wallet,
  AlertCircle,
  Search,
  Plus,
  BookOpen,
  Users,
} from "lucide-react";

import { api } from "@/lib/api";

/* ============================================================
 * FINANCE PAGE
 * ============================================================ */

export default function FinancePage() {

  const [tab, setTab] =
    useState("dashboard");

  return (

    <div className="space-y-6">

      {/* ======================================================
       * HEADER
       * ====================================================== */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Comptabilité
          </h1>

          <p className="mt-1 text-gray-500">
            Bilan synthétisé de la comptabilité de l'établissement
          </p>

        </div>

      </div>


      {/* ======================================================
       * NAVIGATION
       * ====================================================== */}

      <div className="flex gap-3 overflow-x-auto border-b">

        <Tab
          label="Tableau de bord"
          value="dashboard"
          tab={tab}
          setTab={setTab}
        />

        <Tab
          label="Élèves"
          value="students"
          tab={tab}
          setTab={setTab}
        />

        <Tab
          label="Paiements"
          value="payments"
          tab={tab}
          setTab={setTab}
        />

      </div>


      {/* ======================================================
       * CONTENT
       * ====================================================== */}

      {tab === "dashboard" && (
        <FinanceDashboard />
      )}

      {tab === "students" && (
        <FinanceStudents />
      )}

      {tab === "payments" && (
        <PaymentsPage />
      )}

    </div>
  );
}


/* ============================================================
 * TAB
 * ============================================================ */

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
      className={`whitespace-nowrap px-1 pb-3 transition-all ${
        tab === value
          ? "border-b-2 border-indigo-600 font-semibold text-indigo-600"
          : "text-gray-500 hover:text-gray-900"
      }`}
    >

      {label}

    </button>
  );
}


/* ============================================================
 * FINANCE DASHBOARD
 * ============================================================ */

function FinanceDashboard() {

  const [data, setData] =
    useState<any>(null);

  const loadDashboard = async () => {

    try {

      const res =
        await api.get(
          "/finance/dashboard/"
        );

      setData(res.data);

    } catch (error) {

      console.error(
        "Erreur chargement dashboard finance :",
        error
      );

    }
  };

  useEffect(() => {

    loadDashboard();

  }, []);


  if (!data) {

    return (
      <div className="p-6">
        Chargement...
      </div>
    );

  }


  return (

    <div className="space-y-6">

      {/* ====================================================
       * KPI
       * ==================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        <KpiCard
          title="Montant attendu"
          value={`${Number(
            data.total_expected
          ).toLocaleString()} FCFA`}
          icon={
            <Wallet size={20} />
          }
        />

        <KpiCard
          title="Montant encaissé"
          value={`${Number(
            data.total_paid
          ).toLocaleString()} FCFA`}
          icon={
            <CreditCard size={20} />
          }
        />

        <KpiCard
          title="Reste à encaisser"
          value={`${Number(
            data.total_balance
          ).toLocaleString()} FCFA`}
          icon={
            <AlertCircle size={20} />
          }
        />

        <KpiCard
          title="Élèves non solvables"
          value={
            data.unpaid_students
          }
          icon={
            <Users size={20} />
          }
        />

      </div>


      {/* ====================================================
       * DERNIERS PAIEMENTS
       * ==================================================== */}

      <div className="rounded-3xl border bg-white shadow-sm">

        <div className="border-b p-5">

          <h2 className="text-lg font-semibold">
            Derniers paiements
          </h2>

        </div>


        <div className="divide-y">

          {data.latest_payments?.map(
            (payment: any) => (

              <div
                key={payment.id}
                className="flex items-center justify-between p-5"
              >

                <div>

                  <p className="font-medium">
                    {payment.student_name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {payment.classroom_name}
                  </p>

                  <p className="mt-1 text-sm font-medium text-indigo-600">
                    {getPaymentMethodLabel(
                      payment.payment_method,
                      payment.reference
                    )}
                  </p>

                </div>


                <div className="text-right">

                  <p className="font-semibold text-green-600">
                    +{" "}
                    {Number(
                      payment.amount
                    ).toLocaleString()}{" "}
                    FCFA
                  </p>

                  <p className="text-sm text-gray-500">
                    {payment.payment_date}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}


/* ============================================================
 * KPI CARD
 * ============================================================ */

function KpiCard({
  title,
  value,
  icon,
}: any) {

  return (

    <div className="rounded-3xl border bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {value}
          </h3>

        </div>


        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">

          {icon}

        </div>

      </div>

    </div>
  );
}


/* ============================================================
 * FINANCE STUDENTS
 * ============================================================ */

function FinanceStudents() {

  const [students, setStudents] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [selectedStudent, setSelectedStudent] =
    useState<any>(null);

  const [openPayment, setOpenPayment] =
    useState(false);


  const loadStudents = async () => {

    try {

      const res =
        await api.get(
          "/finance/students/"
        );

      setStudents(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.error(
        "Erreur chargement élèves :",
        error
      );

    }
  };


  useEffect(() => {

    loadStudents();

  }, []);


  const filtered = useMemo(() => {

    return students.filter(
      (student) =>
        student.student_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  }, [
    students,
    search,
  ]);


  const openPaymentModal = (
    student: any
  ) => {

    setSelectedStudent(
      student
    );

    setOpenPayment(true);
  };


  return (

    <div className="space-y-5">

      {/* ====================================================
       * SEARCH
       * ==================================================== */}

      <div className="flex items-center gap-3 rounded-2xl border bg-white p-4">

        <Search size={18} />

        <input
          type="text"
          placeholder="Rechercher un élève..."
          className="flex-1 outline-none"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

      </div>


      {/* ====================================================
       * TABLE
       * ==================================================== */}

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 text-sm text-gray-600">

              <tr>

                <th className="p-4 text-left">
                  Élève
                </th>

                <th className="p-4 text-left">
                  Classe
                </th>

                <th className="p-4 text-left">
                  Frais
                </th>

                <th className="p-4 text-left">
                  Payé
                </th>

                <th className="p-4 text-left">
                  Solde
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filtered.map(
                (student) => (

                  <tr
                    key={student.id}
                    className="border-t"
                  >

                    <td className="p-4 font-medium">
                      {student.student_name}
                    </td>

                    <td className="p-4">
                      {student.classroom_name}
                    </td>

                    <td className="p-4">
                      {Number(
                        student.tuition_fee
                      ).toLocaleString()}{" "}
                      FCFA
                    </td>

                    <td className="p-4 font-medium text-green-600">
                      {Number(
                        student.amount_paid
                      ).toLocaleString()}{" "}
                      FCFA
                    </td>

                    <td className="p-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          Number(
                            student.balance
                          ) > 0
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >

                        {Number(
                          student.balance
                        ).toLocaleString()}{" "}
                        FCFA

                      </span>

                    </td>


                    <td className="grid grid-cols-2 gap-2 p-4">

                      <Link
                        href={`/finance/students/${student.id}`}
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700"
                      >

                        <BookOpen size={16} />

                        Détails

                      </Link>


                      <button
                        type="button"
                        onClick={() =>
                          openPaymentModal(
                            student
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm text-white transition hover:bg-cyan-700"
                      >

                        <Plus size={16} />

                        Paiement

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ====================================================
       * PAYMENT MODAL
       * ==================================================== */}

      {openPayment &&
        selectedStudent && (

          <PaymentModal
            student={
              selectedStudent
            }

            onClose={() => {

              setOpenPayment(
                false
              );

              setSelectedStudent(
                null
              );

            }}

            onSuccess={() => {

              loadStudents();

              setOpenPayment(
                false
              );

              setSelectedStudent(
                null
              );

            }}
          />

        )}

    </div>
  );
}


/* ============================================================
 * PAYMENTS PAGE
 * ============================================================ */

function PaymentsPage() {

  const [payments, setPayments] =
    useState<any[]>([]);


  const loadPayments = async () => {

    try {

      const res =
        await api.get(
          "/finance/payments/"
        );

      setPayments(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.error(
        "Erreur chargement paiements :",
        error
      );

    }
  };


  useEffect(() => {

    loadPayments();

  }, []);


  return (

    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">

      <div className="flex items-center justify-between border-b p-5">

        <h2 className="text-lg font-semibold">
          Historique des paiements
        </h2>

      </div>


      <div className="divide-y">

        {payments.map(
          (payment) => (

            <div
              key={payment.id}
              className="flex items-center justify-between p-5"
            >

              <div>

                <p className="font-medium">
                  {payment.student_name}
                </p>

                <p className="text-sm text-gray-500">
                  {payment.classroom_name}
                </p>

                <p className="mt-1 text-sm font-medium text-indigo-600">
                  {getPaymentMethodLabel(
                    payment.payment_method,
                    payment.reference
                  )}
                </p>

              </div>


              <div className="text-right">

                <p className="font-semibold text-green-600">
                  +{" "}
                  {Number(
                    payment.amount
                  ).toLocaleString()}{" "}
                  FCFA
                </p>

                <p className="text-sm text-gray-500">
                  {payment.payment_date}
                </p>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}


/* ============================================================
 * PAYMENT METHOD LABEL
 * ============================================================ */

function getPaymentMethodLabel(
  paymentMethod: string | null | undefined,
  reference: string | null | undefined
) {

  switch (paymentMethod) {

    case "wave":
      return "Wave";

    case "omoney":
      return "Orange Money";

    case "momo":
      return "MoMo";

    case "cheque":
      return "Chèque";

    case "espece":
      return "Espèce";

    default:

      /*
       * Compatibilité avec les anciens paiements
       * enregistrés avant l'ajout de payment_method.
       */
      return reference || "Moyen non renseigné";
  }
}


/* ============================================================
 * PAYMENT MODAL
 * ============================================================ */

function PaymentModal({
  student,
  onClose,
  onSuccess,
}: any) {

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

      alert(
        "Veuillez saisir le montant."
      );

      return;
    }


    if (!paymentMethod) {

      alert(
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


      alert(
        "Paiement enregistré"
      );


      onSuccess();

    } catch (error) {

      console.error(
        "Erreur paiement :",
        error
      );

      alert(
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