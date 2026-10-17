import {
  CATEGORIES,
  DIFFICULTIES,
  STATUSES,
  usePractice,
} from "../context/PracticeContext.jsx";
import { CategoryTag } from "../components/Badge.jsx";

function Bars({ title, rows }) {
  return (
    <div className="card space-y-3 p-5">
      <h2 className="font-serif text-lg font-bold">{title}</h2>
      {rows.map(({ label, done, total }) => (
        <div key={label}>
          <div className="mb-1 flex justify-between text-xs">
            <span>{label}</span>
            <span>
              {done}/{total}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-cream-300">
            <div
              className="h-full rounded-full bg-brand-400"
              style={{ width: `${total ? (done / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { questions } = usePractice();
  const row = (key) => (label) => {
    const set = questions.filter((q) => q[key] === label);
    return {
      label,
      total: set.length,
      done: set.filter((q) => q.status === "Completed").length,
    };
  };
  const noted = questions.filter((q) => q.notes);

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-3xl font-bold">Analytics &amp; Notes</h1>
      {!questions.length ? (
        <p className="card p-8 text-center text-sm text-brand-900/70">
          Nothing to analyse yet. Log some problems first.
        </p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Bars title="By category" rows={CATEGORIES.map(row("category"))} />
            <Bars
              title="By difficulty"
              rows={DIFFICULTIES.map(row("difficulty"))}
            />
            <Bars
              title="By status"
              rows={STATUSES.map((s) => {
                const n = questions.filter((q) => q.status === s).length;
                return { label: s, total: questions.length, done: n };
              })}
            />
          </div>
          <div className="card p-5">
            <h2 className="mb-3 font-serif text-lg font-bold">Notes</h2>
            {noted.length === 0 ? (
              <p className="text-sm text-brand-900/70">
                No notes yet. Add notes when editing a problem.
              </p>
            ) : (
              <ul className="space-y-3">
                {noted.map((q) => (
                  <li key={q.id} className="border-l-2 border-brand-400 pl-3">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      {q.title} <CategoryTag name={q.category} />
                    </p>
                    <p className="text-sm text-brand-900/70">{q.notes}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
