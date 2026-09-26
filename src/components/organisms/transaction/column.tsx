import type { ColumnDef } from "@tanstack/react-table"
import { formatStage } from "../../../utils/stage"
import { useNavigate } from "react-router-dom"
import type { transactionListState } from "../../../models/transaction/list"
import { RevisionBadge } from "../common/revisionBadge"
import { useState } from "react"
import { useMyProfile } from "../../../hooks/query/auth/myProfile"
import { useDeleteProcurement } from "../../../hooks/mutation/transaction/delete"
import { useTranslation } from "react-i18next"

// --- Avatar ---
function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
  const colors = ["bg-blue-400", "bg-green-400", "bg-orange-400", "bg-purple-400", "bg-rose-400"]
  const color = colors[initials.charCodeAt(0) % colors.length]
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${color}`}>
        {initials}
      </div>
      <p className="text-sm font-medium leading-tight text-gray-800 dark:text-gray-200">{name}</p>
    </div>
  )
}

// --- Delete Modal ---
function DeleteModal({ id, onConfirm, onCancel, isLoading }: {
  id: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}) {
  const { t } = useTranslation()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
          {t("transaksiColumn.deleteModal.title")}
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t("transaksiColumn.deleteModal.desc")}
          <span className="block font-mono font-semibold text-gray-700 dark:text-gray-200 break-all mt-1">{id}</span>
          <span className="block mt-1">{t("transaksiColumn.deleteModal.warning")}</span>
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {t("transaksiColumn.deleteModal.cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? t("transaksiColumn.deleteModal.deleting") : t("transaksiColumn.deleteModal.confirm")}
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Action Buttons ---
/**
 * Ubah & hapus hanya untuk transaksi DRAFT milik sendiri — aturannya sama
 * persis dengan backend (services.UpdateProcurement & DeleteProcurement:
 * "can only update DRAFT transactions" dan "you can only update your own
 * transactions").
 *
 * Sebelumnya kedua tombol selalu tampil: prop `status` diterima tapi tidak
 * pernah dipakai, jadi user baru tahu tidak boleh setelah ditolak server.
 */
function ActionButtons({
  id,
  currentStage,
  createdBy,
}: {
  id: string
  currentStage: string
  createdBy: string
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { data: profile } = useMyProfile()
  const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteProcurement({
    onSuccess: () => setShowDeleteModal(false),
  })

  const isDraft = currentStage?.toUpperCase() === "DRAFT"
  const isOwner = !!profile?.data?.id && profile.data.id === createdBy
  const canModify = isDraft && isOwner

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => navigate(`/dashboard/procurement/${id}`)}
          className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {t("transaksiColumn.actions.detail")}
        </button>
        {canModify && (
          <>
            <button
              onClick={() => navigate(`/dashboard/procurement/update/${id}`)}
              className="px-3 py-1 text-xs font-medium border border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              {t("transaksiColumn.actions.edit")}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-1 text-xs font-medium border border-red-400 dark:border-red-500 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              {t("transaksiColumn.actions.delete")}
            </button>
          </>
        )}
      </div>
      {showDeleteModal && (
        <DeleteModal
          id={id}
          isLoading={isDeleting}
          onConfirm={() => deleteTransaction(id)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  )
}

// --- Columns ---
// Header kolom pakai fungsi agar bisa akses hook
function HeaderCell({ labelKey }: { labelKey: string }) {
  const { t } = useTranslation()
  return <>{t(labelKey)}</>
}

export const transaksiColumns: ColumnDef<transactionListState>[] = [
  {
    accessorKey: "transaction.transaction_number",
    id: "transaction_number",
    header: () => <HeaderCell labelKey="transaksiColumn.headers.transactionNo" />,
    cell: ({ row }) => (
      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono leading-tight">
        {row.original.transaction.transaction_number}
      </div>
    ),
  },
  {
    id: "item_name",
    header: () => <HeaderCell labelKey="transaksiColumn.headers.itemName" />,
    cell: ({ row }) => {
      const { t } = useTranslation()
      const items = row.original.items
      return (
        <div>
          <p className="text-sm font-semibold leading-tight text-gray-800 dark:text-gray-200">
            {items[0]?.item_name ?? "-"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {items[0]?.category_name ?? "-"}
            {items.length > 1 && (
              <span className="ml-1 text-blue-500 dark:text-blue-400">
                {t("transaksiColumn.moreItems", { count: items.length - 1 })}
              </span>
            )}
          </p>
        </div>
      )
    },
  },
  {
    id: "created_by",
    header: () => <HeaderCell labelKey="transaksiColumn.headers.createdBy" />,
    cell: ({ row }) => (
      <Avatar name={row.original.transaction.created_by_name ?? row.original.transaction.created_by} />
    ),
  },
  {
    id: "transaction_date",
    header: () => <HeaderCell labelKey="transaksiColumn.headers.transactionDate" />,
    cell: ({ row }) => {
      const date = new Date(row.original.transaction.transaction_date)
      return (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      )
    },
  },
  {
    id: "qty",
    header: () => <HeaderCell labelKey="transaksiColumn.headers.qty" />,
    cell: ({ row }) => {
      const { t } = useTranslation()
      const totalQty = row.original.items.reduce((sum, item) => sum + item.quantity, 0)
      return (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{totalQty}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{t("transaksiColumn.unit")}</p>
        </div>
      )
    },
  },
  {
    id: "total_price",
    header: () => <HeaderCell labelKey="transaksiColumn.headers.totalValue" />,
    cell: ({ row }) => {
      const total = row.original.items.reduce((sum, item) => sum + item.total_price, 0)
      return (
        <span className="text-sm font-semibold tabular-nums text-gray-800 dark:text-gray-200">
          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(total)}
        </span>
      )
    },
  },
  {
    // Stage, bukan status. Status ikut turunan stage dan sering terbaca sama
    // ("Draft" di dua kolom sekaligus), jadi yang ditampilkan cukup posisinya
    // di alur.
    id: "current_stage",
    header: () => <HeaderCell labelKey="transaksiColumn.headers.stage" />,
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        <span className="text-xs text-gray-700 dark:text-gray-300">
          {formatStage(row.original.transaction.current_stage)}
        </span>
        <RevisionBadge show={row.original.transaction.needs_revision} />
      </div>
    ),
  },
  {
    id: "action",
    header: () => <HeaderCell labelKey="transaksiColumn.headers.action" />,
    cell: ({ row }) => (
      <ActionButtons
        id={row.original.transaction.transaction_number}
        currentStage={row.original.transaction.current_stage}
        createdBy={row.original.transaction.created_by}
      />
    ),
  },
]