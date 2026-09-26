import SidebarContent from './content'
import SidebarBrand from './brand'


export default function SideBar2() {
    return (
        <aside className="hidden md:block bg-blue-50 dark:bg-gray-900 h-screen pt-8 px-6 relative">
            <SidebarBrand className="text-black dark:text-white mb-2" />
            <SidebarContent className='overflow-y-scroll hide-scrollbar' />
        </aside>
    )
}
