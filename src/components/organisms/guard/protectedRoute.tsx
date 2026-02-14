import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSidebarList } from '../../../hooks/query/sidebar/list'
import { isPathAllowed } from '../../../utils/menu/rbac'

export default function ProtectedRoute() {
  const { pathname } = useLocation()
  const { data, isLoading } = useSidebarList()

  if (pathname === '/dashboard') {
    return <Outlet />
  }

  if (isLoading) return null 

  const menus = data?.data ?? []
  const allowed = isPathAllowed(pathname, menus)

  if (!allowed) {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}
