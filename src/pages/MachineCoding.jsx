import Tracker from '../components/Tracker.jsx';
const SCOPE = ['Machine Coding', 'Technical'];
export default function MachineCoding() {
  return (
    <div className="space-y-5">
      <h1 className="font-serif text-3xl font-bold">Machine Coding &amp; System Design</h1>
      <Tracker categories={SCOPE} />
    </div>
  );
}
