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
import RoleDetailPage from '../components/pages/role/detail'
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
import EditApprovalFlow from '../components/pages/approval/edit'
import DisposalAgreementPage from '../components/pages/disposalAgreement'
import CreateDisposalAgreementPage from '../components/pages/disposalAgreement/create'
import DisposalAgreementDetailPage from '../components/pages/disposalAgreement/detail'
import UpdateMenuPage from '../components/pages/menu/update'
import AssetsCategoryPage from '../components/pages/assetsCategory'
import CreateAssetsCategory from '../components/pages/assetsCategory/create'
import UpdateAssetsCategory from '../components/pages/assetsCategory/update'

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
import DetailDeprePage from '../components/pages/depretiation/detail'
import UpdateDepreciationPage from '../components/pages/depretiation/update'
import AttachmentSettingPage from '../components/pages/settingAttachment'
import DetailAttachmentSettingPage from '../components/pages/settingAttachment/detail'
import CreateAttachmentSettingPage from '../components/pages/settingAttachment/create'
import EmailSettingPage from '../components/pages/settingEmail'
import HandoverPage from '../components/pages/handover'
import HandoverFormPage from '../components/pages/handover/form'
import HandoverDetailPage from '../components/pages/handover/detail'
import CreateEmailSettingPage from '../components/pages/settingEmail/create'
import DetailEmailSettingPage from '../components/pages/settingEmail/detail'
import MutationPage from '../components/pages/mutation'
import CreateMutationPage from '../components/pages/mutation/create'
import MutationDetailPage from '../components/pages/mutation/detail'
import DisposalFormPage from '../components/pages/disposal/create'
import DisposalPage from '../components/pages/disposal'
import DisposalDetailPage from '../components/pages/disposal/detail'
import StockOpnamePage from '../components/pages/stockOpname'
import CreateStockOpnamePage from '../components/pages/stockOpname/create'
import StockOpnameDetailPage from '../components/pages/stockOpname/detail'
import StockOpnameReportPage from '../components/pages/stockOpname/report'
import StockOpnameConfigPage from '../components/pages/stockOpname/config'
import StockOpnameFillPage from '../components/pages/stockOpname/fill'
import GuidePage from '../components/pages/guide'
import StockOpnameGuidePage from '../components/pages/guide/stockOpname'

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
        // Full-screen, sengaja di luar MainLayout (no sidebar/navbar) biar
        // grid "Lengkapi Data" dapet ruang layar penuh kayak excel.
        path: 'stock-opname/fill/*',
        element: <StockOpnameFillPage />,
      },
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: 'mutation',
            element: <MutationPage />,
          },
          {
            path: 'mutation/*',
            element: <MutationDetailPage />,
          },
          {
            path: 'mutation/create',
            element: <CreateMutationPage />,
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
            path: 'menu/update/:id',
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
            path: 'disposal',
            element: <DisposalPage />,
          },
          {
            path: 'disposal/create',
            element: <DisposalFormPage />,
          },
          // Kesepakatan disposal — sengaja SEJAJAR dengan disposal, bukan
          // di bawahnya ('disposal-agreement', bukan 'disposal/agreement').
          // Sidebar menandai menu aktif dengan pencocokan awalan
          // (`pathname.startsWith(path + "/")`), jadi path bersarang membuat
          // menu Disposal ikut tersorot saat halaman agreement dibuka.
          {
            path: 'disposal-agreement',
            element: <DisposalAgreementPage />,
          },
          {
            path: 'disposal-agreement/create',
            element: <CreateDisposalAgreementPage />,
          },
          {
            path: 'disposal-agreement/*',
            element: <DisposalAgreementDetailPage />,
          },
          {
            path: 'disposal/*',
            element: <DisposalDetailPage />,
          },
          {
            path: 'guide',
            element: <GuidePage />,
          },
          {
            path: 'guide/stock-opname',
            element: <StockOpnameGuidePage />,
          },
          {
            path: 'stock-opname',
            element: <StockOpnamePage />,
          },
          {
            path: 'stock-opname/create',
            element: <CreateStockOpnamePage />,
          },
          {
            path: 'stock-opname/report',
            element: <StockOpnameReportPage />,
          },
          {
            path: 'stock-opname/config',
            element: <StockOpnameConfigPage />,
          },
          {
            path: 'stock-opname/*',
            element: <StockOpnameDetailPage />,
          },
          {
            path: 'setting-attachment',
            element: <AttachmentSettingPage />,
          },
          {
            path: 'setting-attachment/create',
            element: <CreateAttachmentSettingPage />,
          },
          {
            path: 'setting-attachment/:id',
            element: <DetailAttachmentSettingPage />,
          },
          {
            path: 'setting-email',
            element: <EmailSettingPage />,
          },
          {
            path: 'handover',
            element: <HandoverPage />,
          },
          {
            // buat baru, atau ubah draft lewat ?edit=<nomor>
            path: 'handover/create',
            element: <HandoverFormPage />,
          },
          {
            // nomor transaksi mengandung "/" — pakai splat
            path: 'handover/*',
            element: <HandoverDetailPage />,
          },
          {
            path: 'setting-email/create',
            element: <CreateEmailSettingPage />,
          },
          {
            path: 'setting-email/:id',
            element: <DetailEmailSettingPage />,
          },
          {
            path: 'procurement',
            element: <TransactionPage />,
          },
          {
            path: 'procurement/*',
            element: <DetailTransaction />,
          },
          {
            path: 'procurement/update/*',
            element: <EditTransactionPage />,
          },
          {
            path: 'procurement/create',
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
            path: 'depreciation/:id',
            element: <DetailDeprePage />,
          },
          {
            path: 'depreciation/update/:id',
            element: <UpdateDepreciationPage />,
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
            path: 'asset-category/:id/update',
            element: <UpdateAssetsCategory />,
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
            path: 'role/:id',
            element: <RoleDetailPage />,
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
            path: 'approval/:id/edit',
            element: <EditApprovalFlow />,
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
