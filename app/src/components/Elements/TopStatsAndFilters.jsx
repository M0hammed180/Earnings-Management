import axios from "axios";
import React, { useEffect, useState } from "react";

export default function BalanceAndProfit() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "https://earnings-management-production.up.railway.app/transaction/stats",
      );
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p className="text-gray-500">Loading stats...</p>;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Current Wallet Balance */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Current Wallet Balance
          </p>
          <p className="mt-1 text-3xl font-extrabold text-gray-800">
            {Number(data.netAmount || 0).toFixed(2)} EGP
          </p>
        </div>
      </div>

      {/* Total Profit */}
      <div className="flex flex-col justify-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <p className="text-sm font-medium text-gray-500">Total Profit</p>
        <p className="mt-1 text-3xl font-extrabold text-emerald-600">
          {Number(data.totalProfit || 0).toFixed(2)} EGP
        </p>
      </div>
    </div>
  );
}
