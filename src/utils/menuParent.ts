import type { allMenuState, Children } from "../models/menu/list"

export interface MenuParentOption {
  id: string
  label: string
}

/**
 * Daftar kandidat induk menu.
 *
 * Menu biasa hanya boleh menempel pada menu level atas — backend membatasi
 * kedalaman sidebar 1 tingkat (services.validateNesting).
 *
 * Menu bertipe `permission` tidak dirender di sidebar sehingga tidak dihitung
 * dalam batas itu; backend memperbolehkannya menempel pada menu apa pun,
 * termasuk sub menu. Daftarnya karena itu ikut memuat sub menu, ditulis
 * bertingkat supaya jelas posisinya.
 *
 * Catatan bentuk data: endpoint menu mengembalikan POHON (menu level atas
 * dengan `children`), bukan daftar datar. Sub menu karena itu dibaca dari
 * `parent.children` — memfilter `parent_id` pada array teratas tidak akan
 * menemukan apa pun.
 */
export function buildMenuParentOptions(
  menus: allMenuState[],
  options: { allowSubMenu: boolean; excludeId?: string }
): MenuParentOption[] {
  const { allowSubMenu, excludeId } = options

  // jaga-jaga kalau suatu saat endpoint mengembalikan daftar datar
  const topLevel = menus.filter((m) => !m.parent_id)
  const result: MenuParentOption[] = []

  for (const parent of topLevel) {
    if (parent.id === excludeId) continue

    result.push({
      id: parent.id,
      label: parent.menu_type === "group" ? `${parent.name} (grup)` : parent.name,
    })

    if (!allowSubMenu) continue

    const children: Children[] =
      parent.children ??
      (menus.filter((m) => m.parent_id === parent.id) as unknown as Children[])

    for (const child of children) {
      if (child.id === excludeId) continue

      // Menu hak akses tidak berguna sebagai induk — dia sendiri tidak punya
      // halaman dan tidak tampil di sidebar.
      if (child.menu_type === "permission") continue

      result.push({ id: child.id, label: `${parent.name} › ${child.name}` })
    }
  }

  return result
}
