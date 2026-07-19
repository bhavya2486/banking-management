import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { transferFunds } from "../services/transactionService";

export default function Transfer() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    receiverName: "",
    accountNumber: "",
    amount: "",
    remark: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const transferAmount = Number(formData.amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    if (Number(formData.accountNumber) === user.accountNumber) {
      setError("Cannot transfer to your own account.");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmTransfer = async () => {
    setShowConfirm(false);
    setError("");
    setMessage("");

    try {
      const res = await transferFunds({
        senderAccount: user.accountNumber,
        receiverAccount: formData.accountNumber,
        amount: formData.amount,
        remark: formData.remark,
      });

      setMessage(res.data.message);

      setFormData({
        receiverName: "",
        accountNumber: "",
        amount: "",
        remark: "",
      });

      // Update stored balance for the local user immediately
      if (res.data.currentBalance !== undefined) {
        const updatedUser = { ...user, balance: res.data.currentBalance };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Transfer Failed";
      
      // Map API messages to custom user-friendly error text
      if (errMsg.toLowerCase().includes("receiver account not found")) {
        setError("Receiver account not found. Please double-check the account number.");
      } else if (errMsg.toLowerCase().includes("insufficient balance")) {
        setError("Insufficient balance. You do not have enough funds to complete this transfer.");
      } else {
        setError(errMsg);
      }
    }
  };

  return (
    <div className="flex bg-slate-950 text-slate-100 min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <div className="p-8 max-w-4xl mx-auto w-full relative">
          <h1 className="text-3xl font-black mb-8 text-slate-100 tracking-tight">Fund Transfer</h1>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 shadow-xl backdrop-blur-md max-w-xl">
            {message && (
              <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-sm font-semibold">
                ✓ {message}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 text-sm font-semibold">
                ✗ {error}
              </div>
            )}

            <form onSubmit={handleOpenConfirm} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Receiver Name
                </label>
                <input
                  type="text"
                  name="receiverName"
                  placeholder="John Doe"
                  value={formData.receiverName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-650 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Receiver Account Number"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-655 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-655 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Remark
                </label>
                <textarea
                  name="remark"
                  placeholder="Optional remark..."
                  rows="4"
                  value={formData.remark}
                  onChange={handleChange}
                  className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-655 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-755 text-white font-semibold p-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all duration-200 ease-in-out cursor-pointer"
                >
                  Initiate Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-150">
            <h3 className="text-xl font-extrabold text-slate-100 mb-4 tracking-tight">
              Confirm Fund Transfer
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to transfer funds? Please review the details below:
            </p>

            <div className="space-y-3 bg-slate-950/50 border border-slate-800/60 p-4 rounded-xl mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">To Name:</span>
                <span className="text-slate-200 font-bold">{formData.receiverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Account No:</span>
                <span className="text-slate-300 font-mono font-semibold">{formData.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Amount:</span>
                <span className="text-indigo-400 font-extrabold">₹{formData.amount}</span>
              </div>
              {formData.remark && (
                <div className="flex justify-between border-t border-slate-800/40 pt-2 mt-2">
                  <span className="text-slate-500 font-medium">Remark:</span>
                  <span className="text-slate-400 italic truncate max-w-[200px]">{formData.remark}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-300 text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTransfer}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition cursor-pointer"
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
