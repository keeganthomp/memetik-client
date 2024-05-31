import { createBrowserRouter } from 'react-router-dom';
// Layouts
import SidebarLayout, { NoSidebarLayout } from './Layout';
// Pages
import ErrorPage from './pages/ErrorPage';
import PoolsPage from './pages/PoolsPage';
import PoolPage from './pages/PoolPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SidebarLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <PoolsPage />,
      },
    ],
  },
  {
    path: '/pool',
    element: <NoSidebarLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ':poolId',
        element: <PoolPage />,
      },
    ],
  },
]);
export default router;
