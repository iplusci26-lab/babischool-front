"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CreditCard,
  Wallet,
  AlertCircle,
  Search,
  Plus,
  BookOpen,
  Users,
  Trash2,
  Pencil,
 
} from "lucide-react";

import { api } from "@/lib/api";
import { toast } from "sonner";
import EditPaymentModal from "./components/EditPaymentModal";
import PaymentModal from "./components/PaymentModal";


/* ============================================================
 * FORMAT DATE
 * ============================================================ */

function formatFrenchDate(
  date: string | null | undefined
) {

  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(
    new Date(
      `${date}T00:00:00`
    )
  );
}

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
                  {formatFrenchDate(
                      payment.payment_date
                    )}
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

/* ============================================================
 * PAYMENTS PAGE
 * ============================================================ */

/* ============================================================
 * PAYMENTS PAGE
 * ============================================================ */

function PaymentsPage() {

  const [payments, setPayments] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [selectedPayment, setSelectedPayment] =
    useState<any>(null);

  const [openEditPayment, setOpenEditPayment] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);


  /* ==========================================================
   * LOAD PAYMENTS
   * ========================================================== */

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


  /* ==========================================================
   * FILTER PAYMENTS
   * ========================================================== */

  const filteredPayments = useMemo(() => {

    const query =
      search
        .trim()
        .toLowerCase();


    if (!query) {

      return payments;

    }


    return payments.filter(
      (payment) => {

        const studentName =
          payment.student_name
            ?.toLowerCase()
            || "";

        const classroomName =
          payment.classroom_name
            ?.toLowerCase()
            || "";

        const paymentMethod =
          getPaymentMethodLabel(
            payment.payment_method,
            payment.reference
          )
            ?.toLowerCase()
            || "";

        const reference =
          payment.reference
            ?.toLowerCase()
            || "";

        const amount =
          String(
            payment.amount
          );

        const date =
        formatFrenchDate(payment.payment_date)
            ?.toLowerCase()
            || "";


        return (

          studentName.includes(query) ||

          classroomName.includes(query) ||

          paymentMethod.includes(query) ||

          reference.includes(query) ||

          amount.includes(query) ||

          date.includes(query)

        );

      }
    );

  }, [
    payments,
    search,
  ]);


  /* ==========================================================
   * EDIT PAYMENT
   * ========================================================== */

  const openEditModal = (
    payment: any
  ) => {

    setSelectedPayment(
      payment
    );

    setOpenEditPayment(
      true
    );

  };


  const closeEditModal = () => {

    setOpenEditPayment(
      false
    );

    setSelectedPayment(
      null
    );

  };


  /* ==========================================================
   * DELETE PAYMENT
   * ========================================================== */

  const deletePayment = async (
    payment: any
  ) => {

    const confirmed =
      window.confirm(
        `Voulez-vous vraiment supprimer le paiement de ${payment.student_name} ?`
      );


    if (!confirmed) {

      return;

    }


    try {

      setDeletingId(
        payment.id
      );


      await api.delete(
        `/finance/payments/${payment.id}/`
      );


      await loadPayments();


      toast.success(
        "Paiement supprimé avec succès."
      );

    } catch (error) {

      console.error(
        "Erreur suppression paiement :",
        error
      );


      toast.error(
        "Erreur lors de la suppression du paiement."
      );

    } finally {

      setDeletingId(
        null
      );

    }

  };


  return (

    <>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">


        {/* ==================================================
         * HEADER
         * ================================================== */}

        <div className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-lg font-semibold">
              Historique des paiements
            </h2>

            <p className="mt-1 text-sm text-gray-500">

              {filteredPayments.length} paiement
              {filteredPayments.length !== 1
                ? "s"
                : ""
              }

            </p>

          </div>


          {/* ================================================
           * SEARCH
           * ================================================ */}

          <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 lg:w-96">

            <Search
              size={18}
              className="shrink-0 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Rechercher un paiement..."
              className="
                w-full
                bg-transparent
                text-sm
                outline-none
                placeholder:text-gray-400
              "
            />

          </div>

        </div>


        {/* ==================================================
         * TABLE
         * ================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">


            {/* ==============================================
             * TABLE HEADER
             * ============================================== */}

            <thead className="bg-gray-50 text-sm text-gray-600">

              <tr>

                <th className="px-5 py-4 text-left font-medium">
                  Nom
                </th>

                <th className="px-5 py-4 text-left font-medium">
                  Classe
                </th>

                <th className="px-5 py-4 text-left font-medium">
                  Méthode de paiement
                </th>

                <th className="px-5 py-4 text-left font-medium">
                  Date
                </th>

                <th className="px-5 py-4 text-right font-medium">
                  Montant
                </th>

                <th className="px-5 py-4 text-center font-medium">
                  Actions
                </th>

              </tr>

            </thead>


            {/* ==============================================
             * TABLE BODY
             * ============================================== */}

            <tbody>


              {/* EMPTY STATE */}

              {filteredPayments.length === 0 && (

                <tr>

                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center"
                  >

                    <Search
                      size={36}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-4 font-medium text-gray-700">
                      Aucun paiement trouvé
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Essayez une autre recherche.
                    </p>

                  </td>

                </tr>

              )}


              {/* PAYMENTS */}

              {filteredPayments.map(
                (payment) => (

                  <tr
                    key={payment.id}
                    className="border-t transition hover:bg-gray-50"
                  >


                    {/* NOM */}

                    <td className="px-5 py-4">

                      <p className="font-medium text-gray-900">

                        {payment.student_name}

                      </p>

                    </td>


                    {/* CLASSE */}

                    <td className="px-5 py-4 text-sm text-gray-600">

                      {payment.classroom_name}

                    </td>


                    {/* MÉTHODE */}

                    <td className="px-5 py-4">

                      <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">

                        {getPaymentMethodLabel(
                          payment.payment_method,
                          payment.reference
                        )}

                      </span>

                    </td>


                    {/* DATE */}

                    <td className="px-5 py-4 text-sm text-gray-600">

                    {formatFrenchDate(
                      payment.payment_date
                    )}

                    </td>


                    {/* MONTANT */}

                    <td className="px-5 py-4 text-right">

                      <span className="font-semibold text-green-600">

                        +{" "}

                        {Number(
                          payment.amount
                        ).toLocaleString()}{" "}

                        FCFA

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-center gap-2">


                        {/* EDIT */}

                        <button
                          type="button"

                          onClick={() =>
                            openEditModal(
                              payment
                            )
                          }

                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-indigo-50
                            text-indigo-600
                            transition
                            hover:bg-indigo-100
                          "

                          title="Modifier le paiement"

                          aria-label="Modifier le paiement"
                        >

                          <Pencil size={18} />

                        </button>


                        {/* DELETE */}

                        <button
                          type="button"

                          onClick={() =>
                            deletePayment(
                              payment
                            )
                          }

                          disabled={
                            deletingId ===
                            payment.id
                          }

                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-red-50
                            text-red-600
                            transition
                            hover:bg-red-100
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "

                          title="Supprimer le paiement"

                          aria-label="Supprimer le paiement"
                        >

                          {deletingId ===
                          payment.id

                            ? (

                              <span className="text-xs">
                                ...
                              </span>

                            )

                            : (

                              <Trash2
                                size={18}
                              />

                            )}

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ====================================================
       * EDIT PAYMENT MODAL
       * ==================================================== */}

      {openEditPayment &&
        selectedPayment && (

          <EditPaymentModal

            payment={
              selectedPayment
            }

            onClose={
              closeEditModal
            }

            onSuccess={() => {

              loadPayments();

              closeEditModal();

            }}

          />

        )}

    </>

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

      return (
        reference ||
        "Moyen non renseigné"
      );
  }
}
