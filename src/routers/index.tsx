import { createBrowserRouter, Navigate } from 'react-router-dom'
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
import ApprovalFlowDetail from '../components/pages/approval/detail'
import CreateStepApproval from '../components/pages/approval/detail/createStep'
import UpdateMenuPage from '../components/pages/menu/update'
import AssetsCategoryPage from '../components/pages/assetsCategory'
import CreateAssetsCategory from '../components/pages/assetsCategory/create'

// guard route
import ProtectedRoute from '../components/organisms/guard/protectedRoute'
import PublicRoute from '../components/organisms/guard/publicRoute'
import DepretiationPage from '../components/pages/depretiation'
import TransactionPage from '../components/pages/transaction'
import AssetPage from '../components/pages/asset'
import DetailAssetsPage from '../components/pages/asset/detail'
import CreateTransactionPage from '../components/pages/transaction/create'
import DetailTransaction from '../components/pages/transaction/detail'
import EditTransactionPage from '../components/pages/transaction/update'
import CreateDepre from '../components/pages/depretiation/create'

export const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <LandingPage />,
  // },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <PublicRoute />,
    children: [
      { index: true, element: <LoginPage /> }
    ]
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute />, 
    children: [
      {
        element: <MainLayout />, 
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: 'menu',
            element: <MasterMenu />,
          },
          {
            path: 'menu/:id',
            element: <DetailMenu />,
          },
          {
            path: 'menu/:id/update',
            element: <UpdateMenuPage />,
          },
          {
            path: 'menu/create',
            element: <CreateMenu />,
          },
          {
            path: 'menu/assign',
            element: <AssignMenuPage />,
          },
          {
            path: 'asset',
            element: <AssetPage />,
          },
          {
            path: 'asset/:id',
            element: <DetailAssetsPage />,
          },
          {
            path: 'transaction',
            element: <TransactionPage />,
          },
          {
            path: 'transaction/*',
            element: <DetailTransaction />,
          },
          {
            path: 'transaction/update/*',
            element: <EditTransactionPage />,
          },
          {
            path: 'transaction/create',
            element: <CreateTransactionPage />,
          },
          {
            path: 'depreciation',
            element: <DepretiationPage />,
          },
          {
            path: 'depreciation/create',
            element: <CreateDepre />,
          },
          {
            path: 'asset-category',
            element: <AssetsCategoryPage />,
          },
          {
            path: 'asset-category/create',
            element: <CreateAssetsCategory />,
          },
          {
            path: 'branch',
            element: <BranchPage />,
          },
          {
            path: 'branch/:id',
            element: <DetailBranchPage />,
          },
          {
            path: 'branch/create',
            element: <CreateBranchPage />,
          },
          {
            path: 'role',
            element: <RolePage />,
          },
          {
            path: 'role/create',
            element: <CreateRole />,
          },
          {
            path: 'user',
            element: <UserPage />,
          },
          {
            path: 'user/create',
            element: <CreateUsers />,
          },
          {
            path: 'user/:id',
            element: <DetailUser />,
          },
          {
            path: 'user/:id/update',
            element: <UpdateUser />,
          },
          {
            path: 'approval',
            element: <ApprovalPage />,
          },
          {
            path: 'approval/create',
            element: <CreateApproval />,
          },
          {
            path: 'approval/:id',
            element: <ApprovalFlowDetail />,
          },
          {
            path: 'approval/:id/create-step',
            element: <CreateStepApproval />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
])
