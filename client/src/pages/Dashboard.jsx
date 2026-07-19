import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";

import { getDashboardData } from "../services/dashboardService";
import { getCustomers } from "../services/userService";
import { getAllTransactions } from "../services/transactionService";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const [dashboard, setDashboard] = useState({
    balance: 0,
    totalTransactions: 0,
    totalDebit: 0,
    totalCredit: 0,
  });

  const [customers, setCustomers] = useState([]);
  const [transactionsToday, setTransactionsToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      fetchDashboard();
    }
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardData(user.id);
      setDashboard(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const customersRes = await getCustomers();
      setCustomers(customersRes.data);

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const txsTodayRes = await getAllTransactions({ startDate: startOfToday.toISOString() });
      setTransactionsToday(txsTodayRes.data.length);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const totalAdminBalance = customers.reduce((sum, c) => sum + (c.balance || 0), 0);

  if (loading) {
    return (
      <div className="flex bg-slate-950 text-slate-100 min-h-screen">
        <Sidebar />

        <div className="ml-64 flex-1 flex flex-col">
          <Navbar />

          <div className="p-8 flex-grow flex items-center justify-center">
            <h1 className="text-xl font-semibold animate-pulse text-slate-400">Loading Dashboard...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 text-slate-100 min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-black mb-8 text-slate-100 tracking-tight">
            {isAdmin ? "Admin Overview" : "Account Overview"}
          </h1>

          {!isAdmin ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                  title="Current Balance"
                  value={`₹${dashboard.balance}`}
                />

                <DashboardCard
                  title="Transactions"
                  value={dashboard.totalTransactions}
                />

                <DashboardCard
                  title="Money Sent"
                  value={`₹${dashboard.totalDebit}`}
                />

                <DashboardCard
                  title="Money Received"
                  value={`₹${dashboard.totalCredit}`}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DashboardCard
                  title="Total Customers"
                  value={customers.length}
                />

                <DashboardCard
                  title="Total Deposits"
                  value={`₹${totalAdminBalance}`}
                />

                <DashboardCard
                  title="Transactions Today"
                  value={transactionsToday}
                />
              </div>

              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
                <h2 className="text-xl font-bold mb-4 text-slate-100 tracking-tight">Customer Accounts</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50">
                        <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                        <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                        <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                        <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Account Number</th>
                        <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Created Date</th>
                        <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((cust) => (
                        <tr key={cust._id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={cust.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${cust.name || 'Customer'}`}
                              alt="Avatar"
                              className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm"
                            />
                            <span className="font-semibold text-slate-200">{cust.name}</span>
                          </td>
                          <td className="p-3 text-sm text-slate-300">{cust.email}</td>
                          <td className="p-3 text-sm text-slate-400">{cust.phone || "—"}</td>
                          <td className="p-3 text-sm font-mono text-slate-300">{cust.accountNumber}</td>
                          <td className="p-3 text-sm text-slate-400 font-medium">
                            {new Date(cust.createdAt).toLocaleDateString(undefined, {
                              dateStyle: "medium",
                            })}
                          </td>
                          <td className="p-3 text-right font-bold text-indigo-400">₹{cust.balance}</td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-slate-500 text-sm font-medium">
                            No customers found. Go to "Add User" to register one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
