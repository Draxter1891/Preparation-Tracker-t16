import { NavLink, Outlet } from 'react-router';
import { Download, Plus } from 'lucide-react';
import { usePractice } from '../context/PracticeContext.jsx';
import QuestionForm from './QuestionForm.jsx';

const links = [
  { to: '/', label: 'Weekly Overview', end: true },
  { to: '/questions', label: 'Question Bank' },
  { to: '/machine-coding', label: 'Machine Coding' },
  { to: '/analytics', label: 'Analytics & Notes' },
];

export default function Layout() {
  const { questions, openForm, formTarget } = usePractice();

  const exportSummary = () => {
    const blob = new Blob([JSON.stringify(questions, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'practice-summary.json' });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-cream-300/70 bg-cream-100/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-serif text-xl font-bold leading-none">PrepEditorial</p>
            <p className="eyebrow mt-1 hidden !text-[9px] sm:block">Interview Practice Dossier</p>
          </div>
          <div className="flex gap-2 lg:hidden">
            <button className="btn-primary !px-3" onClick={() => openForm(null)} aria-label="Add problem"><Plus size={16} /></button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 text-xs font-medium uppercase tracking-wider">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => `whitespace-nowrap border-b-2 pb-2 ${isActive ? 'border-brand-700 text-brand-700' : 'border-transparent text-brand-900/70 hover:text-brand-700'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="mb-6 hidden justify-end gap-2 lg:flex">
          <button className="btn-primary" onClick={() => openForm(null)}><Plus size={16} /> Add Practice Problem</button>
          <button className="btn-ghost" onClick={exportSummary} disabled={!questions.length}><Download size={16} /> Export Summary</button>
        </div>
        <Outlet />
      </main>

      <footer className="border-t border-cream-300/70 bg-cream-200/50">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-brand-900/70">
          <p className="font-serif text-lg font-medium text-brand-900">PrepEditorial</p>
          <p>Structured interview rehearsal and deliberate technical practice.</p>
        </div>
      </footer>

      {formTarget !== undefined && <QuestionForm />}
    </div>
  );
}
