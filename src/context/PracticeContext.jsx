import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const CATEGORIES = ["DSA", "Git", "Technical", "Machine Coding"];
export const DIFFICULTIES = ["Easy", "Medium", "Hard"];
export const STATUSES = ["Pending", "In Progress", "Completed"];

const KEY = "prep-tracker";
const Ctx = createContext();

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const mk = (title, category, difficulty, status, notes = "") => ({
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
  mk(
    "Build a Distributed Pub/Sub Queue in Pure TS",
    "Machine Coding",
    "Hard",
    "Pending",
    "At-least-once delivery, backpressure, dead-letter.",
  ),
  mk(
    "Median of Two Sorted Arrays",
    "DSA",
    "Hard",
    "Pending",
    "Binary search on the shorter array.",
  ),
  mk(
    "Virtual DOM & Reconciliation Fiber Engine",
    "Technical",
    "Hard",
    "In Progress",
    "Time-slicing cooperative scheduler.",
  ),
  mk(
    "Accessible Autocomplete with Debounce",
    "Machine Coding",
    "Medium",
    "In Progress",
    "ARIA 1.2 combobox pattern.",
  ),
  mk("Invert Binary Tree: Recursive vs Iterative", "DSA", "Easy", "Completed"),
  mk("Git Interactive Rebase & Cherry-Pick", "Git", "Medium", "Completed"),
  mk("System Design: Rate Limiter via Redis", "Technical", "Hard", "Completed"),
  mk("LRU Cache with O(1) Get and Put", "DSA", "Medium", "Completed"),
];

export function PracticeProvider({ children }) {
  const [questions, setQuestions] = useState(load);
  // undefined = closed, null = new, object = editing
  const [formTarget, setFormTarget] = useState(undefined);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(questions));
    } catch {
      console.error("Error fetching data from local storage!");
    }
  }, [questions]);

  // keep tabs in sync
  useEffect(() => {
    const onStorage = (e) => e.key === KEY && setQuestions(load());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addQuestion = useCallback(
    (q) =>
      setQuestions((p) => [
        { ...q, id: crypto.randomUUID(), createdAt: Date.now() },
        ...p,
      ]),
    [],
  );
  const updateQuestion = useCallback(
    (id, patch) =>
      setQuestions((p) => p.map((q) => (q.id === id ? { ...q, ...patch } : q))),
    [],
  );
  const removeQuestion = useCallback(
    (id) => setQuestions((p) => p.filter((q) => q.id !== id)),
    [],
  );
  const loadSample = useCallback(() => setQuestions(sampleData()), []);
  const openForm = useCallback((q = null) => setFormTarget(q), []);
  const closeForm = useCallback(() => setFormTarget(undefined), []);

  const stats = useMemo(() => {
    const by = (fn) => questions.filter(fn);
    const group = (cats) => {
      const all = by((q) => cats.includes(q.category));
      return {
        total: all.length,
        done: all.filter((q) => q.status === "Completed").length,
      };
    };
    const total = questions.length;
    const done = by((q) => q.status === "Completed").length;
    const inProgress = by((q) => q.status === "In Progress").length;
    return {
      total,
      done,
      inProgress,
      pending: total - done - inProgress,
      pct: total ? Math.round((done / total) * 100) : 0,
      dsa: group(["DSA"]),
      interview: group(["Technical", "Git"]),
      machine: group(["Machine Coding"]),
    };
  }, [questions]);

  const value = {
    questions,
    stats,
    formTarget,
    addQuestion,
    updateQuestion,
    removeQuestion,
    loadSample,
    openForm,
    closeForm,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const usePractice = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePractice must be used inside PracticeProvider");
  return ctx;
};
