import { createContext, useContext, useEffect, useState } from "react";

export const CATEGORIES = ["DSA", "Git", "Technical", "Machine Coding"];
export const DIFFICULTIES = ["Easy", "Medium", "Hard"];
export const STATUSES = ["Pending", "In Progress", "Completed"];

const KEY = "prep-tracker";
const Ctx = createContext();

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const make = (title, category, difficulty, status, notes = "") => ({
  id: crypto.randomUUID(),
  title,
  category,
  difficulty,
  status,
  notes,
  link: "",
  createdAt: Date.now(),
});

export const sampleData = () => [
  make("Build a Distributed Pub/Sub Queue in Pure TS", "Machine Coding", "Hard", "Pending", "At-least-once delivery, backpressure, dead-letter."),
  make("Median of Two Sorted Arrays", "DSA", "Hard", "Pending", "Binary search on the shorter array."),
  make("Virtual DOM & Reconciliation Fiber Engine", "Technical", "Hard", "In Progress", "Time-slicing cooperative scheduler."),
  make("Accessible Autocomplete with Debounce", "Machine Coding", "Medium", "In Progress", "ARIA 1.2 combobox pattern."),
  make("Invert Binary Tree: Recursive vs Iterative", "DSA", "Easy", "Completed"),
  make("Git Interactive Rebase & Cherry-Pick", "Git", "Medium", "Completed"),
  make("System Design: Rate Limiter via Redis", "Technical", "Hard", "Completed"),
  make("LRU Cache with O(1) Get and Put", "DSA", "Medium", "Completed"),
];

// done / total for a set of categories
const countFor = (questions, cats) => {
  const list = questions.filter((q) => cats.includes(q.category));
  return { total: list.length, done: list.filter((q) => q.status === "Completed").length };
};

export function PracticeProvider({ children }) {
  const [questions, setQuestions] = useState(load);
  const [formTarget, setFormTarget] = useState(undefined); // undefined = closed, null = new, object = editing

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(questions));
    } catch {
      console.error("Could not save to local storage.");
    }
  }, [questions]);

  const total = questions.length;
  const done = questions.filter((q) => q.status === "Completed").length;
  const inProgress = questions.filter((q) => q.status === "In Progress").length;

  const stats = {
    total,
    done,
    inProgress,
    pending: total - done - inProgress,
    pct: total ? Math.round((done / total) * 100) : 0,
    dsa: countFor(questions, ["DSA"]),
    interview: countFor(questions, ["Technical", "Git"]),
    machine: countFor(questions, ["Machine Coding"]),
  };

  const value = {
    questions,
    stats,
    formTarget,
    addQuestion: (q) => setQuestions([{ ...q, id: crypto.randomUUID(), createdAt: Date.now() }, ...questions]),
    updateQuestion: (id, patch) => setQuestions(questions.map((q) => (q.id === id ? { ...q, ...patch } : q))),
    removeQuestion: (id) => setQuestions(questions.filter((q) => q.id !== id)),
    loadSample: () => setQuestions(sampleData()),
    openForm: (q = null) => setFormTarget(q),
    closeForm: () => setFormTarget(undefined),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePractice() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePractice must be used inside PracticeProvider");
  return ctx;
}