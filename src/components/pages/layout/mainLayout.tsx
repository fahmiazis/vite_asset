import React from 'react'
import SidebarContent from '@/components/organisms/dashboard/sidebarContent'
import CopyrightCard from '@/components/molecules/cards/copyrightCard'

interface SideBar2Props {
  type: 'crypto' | 'learn'
}

export default function SideBar2({
type
}: SideBar2Props) {
    return (
        <aside className="hidden md:block bg-gray-900 max-h-screen pt-12 px-6">
            <h2 className="text-blue-500 text-5xl font-bold whitespace-nowrap font-sans uppercase">{type}</h2>
            <SidebarContent  className='h-[65vh] overflow-y-scroll hide-scrollbar' type={type}/>
            <CopyrightCard/>
        </aside>
    )
}
