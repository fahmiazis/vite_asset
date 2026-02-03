'use client'
import { useState } from 'react'
import { ArrowRight01Icon, MoonIcon, SidebarLeft01Icon, Sun01Icon, SunriseIcon } from 'hugeicons-react'
import MobileSidebar from '../sidebar/mobile'
import Images from '../../../atoms/images'
import sidebarStore from '../../../../stores/useSidebarLayout'
import { useDarkMode } from '../../../../hooks/useDarkMode'

interface NavbarProps {
    title?: string
}

export default function Navbar({
    title = 'Yaaqin'
}: NavbarProps) {
    const { isDark, toggleDarkMode } = useDarkMode();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const { isActive, setIsActive } = sidebarStore()

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
            {/* <div className='flex gap-3 items-center'>
                <button className='capitalize flex gap-2 md:gap-4 items-center border-2 px-4 py-1 md:py-2 rounded-full border-gray-300 font-bold cursor-pointer text-black bg-white'>
                    <Images src='https://i.pinimg.com/1200x/59/7f/11/597f11b631d7d94492f1adb95110cc44.jpg' className='w-6 md:w-8 rounded-full' />
                    <p className='text-sm md:text-lg'>Masuk</p>
                </button>
            </div> */}
            <button
                onClick={toggleDarkMode}
                className="p-2 text-2xl rounded-xl border border-zinc-300 dark:border-zinc-700"
            >
                {isDark ? <MoonIcon/> : <Sun01Icon/>}
            </button>
            <MobileSidebar isOpen={isSidebarOpen} setIsOpen={() => setIsSidebarOpen(false)} />
        </section>
    )
}
