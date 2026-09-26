import type { ColumnDef } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import type { DisposalAsset } from "../../../models/disposal/detail"
import type { disposalListState } from "../../../models/disposal/list"
import {
  disposalStageLabel,
  disposalTypeLabel,
  formatRupiah,
  isSell,
} from "../../../utils/disposalStage"

// --- Helpers ---
function formatDate(value: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// --- Disposal Type Badge ---
function DisposalTypeBadge({ value }: { value: string }) {
  const cls = isSell(value)
    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    : "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {disposalTypeLabel(value)}
    </span>
  )
}

// --- Revision Badge ---
/**
 * Transaksi yang dikembalikan approver untuk diperbaiki kembali ke DRAFT, jadi
 * di daftar tampilannya sama persis dengan draft biasa. Tanpa penanda ini
 * pengaju tidak punya cara tahu ada yang harus dikerjakan.
 */
function RevisionBadge({ assets }: { assets: DisposalAsset[] }) {
  const { t } = useTranslation()
  const marked = assets.filter(
    (asset) => asset.needs_revision && asset.status === "PENDING"
  )
  if (marked.length === 0) return null

  // catatan approver ditaruh di tooltip supaya baris tabel tidak melebar
  const notes = marked
    .map((asset) => asset.revision_notes)
    .filter(Boolean)
    .join(" · ")

  return (
    <span
      title={notes || undefined}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 whitespace-nowrap"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      {t("disposalList.needsRevision", { count: marked.length })}
    </span>
  )
}

// --- Action Buttons ---
function ActionButtons({ id }: { id: string }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => navigate(`/dashboard/disposal/${id}`)}
        className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
      >
        Detail
      </button>
    </div>
  )
}

export const disposalColumns: ColumnDef<disposalListState>[] = [
  {
    accessorFn: (row) => row.transaction.transaction_number,
    id: "transaction_number",
    header: "NO. TRANSAKSI",
    cell: ({ row }) => (
      <div className="text-xs text-gray1 font-mono leading-tight whitespace-nowrap">
        {row.original.transaction.transaction_number}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.transaction.transaction_date,
    id: "transaction_date",
    header: "TGL TRANSAKSI",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap">
        {formatDate(row.original.transaction.transaction_date)}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.transaction.disposal_type,
    id: "disposal_type",
    header: "TIPE DISPOSAL",
    cell: ({ row }) => (
      <DisposalTypeBadge value={row.original.transaction.disposal_type} />
    ),
  },
  // {
  //   accessorFn: (row) => row.transaction.status,
  //   id: "status",
  //   header: "STATUS",
  //   cell: ({ row }) => (
  //     <StatusBadge value={row.original.transaction.status} />
  //   ),
  // },
  {
    accessorFn: (row) => row.transaction.current_stage,
    id: "current_stage",
    header: "STAGE",
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-1">
        <span className="text-xs text-gray1">
          {disposalStageLabel(row.original.transaction.current_stage)}
        </span>
        <RevisionBadge assets={row.original.assets} />
      </div>
    ),
  },
  {
    accessorFn: (row) => row.transaction.sale_value,
    id: "sale_value",
    header: "NILAI JUAL",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap">
        {row.original.transaction.sale_value != null
          ? formatRupiah(row.original.transaction.sale_value)
          : "-"}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.transaction.notes,
    id: "notes",
    header: "CATATAN",
    cell: ({ row }) => (
      <span className="text-sm text-gray1 max-w-[200px] truncate block">
        {row.original.transaction.notes || "-"}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.transaction.created_by_name ?? row.transaction.created_by,
    id: "created_by",
    header: "DIBUAT OLEH",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.transaction.created_by_name ?? row.original.transaction.created_by ?? "-"}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.transaction.created_at,
    id: "created_at",
    header: "TGL DIBUAT",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap">
        {formatDate(row.original.transaction.created_at)}
      </span>
    ),
  },
  {
    id: "aksi",
    header: "AKSI",
    cell: ({ row }) => <ActionButtons id={row.original.transaction.transaction_number} />,
  },
]