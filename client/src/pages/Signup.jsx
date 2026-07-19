import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(formData);

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex justify-center items-center p-4">
      <div className="bg-slate-900/45 border border-slate-800/80 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-[420px] p-8">
        <h1 className="text-3xl font-black text-slate-100 text-center mb-2 tracking-tight">
          Create Account
        </h1>
        <p className="text-slate-400 text-sm text-center mb-6">
          Set up a new administrator profile
        </p>

        {message && (
          <div className="p-4 mb-4 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-sm font-semibold text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Admin Name"
              className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm font-medium"
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
              placeholder="name@example.com"
              className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm font-medium"
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
              placeholder="+91 9876543210"
              className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm font-medium"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm font-medium"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-semibold p-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all duration-200 ease-in-out cursor-pointer mt-2"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm font-medium">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}