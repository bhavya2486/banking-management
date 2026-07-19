import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-4 py-3 mx-4 my-1 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
      isActive
        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-slate-900/95 border-r border-slate-800/80 text-white fixed left-0 top-0 flex flex-col">
      <div className="p-6 text-2xl font-black tracking-tight border-b border-slate-800/60 text-indigo-400">
        BankDash
      </div>

      <div className="flex flex-col mt-6 flex-grow">
        <NavLink className={linkClass} to="/dashboard">
          Dashboard
        </NavLink>

        {!isAdmin ? (
          <>
            <NavLink className={linkClass} to="/transactions">
              Transactions
            </NavLink>

            <NavLink className={linkClass} to="/transfer">
              Transfer
            </NavLink>

            <NavLink className={linkClass} to="/analytics">
              Analytics
            </NavLink>
          </>
        ) : (
          <>
            <NavLink className={linkClass} to="/admin-transactions">
              Transactions
            </NavLink>

            <NavLink className={linkClass} to="/add-customer">
              Add User
            </NavLink>
          </>
        )}

        <NavLink className={linkClass} to="/profile">
          Profile
        </NavLink>
      </div>

      <div className="p-4 border-t border-slate-800/60">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 flex items-center gap-3 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}