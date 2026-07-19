import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getAllTransactions } from "../services/transactionService";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountNumber, setAccountNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [preset, setPreset] = useState("all"); // "all", "week", "month"

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (filters = {}) => {
    setLoading(true);
    try {
      const params = {
        accountNumber: filters.accountNumber !== undefined ? filters.accountNumber : accountNumber,
        startDate: filters.startDate !== undefined ? filters.startDate : startDate,
        endDate: filters.endDate !== undefined ? filters.endDate : endDate,
      };

      // Clean empty params
      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const res = await getAllTransactions(params);
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleReset = () => {
    setAccountNumber("");
    setStartDate("");
    setEndDate("");
    setPreset("all");
    fetchTransactions({ accountNumber: "", startDate: "", endDate: "" });
  };

  const applyPreset = (type) => {
    setPreset(type);
    const end = new Date();
    let start = null;

    if (type === "week") {
      start = new Date();
      start.setDate(end.getDate() - 7);
    } else if (type === "month") {
      start = new Date();
      start.setDate(end.getDate() - 30);
    }

    const startStr = start ? start.toISOString().split("T")[0] : "";
    const endStr = start ? end.toISOString().split("T")[0] : "";

    setStartDate(startStr);
    setEndDate(endStr);

    fetchTransactions({
      startDate: startStr,
      endDate: endStr,
    });
  };

  const handleCustomDateChange = (name, value) => {
    setPreset("custom");
    if (name === "startDate") {
      setStartDate(value);
      fetchTransactions({ startDate: value });
    } else {
      setEndDate(value);
      fetchTransactions({ endDate: value });
    }
  };

  return (
    <div className="flex bg-slate-950 text-slate-100 min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <div className="p-8 max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-100 tracking-tight">
                System Transactions
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                View, filter, and audit all transaction logs across the platform.
              </p>
            </div>
            <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/25 flex flex-col items-center">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-85">
                Total Transactions
              </span>
              <span className="text-2xl font-black mt-0.5">
                {transactions.length}
              </span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl p-6 mb-8 backdrop-blur-md">
            <h2 className="text-lg font-bold text-slate-100 mb-4">Filter Log Records</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Account */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Account Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search account no..."
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-650 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Preset Ranges */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Date Presets
                  </label>
                  <div className="grid grid-cols-3 gap-2 h-[46px]">
                    <button
                      type="button"
                      onClick={() => applyPreset("all")}
                      className={`rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                        preset === "all"
                          ? "bg-indigo-600/10 border-indigo-500/35 text-indigo-400 shadow-sm"
                          : "border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                      }`}
                    >
                      All Time
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("week")}
                      className={`rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                        preset === "week"
                          ? "bg-indigo-600/10 border-indigo-500/35 text-indigo-400 shadow-sm"
                          : "border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                      }`}
                    >
                      Last Week
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset("month")}
                      className={`rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                        preset === "month"
                          ? "bg-indigo-600/10 border-indigo-500/35 text-indigo-400 shadow-sm"
                          : "border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                      }`}
                    >
                      Last Month
                    </button>
                  </div>
                </div>

                {/* Custom Dates */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Custom Date Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      name="startDate"
                      value={startDate}
                      onChange={(e) => handleCustomDateChange("startDate", e.target.value)}
                      className="w-1/2 bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-100 text-xs font-semibold"
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={endDate}
                      onChange={(e) => handleCustomDateChange("endDate", e.target.value)}
                      className="w-1/2 bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-100 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Records Table */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
            {loading ? (
              <div className="py-12 text-center text-slate-400 font-medium animate-pulse">
                Loading transactions log...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/50">
                      <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                      <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Sender</th>
                      <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Receiver</th>
                      <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Remarks</th>
                      <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx._id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 text-sm text-slate-400">
                          {new Date(tx.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="p-3.5 text-sm text-slate-300">
                          <div className="font-semibold">{tx.senderAccount}</div>
                          {tx.type === "Debit" && tx.userId && (
                            <div className="text-xs text-slate-500 mt-0.5">{tx.userId.name}</div>
                          )}
                        </td>
                        <td className="p-3.5 text-sm text-slate-300">
                          <div className="font-semibold">{tx.receiverAccount}</div>
                          {tx.type === "Credit" && tx.userId && (
                            <div className="text-xs text-slate-500 mt-0.5">{tx.userId.name}</div>
                          )}
                        </td>
                        <td className="p-3.5 text-sm text-slate-400 italic max-w-[200px] truncate">
                          {tx.remark || "—"}
                        </td>
                        <td className="p-3.5 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                              tx.type === "Credit"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td
                          className={`p-3.5 text-sm font-bold text-right ${
                            tx.type === "Credit" ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {tx.type === "Credit" ? "+" : "-"}₹{tx.amount}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500 text-sm font-medium">
                          No transaction records found matching the current search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
