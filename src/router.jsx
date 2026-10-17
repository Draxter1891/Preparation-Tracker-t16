import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout.jsx';
import Overview from './pages/Overview.jsx';
import Questions from './pages/Questions.jsx';
import MachineCoding from './pages/MachineCoding.jsx';
import Analytics from './pages/Analytics.jsx';
import { ErrorPage, NotFound } from './pages/ErrorPages.jsx';

export default createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'questions', element: <Questions /> },
      { path: 'machine-coding', element: <MachineCoding /> },
      { path: 'analytics', element: <Analytics /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
