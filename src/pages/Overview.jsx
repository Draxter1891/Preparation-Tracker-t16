import { Binary, Cpu, Layers, ListChecks } from "lucide-react";
import { usePractice } from "../context/PracticeContext.jsx";
import ProgressHero from "../components/ProgressHero.jsx";
import StatCard from "../components/StatCard.jsx";
import Tracker from "../components/Tracker.jsx";

export default function Overview() {
  const { stats } = usePractice();
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Curate your syllabus & Path</p>
        <h1 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
          Weekly Practice{" "}
          <em className="font-medium text-brand-700">Momentum</em>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-brand-900/70">
         Algorithms, machine coding and technical questions, all tracked in one place so you can see what’s done and what’s left.
        </p>
      </header>
      <ProgressHero />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total ledger"
          icon={ListChecks}
          done={stats.done}
          total={stats.total}
          unit="done"
        />
        <StatCard label="DSA core" icon={Binary} {...stats.dsa} />
        <StatCard label="Interview Qs" icon={Layers} {...stats.interview} />
        <StatCard
          label="Machine coding"
          icon={Cpu}
          {...stats.machine}
          unit="ready"
        />
      </div>
      <Tracker />
    </div>
  );
}
