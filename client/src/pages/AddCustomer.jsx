import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { registerCustomer } from "../services/authService";

export default function AddCustomer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    balance: "",
    role: "customer",
    profileImage: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "role" && value === "admin") {
        updated.balance = "";
      }
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await registerCustomer(formData);
      setMessage(res.data.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        balance: "",
        role: "customer",
        profileImage: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-950 text-slate-100 min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <div className="p-8 max-w-4xl mx-auto w-full">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 shadow-xl backdrop-blur-md">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-100 tracking-tight">
                Create User Account
              </h1>
              <p className="text-slate-400 mt-2 text-sm">
                Register a new customer or admin user account.
              </p>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-sm font-semibold animate-pulse">
                ✓ {message}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 text-sm font-semibold">
                ✗ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image File Upload and Preview */}
              <div className="flex flex-col items-center pb-6 border-b border-slate-800/60 mb-6">
                <img
                  src={formData.profileImage || "https://api.dicebear.com/7.x/initials/svg?seed=New"}
                  alt="Profile Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 shadow-md mb-3"
                />
                <label className="cursor-pointer bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-700 transition-all">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="John Doe"
                    required
                    className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-650 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="john.doe@example.com"
                    required
                    className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-650 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    placeholder="+91 9876543210"
                    required
                    className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-650 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-650 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Account Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium"
                    onChange={handleChange}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Starting Balance (₹)
                  </label>
                  <input
                    type="number"
                    name="balance"
                    value={formData.role === "admin" ? "0" : formData.balance}
                    placeholder={formData.role === "admin" ? "0 (Fixed for Admin)" : "50000"}
                    disabled={formData.role === "admin"}
                    className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-650 focus:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-755 disabled:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all duration-205 ease-in-out cursor-pointer"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
