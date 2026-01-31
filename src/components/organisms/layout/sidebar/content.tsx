'use client'
import React, { useState } from 'react'
import { ArrowDown01Icon, ArrowRight01Icon } from 'hugeicons-react'
import { useLocation } from 'react-router-dom'

interface SidebarContentState {
  type: 'crypto' | 'learn'
  className?: string
}

export default function SidebarContent({
  type,
  className,
}: SidebarContentState) {
  const { pathname } = useLocation()

  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const toggleMenu = (label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label))
  }

  return (
    <>
      {type === 'crypto' ? (
        <nav className={`flex flex-col text-blue-500 mt-12 space-y-4 ${className}`}>
          {sidebarCrypto.map((item, idx) => {
            const isActive =
              item.url === "/crypto"
                ? pathname === "/crypto"
                : pathname.startsWith(item.url);
            return (
              <Link
                key={idx}
                href={item.url}
                className={`flex items-center gap-3 p-2 rounded-lg transition duration-300 ${isActive
                  ? "bg-gray-700 text-white"
                  : "text-blue-400 hover:bg-gray-700 hover:text-white"
                  }`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      ) : (
        <nav
          className={`flex flex-col text-blue-500 mt-12 space-y-2 ${className}`}
        >
          {sidebarLearn.map((item, idx) => {
            const isActive =
              item.url === '/learn'
                ? pathname === '/learn'
                : pathname.startsWith(item.url ?? '')

            const hasChild = Array.isArray(item.child)

            return (
              <div key={idx}>
                {/* PARENT ITEM */}
                <button
                  onClick={() =>
                    hasChild ? toggleMenu(item.label) : null
                  }
                  className={`flex items-center justify-between w-full p-2 rounded-lg transition duration-300 ${isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-blue-400 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    {hasChild ? (
                      <span>{item.label}</span>
                    ) : (
                      <Link href={item.url!}>{item.label}</Link>
                    )}
                  </div>

                  {hasChild && (
                    <span className="text-gray-400">
                      {openMenu === item.label ? (
                        <ArrowDown01Icon size={18} />
                      ) : (
                        <ArrowRight01Icon size={18} />
                      )}
                    </span>
                  )}
                </button>

                {/* CHILD MENU */}
                {hasChild && (
                  <div
                    className={`pl-8 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${openMenu === item.label ? 'max-h-60' : 'max-h-0'
                      }`}
                  >
                    {item.child?.map((child, cIdx) => {
                      const isChildActive = pathname === child.url
                      return (
                        <Link
                          key={cIdx}
                          href={child.url}
                          className={`block p-2 rounded-md text-sm transition duration-300 ${isChildActive
                            ? 'bg-gray-700 text-white'
                            : 'text-blue-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      )}
    </>
  )
}