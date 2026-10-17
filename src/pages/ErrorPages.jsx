import { Link, useRouteError } from 'react-router';
export const NotFound = () => (
  <div className="card p-10 text-center">
    <h1 className="font-serif text-2xl font-bold">Page not found</h1>
    <Link to="/" className="btn-primary mt-4">Back to overview</Link>
  </div>
);
export function ErrorPage() {
  const err = useRouteError();
  return (
    <div className="mx-auto max-w-md p-10 text-center">
      <h1 className="font-serif text-2xl font-bold">Something broke</h1>
      <p className="mt-2 text-sm text-brand-900/70">{err?.message || 'Unexpected error'}</p>
      <a href="/" className="btn-primary mt-4">Reload</a>
    </div>
  );
}
