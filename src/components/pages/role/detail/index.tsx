import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import Head from "../../../molecules/head"
import { useRoleDetail } from "../../../../hooks/query/role/detail"
import { useRoleMenus } from "../../../../hooks/query/role/roleMenus"
import { useMenuList } from "../../../../hooks/query/menu/list"
import { usePermissionCatalog } from "../../../../hooks/query/menu/permissionCatalog"
import { useUpdateRole } from "../../../../hooks/mutation/role/useUpdateRole"
import { useDeleteRole } from "../../../../hooks/mutation/role/useDeleteRole"
import { useAssignMenus } from "../../../../hooks/mutation/menu/useAssignMenus"
import {
  PermissionMatrix,
  type PermissionSelection,
} from "../../../organisms/role/permissionMatrix"
import type { RoleMenuState } from "../../../../models/roles/roleMenus"

/** Ratakan pohon role menus jadi map menuId → permissions */
function flattenRoleMenus(menus: RoleMenuState[]): PermissionSelection {
  const result: PermissionSelection = {}

  const walk = (items: RoleMenuState[]) => {
    items.forEach((item) => {
      if (item.permissions?.length) {
        result[item.id] = item.permissions
      }
      if (item.children?.length) walk(item.children)
    })
  }

  walk(menus)
  return result
}

function DeleteRoleModal({
  roleName,
  isPending,
  onConfirm,
  onCancel,
}: {
  roleName: string
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 mx-auto mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
          Hapus role
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Role <span className="font-medium text-gray-700 dark:text-gray-300">"{roleName}"</span>{" "}
          akan dihapus permanen. User yang memakai role ini akan kehilangan akses yang
          diberikan lewat role tersebut.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RoleDetailPage() {
  const { id = "" } = useParams()
  const navigate = useNavigate()

  const { data: roleData, isLoading: loadingRole } = useRoleDetail(id)
  const { data: roleMenusData, isLoading: loadingRoleMenus } = useRoleMenus(id)
  const { data: menuListData, isLoading: loadingMenus } = useMenuList()
  const { data: catalogData, isLoading: loadingCatalog } = usePermissionCatalog()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selection, setSelection] = useState<PermissionSelection>({})
  const [baseline, setBaseline] = useState<PermissionSelection>({})
  const [showDelete, setShowDelete] = useState(false)

  const role = roleData?.data

  // isi form dari data role
  useEffect(() => {
    if (role) {
      setName(role.name)
      setDescription(role.description ?? "")
    }
  }, [role])

  // isi matriks dari hak akses yang sudah ada
  useEffect(() => {
    if (roleMenusData?.data) {
      const flat = flattenRoleMenus(roleMenusData.data)
      setSelection(flat)
      setBaseline(flat)
    }
  }, [roleMenusData])

  const { mutate: updateRole, isPending: updatingRole } = useUpdateRole({ roleId: id })
  const { mutate: deleteRole, isPending: deletingRole } = useDeleteRole({
    onSuccess: () => navigate("/dashboard/role"),
  })
  const { mutate: assignMenus, isPending: savingAccess } = useAssignMenus({
    roleId: id,
    redirectOnSuccess: false,
    onSuccess: () => setBaseline(selection),
  })

  const isLoading = loadingRole || loadingRoleMenus || loadingMenus || loadingCatalog

  const accessChanged = useMemo(
    () => JSON.stringify(selection) !== JSON.stringify(baseline),
    [selection, baseline]
  )
  const profileChanged =
    !!role && (name !== role.name || description !== (role.description ?? ""))

  const totalMenusWithAccess = Object.keys(selection).length

  // Penyimpanan bersifat replace-all: menu yang hilang dari selection akan
  // dicabut aksesnya. Ditampilkan eksplisit supaya tidak ada yang tercabut diam-diam.
  const willBeRevoked = useMemo(
    () => Object.keys(baseline).filter((menuId) => !(selection[menuId]?.length)),
    [baseline, selection]
  )

  const menuNameById = useMemo(() => {
    const map: Record<string, string> = {}
    const walk = (items: { id: string; name: string; children?: any[] }[]) => {
      items.forEach((m) => {
        map[m.id] = m.name
        if (m.children?.length) walk(m.children)
      })
    }
    walk(menuListData?.data ?? [])
    return map
  }, [menuListData])

  // ratakan semua permission dari tiap module, dipakai untuk label & deskripsi
  const allPermissions = useMemo(
    () => (catalogData?.data.groups ?? []).flatMap((group) => group.permissions),
    [catalogData]
  )

  const handleSaveProfile = () => {
    if (!name.trim()) return toast.error("Nama role wajib diisi")
    updateRole({ name: name.trim(), description: description.trim() })
  }

  const handleSaveAccess = () => {
    const menus = Object.entries(selection).map(([menu_id, permissions]) => ({
      menu_id,
      permissions,
    }))

    assignMenus({ menus })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
      </div>
    )
  }

  if (!role) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-gray-400">Role tidak ditemukan</p>
        <button
          onClick={() => navigate("/dashboard/role")}
          className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
        >
          Kembali ke daftar role
        </button>
      </div>
    )
  }

  const inputClass =
    "w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 disabled:opacity-50"

  return (
    <section className="space-y-4">
      {showDelete && (
        <DeleteRoleModal
          roleName={role.name}
          isPending={deletingRole}
          onConfirm={() => deleteRole(id)}
          onCancel={() => setShowDelete(false)}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <Head label={`Role — ${role.name}`} />
        <button
          onClick={() => setShowDelete(true)}
          className="px-4 py-2 text-sm font-medium border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
        >
          Hapus role
        </button>
      </div>

      {/* Profil role */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Informasi Role</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
              Nama role <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updatingRole}
              className={inputClass}
              placeholder="admin, manager, staff..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
              Deskripsi
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={updatingRole}
              className={inputClass}
              placeholder="Penjelasan singkat peran ini"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={updatingRole || !profileChanged}
            className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updatingRole ? "Menyimpan..." : "Simpan Informasi"}
          </button>
        </div>
      </div>

      {/* Hak akses per menu */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Hak Akses per Menu
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Pilihan hak akses tiap menu mengikuti tabel{" "}
              <span className="font-mono">menu_permissions</span>. Menu tanpa centang
              akan dicabut aksesnya saat disimpan. {totalMenusWithAccess} menu punya akses.
            </p>
          </div>

          <button
            onClick={handleSaveAccess}
            disabled={savingAccess || !accessChanged}
            className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {savingAccess ? "Menyimpan..." : "Simpan Hak Akses"}
          </button>
        </div>

        {accessChanged && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
            Ada perubahan yang belum disimpan.
          </p>
        )}

        {willBeRevoked.length > 0 && (
          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 rounded-lg">
            <p className="font-medium">
              {willBeRevoked.length} menu akan kehilangan akses saat disimpan:
            </p>
            <p className="mt-1">
              {willBeRevoked
                .map((id) => menuNameById[id] ?? id)
                .join(", ")}
            </p>
          </div>
        )}

        <PermissionMatrix
          menus={menuListData?.data ?? []}
          allPermissions={allPermissions}
          menuOptions={catalogData?.data.menus ?? []}
          value={selection}
          onChange={setSelection}
        />
      </div>
    </section>
  )
}
