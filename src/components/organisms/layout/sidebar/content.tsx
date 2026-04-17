import { useLocation } from 'react-router-dom'
import Links from '../../../atoms/links'
import { useSidebarList } from '../../../../hooks/query/sidebar/list'
import { Icon } from '@iconify/react'
import { useLogout } from '../../../../hooks/custom/logout'

export interface SidebarContenProps {
  className?: string
}

export default function SidebarContent({
  className
}: SidebarContenProps) {
  const { pathname } = useLocation()

  const { data } = useSidebarList()

  const handleLogout = useLogout()

  return (
    <div className={`${className} flex flex-col h-[90%] text-black dark:text-white`}>

      {/* MENU (scrollable) */}
      <div className="flex-1 overflow-y-auto mt-12 space-y-2 pr-1">
        {data?.data.map((item, idx) => {
          const isActive =
            item.path === "/crypto"
              ? pathname === "/crypto"
              : pathname.startsWith(item.path);

          return (
            <Links
              key={idx}
              href={item.path}
              className={`flex items-center gap-3 p-2 rounded-lg transition duration-300 ${isActive
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-white"
                }`}
            >
              <Icon
                icon={item.icon_name ? item.icon_name : "wordpress:not-found"}
                width={20}
                height={20}
              />
              <span className="text-xs">{item.name}</span>
            </Links>
          );
        })}
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