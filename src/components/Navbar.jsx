import { NavLink, useNavigate } from "react-router";
import { usePractice } from "../context/PracticeContext";
import { Plus } from "lucide-react";

const links = [
  { to: "/", label: "Weekly Overview", end: true },
  { to: "/questions", label: "Question Bank" },
  { to: "/machine-coding", label: "Machine Coding" },
  { to: "/analytics", label: "Analytics & Notes" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { openForm } = usePractice();


  return (
    <header className="sticky top-0 z-30 border-b border-cream-300/70 bg-cream-100/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 mb-10">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <p className="font-serif text-3xl font-bold leading-none">
            PrepEditorial
          </p>
          <p className="eyebrow mt-1 hidden text-[9px]! sm:block">
            Log Your Learning
          </p>
        </div>
        <div className="flex gap-2 lg:hidden">
          <button
            className="btn-primary px-3!"
            onClick={() => openForm(null)}
            aria-label="Add problem"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <nav className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 text-xs font-medium uppercase tracking-wider">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 pb-2 ${isActive ? "border-brand-700 text-brand-700" : "border-transparent text-brand-900/70 hover:text-brand-700"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
