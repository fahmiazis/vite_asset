import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/pages/layout/mainLayout'
import MainPage from '../components/pages'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <p>Login</p>,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <MainPage/>,
      },
      {
        path: 'assets',
        element: <p>Assets</p>,
      },
    ],
  },
])
