import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Links from '../../../atoms/links'
import { useSidebarList } from '../../../../hooks/query/sidebar/list'
import { Icon } from '@iconify/react'
import { useLogout } from '../../../../hooks/custom/logout'
import { Home01Icon } from 'hugeicons-react'
import type { sidebarListState } from '../../../../models/sidebar/list'

export interface SidebarContenProps {
  className?: string
}

const ITEM_BASE =
  'flex items-center gap-3 p-2 rounded-lg transition duration-300'

function isPathActive(pathname: string, path?: string | null) {
  if (!path) return false
  return pathname === path || pathname.startsWith(`${path}/`)
}

/** Menu induk aktif kalau salah satu sub menunya aktif */
function isBranchActive(pathname: string, item: sidebarListState) {
  if (isPathActive(pathname, item.path)) return true
  return (item.children ?? []).some((child) => isPathActive(pathname, child.path))
}

function MenuIcon({ name }: { name?: string | null }) {
  return (
    <Icon
      icon={name || 'wordpress:not-found'}
      width={20}
      height={20}
      className="flex-shrink-0"
    />
  )
}

function SidebarItem({
  item,
  pathname,
}: {
  item: sidebarListState
  pathname: string
}) {
  const children = item.children ?? []
  const hasChildren = children.length > 0
  const branchActive = isBranchActive(pathname, item)

  // default terbuka, biar semua sub menu langsung kelihatan
  const [open, setOpen] = useState(true)

  // tetap dibuka paksa saat berpindah ke halaman di dalam grup ini
  useEffect(() => {
    if (branchActive) setOpen(true)
  }, [branchActive])

  // Menu tanpa sub menu — link biasa
  if (!hasChildren) {
    // Tidak bisa diklik dan tidak punya isi — jangan dirender sama sekali.
    // Contohnya grup yang seluruh sub menunya bertipe "Hak Akses" sehingga
    // tersaring habis oleh backend.
    if (!item.path) return null

    return (
      <Links
        href={item.path}
        className={`${ITEM_BASE} ${
          branchActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 hover:text-white'
        }`}
      >
        <MenuIcon name={item.icon_name} />
        <span className="text-xs">{item.name}</span>
      </Links>
    )
  }

  // Menu dengan sub menu — bisa dilipat
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${ITEM_BASE} w-full text-left ${
          branchActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 hover:text-white'
        }`}
      >
        <MenuIcon name={item.icon_name} />
        <span className="text-xs flex-1">{item.name}</span>
        <svg
          className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {open && (
        <div className="mt-1 ml-4 pl-3 border-l border-gray-300 dark:border-gray-700 space-y-1">
          {children.map((child) =>
            child.path ? (
              <Links
                key={child.id}
                href={child.path}
                className={`${ITEM_BASE} py-1.5 ${
                  isPathActive(pathname, child.path)
                    ? 'bg-gray-700 text-white'
                    : 'hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xs">{child.name}</span>
              </Links>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

export default function SidebarContent({ className }: SidebarContenProps) {
  const { pathname } = useLocation()
  const { data } = useSidebarList()
  const handleLogout = useLogout()

  return (
    <div className={`${className} flex flex-col h-[90%] text-black dark:text-white`}>

      {/* MENU (scrollable) */}
      <div className="flex-1 overflow-y-auto mt-12 space-y-2 pr-1">
        <Links
          href="/dashboard"
          className={`${ITEM_BASE} ${
            pathname === '/dashboard'
              ? 'bg-gray-700 text-white'
              : 'hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Home01Icon size={20} />
          <span className="text-xs">Dashboard</span>
        </Links>

        {data?.data.map((item) => (
          <SidebarItem key={item.id} item={item} pathname={pathname} />
        ))}
      </div>

      {/* LOGOUT (fixed bottom) */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

    </div>
  )
}
