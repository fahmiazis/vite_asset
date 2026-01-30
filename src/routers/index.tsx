import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <p>Login</p>,
  },
  {
    path: '/',
    element: <p>DashboardLayout</p>,
    children: [
      {
        index: true,
        element: <p>Dashboard</p>,
      },
      {
        path: 'assets',
        element: <p>Assets</p>,
      },
    ],
  },
])
