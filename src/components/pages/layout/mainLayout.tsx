import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import sidebarStore from "../../../stores/useSidebarLayout";
import SideBar2 from "../../organisms/layout/sidebar";
import Navbar from "../../organisms/layout/navbar";

export default function MainLayout() {
  const { isActive } = sidebarStore();
  const navigate = useNavigate();

//   useEffect(() => {
//     const accessToken = Cookies.get("access_token");
//     const refreshToken = Cookies.get("refresh_token");

//     if (!accessToken || !refreshToken) {
//       navigate("/login", { replace: true });
//     }
//   }, [navigate]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`h-full bg-blue-50 dark:bg-gray-900 text-white z-10
          transition-all duration-300 ease-in-out
          ${isActive ? "translate-x-0 w-80" : "-translate-x-full w-0"}
          overflow-hidden`}
      >
        <SideBar2 />
      </aside>

      {/* Main Content */}
      <div
        className={`${isActive ? "translate-x-0 w-80" : "w-0"}
          duration-500 bg-blue-200 dark:bg-black p-1 md:p-2
          flex flex-col flex-1 max-w-screen`}
      >
        <Navbar title="Assets" />

        <section className="flex-1 overflow-y-auto hide-scrollbar p-2 md:p-4">
          <Suspense fallback={<p className="text-white">Loading...</p>}>
            <Outlet />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
