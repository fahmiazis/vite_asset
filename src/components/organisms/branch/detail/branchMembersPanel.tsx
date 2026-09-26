import { useMemo, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useUserList } from "../../../../hooks/query/user/list"
import { useBranchMembers } from "../../../../hooks/query/branch/members"
import {
  useAssignBranchMembers,
  useRemoveBranchMember,
} from "../../../../hooks/mutation/branch/useBranchMembers"
import type {
  BranchMemberState,
  BranchMemberVariant,
} from "../../../../models/branch/members"

// ─── Teks per varian ─────────────────────────────────────────────────────────

interface VariantCopy {
  title: string
  description: string
  addButton: string
  modalTitle: string
  modalNotice: ReactNode
  noticeTone: "amber" | "indigo"
  emptyText: string
  submitLabel: (count: number) => string
  removeTitle: string
  removeDescription: (user: BranchMemberState) => ReactNode
}

const COPY: Record<BranchMemberVariant, VariantCopy> = {
  homebase: {
    title: "Anggota Homebase",
    description:
      "User yang menjadikan cabang ini sebagai homebase. Nomor transaksi mereka memakai kode cabang ini.",
    addButton: "Tambah User",
    modalTitle: "Tambah Anggota Homebase",
    modalNotice: (
      <>
        Cabang ini akan jadi homebase <span className="font-medium">aktif</span> user
        terpilih. Homebase lama mereka tidak dihapus, hanya dinonaktifkan.
      </>
    ),
    noticeTone: "amber",
    emptyText: "Belum ada user yang berhomebase di cabang ini",
    submitLabel: (count) => `Set Homebase (${count})`,
    removeTitle: "Lepas dari homebase",
    removeDescription: (user) => (
      <>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {user.fullname}
        </span>{" "}
        tidak lagi berhomebase di cabang ini.
        {user.is_active && (
          <span className="block mt-2 text-amber-600 dark:text-amber-400">
            Ini homebase aktifnya — setelah dilepas, user tidak punya homebase aktif
            sampai diatur ulang.
          </span>
        )}
      </>
    ),
  },
  assignment: {
    title: "Akses Cabang",
    description:
      "User yang diberi akses ke transaksi cabang ini tanpa menjadikannya homebase. Satu user boleh punya akses ke banyak cabang.",
    addButton: "Tambah Akses",
    modalTitle: "Beri Akses Cabang",
    modalNotice: (
      <>
        Akses ini <span className="font-medium">tidak mengubah homebase</span> user.
        Homebase mereka dan kode cabang pada nomor transaksinya tetap seperti semula.
      </>
    ),
    noticeTone: "indigo",
    emptyText: "Belum ada user yang diberi akses ke cabang ini",
    submitLabel: (count) => `Beri Akses (${count})`,
    removeTitle: "Cabut akses cabang",
    removeDescription: (user) => (
      <>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {user.fullname}
        </span>{" "}
        tidak lagi punya akses ke transaksi cabang ini. Homebase-nya tidak
        terpengaruh.
      </>
    ),
  },
}

// ─── Modal pilih user ────────────────────────────────────────────────────────

function AddMembersModal({
  branchId,
  branchName,
  variant,
  excludeIds,
  onClose,
}: {
  branchId: string
  branchName: string
  variant: BranchMemberVariant
  excludeIds: string[]
  onClose: () => void
}) {
  const copy = COPY[variant]
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string[]>([])

  const { data: userListData, isLoading } = useUserList()
  const { mutate: assign, isPending } = useAssignBranchMembers({
    branchId,
    variant,
    onSuccess: onClose,
  })

  const candidates = useMemo(() => {
    const users = userListData?.data ?? []
    const keyword = search.trim().toLowerCase()

    return users
      .filter((user) => !excludeIds.includes(user.id))
      .filter((user) => {
        if (!keyword) return true
        return (
          user.fullname?.toLowerCase().includes(keyword) ||
          user.username?.toLowerCase().includes(keyword) ||
          user.email?.toLowerCase().includes(keyword)
        )
      })
  }, [userListData, search, excludeIds])

  const allVisibleSelected =
    candidates.length > 0 && candidates.every((u) => selected.includes(u.id))

  const toggle = (userId: string) => {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const toggleAllVisible = () => {
    const visibleIds = candidates.map((u) => u.id)
    setSelected((prev) =>
      allVisibleSelected
        ? prev.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...prev, ...visibleIds]))
    )
  }

  const handleSubmit = () => {
    if (selected.length === 0) return toast.error("Pilih minimal satu user")
    assign({ user_ids: selected })
  }

  const noticeClass =
    copy.noticeTone === "amber"
      ? "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-amber-700 dark:text-amber-400"
      : "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {copy.modalTitle}
            </h3>
            <p className="text-xs text-gray-400 mt-1 truncate">{branchName}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          <div className={`flex items-start gap-3 p-3 rounded-xl border ${noticeClass}`}>
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs">{copy.modalNotice}</p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, username, atau email..."
            className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {selected.length} dipilih dari {candidates.length} user
            </span>
            {candidates.length > 0 && (
              <button
                type="button"
                onClick={toggleAllVisible}
                className="text-xs text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
              >
                {allVisibleSelected ? "Hapus semua pilihan" : "Pilih semua yang tampil"}
              </button>
            )}
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : candidates.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">
                {search ? "Tidak ada user yang cocok" : "Semua user sudah terdaftar di cabang ini"}
              </p>
            ) : (
              candidates.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(user.id)}
                    onChange={() => toggle(user.id)}
                    disabled={isPending}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {user.fullname}
                    </span>
                    <span className="block text-xs text-gray-400 truncate">
                      {user.username} · {user.email}
                    </span>
                  </span>
                  {user.status !== "active" && (
                    <span className="text-xs text-gray-400 flex-shrink-0">inactive</span>
                  )}
                </label>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || selected.length === 0}
            className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Menyimpan..." : copy.submitLabel(selected.length)}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Konfirmasi lepas user ───────────────────────────────────────────────────

function RemoveMemberModal({
  user,
  variant,
  isPending,
  onConfirm,
  onCancel,
}: {
  user: BranchMemberState
  variant: BranchMemberVariant
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const copy = COPY[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
          {copy.removeTitle}
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          {copy.removeDescription(user)}
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
            {isPending ? "Memproses..." : "Lepas"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Panel ───────────────────────────────────────────────────────────────────

interface BranchMembersPanelProps {
  branchId: string
  branchName: string
  variant: BranchMemberVariant
  className?: string
}

/**
 * Daftar user pada sebuah cabang. Dipakai dua kali di halaman detail branch:
 * varian "homebase" (satu homebase aktif per user) dan varian "assignment"
 * (akses tambahan, satu user boleh di banyak cabang).
 */
export function BranchMembersPanel({
  branchId,
  branchName,
  variant,
  className = "",
}: BranchMembersPanelProps) {
  const copy = COPY[variant]
  const [showAdd, setShowAdd] = useState(false)
  const [toRemove, setToRemove] = useState<BranchMemberState | null>(null)

  const { data, isLoading } = useBranchMembers(branchId, variant)
  // daftar seberang dipakai untuk menentukan siapa yang tidak boleh dipilih;
  // react-query men-dedupe request-nya dengan panel satunya
  const { data: otherData } = useBranchMembers(
    branchId,
    variant === "homebase" ? "assignment" : "homebase"
  )

  const { mutate: removeMember, isPending: removing } = useRemoveBranchMember({
    branchId,
    variant,
    onSuccess: () => setToRemove(null),
  })

  const members = data?.data ?? []
  const otherMembers = otherData?.data ?? []

  // user_branchs punya UNIQUE (user_id, branch_id) — satu user hanya boleh
  // punya satu baris per cabang.
  //
  // - homebase: anggota assignment boleh dipilih, backend menaikkan tipenya
  //   jadi homebase, jadi cukup kecualikan anggota homebase saat ini.
  // - assignment: anggota homebase sudah otomatis punya akses dan akan
  //   dilewati backend, jadi keduanya dikecualikan.
  const excludeIds = useMemo(() => {
    const own = members.map((m) => m.id)
    if (variant === "homebase") return own
    return [...own, ...otherMembers.map((m) => m.id)]
  }, [members, otherMembers, variant])

  return (
    <div
      className={`bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 ${className}`}
    >
      {showAdd && (
        <AddMembersModal
          branchId={branchId}
          branchName={branchName}
          variant={variant}
          excludeIds={excludeIds}
          onClose={() => setShowAdd(false)}
        />
      )}
      {toRemove && (
        <RemoveMemberModal
          user={toRemove}
          variant={variant}
          isPending={removing}
          onConfirm={() => removeMember(toRemove.id)}
          onCancel={() => setToRemove(null)}
        />
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {copy.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{copy.description}</p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {copy.addButton}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-10">{copy.emptyText}</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">{members.length} user</p>

          {members.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {user.fullname}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.username} · {user.email}
                </p>
              </div>

              {variant === "homebase" ? (
                user.is_active ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Aktif
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 flex-shrink-0"
                    title="User ini punya homebase aktif di cabang lain"
                  >
                    Tidak aktif
                  </span>
                )
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex-shrink-0">
                  {user.branch_type === "temporary" ? "Sementara" : "Assignment"}
                </span>
              )}

              <Link
                to={`/dashboard/user/${user.id}`}
                className="text-xs text-indigo-600 hover:text-indigo-700 underline underline-offset-2 flex-shrink-0"
              >
                Detail
              </Link>

              <button
                onClick={() => setToRemove(user)}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex-shrink-0"
                title={copy.removeTitle}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
