import { useMemo, useState } from "react";
import {
  ExternalLink,
  Inbox,
  Pencil,
  RotateCcw,
  Search,
  SearchX,
  Trash2,
} from "lucide-react";
import {
  CATEGORIES,
  DIFFICULTIES,
  STATUSES,
  usePractice,
} from "../context/PracticeContext.jsx";
import { CategoryTag, DifficultyBadge } from "./Badge.jsx";

const INIT = {
  q: "",
  category: "All",
  status: "All",
  difficulty: "All",
  sort: "recent",
};
const rank = { Easy: 1, Medium: 2, Hard: 3 };
const sorters = {
  recent: (a, b) => b.createdAt - a.createdAt,
  oldest: (a, b) => a.createdAt - b.createdAt,
  hardest: (a, b) => rank[b.difficulty] - rank[a.difficulty],
  title: (a, b) => a.title.localeCompare(b.title),
};

export default function Tracker({ categories = CATEGORIES }) {
  const { questions, updateQuestion, removeQuestion, openForm, loadSample } =
    usePractice();
  const [f, setF] = useState(INIT);
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const scoped = useMemo(
    () => questions.filter((q) => categories.includes(q.category)),
    [questions, categories],
  );
  const list = useMemo(() => {
    const term = f.q.trim().toLowerCase();
    return scoped
      .filter((q) => f.category === "All" || q.category === f.category)
      .filter((q) => f.status === "All" || q.status === f.status)
      .filter((q) => f.difficulty === "All" || q.difficulty === f.difficulty)
      .filter(
        (q) =>
          !term ||
          `${q.title} ${q.notes} ${q.category}`.toLowerCase().includes(term),
      )
      .sort(sorters[f.sort]);
  }, [scoped, f]);

  const dirty = JSON.stringify(f) !== JSON.stringify(INIT);
  const count = (c) =>
    c === "All" ? scoped.length : scoped.filter((q) => q.category === c).length;

  const confirmDelete = (q) =>
    window.confirm(`Delete "${q.title}"?`) && removeQuestion(q.id);

  if (!questions.length) {
    return (
      <div className="card flex flex-col items-center px-6 py-14 text-center">
        <Inbox size={36} className="text-brand-700" />
        <h3 className="mt-3 font-serif text-xl font-bold">
          Your practice log is empty
        </h3>
        <p className="mt-1 max-w-sm text-sm text-brand-900/70">
          Add your first problem, or load a few samples to see how the dashboard
          behaves.
        </p>
        <div className="mt-5 flex gap-2">
          <button className="btn-primary" onClick={() => openForm(null)}>
            Add problem
          </button>
          <button className="btn-ghost" onClick={loadSample}>
            Load sample data
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="card space-y-4 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-96">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/50"
            />
            <input
              className="input pl-9"
              placeholder="Search by title, concept, notes…"
              value={f.q}
              onChange={(e) => set("q")(e.target.value)}
              aria-label="Search"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              className="input !w-auto !py-1.5"
              value={f.sort}
              onChange={(e) => set("sort")(e.target.value)}
              aria-label="Sort"
            >
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest</option>
              <option value="hardest">Hardest first</option>
              <option value="title">Title A–Z</option>
            </select>
            <button
              className="btn-ghost !py-1.5 text-xs"
              onClick={() => setF(INIT)}
              disabled={!dirty}
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Category filter"
          >
            {["All", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => set("category")(c)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${f.category === c ? "bg-brand-700 text-white" : "bg-cream-200 hover:bg-cream-300"}`}
              >
                {c} <span className="opacity-70">{count(c)}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 text-xs">
            <select
              className="input !w-auto !py-1.5"
              value={f.status}
              onChange={(e) => set("status")(e.target.value)}
              aria-label="Status filter"
            >
              <option value="All">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              className="input !w-auto !py-1.5"
              value={f.difficulty}
              onChange={(e) => set("difficulty")(e.target.value)}
              aria-label="Difficulty filter"
            >
              <option value="All">All difficulties</option>
              {DIFFICULTIES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[48px_1fr_140px_90px_140px_72px] gap-3 bg-cream-200/70 px-4 py-3 text-[11px] font-medium uppercase tracking-wider md:grid">
          <span>Done</span>
          <span>Challenge</span>
          <span>Category</span>
          <span>Level</span>
          <span>State</span>
          <span className="text-right">Actions</span>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <SearchX size={30} className="text-brand-700" />
            <p className="mt-3 font-medium">No problems match these filters</p>
            <button className="btn-ghost mt-4" onClick={() => setF(INIT)}>
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-cream-300/60">
            {list.map((q) => {
              const done = q.status === "Completed";
              return (
                <li
                  key={q.id}
                  className="grid grid-cols-[auto_1fr_auto] items-start gap-x-3 gap-y-3 px-4 py-3 md:grid-cols-[48px_1fr_140px_90px_140px_72px] md:items-center"
                >
                  <input
                    type="checkbox"
                    checked={done}
                    aria-label={`Mark ${q.title} complete`}
                    onChange={() =>
                      updateQuestion(q.id, {
                        status: done ? "Pending" : "Completed",
                      })
                    }
                    className="mt-1 h-5 w-5 cursor-pointer accent-brand-400 md:mt-0"
                  />
                  <div className="min-w-0">
                    <p
                      className={`flex items-center gap-1.5 text-sm font-medium ${done ? "text-brand-900/50 line-through" : ""}`}
                    >
                      <span className="truncate">{q.title}</span>
                      {q.link && (
                        <a
                          href={q.link}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open link"
                        >
                          <ExternalLink
                            size={13}
                            className="shrink-0 text-brand-700"
                          />
                        </a>
                      )}
                    </p>
                    {q.notes && (
                      <p className="truncate text-xs text-brand-900/60">
                        {q.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 md:justify-end">
                    <button
                      onClick={() => openForm(q)}
                      aria-label="Edit"
                      className="rounded p-1.5 hover:bg-cream-200"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => confirmDelete(q)}
                      aria-label="Delete"
                      className="rounded p-1.5 hover:bg-rose-100"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="col-span-3 flex flex-wrap items-center gap-2 md:contents">
                    <div className="md:order-none">
                      <CategoryTag name={q.category} />
                    </div>
                    <div>
                      <DifficultyBadge level={q.difficulty} />
                    </div>
                    <select
                      className="input !w-auto !py-1 text-xs"
                      value={q.status}
                      aria-label="Status"
                      onChange={(e) =>
                        updateQuestion(q.id, { status: e.target.value })
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="flex justify-between border-t border-cream-300/60 bg-cream-200/40 px-4 py-3 text-xs text-brand-900/70">
          <span>
            Showing {list.length} of {scoped.length} entries
          </span>
        </div>
      </div>
    </section>
  );
}
