import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useRoleList } from "../../../../hooks/query/role/list"
import { useAssignRoles } from "../../../../hooks/mutation/user/useAssignRoles"
import type { DetailuserState } from "../../../../models/users/detail"

interface RoleAssignmentSectionProps {
  user?: DetailuserState
  className?: string
}

/**
 * Atur role yang dimiliki user (POST /users/:id/roles).
 * Backend mewajibkan minimal satu role — user tanpa role akan ditolak
 * semua endpoint ber-permission.
 */
export default function RoleAssignmentSection({
  user,
  className = "",
}: RoleAssignmentSectionProps) {
  const { data: roleListData, isLoading: loadingRoles } = useRoleList()

  const assignedIds = useMemo(
    () => (user?.roles ?? []).map((role) => role.id),
    [user]
  )

  const [selected, setSelected] = useState<string[]>(assignedIds)

  useEffect(() => {
    setSelected(assignedIds)
  }, [assignedIds])

  const { mutate: assignRoles, isPending } = useAssignRoles({
    userId: user?.id ?? "",
  })

  const changed = useMemo(() => {
    const a = [...selected].sort().join(",")
    const b = [...assignedIds].sort().join(",")
    return a !== b
  }, [selected, assignedIds])

  const toggle = (roleId: string) => {
    setSelected((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    )
  }

  const handleSave = () => {
    if (selected.length === 0) {
      return toast.error("Pilih minimal satu role")
    }
    assignRoles({ role_ids: selected })
  }

  const roles = roleListData?.data ?? []

  return (
    <div
      className={`bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Role User
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Hak akses user mengikuti gabungan permission dari semua role yang dipilih
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending || !changed || !user}
          className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {isPending ? "Menyimpan..." : "Simpan Role"}
        </button>
      </div>

      {changed && (
        <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg mb-3">
          Ada perubahan role yang belum disimpan.
        </p>
      )}

      {selected.length === 0 && (
        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg mb-3">
          Minimal satu role harus dipilih.
        </p>
      )}

      {loadingRoles ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : roles.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-6">Belum ada role</p>
      ) : (
        <div className="space-y-2">
          {roles.map((role) => (
            <label
              key={role.id}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.includes(role.id)}
                onChange={() => toggle(role.id)}
                disabled={isPending}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                  {role.name}
                </span>
                {role.description && (
                  <span className="block text-xs text-gray-400">{role.description}</span>
                )}
              </span>
              <Link
                to={`/dashboard/role/${role.id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-indigo-600 hover:text-indigo-700 underline underline-offset-2 flex-shrink-0 mt-0.5"
              >
                Hak akses
              </Link>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
