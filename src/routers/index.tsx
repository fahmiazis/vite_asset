import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../components/pages/layout/mainLayout'
import LoginPage from '../components/pages/login'
import UserPage from '../components/pages/user'
import DetailUser from '../components/pages/user/detail'
import LandingPage from '../components/pages'
import MainPage from '../components/pages/dashboard'
import CreateUsers from '../components/pages/user/create'
import RolePage from '../components/pages/role'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage/>,
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
        path: 'role',
        element: <RolePage/>,
      },
      {
        path: 'user',
        element: <UserPage/>,
      },
      {
        path: 'user/create',
        element: <CreateUsers/>,
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
  
  // {
  //   path: "*",
  //   element: <Navigate to="/login" replace />,
  // },
])
