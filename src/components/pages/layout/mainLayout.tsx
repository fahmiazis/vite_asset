import { Suspense } from "react";
import sidebarStore from "../../../stores/useSidebarLayout";
import SideBar2 from "../../organisms/layout/sidebar";
import Navbar from "../../organisms/layout/navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    const { isActive } = sidebarStore()
    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`
      h-full bg-gray-900 text-white
      transition-all duration-300 ease-in-out
      overflow-hidden
    `}
            >
                <SideBar2 />
            </aside>

            {/* Main Content */}
            <main className="flex flex-col flex-1 min-w-0 bg-black p-2">
                <Navbar title="Crypto" />

                <section className="flex-1 overflow-y-auto hide-scrollbar p-2 md:p-4">
                    <Suspense fallback={<p className="text-white">Loading...</p>}>
                        <Outlet />
                    </Suspense>
                </section>
            </main>
        </div>
    );
}
