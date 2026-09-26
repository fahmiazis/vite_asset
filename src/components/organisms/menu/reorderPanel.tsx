import { useEffect, useMemo, useState } from "react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Icon } from "@iconify/react"
import { Link } from "react-router-dom"
import type { allMenuState, Children } from "../../../models/menu/list"
import type { ReorderMenuItem } from "../../../models/menu/reorder"
import { useReorderMenus } from "../../../hooks/mutation/menu/useReorderMenus"
import { DeleteMenuModal } from "./deleteMenuModal"
import { MENU_TYPE, menuTypeOf } from "../../../utils/menu/menuType"
import type { MenuType } from "../../../models/menu/list"

// ─── Struktur kerja lokal ────────────────────────────────────────────────────

interface DraftMenu {
  id: string
  name: string
  menuType: MenuType
  path: string | null
  iconName?: string | null
  status: string
  children: DraftChild[]
}

interface DraftChild {
  id: string
  name: string
  menuType: MenuType
  path: string | null
  status: string
  /** menu permission yang menempel di bawahnya — ikut terbawa saat dipindah */
  children: DraftChild[]
}

function toDraft(menus: allMenuState[]): DraftMenu[] {
  return [...menus]
    .sort((a, b) => a.order_index - b.order_index)
    .map((menu) => ({
      id: menu.id,
      name: menu.name,
      menuType: menuTypeOf(menu.menu_type),
      path: menu.path ?? null,
      iconName: menu.icon_name,
      status: menu.status,
      children: [...(menu.children ?? [])]
        .sort((a: Children, b: Children) => a.order_index - b.order_index)
        .map((child) => ({
          id: child.id,
          name: child.name,
          menuType: menuTypeOf(child.menu_type),
          path: child.path ?? null,
          status: child.status,
          children: (child.children ?? []).map((g) => ({
            id: g.id,
            name: g.name,
            menuType: menuTypeOf(g.menu_type),
            path: g.path ?? null,
            status: g.status,
            children: [],
          })),
        })),
    }))
}

/** Bentuk payload reorder: parent pakai index-nya sendiri, child pakai index dalam parent */
function toPayload(draft: DraftMenu[]): ReorderMenuItem[] {
  const items: ReorderMenuItem[] = []

  draft.forEach((menu, menuIndex) => {
    items.push({ id: menu.id, parent_id: null, order_index: menuIndex })

    menu.children.forEach((child, childIndex) => {
      items.push({ id: child.id, parent_id: menu.id, order_index: childIndex })

      // Menu permission di level ketiga tetap menempel pada induknya
      child.children.forEach((grandChild, gIndex) => {
        items.push({ id: grandChild.id, parent_id: child.id, order_index: gIndex })
      })
    })
  })

  return items
}

/**
 * Pindahkan sebuah menu ke grup lain, atau keluarkan ke level atas.
 * targetParentId null berarti jadi menu level atas.
 *
 * Menu yang punya sub menu tidak boleh dijadikan sub menu — backend menolaknya
 * karena nesting dibatasi 1 level.
 */
function moveMenu(
  draft: DraftMenu[],
  itemId: string,
  targetParentId: string | null
): DraftMenu[] {
  // Cari sebagai menu level atas
  const asParent = draft.find((m) => m.id === itemId)
  if (asParent) {
    if (targetParentId === null) return draft

    // Sub menu yang tampil di sidebar menghalangi pemindahan (kedalaman maks 2).
    // Anak bertipe permission tidak dihitung dan ikut terbawa.
    const visibleChildren = asParent.children.filter((c) => c.menuType !== "permission")
    if (visibleChildren.length > 0) return draft

    const moved: DraftChild = {
      id: asParent.id,
      name: asParent.name,
      menuType: asParent.menuType,
      path: asParent.path,
      status: asParent.status,
      children: asParent.children,
    }

    const without = draft.filter((m) => m.id !== itemId)

    // Target menu level atas
    if (without.some((m) => m.id === targetParentId)) {
      return without.map((m) =>
        m.id === targetParentId ? { ...m, children: [...m.children, moved] } : m
      )
    }

    // Target sub menu — hanya menu hak akses yang boleh turun ke level 3
    const targetIsSubMenu = without.some((m) =>
      m.children.some((c) => c.id === targetParentId)
    )
    if (targetIsSubMenu && asParent.menuType === "permission") {
      return without.map((m) => ({
        ...m,
        children: m.children.map((c) =>
          c.id === targetParentId ? { ...c, children: [...c.children, moved] } : c
        ),
      }))
    }

    return draft
  }

  // Cari sebagai sub menu (level 2)
  let owner = draft.find((m) => m.children.some((c) => c.id === itemId))
  let child = owner?.children.find((c) => c.id === itemId)

  // Cari sebagai menu hak akses di level 3
  let grandOwner: DraftChild | undefined
  if (!child) {
    for (const menu of draft) {
      const found = menu.children.find((c) => c.children.some((g) => g.id === itemId))
      if (found) {
        owner = menu
        grandOwner = found
        child = found.children.find((g) => g.id === itemId)
        break
      }
    }
  }

  if (!owner || !child) return draft

  const currentParentId = grandOwner ? grandOwner.id : owner.id
  if (currentParentId === targetParentId) return draft

  // Lepaskan dari posisi lama
  const stripped = draft.map((m) => ({
    ...m,
    children: m.children
      .filter((c) => c.id !== itemId)
      .map((c) => ({ ...c, children: c.children.filter((g) => g.id !== itemId) })),
  }))

  if (targetParentId === null) {
    return [
      ...stripped,
      {
        id: child.id,
        name: child.name,
        menuType: child.menuType,
        path: child.path,
        iconName: null,
        status: child.status,
        children: child.children,
      },
    ]
  }

  // Target menu level atas?
  if (stripped.some((m) => m.id === targetParentId)) {
    return stripped.map((m) =>
      m.id === targetParentId ? { ...m, children: [...m.children, child] } : m
    )
  }

  // Target sub menu — hanya menu hak akses yang boleh masuk ke level 3
  const targetIsSubMenu = stripped.some((m) =>
    m.children.some((c) => c.id === targetParentId)
  )
  if (targetIsSubMenu && child.menuType === "permission") {
    return stripped.map((m) => ({
      ...m,
      children: m.children.map((c) =>
        c.id === targetParentId ? { ...c, children: [...c.children, child!] } : c
      ),
    }))
  }

  // Target tidak dikenali — kembalikan apa adanya supaya menu tidak hilang
  return draft
}

/** Tanda tangan urutan, untuk deteksi perubahan */
function signature(draft: DraftMenu[]): string {
  return draft
    .map(
      (m) =>
        `${m.id}:${m.children
          .map((c) => `${c.id}[${c.children.map((g) => g.id).join(",")}]`)
          .join(",")}`
    )
    .join("|")
}

/** Daftar menu level atas — kandidat grup tujuan */
function topLevelOptions(draft: DraftMenu[]) {
  return draft.map((m) => ({ id: m.id, name: m.name }))
}

/**
 * Kandidat induk untuk menu bertipe permission: menu level atas DITAMBAH sub
 * menu. Menu hak akses tidak dirender di sidebar sehingga tidak menambah
 * kedalaman — backend mengizinkannya menempel di mana pun
 * (services.validateNesting).
 *
 * Sub menu bertipe permission tidak ikut: dia sendiri tidak punya halaman,
 * jadi tidak berguna sebagai induk.
 */
function permissionTargetOptions(draft: DraftMenu[]) {
  const options: { id: string; name: string }[] = []

  for (const menu of draft) {
    options.push({ id: menu.id, name: menu.name })

    for (const child of menu.children) {
      if (child.menuType === "permission") continue
      options.push({ id: child.id, name: `${menu.name} › ${child.name}` })
    }
  }

  return options
}

// ─── Baris sortable ──────────────────────────────────────────────────────────

function DragHandle({ listeners, attributes }: { listeners: any; attributes: any }) {
  return (
    <button
      type="button"
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 -ml-1 touch-none"
      aria-label="Geser untuk mengubah urutan"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="7" cy="5" r="1.5" />
        <circle cx="13" cy="5" r="1.5" />
        <circle cx="7" cy="10" r="1.5" />
        <circle cx="13" cy="10" r="1.5" />
        <circle cx="7" cy="15" r="1.5" />
        <circle cx="13" cy="15" r="1.5" />
      </svg>
    </button>
  )
}

function EditLink({ id }: { id: string }) {
  return (
    <Link
      to={`/dashboard/menu/update/${id}`}
      onPointerDown={(e) => e.stopPropagation()}
      className="text-xs text-indigo-600 hover:text-indigo-700 underline underline-offset-2 flex-shrink-0"
    >
      Edit
    </Link>
  )
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      title="Hapus menu"
      className="flex items-center justify-center w-7 h-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex-shrink-0"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}

function GroupSelect({
  value,
  options,
  onChange,
  disabled = false,
  title,
}: {
  value: string
  options: { id: string; name: string }[]
  onChange: (v: string) => void
  disabled?: boolean
  title?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      title={title}
      onPointerDown={(e) => e.stopPropagation()}
      className="text-xs px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 max-w-[150px] disabled:opacity-40 flex-shrink-0"
    >
      <option value="">Tanpa grup</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  )
}

function SortableChild({
  child,
  index,
  parentId,
  groups,
  permissionTargets,
  onMove,
  onDelete,
}: {
  child: DraftChild
  index: number
  parentId: string
  groups: { id: string; name: string }[]
  /** kandidat induk untuk menu hak akses — termasuk sub menu */
  permissionTargets: { id: string; name: string }[]
  onMove: (itemId: string, targetParentId: string | null) => void
  onDelete: (item: { id: string; name: string; childCount: number }) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: child.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 pl-8 pr-3 py-2 rounded-lg border ${
        isDragging
          ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg z-10 relative"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950"
      }`}
    >
      <DragHandle listeners={listeners} attributes={attributes} />
      <span className="text-xs text-gray-400 w-5 flex-shrink-0">{index + 1}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
          <span className="text-gray-400 mr-1">↳</span>
          {child.name}
          {child.status !== "active" && (
            <span className="ml-2 text-xs font-normal text-gray-400">(inactive)</span>
          )}
        </p>
        <p className="text-xs text-gray-400 font-mono truncate">{child.path || "—"}</p>
      </div>

      {child.menuType !== "page" && (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${MENU_TYPE[child.menuType].cls}`}
          title={MENU_TYPE[child.menuType].desc}
        >
          {MENU_TYPE[child.menuType].short}
        </span>
      )}

      <GroupSelect
        value={parentId}
        options={child.menuType === "permission" ? permissionTargets : groups}
        onChange={(v) => onMove(child.id, v || null)}
        title="Pindahkan ke menu lain"
      />

      <EditLink id={child.id} />
      <DeleteButton
        onClick={() =>
          onDelete({ id: child.id, name: child.name, childCount: child.children.length })
        }
      />
    </div>
  )
}

/**
 * Menu hak akses di level 3.
 *
 * Tidak ikut drag & drop — urutannya tidak berpengaruh karena menu ini tidak
 * dirender di sidebar. Yang penting dia terlihat dan bisa dipindahkan, supaya
 * tidak "hilang" dari layar pengelolaan menu.
 */
function PermissionGrandChild({
  item,
  parentId,
  permissionTargets,
  onMove,
  onDelete,
}: {
  item: DraftChild
  parentId: string
  permissionTargets: { id: string; name: string }[]
  onMove: (itemId: string, targetParentId: string | null) => void
  onDelete: (item: { id: string; name: string; childCount: number }) => void
}) {
  return (
    <div className="flex items-center gap-2 pl-16 pr-3 py-2 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40">
      <span className="text-xs text-gray-300 dark:text-gray-600 flex-shrink-0">└</span>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
          {item.name}
        </p>
        <p className="text-xs text-gray-400 font-mono truncate">{item.path || "—"}</p>
      </div>

      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${MENU_TYPE.permission.cls}`}
        title={MENU_TYPE.permission.desc}
      >
        {MENU_TYPE.permission.short}
      </span>

      <GroupSelect
        value={parentId}
        options={permissionTargets}
        onChange={(v) => onMove(item.id, v || null)}
        title="Pindahkan ke menu lain"
      />

      <EditLink id={item.id} />
      <DeleteButton
        onClick={() => onDelete({ id: item.id, name: item.name, childCount: 0 })}
      />
    </div>
  )
}

function SortableParent({
  menu,
  index,
  allGroups,
  permissionTargets,
  onMove,
  onDelete,
  onChildrenChange,
}: {
  menu: DraftMenu
  index: number
  /** seluruh menu level atas; dipakai sebagai daftar grup tujuan */
  allGroups: { id: string; name: string }[]
  /** kandidat induk untuk menu hak akses — termasuk sub menu */
  permissionTargets: { id: string; name: string }[]
  onMove: (itemId: string, targetParentId: string | null) => void
  onDelete: (item: { id: string; name: string; childCount: number }) => void
  onChildrenChange: (children: DraftChild[]) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: menu.id })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleChildDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = menu.children.findIndex((c) => c.id === active.id)
    const newIndex = menu.children.findIndex((c) => c.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    onChildrenChange(arrayMove(menu.children, oldIndex, newIndex))
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-xl border ${
        isDragging
          ? "border-indigo-400 shadow-lg z-10 relative"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 dark:bg-gray-800/60 rounded-t-xl">
        <DragHandle listeners={listeners} attributes={attributes} />
        <span className="text-xs font-semibold text-gray-400 w-5 flex-shrink-0">
          {index + 1}
        </span>

        {menu.iconName && (
          <Icon icon={menu.iconName} width={16} height={16} className="text-gray-500 flex-shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {menu.name}
            {menu.status !== "active" && (
              <span className="ml-2 text-xs font-normal text-gray-400">(inactive)</span>
            )}
          </p>
          <p className="text-xs text-gray-400 font-mono truncate">{menu.path || "—"}</p>
        </div>

        {menu.menuType === "permission" && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${MENU_TYPE.permission.cls}`}
            title={MENU_TYPE.permission.desc}
          >
            {MENU_TYPE.permission.short}
          </span>
        )}

        {menu.children.some((c) => c.menuType !== "permission") ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex-shrink-0">
            grup · {menu.children.filter((c) => c.menuType !== "permission").length} sub menu
          </span>
        ) : (
          <GroupSelect
            value=""
            // Menu hak akses boleh menempel di sub menu juga, jadi daftar
            // tujuannya lebih luas daripada menu biasa
            options={(menu.menuType === "permission" ? permissionTargets : allGroups).filter(
              (g) => g.id !== menu.id
            )}
            onChange={(v) => onMove(menu.id, v || null)}
            title={
              menu.menuType === "permission"
                ? "Pindahkan ke menu lain"
                : "Masukkan ke dalam grup"
            }
          />
        )}

        <EditLink id={menu.id} />
        <DeleteButton
          onClick={() =>
            onDelete({ id: menu.id, name: menu.name, childCount: menu.children.length })
          }
        />
      </div>

      {menu.children.length > 0 && (
        <div className="p-2 space-y-2">
          {/* Konteks DnD terpisah per parent: sub menu hanya bisa diurutkan
              di dalam parent-nya sendiri, tidak lompat antar parent */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleChildDragEnd}
          >
            <SortableContext
              items={menu.children.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {menu.children.map((child, childIndex) => (
                <div key={child.id} className="space-y-2">
                  <SortableChild
                    child={child}
                    index={childIndex}
                    parentId={menu.id}
                    groups={allGroups}
                    permissionTargets={permissionTargets}
                    onMove={onMove}
                    onDelete={onDelete}
                  />

                  {child.children.map((grandChild) => (
                    <PermissionGrandChild
                      key={grandChild.id}
                      item={grandChild}
                      parentId={child.id}
                      permissionTargets={permissionTargets}
                      onMove={onMove}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}

// ─── Panel ───────────────────────────────────────────────────────────────────

interface MenuReorderPanelProps {
  menus: allMenuState[]
}

/**
 * Atur urutan menu sidebar dengan drag & drop.
 * Urutan disimpan sekaligus lewat PUT /menus/reorder (satu transaksi).
 */
export function MenuReorderPanel({ menus }: MenuReorderPanelProps) {
  const [draft, setDraft] = useState<DraftMenu[]>(() => toDraft(menus))
  const [baseline, setBaseline] = useState<string>(() => signature(toDraft(menus)))

  // sinkronkan saat data dari server berubah
  useEffect(() => {
    const next = toDraft(menus)
    setDraft(next)
    setBaseline(signature(next))
  }, [menus])

  const [toDelete, setToDelete] = useState<
    { id: string; name: string; childCount: number } | null
  >(null)

  const { mutate: saveOrder, isPending } = useReorderMenus()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const hasChanges = useMemo(() => signature(draft) !== baseline, [draft, baseline])
  const topLevelGroups = useMemo(() => topLevelOptions(draft), [draft])
  const permissionTargets = useMemo(() => permissionTargetOptions(draft), [draft])

  const handleParentDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = draft.findIndex((m) => m.id === active.id)
    const newIndex = draft.findIndex((m) => m.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    setDraft((prev) => arrayMove(prev, oldIndex, newIndex))
  }

  const handleMove = (itemId: string, targetParentId: string | null) => {
    setDraft((prev) => moveMenu(prev, itemId, targetParentId))
  }

  const handleReset = () => {
    const next = toDraft(menus)
    setDraft(next)
    setBaseline(signature(next))
  }

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
      {toDelete && (
        <DeleteMenuModal
          menuId={toDelete.id}
          menuName={toDelete.name}
          childCount={toDelete.childCount}
          onCancel={() => setToDelete(null)}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Urutan Menu Sidebar
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Geser untuk mengubah urutan. Gunakan dropdown di kanan tiap baris untuk
            memasukkan menu ke dalam grup atau mengeluarkannya. Menu yang sudah punya
            sub menu tidak bisa dijadikan sub menu.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {hasChanges && (
            <button
              onClick={handleReset}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => saveOrder({ menus: toPayload(draft) })}
            disabled={isPending || !hasChanges}
            className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Menyimpan..." : "Simpan Urutan"}
          </button>
        </div>
      </div>

      {hasChanges && (
        <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
          Urutan berubah tapi belum disimpan.
        </p>
      )}

      {draft.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-10">Belum ada menu</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleParentDragEnd}
        >
          <SortableContext
            items={draft.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {draft.map((menu, index) => (
                <SortableParent
                  key={menu.id}
                  menu={menu}
                  index={index}
                  allGroups={topLevelGroups}
                  permissionTargets={permissionTargets}
                  onMove={handleMove}
                  onDelete={setToDelete}
                  onChildrenChange={(children) =>
                    setDraft((prev) =>
                      prev.map((m) => (m.id === menu.id ? { ...m, children } : m))
                    )
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
