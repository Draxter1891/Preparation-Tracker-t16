const diff = {
  Easy: "bg-stone-200 text-stone-700",
  Medium: "bg-amber-200 text-amber-900",
  Hard: "bg-rose-200 text-rose-900",
};
export const DifficultyBadge = ({ level }) => (
  <span
    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${diff[level]}`}
  >
    {level}
  </span>
);
export const CategoryTag = ({ name }) => (
  <span className="rounded bg-cream-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-900/80">
    {name}
  </span>
);
