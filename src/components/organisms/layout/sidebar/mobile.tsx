import { Cancel01Icon } from 'hugeicons-react';
import SidebarContent from './content';
import SidebarBrand from './brand';

interface MobileSidebarState {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void
}

export default function MobileSidebar({
    isOpen,
    setIsOpen
}: MobileSidebarState) {
    return (
        <div
            className={`fixed md:hidden top-0 left-0 w-64 h-full bg-black text-white transition-transform transform z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className='p-4 relative'>
                <Cancel01Icon onClick={() => setIsOpen(false)} className="cursor-pointer text-white text-lg mb-4 absolute right-4" />
                <SidebarBrand className='mt-6 mb-2' />
                <section className='flex flex-col gap-4 max-h-[90vh] overflow-y-scroll hide-scrollbar'>
                    <SidebarContent className='h-[65vh]'/>
                </section>
            </div>
        </div>
    )
}
