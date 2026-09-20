import { useMemo, useState } from "react"
import type { allMenuState, Children } from "../../../models/menu/list"
import type {
  MenuPermissionOptions,
  PermissionOption,
} from "../../../models/menu/permissionCatalog"
import { useSetMenuPermissions } from "../../../hooks/mutation/menu/useSetMenuPermissions"
import { MENU_TYPE, menuTypeOf } from "../../../utils/menu/menuType"

/** menuId → daftar permission yang dicentang */
export type PermissionSelection = Record<string, string[]>

interface MenuRowProps {
  menu: allMenuState | Children
  isChild?: boolean
  /** 0 = level atas, 1 = sub menu, 2 = permission di bawah sub menu */
  depth?: number
  /** hak akses yang relevan untuk menu ini (dari tabel menu_permissions) */
  options: PermissionOption[]
  /** metadata semua permission, untuk menampilkan label permission bebas */
  metaByValue: Record<string, PermissionOption>
  selected: string[]
  onChange: (permissions: string[]) => void
  /** hanya untuk grup: beri akses baca ke seluruh sub menunya */
  onGrantChildren?: () => void
  /** grup yang di-assign tapi sub menunya belum ada yang di-assign */
  warnEmptyGroup?: boolean
}

function MenuRow({
  menu,
  isChild = false,
  depth,
  options,
  metaByValue,
  selected,
  onChange,
  onGrantChildren,
  warnEmptyGroup = false,
}: MenuRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [freeText, setFreeText] = useState("")

  const { mutate: saveMenuPermissions, isPending: savingOptions } = useSetMenuPermissions()

  const isInactive = menu.status !== "active"
  const menuType = menuTypeOf(menu.menu_type)
  const optionValues = options.map((o) => o.value)

  // permission yang dicentang tapi tidak terdaftar di menu_permissions menu ini
  const extraValues = selected.filter((v) => !optionValues.includes(v))

  const toggle = (permission: string) => {
    onChange(
      selected.includes(permission)
        ? selected.filter((p) => p !== permission)
        : [...selected, permission]
    )
  }

  const handleAddFreeText = () => {
    const value = freeText.trim()
    if (!value) return

    if (/\s/.test(value)) {
      setFreeText("")
      return
    }

    if (!selected.includes(value)) onChange([...selected, value])

    // daftarkan juga ke menu_permissions supaya lain kali muncul sebagai pilihan
    saveMenuPermissions({
      menuId: menu.id,
      payload: { permissions: Array.from(new Set([...optionValues, value])) },
    })

    setFreeText("")
  }

  return (
    <div
      className={`border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden ${
        (depth ?? (isChild ? 1 : 0)) === 2 ? "ml-12" : isChild ? "ml-6" : ""
      }`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <svg
            className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>

          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {isChild && <span className="text-gray-400 mr-1">↳</span>}
              {menu.name}
              {isInactive && (
                <span className="ml-2 text-xs font-normal text-gray-400">(inactive)</span>
              )}
            </p>
            <p className="text-xs text-gray-400 font-mono truncate">
              {menu.route_path || menu.path || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {menuType !== "page" && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${MENU_TYPE[menuType].cls}`}
              title={MENU_TYPE[menuType].desc}
            >
              {MENU_TYPE[menuType].short}
            </span>
          )}
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            selected.length > 0
              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
              : "bg-gray-100 text-gray-400 dark:bg-gray-800"
          }`}
        >
          {selected.length > 0 ? `${selected.length} akses` : "tidak ada akses"}
        </span>
        </div>
      </button>

      {/* Isi */}
      {expanded && (
        <div className="p-4 space-y-4 bg-white dark:bg-gray-950">
          {warnEmptyGroup && (
            <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 rounded-lg">
              <p className="font-medium">Grup ini tidak akan muncul di sidebar.</p>
              <p className="mt-1">
                Grup hanyalah wadah — yang menentukan tampil atau tidak adalah sub
                menunya. Saat ini belum ada satu pun sub menu grup ini yang diberi
                akses, jadi grupnya ikut disembunyikan.
              </p>
              {onGrantChildren && (
                <button
                  type="button"
                  onClick={onGrantChildren}
                  className="mt-2 px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Beri akses baca ke semua sub menu
                </button>
              )}
            </div>
          )}

          {!menu.route_path && (
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
              Menu ini belum punya <span className="font-mono">route_path</span>. Permission
              tetap tersimpan, tapi backend tidak bisa mencocokkannya ke endpoint mana pun.
            </p>
          )}

          {options.length === 0 && extraValues.length === 0 ? (
            <p className="text-xs text-gray-400">
              Belum ada hak akses yang dipetakan ke menu ini. Tambahkan lewat kolom di
              bawah, atau lewat tabel <span className="font-mono">menu_permissions</span>.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {options.map((permission) => (
                <label
                  key={permission.value}
                  className="flex items-start gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(permission.value)}
                    onChange={() => toggle(permission.value)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-gray-800 dark:text-gray-200">
                      {permission.label}
                    </span>
                    <span className="block text-xs text-gray-400 font-mono">
                      {permission.value}
                    </span>
                    {permission.description && (
                      <span className="block text-xs text-gray-400">
                        {permission.description}
                      </span>
                    )}
                  </span>
                </label>
              ))}

              {/* permission yang dimiliki role tapi belum terdaftar di menu ini */}
              {extraValues.map((value) => (
                <label
                  key={value}
                  className="flex items-start gap-2 px-3 py-2 rounded-lg border border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked
                    onChange={() => toggle(value)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-gray-800 dark:text-gray-200">
                      {metaByValue[value]?.label ?? value}
                    </span>
                    <span className="block text-xs text-gray-400 font-mono">{value}</span>
                    <span className="block text-xs text-amber-600 dark:text-amber-400">
                      Belum terdaftar untuk menu ini
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Tambah permission bebas */}
          <div className="pt-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Tambah hak akses baru
            </label>
            <div className="flex gap-2">
              <input
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddFreeText()
                  }
                }}
                placeholder="mis. execute_disposal"
                disabled={savingOptions}
                className="flex-1 px-3 py-2 text-xs font-mono border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleAddFreeText}
                disabled={savingOptions || !freeText.trim()}
                className="px-3 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {savingOptions ? "..." : "Tambah"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Tanpa spasi. Akan ikut terdaftar ke menu ini, jadi lain kali muncul sebagai
              pilihan.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

interface PermissionMatrixProps {
  menus: allMenuState[]
  /** semua permission yang dikenal, untuk metadata label/deskripsi */
  allPermissions: PermissionOption[]
  /** pemetaan permission → menu dari tabel menu_permissions */
  menuOptions: MenuPermissionOptions[]
  value: PermissionSelection
  onChange: (value: PermissionSelection) => void
}

/**
 * Matriks hak akses per menu. Pilihan permission tiap menu diambil dari
 * tabel menu_permissions — jadi menu Disposal hanya menawarkan hak akses
 * disposal, bukan seluruh permission yang ada di sistem.
 */
export function PermissionMatrix({
  menus,
  allPermissions,
  menuOptions,
  value,
  onChange,
}: PermissionMatrixProps) {
  const metaByValue = useMemo(() => {
    const map: Record<string, PermissionOption> = {}
    allPermissions.forEach((p) => {
      map[p.value] = p
    })
    return map
  }, [allPermissions])

  const optionsByMenu = useMemo(() => {
    const map: Record<string, PermissionOption[]> = {}

    menuOptions.forEach((entry) => {
      map[entry.menu_id] = entry.values
        .map(
          (v) =>
            metaByValue[v] ?? {
              id: v,
              value: v,
              label: v,
              description: "",
              module: "",
            }
        )
        // akses dasar di atas, sisanya menyusul
        .sort((a, b) => {
          if (a.module === b.module) return a.label.localeCompare(b.label)
          if (a.module === "basic") return -1
          if (b.module === "basic") return 1
          return a.module.localeCompare(b.module)
        })
    })

    return map
  }, [menuOptions, metaByValue])

  /** Beri akses baca ke seluruh sub menu sebuah grup sekaligus */
  const grantReadToChildren = (children: Children[]) => {
    const next = { ...value }
    children.forEach((child) => {
      if (next[child.id]?.length) return
      const opts = optionsByMenu[child.id] ?? []
      // pakai "read" kalau tersedia, kalau tidak ambil opsi pertama
      const pick = opts.find((o) => o.value === "read") ?? opts[0]
      if (pick) next[child.id] = [pick.value]
    })
    onChange(next)
  }

  /** Grup yang di-assign tapi belum ada sub menu yang di-assign */
  const isEmptyAssignedGroup = (menu: allMenuState) => {
    if (menuTypeOf(menu.menu_type) !== "group") return false
    if (!value[menu.id]?.length) return false
    return !(menu.children ?? []).some((c) => value[c.id]?.length)
  }

  const setFor = (menuId: string, permissions: string[]) => {
    const next = { ...value }
    if (permissions.length === 0) {
      delete next[menuId]
    } else {
      next[menuId] = permissions
    }
    onChange(next)
  }

  if (menus.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-10">
        Belum ada menu yang bisa diatur hak aksesnya
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {menus.map((menu) => (
        <div key={menu.id} className="space-y-2">
          <MenuRow
            menu={menu}
            options={optionsByMenu[menu.id] ?? []}
            metaByValue={metaByValue}
            selected={value[menu.id] ?? []}
            onChange={(permissions) => setFor(menu.id, permissions)}
            warnEmptyGroup={isEmptyAssignedGroup(menu)}
            onGrantChildren={() => grantReadToChildren(menu.children ?? [])}
          />

          {menu.children?.map((child) => (
            <div key={child.id} className="space-y-2">
              <MenuRow
                menu={child}
                isChild
                options={optionsByMenu[child.id] ?? []}
                metaByValue={metaByValue}
                selected={value[child.id] ?? []}
                onChange={(permissions) => setFor(child.id, permissions)}
              />

              {/* Level ketiga — hanya menu bertipe permission yang bisa sampai sini */}
              {child.children?.map((grandChild) => (
                <MenuRow
                  key={grandChild.id}
                  menu={grandChild}
                  isChild
                  depth={2}
                  options={optionsByMenu[grandChild.id] ?? []}
                  metaByValue={metaByValue}
                  selected={value[grandChild.id] ?? []}
                  onChange={(permissions) => setFor(grandChild.id, permissions)}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
