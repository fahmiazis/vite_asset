import { useLocation } from 'react-router-dom'
import Links from '../../../atoms/links'
import { useSidebarList } from '../../../../hooks/query/sidebar/list'
import { Icon } from '@iconify/react'

export interface SidebarContenProps {
  className?: string
}

export default function SidebarContent({
  className
}: SidebarContenProps) {
  const { pathname } = useLocation()

  const { data } = useSidebarList()
  return (
    <div className={`${className} flex flex-col justify-between mt-12 space-y-4 text-black dark:text-white`}>
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
             <Icon icon={item.icon_name ? item.icon_name : 'wordpress:not-found'} width={20} height={20} />
            <span className='text-xs'>{item.name}</span>
          </Links>
        );
      })}
    </div>
  )
}