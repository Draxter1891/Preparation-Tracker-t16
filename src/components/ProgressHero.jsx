import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { usePractice } from '../context/PracticeContext.jsx';

export default function ProgressHero() {
  const { stats } = usePractice();
  const dot = (c) => <span className={`inline-block h-2 w-2 rounded-full ${c}`} />;
  return (
    <section className="card grid gap-6 p-6 md:grid-cols-[1fr_300px]">
      <div className="flex flex-col justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl font-medium">Overall Completion Cadence</h2>
          <p className="mt-2 max-w-md text-sm text-brand-900/70">
            Completion across every problem you have logged. Add problems to set the week's scope.
          </p>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-[11px] uppercase tracking-wider">
            <span>Sprint trajectory</span><span>{stats.pct}% completed</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cream-300">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${stats.pct}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-brand-900/60">{stats.done} of {stats.total} completed ({stats.inProgress} in progress)</p>
        </div>
      </div>
      <div className="rounded-lg border border-cream-300/70 bg-cream-100 p-5">
        <div className="mx-auto h-32 w-32">
          <CircularProgressbar value={stats.pct} text={`${stats.pct}%`}
            styles={buildStyles({ pathColor: '#d69a22', trailColor: '#e9dcb9', textColor: '#3b2a0a', textSize: '22px' })} />
        </div>
        <p className="eyebrow mt-4 text-center">Weekly quota ratio</p>
        <div className="mt-2 flex justify-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">{dot('bg-brand-400')} Done {stats.done}</span>
          <span className="flex items-center gap-1.5">{dot('bg-orange-300')} In Progress {stats.inProgress}</span>
          <span className="flex items-center gap-1.5">{dot('bg-stone-300')} Pending {stats.pending}</span>
        </div>
      </div>
    </section>
  );
}
