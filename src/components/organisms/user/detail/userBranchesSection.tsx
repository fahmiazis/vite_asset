import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useBranchList } from "../../../../hooks/query/branch/list"
import { useUserBranches } from "../../../../hooks/query/user/branches"
import { useUserHeldAssets } from "../../../../hooks/query/user/heldAssets"
import {
  useAddUserBranchAccess,
  useRemoveUserBranch,
  useSetUserHomebase,
} from "../../../../hooks/mutation/user/useUserBranches"
import type { UserBranchState } from "../../../../models/users/branches"

const spinner = (
  <div className="flex items-center justify-center py-8">
    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

// ─── Modal pilih cabang (dipakai ganti homebase & tambah akses) ──────────────

function BranchPickerModal({
  mode,
  userId,
  userBranches,
  initialSelected,
  onClose,
}: {
  mode: "homebase" | "access"
  userId: string
  userBranches: UserBranchState[]
  /** cabang yang langsung terpilih saat modal dibuka */
  initialSelected?: string
  onClose: () => void
}) {
  const { t } = useTranslation()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string[]>(initialSelected ? [initialSelected] : [])
  // aset yang dipegang tetap milik cabangnya; ganti homebase tidak ikut
  // memindahkan aset — diperingatkan supaya tidak mengira begitu
  const { total: heldAssetCount } = useUserHeldAssets(mode === "homebase" ? userId : "")

  const { data: branchData, isLoading } = useBranchList()
  const setHomebase = useSetUserHomebase(userId, onClose)
  const addAccess = useAddUserBranchAccess(userId, onClose)
  const isPending = setHomebase.isPending || addAccess.isPending

  const currentHomebase = userBranches.find((b) => b.membership_type === "homebase" && b.is_active)

  // homebase: semua cabang kecuali homebase aktif (baris assignment dinaikkan
  // backend jadi homebase). akses: cabang yang belum punya baris sama sekali —
  // UNIQUE (user_id, branch_id), dan homebase sudah otomatis punya akses.
  const candidates = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    const excluded =
      mode === "homebase"
        ? new Set(currentHomebase ? [currentHomebase.id] : [])
        : new Set(userBranches.map((b) => b.id))

    return (branchData?.data ?? [])
      .filter((b) => !excluded.has(b.id))
      .filter(
        (b) =>
          !keyword ||
          b.branch_code.toLowerCase().includes(keyword) ||
          b.branch_name.toLowerCase().includes(keyword),
      )
  }, [branchData, search, mode, userBranches, currentHomebase])

  const toggle = (branchId: string) => {
    if (mode === "homebase") return setSelected([branchId])
    setSelected((prev) =>
      prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId],
    )
  }

  const handleSubmit = () => {
    if (selected.length === 0) return
    if (mode === "homebase") setHomebase.mutate(selected[0])
    else addAccess.mutate(selected)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t(
              mode === "homebase"
                ? "userBranch.homebaseModal.title"
                : "userBranch.accessModal.title",
            )}
          </h3>
          {mode === "homebase" && currentHomebase && (
            <p className="text-xs text-gray-400 mt-1">
              {t("userBranch.homebaseModal.current", {
                code: currentHomebase.branch_code,
                name: currentHomebase.branch_name,
              })}
            </p>
          )}
        </div>

        <div className="px-5 py-4 space-y-3">
          <p
            className={`text-xs p-3 rounded-xl border ${
              mode === "homebase"
                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-amber-700 dark:text-amber-400"
                : "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400"
            }`}
          >
            {t(
              mode === "homebase"
                ? "userBranch.homebaseModal.notice"
                : "userBranch.accessModal.notice",
            )}
          </p>

          {mode === "homebase" && heldAssetCount > 0 && (
            <p className="text-xs p-3 rounded-xl border bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800 text-red-700 dark:text-red-400">
              {t("userBranch.homebaseModal.heldAssets", { count: heldAssetCount })}
            </p>
          )}

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("userBranch.searchBranch")}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
          />

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {isLoading ? (
              spinner
            ) : candidates.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">
                {t("userBranch.noBranchCandidate")}
              </p>
            ) : (
              candidates.map((branch) => {
                const existing = userBranches.find((b) => b.id === branch.id)
                return (
                  <label
                    key={branch.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <input
                      type={mode === "homebase" ? "radio" : "checkbox"}
                      name="user-branch-picker"
                      checked={selected.includes(branch.id)}
                      onChange={() => toggle(branch.id)}
                      disabled={isPending}
                      className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {branch.branch_name}
                      </span>
                      <span className="block text-xs text-gray-400 truncate">
                        {branch.branch_code}
                      </span>
                    </span>
                    {existing && <MembershipBadge branch={existing} />}
                    {branch.status !== "active" && (
                      <span className="text-xs text-gray-400 flex-shrink-0">{branch.status}</span>
                    )}
                  </label>
                )
              })
            )}
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {t("userBranch.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || selected.length === 0}
            className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? t("userBranch.saving")
              : mode === "homebase"
                ? t("userBranch.homebaseModal.submit")
                : t("userBranch.accessModal.submit", { count: selected.length })}
          </button>
        </div>
      </div>
    </div>
  )
}

export { BranchPickerModal }

// ─── Badge jenis keanggotaan ─────────────────────────────────────────────────

function MembershipBadge({ branch }: { branch: UserBranchState }) {
  const { t } = useTranslation()

  if (branch.membership_type === "homebase") {
    return branch.is_active ? (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        {t("userBranch.membership.homebaseActive")}
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 flex-shrink-0">
        {t("userBranch.membership.homebaseInactive")}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex-shrink-0">
      {t(`userBranch.membership.${branch.membership_type}`)}
    </span>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

interface UserBranchesSectionProps {
  userId: string
  className?: string
  /** halaman profil: hanya daftar, tanpa tambah/ubah/lepas */
  readOnly?: boolean
}

/**
 * Seluruh cabang user (user_branchs): homebase aktif, homebase lama yang
 * nonaktif, dan akses cabang tambahan. Bisa ganti homebase, tambah akses,
 * dan lepas dari sini.
 */
export default function UserBranchesSection({
  userId,
  className = "",
  readOnly = false,
}: UserBranchesSectionProps) {
  const { t } = useTranslation()
  const { branches, isLoading } = useUserBranches(userId)
  const [showAdd, setShowAdd] = useState(false)
  const [toRemove, setToRemove] = useState<UserBranchState | null>(null)

  const [promote, setPromote] = useState<string | null>(null)
  const remove = useRemoveUserBranch(userId, () => setToRemove(null))

  // homebase aktif di atas, lalu homebase lama, lalu akses
  const sorted = useMemo(() => {
    const rank = (b: UserBranchState) =>
      b.membership_type === "homebase" ? (b.is_active ? 0 : 1) : 2
    return [...branches].sort(
      (a, b) => rank(a) - rank(b) || a.branch_code.localeCompare(b.branch_code),
    )
  }, [branches])

  return (
    <div
      className={`bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 ${className}`}
    >
      {showAdd && (
        <BranchPickerModal
          mode="access"
          userId={userId}
          userBranches={branches}
          onClose={() => setShowAdd(false)}
        />
      )}

      {promote && (
        <BranchPickerModal
          mode="homebase"
          userId={userId}
          userBranches={branches}
          initialSelected={promote}
          onClose={() => setPromote(null)}
        />
      )}

      {toRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
              {t("userBranch.removeModal.title")}
            </h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
              {t("userBranch.removeModal.description", {
                code: toRemove.branch_code,
                name: toRemove.branch_name,
              })}
              {toRemove.membership_type === "homebase" && toRemove.is_active && (
                <span className="block mt-2 text-amber-600 dark:text-amber-400">
                  {t("userBranch.removeModal.activeHomebase")}
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setToRemove(null)}
                disabled={remove.isPending}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {t("userBranch.cancel")}
              </button>
              <button
                onClick={() =>
                  remove.mutate({
                    branchId: toRemove.id,
                    membership: toRemove.membership_type,
                  })
                }
                disabled={remove.isPending}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {remove.isPending ? t("userBranch.saving") : t("userBranch.removeModal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {t("userBranch.title")}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{t("userBranch.subtitle")}</p>
        </div>

        {!readOnly && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("userBranch.addAccess")}
          </button>
        )}
      </div>

      {isLoading ? (
        spinner
      ) : sorted.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-10">{t("userBranch.empty")}</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">{t("userBranch.count", { count: sorted.length })}</p>

          {sorted.map((branch) => {
            const isActiveHomebase = branch.membership_type === "homebase" && branch.is_active
            return (
              <div
                key={branch.id}
                className="flex flex-wrap items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {branch.branch_name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{branch.branch_code}</p>
                </div>

                <MembershipBadge branch={branch} />

                {!readOnly && !isActiveHomebase && (
                  <button
                    onClick={() => setPromote(branch.id)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 underline underline-offset-2 flex-shrink-0"
                  >
                    {t("userBranch.makeHomebase")}
                  </button>
                )}

                {!readOnly && (
                  <>
                    <Link
                      to={`/dashboard/branch/${branch.id}`}
                      className="text-xs text-indigo-600 hover:text-indigo-700 underline underline-offset-2 flex-shrink-0"
                    >
                      {t("userBranch.detail")}
                    </Link>

                    <button
                      onClick={() => setToRemove(branch)}
                      className="flex items-center justify-center w-7 h-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex-shrink-0"
                      title={t("userBranch.removeModal.title")}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
