import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/pages/layout/mainLayout'
import MainPage from '../components/pages'
import LoginPage from '../components/pages/login'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <p>landing page here</p>,
  },
  {
    path: '/login',
    element: <LoginPage/>,
  },
  {
    path: '/dashboard',
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
