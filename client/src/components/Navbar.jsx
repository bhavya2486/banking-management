export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const avatarUrl = user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name || 'User'}`;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
      <h2 className="text-xl font-bold tracking-tight text-slate-100">
        Banking Portal
      </h2>

      <div className="flex items-center gap-3 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-800/60 rounded-full pl-4 pr-1.5 py-1.5 transition-all duration-200 cursor-pointer">
        <span className="text-slate-300 text-sm font-semibold">Welcome, {user?.name}</span>
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm"
        />
      </div>
    </div>
  );
}