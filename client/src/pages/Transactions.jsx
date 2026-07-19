import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { getTransactions } from "../services/transactionService";

export default function Transactions() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions(user.id);
      setTransactions(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    // 1. Search by receiver name or account number
    const matchSearch =
      tx.receiverName.toLowerCase().includes(search.toLowerCase()) ||
      tx.accountNumber.toString().includes(search);

    // 2. Filter by Credit/Debit type
    const matchType = filterType === "All" || tx.type === filterType;

    // 3. Filter by Custom Date Range
    let matchDate = true;
    const txDate = new Date(tx.createdAt);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      matchDate = matchDate && txDate >= start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchDate = matchDate && txDate <= end;
    }

    return matchSearch && matchType && matchDate;
  });

  const handleResetFilters = () => {
    setSearch("");
    setFilterType("All");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="flex bg-slate-950 text-slate-100 min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <div className="p-8 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl font-black mb-8 text-slate-100 tracking-tight">Transaction History</h1>

          {/* Advanced Filters Panel */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md mb-8">
            <h2 className="text-lg font-bold text-slate-100 mb-4">Filter Transactions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Search Name or Account
                </label>
                <input
                  type="text"
                  placeholder="e.g. John or 100201..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl text-slate-100 placeholder-slate-600 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Transaction Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl text-slate-100 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-xs font-medium"
                >
                  <option value="All">All Transactions</option>
                  <option value="Credit">Credits Only</option>
                  <option value="Debit">Debits Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl text-slate-100 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl text-slate-100 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs font-medium"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/40 flex justify-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
            {loading ? (
              <div className="p-8 text-center text-slate-400 font-medium animate-pulse">Loading Transactions...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50">
                    <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Receiver</th>
                    <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Account</th>
                    <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Remarks</th>
                    <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="p-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction._id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 text-sm text-slate-400">
                          {new Date(transaction.createdAt).toLocaleDateString(undefined, {
                            dateStyle: "medium"
                          })}
                        </td>

                        <td className="p-3.5 text-sm font-semibold text-slate-200">{transaction.receiverName}</td>

                        <td className="p-3.5 text-sm font-mono text-slate-300">{transaction.accountNumber}</td>

                        <td className="p-3.5 text-sm text-slate-500 italic max-w-[200px] truncate">{transaction.remark || "—"}</td>

                        <td className="p-3.5 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                              transaction.type === "Credit"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>

                        <td
                          className={`p-3.5 text-sm font-bold text-right ${
                            transaction.type === "Credit" ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {transaction.type === "Credit" ? "+" : "-"}₹{transaction.amount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 text-sm font-medium">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
