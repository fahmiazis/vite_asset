import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../components/pages/layout/mainLayout'
import MainPage from '../components/pages'
import LoginPage from '../components/pages/login'
import UserPage from '../components/pages/user'
import DetailUser from '../components/pages/user/detail'

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
        path: 'user',
        element: <UserPage/>,
      },
      {
        path: 'user/:id',
        element: <DetailUser/>,
      },
      {
        path: 'assetd',
        element: <p>Assets</p>,
      },
    ],
  },
  
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
])
