import { createBrowserRouter } from 'react-router-dom';
// Layouts
import SidebarLayout from './Layout';
// Pages
import ErrorPage from './pages/ErrorPage';
import PoolsPage from './pages/PoolsPage';
import PoolPage from './pages/PoolPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <PoolsPage />,
      },
      {
        path: ':tokenAddress',
        element: <PoolPage />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
export default router;
