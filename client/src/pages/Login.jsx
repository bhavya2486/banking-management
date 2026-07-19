import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
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
      const res = await loginUser(formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex justify-center items-center p-4">
      <div className="bg-slate-900/45 border border-slate-800/80 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-[420px] p-8">
        <h1 className="text-3xl font-black text-slate-100 text-center mb-2 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-slate-400 text-sm text-center mb-6">
          Access your BankDash account
        </p>

        {message && (
          <div className="p-4 mb-4 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 text-sm font-semibold text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm font-medium">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}