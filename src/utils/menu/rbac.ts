import type { sidebarListState } from "../../models/sidebar/list"

/** Ratakan pohon sidebar jadi satu daftar (parent + semua sub menu) */
export const flattenSidebarMenus = (
  menus: sidebarListState[]
): sidebarListState[] =>
  menus.flatMap((menu) => [menu, ...flattenSidebarMenus(menu.children ?? [])])

/**
 * Cek apakah sebuah path boleh diakses berdasarkan menu milik user.
 * Sub menu ikut diperiksa — kalau hanya parent yang dicek, semua halaman
 * yang berupa sub menu akan ditolak.
 */
export const isPathAllowed = (
  pathname: string,
  menus: sidebarListState[]
): boolean =>
  flattenSidebarMenus(menus).some((menu) => {
    if (!menu.path) return false
    return pathname === menu.path || pathname.startsWith(`${menu.path}/`)
  })

/** Permission yang dimiliki user untuk sebuah path menu */
export const permissionsForPath = (
  pathname: string,
  menus: sidebarListState[]
): string[] => {
  const match = flattenSidebarMenus(menus)
    .filter((menu) => !!menu.path)
    .filter((menu) => pathname === menu.path || pathname.startsWith(`${menu.path}/`))
    // ambil path terpanjang (paling spesifik)
    .sort((a, b) => (b.path?.length ?? 0) - (a.path?.length ?? 0))[0]

  return match?.permissions ?? []
}

/** Helper cek satu permission pada path tertentu */
export const hasPermission = (
  pathname: string,
  menus: sidebarListState[],
  permission: string
): boolean => permissionsForPath(pathname, menus).includes(permission)
