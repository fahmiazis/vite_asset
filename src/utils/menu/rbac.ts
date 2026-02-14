import type { sidebarListState } from "../../models/sidebar/list"


export const isPathAllowed = (
  pathname: string,
  menus: sidebarListState[]
): boolean => {
    console.log('pathname ==>', pathname)
    console.log('menus ==>', menus)

  return menus.some(menu =>
    pathname.startsWith(menu.path)
  )
}