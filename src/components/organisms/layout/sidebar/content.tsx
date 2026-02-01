'use client'
import React, { useState } from 'react'
import { ArrowDown01Icon, ArrowRight01Icon, BitcoinEllipseIcon, Image02Icon, Wallet01Icon } from 'hugeicons-react'
import { useLocation } from 'react-router-dom'
import Links from '../../../atoms/links'

export interface SidebarContenProps {
  className?: string
}

export const assetsSideBar = [
  { label: "My Assets", url: "/assets", icon: BitcoinEllipseIcon },
  { label: "Master User", url: "/master-user", icon: Image02Icon },
  { label: "Disposal", url: "/disposal", icon: Wallet01Icon },
];


export default function SidebarContent({
  className
}: SidebarContenProps) {
  const { pathname } = useLocation()
  return (
      <nav className={`${className} flex flex-col text-blue-500 mt-12 space-y-4`}>
        {assetsSideBar.map((item, idx) => {
          const isActive =
            item.url === "/crypto"
              ? pathname === "/crypto"
              : pathname.startsWith(item.url);
          return (
            <Links
              key={idx}
              href={item.url}
              className={`flex items-center gap-3 p-2 rounded-lg transition duration-300 ${isActive
                ? "bg-gray-700 text-white"
                : "text-blue-400 hover:bg-gray-700 hover:text-white"
                }`}
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              <span>{item.label}</span>
            </Links>
          );
        })}
      </nav>
  )
}