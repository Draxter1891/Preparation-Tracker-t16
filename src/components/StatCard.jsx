export default function StatCard({
  label,
  icon: Icon,
  done,
  total,
  unit = "solved",
}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <p className="eyebrow">{label}</p>
        <Icon size={16} className="text-brand-700" />
      </div>
      <p className="mt-3 font-serif text-3xl font-bold">
        {done}
        <span className="ml-1 font-sans text-sm font-normal text-brand-900/60">
          / {total} {unit}
        </span>
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-300">
          <div
            className="h-full rounded-full bg-brand-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[11px] text-brand-900/70">{pct}%</span>
      </div>
    </div>
  );
}
