"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function StudentFinance({ studentId }: any) {
  const [data, setData] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [loadingPayment, setLoadingPayment] = useState(false);

  
  useEffect(() => {
    api.get(`/finance/students/${studentId}/summary/`)
      .then((res) => setData(res.data))
      .catch(console.error);
      
  }, [studentId]);

  const handlePayment = async () => {
    if (Number(amount) <= 0) {
      alert("Invalid amount");
      return;
    }
    try {
      setLoadingPayment(true);
  
      await api.post("/finance/payments/", {
        student_id: studentId,
        amount: Number(amount),
        payment_method: method,
      });
  
      // 🔥 refresh student data
      const res = await api.get(`/finance/students/${studentId}/summary/`);
      setData(res.data);
  
      // reset
      setAmount("");
      setShowPayment(false);
  
      alert("Payment successful");
  
    } catch (err: any) {
      console.error(err.response?.data);
      alert("Payment failed");
    } finally {
      setLoadingPayment(false);
    }
  };

  if (!data) return <div>Loading finance...</div>;
  
  return (
    <div className="space-y-6">

      {/* 💰 SUMMARY */}
      <div className="grid grid-cols-3 gap-4">

        <Card title="Total scolarité" value={data.total_fee} />
        <Card title="Payée" value={data.total_paid} />
        <Card title="Solde" value={data.balance} danger />
        <button
          onClick={() => setShowPayment(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Ajouter paiement
        </button>
      </div>

      {showPayment && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          
          {data.balance === 0 
          
          ?(
              <div className="text-green-600 font-bold">
                Soldé ✅
              </div>
            )

          :(<div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

            <h2 className="text-lg font-bold">Ajouter paiement </h2>

            {/* Amount */}
            <input
              type="number"
              placeholder="Montant"
              className="border p-2 w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {/* Method */}
            <select
              className="border p-2 w-full"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="mobile">Mobile Money</option>
              <option value="bank">Bank Transfer</option>
            </select>

            {/* Actions */}
            <div className="flex gap-2">

              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 border p-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handlePayment}
                disabled={loadingPayment || !amount}
                className="flex-1 bg-[#6214BE] text-white p-2 rounded"
              >
                {loadingPayment ? "Processing..." : "Payer"}
              </button>

            </div>

          </div>)
          }

          
        </div>
      )}

      {/* 📊 PAYMENTS TABLE */}
      <div className="bg-white border rounded-xl">

        <div className="p-4 font-semibold border-b">
          Paiements
        </div>

        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Montant</th>
              <th className="p-3">Reference</th>
            </tr>
          </thead>

          <tbody>
            {data.payments.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.payment_date}</td>
                <td className="p-3">{p.amount}</td>
                <td className="p-3">{p.reference || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

function Card({ title, value, danger }: any) {
  return (
    <div className="bg-white p-4 border rounded-xl">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-xl font-bold ${
        danger ? "text-red-600" : ""
      }`}>
        {value} FCFA
      </p>
    </div>
  );
}