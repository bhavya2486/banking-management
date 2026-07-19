import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getTransactions } from "../services/transactionService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

export default function Analytics() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getTransactions(user.id);
      setTransactions(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching transaction data for analytics:", err);
      setLoading(false);
    }
  };

  // Filter transactions according to selected start and end dates
  const filteredTransactions = transactions.filter((tx) => {
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

    return matchDate;
  });

  // Process data for Monthly Spending (Bar Chart) - Debit transactions grouped by month
  const monthlyData = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  filteredTransactions
    .filter((tx) => tx.type === "Debit")
    .forEach((tx) => {
      const date = new Date(tx.createdAt);
      const monthStr = monthNames[date.getMonth()];
      monthlyData[monthStr] = (monthlyData[monthStr] || 0) + tx.amount;
    });

  // Ensure we display at least the last few months or standard months
  const barLabels = monthNames.filter(m => monthlyData[m] !== undefined || m === monthNames[new Date().getMonth()]);
  const barDataValues = barLabels.map((m) => monthlyData[m] || 0);

  const barChartData = {
    labels: barLabels.length > 0 ? barLabels : ["No Data"],
    datasets: [
      {
        label: "Spending (₹)",
        data: barDataValues.length > 0 ? barDataValues : [0],
        backgroundColor: "rgba(99, 102, 241, 0.7)", // indigo-500
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  // Process data for Credit vs Debit (Pie Chart)
  let totalCredit = 0;
  let totalDebit = 0;

  filteredTransactions.forEach((tx) => {
    if (tx.type === "Credit") {
      totalCredit += tx.amount;
    } else if (tx.type === "Debit") {
      totalDebit += tx.amount;
    }
  });

  const pieChartData = {
    labels: ["Money Received (Credit)", "Money Sent (Debit)"],
    datasets: [
      {
        data: [totalCredit, totalDebit],
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)", // emerald-500
          "rgba(244, 63, 94, 0.7)",  // rose-500
        ],
        borderColor: [
          "rgb(16, 185, 129)",
          "rgb(244, 63, 94)",
        ],
        borderWidth: 1.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#94a3b8", // slate-400
          font: {
            family: "Inter",
            weight: "600",
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(51, 65, 85, 0.2)", // slate-700
        },
        ticks: {
          color: "#94a3b8",
        },
      },
      y: {
        grid: {
          color: "rgba(51, 65, 85, 0.2)",
        },
        ticks: {
          color: "#94a3b8",
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94a3b8",
          font: {
            family: "Inter",
            weight: "600",
          },
        },
      },
    },
  };

  const handleResetDates = () => {
    setStartDate("");
    setEndDate("");
  };

  const applyPreset = (presetType) => {
    const today = new Date();
    if (presetType === "today") {
      const todayStr = today.toISOString().split("T")[0];
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (presetType === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      const startStr = oneMonthAgo.toISOString().split("T")[0];
      const endStr = today.toISOString().split("T")[0];
      setStartDate(startStr);
      setEndDate(endStr);
    }
  };

  return (
    <div className="flex bg-slate-950 text-slate-100 min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <div className="p-8 max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-100 tracking-tight">
                Financial Analytics
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Analyze your credits, debits, and monthly spending insights.
              </p>
            </div>

            {/* Date Filters */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center gap-3 backdrop-blur-md">
              <div className="flex gap-2 mr-2">
                <button
                  onClick={() => applyPreset("today")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Today
                </button>
                <button
                  onClick={() => applyPreset("month")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Last Month
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-950/40 border border-slate-800/60 p-2 rounded-xl text-slate-100 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs font-semibold"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-950/40 border border-slate-800/60 p-2 rounded-xl text-slate-100 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs font-semibold"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={handleResetDates}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400 font-semibold animate-pulse">
              Loading charts...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
                <h2 className="text-xl font-bold mb-4 text-slate-100 tracking-tight">
                  Monthly Spending (Debits)
                </h2>

                <div className="h-64 relative">
                  <Bar data={barChartData} options={chartOptions} />
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
                <h2 className="text-xl font-bold mb-4 text-slate-100 tracking-tight">
                  Credit vs Debit Ratio
                </h2>

                <div className="h-64 relative">
                  <Pie data={pieChartData} options={pieOptions} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}