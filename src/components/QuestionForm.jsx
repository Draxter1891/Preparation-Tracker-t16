import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES, STATUSES, usePractice } from '../context/PracticeContext.jsx';

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="eyebrow mb-1 block">{label}</span>
    {children}
    {error && <span role="alert" className="mt-1 block text-xs text-rose-700">{error.message}</span>}
  </label>
);

export default function QuestionForm() {
  const { formTarget, addQuestion, updateQuestion, closeForm } = usePractice();
  const editing = Boolean(formTarget);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: formTarget?.title ?? '',
      category: formTarget?.category ?? 'DSA',
      difficulty: formTarget?.difficulty ?? 'Medium',
      status: formTarget?.status ?? 'Pending',
      link: formTarget?.link ?? '',
      notes: formTarget?.notes ?? '',
    },
  });

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeForm();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeForm]);

  const onSubmit = (data) => {
    const clean = { ...data, title: data.title.trim(), notes: data.notes.trim(), link: data.link.trim() };
    editing ? updateQuestion(formTarget.id, clean) : addQuestion(clean);
    closeForm();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-brand-900/40 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && closeForm()}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate role="dialog" aria-modal="true"
        className="card max-h-[92vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-b-none p-6 sm:rounded-b-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">{editing ? 'Edit Problem' : 'Add Practice Problem'}</h2>
          <button type="button" onClick={closeForm} aria-label="Close" className="rounded p-1 hover:bg-cream-200"><X size={18} /></button>
        </div>

        <Field label="Title" error={errors.title}>
          <input className="input" autoFocus placeholder="e.g. LRU Cache with O(1) operations"
            {...register('title', {
              required: 'Title is required',
              validate: (v) => v.trim().length >= 3 || 'Use at least 3 characters',
              maxLength: { value: 120, message: 'Max 120 characters' },
            })} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Category"><select className="input" {...register('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Difficulty"><select className="input" {...register('difficulty')}>{DIFFICULTIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Status"><select className="input" {...register('status')}>{STATUSES.map((c) => <option key={c}>{c}</option>)}</select></Field>
        </div>

        <Field label="Link (optional)" error={errors.link}>
          <input className="input" placeholder="https://leetcode.com/problems/..."
            {...register('link', { pattern: { value: /^$|^https?:\/\/\S+\.\S+$/i, message: 'Enter a valid http(s) URL' } })} />
        </Field>

        <Field label="Notes (optional)" error={errors.notes}>
          <textarea rows={3} className="input" placeholder="Key insight, edge cases, what tripped you up..."
            {...register('notes', { maxLength: { value: 240, message: 'Max 240 characters' } })} />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={closeForm}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>{editing ? 'Save changes' : 'Add problem'}</button>
        </div>
      </form>
    </div>
  );
}
