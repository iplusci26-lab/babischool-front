"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {

  CreditCard,

  Wallet,

  TrendingUp,

  AlertCircle,

  Search,

  Plus,

  BookOpen,

  Users,

} from "lucide-react";

import { api } from "@/lib/api";


export default function FinancePage() {

  const [tab, setTab] = useState("dashboard");

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Finance
          </h1>

          <p className="text-gray-500 mt-1">
            Gestion financière de l’établissement
          </p>

        </div>

      </div>

      {/* NAV */}

      <div className="flex gap-3 border-b overflow-x-auto">

        <Tab
          label="Dashboard"
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

        <Tab
          label="Ledger"
          value="ledger"
          tab={tab}
          setTab={setTab}
        />

      </div>

      {/* CONTENT */}

      {tab === "dashboard" && (
        <FinanceDashboard />
      )}

      {tab === "students" && (
        <FinanceStudents />
      )}

      {tab === "payments" && (
        <PaymentsPage />
      )}

      {tab === "ledger" && (
        <LedgerPage />
      )}

    </div>
  );
}


function Tab({

  label,

  value,

  tab,

  setTab

}: any) {

  return (

    <button
      onClick={() => setTab(value)}
      className={`pb-3 px-1 whitespace-nowrap transition-all ${
        tab === value
          ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
          : "text-gray-500 hover:text-gray-900"
      }`}
    >

      {label}

    </button>
  );
}



function FinanceDashboard() {

  const [data, setData] = useState<any>(null);

  const loadDashboard = async () => {

    const res = await api.get(
      "/finance/dashboard/"
    );

    setData(res.data);
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

      {/* KPI */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <KpiCard
          title="Montant attendu"
          value={`${Number(
            data.total_expected
          ).toLocaleString()} FCFA`}
          icon={<Wallet size={20} />}
        />

        <KpiCard
          title="Montant encaissé"
          value={`${Number(
            data.total_paid
          ).toLocaleString()} FCFA`}
          icon={<CreditCard size={20} />}
        />

        <KpiCard
          title="Reste à payer"
          value={`${Number(
            data.total_balance
          ).toLocaleString()} FCFA`}
          icon={<AlertCircle size={20} />}
        />

        <KpiCard
          title="Élèves solvables"
          value={data.paid_students}
          icon={<Users size={20} />}
        />

      </div>

      {/* PAYMENTS */}

      <div className="bg-white rounded-3xl border shadow-sm">

        <div className="p-5 border-b">

          <h2 className="font-semibold text-lg">
            Derniers paiements
          </h2>

        </div>

        <div className="divide-y">

          {data.latest_payments.map((p: any) => (

            <div
              key={p.id}
              className="p-5 flex items-center justify-between"
            >

              <div>

                <p className="font-medium">
                  {p.student_name}
                </p>

                <p className="text-sm text-gray-500">
                  {p.classroom_name}
                </p>

              </div>

              <div className="text-right">

                <p className="font-semibold text-green-600">
                  + {Number(
                    p.amount
                  ).toLocaleString()} FCFA
                </p>

                <p className="text-sm text-gray-500">
                  {p.payment_date}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}



function KpiCard({

  title,

  value,

  icon

}: any) {

  return (

    <div className="bg-white rounded-3xl border p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {value}
          </h3>

        </div>

        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">

          {icon}

        </div>

      </div>

    </div>
  );
}



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

    const res = await api.get(
      "/finance/students/"
    );

    setStudents(res.data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filtered = useMemo(() => {

    return students.filter((s) =>

      s.student_name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  }, [students, search]);

  const openPaymentModal = (
    student: any
  ) => {

    setSelectedStudent(student);

    setOpenPayment(true);
  };

  return (

    <div className="space-y-5">

      {/* SEARCH */}

      <div className="bg-white rounded-2xl border p-4 flex items-center gap-3">

        <Search size={18} />

        <input
          type="text"
          placeholder="Rechercher un élève..."
          className="outline-none flex-1"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 text-sm text-gray-600">

              <tr>

                <th className="text-left p-4">
                  Élève
                </th>

                <th className="text-left p-4">
                  Classe
                </th>

                <th className="text-left p-4">
                  Frais
                </th>

                <th className="text-left p-4">
                  Payé
                </th>

                <th className="text-left p-4">
                  Solde
                </th>

                <th className="text-center p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((s) => (

                <tr
                  key={s.id}
                  className="border-t"
                >

                  <td className="p-4 font-medium">
                    {s.student_name}
                  </td>

                  <td className="p-4">
                    {s.classroom_name}
                  </td>

                  <td className="p-4">
                    {Number(
                      s.tuition_fee
                    ).toLocaleString()} FCFA
                  </td>

                  <td className="p-4 text-green-600 font-medium">
                    {Number(
                      s.amount_paid
                    ).toLocaleString()} FCFA
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        Number(s.balance) > 0
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >

                      {Number(
                        s.balance
                      ).toLocaleString()} FCFA

                    </span>

                  </td>

                  <td className="p-4 items-center grid grid-cols-2 flex gap-2">
                    
                  <Link
                      href={`/finance/students/${s.id}`}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm transition"
                    >

                      <BookOpen size={16} />

                      Détails

                    </Link>

                    <button
                      onClick={() =>
                        openPaymentModal(s)
                      }
                      className="flex items-center gap-2 bg-cyan-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm transition"
                    >

                      <Plus size={16} />

                      Paiement

                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* PAYMENT MODAL */}

      {openPayment && selectedStudent && (

        <PaymentModal

          student={selectedStudent}

          onClose={() => {

            setOpenPayment(false);

            setSelectedStudent(null);
          }}

          onSuccess={() => {

            loadStudents();

            setOpenPayment(false);

            setSelectedStudent(null);
          }}
        />
      )}

    </div>
  );
}



function PaymentsPage() {

  const [payments, setPayments] =
    useState<any[]>([]);

  const loadPayments = async () => {

    const res = await api.get(
      "/finance/payments/"
    );

    setPayments(res.data);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (

    <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">

      <div className="p-5 border-b flex items-center justify-between">

        <h2 className="font-semibold text-lg">
          Historique des paiements
        </h2>

      </div>

      <div className="divide-y">

        {payments.map((p) => (

          <div
            key={p.id}
            className="p-5 flex items-center justify-between"
          >

            <div>

              <p className="font-medium">
                {p.student_name}
              </p>

              <p className="text-sm text-gray-500">
                {p.classroom_name}
              </p>

            </div>

            <div className="text-right">

              <p className="font-semibold text-green-600">
                + {Number(
                  p.amount
                ).toLocaleString()} FCFA
              </p>

              <p className="text-sm text-gray-500">
                {p.payment_date}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}



function LedgerPage() {

  const [entries, setEntries] =
    useState<any[]>([]);

  const loadEntries = async () => {

    const res = await api.get(
      "/finance/ledger/"
    );

    setEntries(res.data);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return (

    <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">

      <div className="p-5 border-b">

        <h2 className="font-semibold text-lg">
          Journal comptable
        </h2>

      </div>

      <div className="divide-y">

        {entries.map((e) => (

          <div
            key={e.id}
            className="p-5 flex items-center justify-between"
          >

            <div>

              <p className="font-medium">
                {e.student_name}
              </p>

              <p className="text-sm text-gray-500">
                {e.description}
              </p>

            </div>

            <div className="text-right">

              <p
                className={`font-semibold ${
                  e.entry_type === "credit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >

                {e.entry_type === "credit"
                  ? "+"
                  : "-"}

                {" "}

                {Number(
                  e.amount
                ).toLocaleString()} FCFA

              </p>

              <p className="text-sm text-gray-500">
                {new Date(
                  e.created_at
                ).toLocaleDateString()}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}


function PaymentModal({

  student,

  onClose,

  onSuccess

}: any) {

  const [amount, setAmount] =
    useState("");

  const [reference, setReference] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submit = async () => {

    try {

      setLoading(true);

      await api.post(
        "/finance/payments/",
        {

          enrollment_id: student.id,

          amount,

          payment_date: new Date()
            .toISOString()
            .split("T")[0],

          reference,

          notes
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

  return (

    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Nouveau paiement
            </h2>

            <p className="text-indigo-100 mt-1">
              {student.student_name}
            </p>

          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
          >

            <X size={20} />

          </button>

        </div>

        {/* BODY */}

        <div className="p-6 space-y-5">

          {/* INFO */}

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-gray-50 rounded-2xl p-4">

              <p className="text-sm text-gray-500">
                Frais
              </p>

              <h3 className="font-bold text-lg mt-1">

                {Number(
                  student.tuition_fee
                ).toLocaleString()} FCFA

              </h3>

            </div>

            <div className="bg-red-50 rounded-2xl p-4">

              <p className="text-sm text-red-500">
                Solde
              </p>

              <h3 className="font-bold text-lg mt-1 text-red-600">

                {Number(
                  student.balance
                ).toLocaleString()} FCFA

              </h3>

            </div>

          </div>

          {/* AMOUNT */}

          <div>

            <label className="block text-sm font-medium mb-2">

              Montant

            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="50000"
            />

          </div>

          {/* REFERENCE */}

          <div>

            <label className="block text-sm font-medium mb-2">

              Référence

            </label>

            <input
              type="text"
              value={reference}
              onChange={(e) =>
                setReference(e.target.value)
              }
              className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Référence paiement"
            />

          </div>

          {/* NOTES */}

          <div>

            <label className="block text-sm font-medium mb-2">

              Notes

            </label>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Informations supplémentaires"
            />

          </div>

        </div>

        {/* FOOTER */}

        <div className="p-6 border-t flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl border hover:bg-gray-50"
          >

            Annuler

          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50"
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