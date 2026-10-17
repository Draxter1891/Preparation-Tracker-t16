import { useState } from "react";
import { ExternalLink, Inbox, Pencil, RotateCcw, Search, SearchX, Trash2 } from "lucide-react";
import { CATEGORIES, DIFFICULTIES, STATUSES, usePractice } from "../context/PracticeContext.jsx";
import { CategoryTag, DifficultyBadge } from "./Badge.jsx";

const INIT = { search: "", category: "All", status: "All", difficulty: "All", sort: "recent" };

const RANK = { Easy: 1, Medium: 2, Hard: 3 };
const SORTERS = {
  recent: (a, b) => b.createdAt - a.createdAt,
  oldest: (a, b) => a.createdAt - b.createdAt,
  hardest: (a, b) => RANK[b.difficulty] - RANK[a.difficulty],
  title: (a, b) => a.title.localeCompare(b.title),
};

// true if the question passes every active filter
function matches(q, f) {
  const text = `${q.title} ${q.notes} ${q.category}`.toLowerCase();
  return (
    (f.category === "All" || q.category === f.category) &&
    (f.status === "All" || q.status === f.status) &&
    (f.difficulty === "All" || q.difficulty === f.difficulty) &&
    text.includes(f.search.trim().toLowerCase())
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <select
      className="input w-auto! py-1.5!"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  );
}

function EmptyLog() {
  const { openForm, loadSample } = usePractice();
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <Inbox size={36} className="text-brand-700" />
      <h3 className="mt-3 font-serif text-xl font-bold">Your practice log is empty</h3>
      <p className="mt-1 max-w-sm text-sm text-brand-900/70">
        Add your first problem, or load a few samples to see how the dashboard behaves.
      </p>
      <div className="mt-5 flex gap-2">
        <button className="btn-primary" onClick={() => openForm(null)}>Add problem</button>
        <button className="btn-ghost" onClick={loadSample}>Load sample data</button>
      </div>
    </div>
  );
}

function QuestionRow({ q }) {
  const { updateQuestion, removeQuestion, openForm } = usePractice();
  const done = q.status === "Completed";

  const handleDelete = () => {
    if (window.confirm(`Delete "${q.title}"?`)) removeQuestion(q.id);
  };

  return (
    <li className="grid grid-cols-[auto_1fr_auto] items-start gap-x-3 gap-y-3 px-4 py-3 md:grid-cols-[48px_1fr_140px_90px_140px_72px] md:items-center">
      <input
        type="checkbox"
        checked={done}
        aria-label={`Mark ${q.title} complete`}
        onChange={() => updateQuestion(q.id, { status: done ? "Pending" : "Completed" })}
        className="mt-1 h-5 w-5 cursor-pointer accent-brand-400 md:mt-0"
      />

      <div className="min-w-0">
        <p className={`flex items-center gap-1.5 text-sm font-medium ${done ? "text-brand-900/50 line-through" : ""}`}>
          <span className="truncate">{q.title}</span>
          {q.link && (
            <a href={q.link} target="_blank" rel="noreferrer" aria-label="Open link">
              <ExternalLink size={13} className="shrink-0 text-brand-700" />
            </a>
          )}
        </p>
        {q.notes && <p className="truncate text-xs text-brand-900/60">{q.notes}</p>}
      </div>

      <div className="flex gap-1 md:justify-end">
        <button onClick={() => openForm(q)} aria-label="Edit" className="rounded p-1.5 hover:bg-cream-200">
          <Pencil size={15} />
        </button>
        <button onClick={handleDelete} aria-label="Delete" className="rounded p-1.5 hover:bg-rose-100">
          <Trash2 size={15} />
        </button>
      </div>

      <div className="col-span-3 flex flex-wrap items-center gap-2 md:contents">
        <CategoryTag name={q.category} />
        <DifficultyBadge level={q.difficulty} />
        <select
          className="input w-auto! py-1! text-xs"
          aria-label="Status"
          value={q.status}
          onChange={(e) => updateQuestion(q.id, { status: e.target.value })}
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
    </li>
  );
}

export default function Tracker({ categories = CATEGORIES }) {
  const { questions } = usePractice();
  const [filters, setFilters] = useState(INIT);

  const change = (key, value) => setFilters({ ...filters, [key]: value });
  const reset = () => setFilters(INIT);
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(INIT);

  const scoped = questions.filter((q) => categories.includes(q.category));
  const list = scoped.filter((q) => matches(q, filters)).sort(SORTERS[filters.sort]);
  const countIn = (c) => (c === "All" ? scoped.length : scoped.filter((q) => q.category === c).length);

  if (!questions.length) return <EmptyLog />;

  return (
    <section className="space-y-4">
      {/* Filters */}
      <div className="card space-y-4 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-96">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-900/50" />
            <input
              className="input pl-10"
              placeholder="Search by title, concept, notes…"
              aria-label="Search"
              value={filters.search}
              onChange={(e) => change("search", e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Select label="Sort" value={filters.sort} onChange={(v) => change("sort", v)}>
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest</option>
              <option value="hardest">Hardest first</option>
              <option value="title">Title A–Z</option>
            </Select>
            <button className="btn-ghost py-1.5! text-xs" onClick={reset} disabled={!isFiltered}>
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Category filter">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => change("category", c)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  filters.category === c ? "bg-brand-700 text-white" : "bg-cream-200 hover:bg-cream-300"
                }`}
              >
                {c} <span className="opacity-70">{countIn(c)}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 text-xs">
            <Select label="Status filter" value={filters.status} onChange={(v) => change("status", v)}>
              <option value="All">All statuses</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </Select>
            <Select label="Difficulty filter" value={filters.difficulty} onChange={(v) => change("difficulty", v)}>
              <option value="All">All difficulties</option>
              {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
            </Select>
          </div>
        </div>
      </div>

      {/* List */}
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
            <button className="btn-ghost mt-4" onClick={reset}>Clear filters</button>
          </div>
        ) : (
          <ul className="divide-y divide-cream-300/60">
            {list.map((q) => <QuestionRow key={q.id} q={q} />)}
          </ul>
        )}

        <div className="border-t border-cream-300/60 bg-cream-200/40 px-4 py-3 text-xs text-brand-900/70">
          Showing {list.length} of {scoped.length} entries
        </div>
      </div>
    </section>
  );
}