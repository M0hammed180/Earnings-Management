import React, { useEffect, useState } from "react";
import axios from "axios";
import TopStatsAndFilters from "../Elements/TopStatsAndFilters";
import Loading from "../Elements/Loading";
import { FiLock, FiTrash, FiX, FiXCircle } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState(null);
  const [search, setSearch] = useState("");
  const { isAuthenticated, role } = useSelector((state) => state.user);

  const [editFormData, setEditFormData] = useState({
    amount: "",
    sender: "",
    notes: "",
    type: "",
  });

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("https://earnings-management-production.up.railway.app/transaction");
      setTransactions(response.data.allTransactions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filterTransactions = transactions.filter((item) =>
    item.sender.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEditClick = (transaction) => {
    setTransactionId(transaction._id);
    setEditFormData({
      amount: transaction.amount ?? "",
      sender: transaction.sender ?? "",
      notes: transaction.notes ?? "",
      type: transaction.type ?? "received",
    });
  };

  const handleSaveClick = async () => {
    if (window.confirm("Are You Sure To Update?")) {
      try {
        await axios.put("https://earnings-management-production.up.railway.app/transaction", {
          ...editFormData,
          transactionId,
        });
        setTransactionId(null);
        fetchTransactions();
      } catch (error) {
        console.error("Error updating transaction:", error);
      }
    }
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are You Sure To Delete?")) {
      try {
        const response = await axios.delete(
          `https://earnings-management-production.up.railway.app/transaction/${transactionId}`,
        );

        fetchTransactions();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  // تم إضافة كلمة return هنا
  if (loading) return <Loading />;

  const inputClass =
    "w-full min-w-28 rounded-lg border border-gray-200 p-2.5 text-sm text-gray-800 outline-none focus:border-gray-600";

  // تم نقل الدالة خارج الـ map لتحسين الأداء
  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 p-5 text-gray-800">
      <TopStatsAndFilters />
      <div className=" w-full flex justify-center my-3">
        <div className="relative text-gray-600">
          <input
            type="text"
            name="serch"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
          />
          <button
            type="submit"
            onClick={() => setSearch("")}
            className="absolute right-0 top-0 mt-3 mr-4 cursor-pointer"
          >
            {search.length > 0 ? (
              <FiXCircle />
            ) : (
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                viewBox="0 0 56.966 56.966"
                style={{ enableBackground: "new 0 0 56.966 56.966" }}
                xmlSpace="preserve"
                width="512px"
                height="512px"
              >
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 border-b border-gray-100 pb-2 text-lg font-bold text-gray-800">
            Transaction History
          </h2>

          <div className="-mx-5 overflow-x-auto px-5">
            <table className="min-w-175 w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-700 text-gray-50">
                  {[
                    "Date & Time",
                    "Sender",
                    "Type",
                    "Amount",
                    "Profit",
                    "Notes",
                    role == "admin" && "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="border-b border-gray-200 p-2.5 whitespace-nowrap "
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filterTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No transactions recorded.
                    </td>
                  </tr>
                ) : (
                  filterTransactions.map((item) => {
                    const isEditing = transactionId === item._id;
                    const badge =
                      item.type === "received"
                        ? "bg-emerald-600"
                        : item.type === "send"
                          ? "bg-red-600"
                          : "bg-sky-500";

                    return (
                      <tr
                        key={item._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-2.5">{formatDate(item.receivedAt)}</td>
                        <td className="p-2.5 font-bold">
                          {isEditing ? (
                            <input
                              name="sender"
                              value={editFormData.sender}
                              onChange={(event) =>
                                setEditFormData({
                                  ...editFormData,
                                  sender: event.target.value,
                                })
                              }
                              className={inputClass}
                            />
                          ) : (
                            item.sender
                          )}
                        </td>
                        <td className="p-2.5">
                          {isEditing ? (
                            <select
                              name="type"
                              value={editFormData.type}
                              onChange={(event) =>
                                setEditFormData({
                                  ...editFormData,
                                  type: event.target.value,
                                })
                              }
                              className={inputClass}
                            >
                              <option defaultChecked value="received">
                                Received
                              </option>
                              <option value="send">Sent</option>
                            </select>
                          ) : (
                            <span
                              className={`rounded px-2 py-0.5 text-xs text-white ${badge}`}
                            >
                              {item.type}
                            </span>
                          )}
                        </td>
                        <td className="p-2.5">
                          {isEditing ? (
                            <input
                              type="text"
                              name="amount"
                              value={editFormData.amount}
                              onChange={(event) =>
                                setEditFormData({
                                  ...editFormData,
                                  amount: event.target.value,
                                })
                              }
                              className={inputClass}
                            />
                          ) : (
                            <p>
                              {item.type == "send" ? "-" : "+"}{" "}
                              {Number(item.amount || 0).toFixed(2)} EGP
                            </p>
                          )}
                        </td>
                        <td
                          className={`p-2.5 font-bold ${item.type == "send" ? "text-gray-700" : "text-emerald-600"} `}
                        >
                          {item.type == "send"
                            ? 0.0
                            : Number(item.profit || 0).toFixed(2)}{" "}
                          EGP
                        </td>
                        <td className=" p-2.5 ">
                          {isEditing ? (
                            <input
                              name="notes"
                              value={editFormData.notes}
                              onChange={(event) =>
                                setEditFormData({
                                  ...editFormData,
                                  notes: event.target.value,
                                })
                              }
                              className={inputClass}
                            />
                          ) : (
                            <p> {item.notes || "—"}</p>
                          )}
                        </td>
                        <td className="p-2.5">
                          <div className="flex gap-2">
                            {role == "admin" &&
                              (isEditing ? (
                                <>
                                  <button
                                    onClick={handleSaveClick}
                                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setTransactionId(null)}
                                    className="rounded-lg bg-gray-600 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditClick(item)}
                                    className="cursor-pointer rounded-lg bg-gray-600 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item._id)}
                                    className="rounded bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </>
                              ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
