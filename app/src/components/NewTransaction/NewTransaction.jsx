import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const senders = [
  "Vodafone Cash",
  "Orange Cash",
  "Etisalat Cash",
  "WE Cash",
  "Instapay ",
  "Fawry ",
];
const getLocalDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

export default function NewTransaction() {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState({
    sender: "Vodafone",
    type: "received",
    receivedAt: getLocalDateTime(),
    amount: "",
    name: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3000/transaction", transaction);
      navigate(-1);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-5 text-gray-800">
      <div className="mx-auto max-w-xl">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h1 className="mb-5 border-b border-gray-100 pb-2 text-lg font-bold text-gray-600">
            New Transaction
          </h1>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold">Sender</label>
              <select
                name="sender"
                className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm outline-none focus:border-gray-600"
                value={transaction.sender}
                onChange={handleChange}
              >
                {senders.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Transaction Type
              </label>
              <select
                name="type"
                className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm outline-none focus:border-gray-600"
                value={transaction.type}
                onChange={handleChange}
              >
                <option value="send">Send</option>
                <option defaultChecked value="received">
                  Received
                </option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Date and Time
              </label>
              <input
                name="receivedAt"
                type="datetime-local"
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-600"
                value={transaction.receivedAt}
                onChange={handleChange}
                requigray
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Amount (EGP)
              </label>
              <input
                name="amount"
                type="number"
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-600"
                value={transaction.amount}
                onChange={handleChange}
                requigray
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">
                Notes (optional)
              </label>
              <input
                type="text"
                name="notes"
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-600"
                value={transaction.notes}
                onChange={handleChange}
                placeholder="Customer number or name"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-600 py-2.5 font-bold text-white transition hover:bg-gray-700"
            >
              Save Transaction
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
