export default function DashboardCard({
  title,
  value
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-md p-6 hover:scale-[1.02] hover:border-slate-700/80 transition-all duration-200">
      <h3 className="text-slate-400 text-sm font-semibold tracking-wide uppercase">
        {title}
      </h3>

      <p className="text-2xl font-black text-slate-100 mt-2 tracking-tight">
        {value}
      </p>
    </div>
  );
}