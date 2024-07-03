import { createBrowserRouter } from 'react-router-dom';
// Layouts
import SidebarLayout from './Layout';
// Pages
import ErrorPage from './pages/ErrorPage';
import PoolsPage from './pages/PoolsPage';
import PoolPage from './pages/PoolPage';
import ProfilePage from './pages/ProfilePage';
// import HomePage from './pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
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
      {
        path: 'profile',
        errorElement: <ErrorPage />,
        element: <ProfilePage />,
      },
      {
        path: 'pools',
        errorElement: <ErrorPage />,
        element: <PoolsPage />,
        children: [
          {
            path: 'pools/:tokenAddress',
            element: <PoolPage />,
          },
        ],
      },
    ],
  },
]);
export default router;
