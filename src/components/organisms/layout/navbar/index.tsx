'use client'
import { useState } from 'react'
import { ArrowRight01Icon, MoonIcon, SidebarLeft01Icon, Sun01Icon, SunriseIcon } from 'hugeicons-react'
import MobileSidebar from '../sidebar/mobile'
import Images from '../../../atoms/images'
import sidebarStore from '../../../../stores/useSidebarLayout'
import { useDarkMode } from '../../../../hooks/useDarkMode'
import ProfileCardnavbar from '../../../molecules/card/profileCardNavbar'
import { useMyProfile } from '../../../../hooks/query/auth/myProfile'

interface NavbarProps {
    title?: string
}

export default function Navbar({
    title = 'Yaaqin'
}: NavbarProps) {
    const { isDark, toggleDarkMode } = useDarkMode();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const { isActive, setIsActive } = sidebarStore()
    const { data: myProfile } = useMyProfile()

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState)
    }

    const handleSidebarDesk = () => {
        setIsActive(!isActive)
    }

    return (
        <section className='flex justify-between items-center bg-blue-50 dark:bg-gray-900 rounded-none md:rounded-xl p-2 md:p-4'>
            <div className='flex gap-1 md:gap-3 items-center'>
                <ArrowRight01Icon
                    className='block md:hidden cursor-pointer'
                    onClick={toggleSidebar}
                />
                <div className="relative group">
                    <SidebarLeft01Icon
                        className="hidden md:block cursor-pointer duration-300"
                        onClick={handleSidebarDesk}
                    />

                    {/* Tooltip */}
                    <span className="absolute left-4 -translate-x-1/4 -bottom-8 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-700 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap z-10">
                        {isActive ? 'Close sidebar' : 'Open Sidebar'}
                    </span>
                </div>
                <div className='flex flex-col'>
                    <h6 className='text-sm md:text-2xl font-extrabold truncate'>
                        {title}
                    </h6>
                </div>
            </div>
            <div className='flex gap-4 items-center'>
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-2xl rounded-xl border border-zinc-300 dark:border-zinc-700"
                >
                    {isDark ? <MoonIcon /> : <Sun01Icon />}
                </button>
                {myProfile && (
                    <ProfileCardnavbar name={myProfile?.data.fullname} email={myProfile?.data.email} avatarUrl={"https://i.pinimg.com/1200x/c3/0b/53/c30b53f04c0a4b499ebbf9e19f54ab10.jpg"} />
                )}
            </div>
            <MobileSidebar isOpen={isSidebarOpen} setIsOpen={() => setIsSidebarOpen(false)} />
        </section>
    )
}
