"use client";

import {

  useEffect,

  useState

} from "react";

import {

  Wallet,

  CreditCard,

  Receipt,

  BookOpen,

  ArrowDownCircle,

  ArrowUpCircle,

} from "lucide-react";

import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { Plus, X } from "lucide-react";

export default function StudentFinanceDetailPage() {

  const [data, setData] = useState<any>(null);

  const [tab, setTab] = useState("payments");

  const [openPayment, setOpenPayment] = useState(false);

  const params = useParams();
  
  const loadData = async () => {

    
    const res = await api.get(
      `/finance/students/${params.id}/`
    );
    
    console.log(res.data)
    setData(res.data);
  };

  useEffect(() => {

    if (params?.id) {

        loadData();
      }
    loadData();
  }, [params]);

  if (!data) {

    return (
      <div className="p-6">
        Chargement...
      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white flex items-start justify-between">

        <h1 className="text-3xl font-bold">

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
            className="bg-white text-indigo-600 hover:bg-indigo-50 transition px-5 py-3 rounded-2xl font-medium flex items-center gap-2"
            >

            <Plus size={18} />

            Nouveau paiement

        </button>
      {/* KPI */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <Card
          title="Frais"
          value={`${Number(
            data.finance.tuition_fee
          ).toLocaleString()} FCFA`}
          icon={<Wallet size={20} />}
        />

        <Card
          title="Payé"
          value={`${Number(
            data.finance.amount_paid
          ).toLocaleString()} FCFA`}
          icon={<CreditCard size={20} />}
        />

        <Card
          title="Solde"
          value={`${Number(
            data.finance.balance
          ).toLocaleString()} FCFA`}
          icon={<Receipt size={20} />}
        />

      </div>

      {/* NAV */}

      <div className="flex gap-5 border-b overflow-x-auto">

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

      {/* PAYMENTS */}

      {tab === "payments" && (

        <div className="bg-white rounded-3xl border overflow-hidden">

          <div className="divide-y">

            {data.payments.map((p: any) => (

              <div
                key={p.id}
                className="p-5 flex items-center justify-between"
              >

                <div>

                  <p className="font-medium">

                    Paiement

                  </p>

                  <p className="text-sm text-gray-500">

                    {p.reference || "Sans référence"}

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
      )}

      {/* LEDGER */}

      {tab === "ledger" && (

        <div className="bg-white rounded-3xl border overflow-hidden">

          <div className="divide-y">

            {data.ledger.map((l: any) => (

              <div
                key={l.id}
                className="p-5 flex items-center justify-between"
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      l.entry_type === "credit"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >

                    {l.entry_type === "credit"
                      ? (
                        <ArrowDownCircle size={18} />
                      )
                      : (
                        <ArrowUpCircle size={18} />
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
                  className={`font-semibold ${
                    l.entry_type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >

                  {Number(
                    l.amount
                  ).toLocaleString()} FCFA

                </p>

              </div>
            ))}

          </div>

        </div>
      )}

      {/* INVOICES */}

      {tab === "invoices" && (

        <div className="bg-white rounded-3xl border overflow-hidden">

          <div className="divide-y">

            {data.invoices.map((i: any) => (

              <div
                key={i.id}
                className="p-5 flex items-center justify-between"
              >

                <div>

                  <p className="font-medium">

                    Facture

                  </p>

                  <p className="text-sm text-gray-500">

                    Échéance :
                    {" "}
                    {i.due_date}

                  </p>

                </div>

                <div className="text-right">

                  <p className="font-semibold">

                    {Number(
                      i.amount_due
                    ).toLocaleString()} FCFA

                  </p>

                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      i.is_paid
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {i.is_paid
                      ? "Payée"
                      : "Impayée"}

                  </span>

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

        {openPayment && (

        <PaymentModal

        enrollmentId={params.id}

        studentName={data.student.name}

        balance={data.finance.balance}

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


function Card({

  title,

  value,

  icon

}: any) {

  return (

    <div className="bg-white border rounded-3xl p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {value}
          </h3>

        </div>

        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">

          {icon}

        </div>

      </div>

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
      className={`pb-3 whitespace-nowrap ${
        tab === value
          ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
          : "text-gray-500"
      }`}
    >

      {label}

    </button>
  );
}


function PaymentModal({

    enrollmentId,
  
    studentName,
  
    balance,
  
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
  
            enrollment_id:
              enrollmentId,
  
            amount,
  
            payment_date:
              new Date()
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
  
        <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
  
          {/* HEADER */}
  
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex items-center justify-between">
  
            <div>
  
              <h2 className="text-2xl font-bold">
                Nouveau paiement
              </h2>
  
              <p className="text-indigo-100 mt-1">
                {studentName}
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
  
            {/* BALANCE */}
  
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
  
              <p className="text-sm text-red-500">
                Solde restant
              </p>
  
              <h3 className="text-2xl font-bold text-red-600 mt-2">
  
                {Number(
                  balance
                ).toLocaleString()} FCFA
  
              </h3>
  
            </div>
  
            {/* MONTANT */}
  
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
                rows={4}
                className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Notes"
              />
  
            </div>
  
          </div>
  
          {/* FOOTER */}
  
          <div className="border-t p-6 flex justify-end gap-3">
  
            <button
              onClick={onClose}
              className="px-5 py-3 border rounded-2xl hover:bg-gray-50"
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