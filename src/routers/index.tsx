import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../components/pages/layout/mainLayout'
import LoginPage from '../components/pages/login'
import UserPage from '../components/pages/user'
import DetailUser from '../components/pages/user/detail'
import LandingPage from '../components/pages'
import MainPage from '../components/pages/dashboard'
import CreateUsers from '../components/pages/user/create'
import RolePage from '../components/pages/role'
import CreateRole from '../components/pages/role/create'
import NotFound from '../components/pages/notFound'
import Forbidden from '../components/pages/forbidden'
import BranchPage from '../components/pages/branch'
import CreateBranchPage from '../components/pages/branch/create'
import DetailBranchPage from '../components/pages/branch/detail'
import MasterMenu from '../components/pages/menu'
import CreateMenu from '../components/pages/menu/create'
import DetailMenu from '../components/pages/menu/detail'
import AssignMenuPage from '../components/pages/menu/assign'
import UpdateUser from '../components/pages/user/update'
import CreateApproval from '../components/pages/approval/create'
import ApprovalPage from '../components/pages/approval'

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
        path: 'menu',
        element: <MasterMenu/>,
      },
      {
        path: 'menu/:id',
        element: <DetailMenu/>,
      },
      {
        path: 'menu/create',
        element: <CreateMenu/>,
      },
      {
        path: 'menu/assign',
        element: <AssignMenuPage/>,
      },
      {
        path: 'branch',
        element: <BranchPage/>,
      },
      {
        path: 'branch/:id',
        element: <DetailBranchPage/>,
      },
      {
        path: 'branch/create',
        element:  <CreateBranchPage/>,
      },
      {
        path: 'role',
        element: <RolePage/>,
      },
      {
        path: 'role/create',
        element: <CreateRole/>,
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
        path: 'user/:id/update',
        element: <UpdateUser/>,
      },
      {
        path: 'approval',
        element: <ApprovalPage/>,
      },
      {
        path: 'approval/create',
        element: <CreateApproval/>,
      },
    ],
  },
  
  {
    path: "*",
    element: <NotFound/>,
  },
  {
    path: "/forbidden",
    element: <Forbidden/>,
  },
])
