import type { MenuType } from "../../models/menu/list"

export const MENU_TYPE: Record<MenuType, { label: string; short: string; desc: string; cls: string }> = {
  page: {
    label: "Menu",
    short: "Halaman",
    desc: "Punya halaman sendiri dan tampil di sidebar.",
    cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  group: {
    label: "Grup Menu",
    short: "Grup",
    desc: "Wadah di sidebar yang bisa dilipat. Tidak punya halaman.",
    cls: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  permission: {
    label: "Hak Akses",
    short: "Hak Akses",
    desc: "Tidak tampil di sidebar. Hanya untuk memetakan endpoint backend ke permission.",
    cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
}

export function menuTypeOf(value?: string | null): MenuType {
  return value === "group" || value === "permission" ? value : "page"
}

export function isPermissionOnly(value?: string | null): boolean {
  return menuTypeOf(value) === "permission"
}
