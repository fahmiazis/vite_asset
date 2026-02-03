import React from 'react'
import SidebarContent from './content'


export default function SideBar2() {
    return (
        <aside className="hidden md:block bg-blue-50 dark:bg-gray-900 max-h-screen pt-12 px-6">
            <h2 className="text-black dark:text-white text-5xl font-bold whitespace-nowrap font-sans uppercase">Assets</h2>
            <SidebarContent  className='h-[65vh] overflow-y-scroll hide-scrollbar' />
        </aside>
    )
}
