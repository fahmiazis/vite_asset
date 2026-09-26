import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { listAssetsState } from "../../../models/asset/list";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

// --- Badge Asset Status ---
function AssetStatusBadge({ value }: { value: string }) {
  // Semua nilai di constans/asset.ts. Dulu hanya empat status yang dikenal,
  // sehingga AVAILABLE (mayoritas aset) jatuh ke gaya "inactive" abu-abu.
  const map: Record<string, { dot: string; bg: string }> = {
    available:       { dot: "bg-green-500",  bg: "bg-green-50 text-green-700" },
    active:          { dot: "bg-green-500",  bg: "bg-green-50 text-green-700" },
    pending_receipt: { dot: "bg-sky-500",    bg: "bg-sky-50 text-sky-700" },
    in_mutation:     { dot: "bg-blue-500",   bg: "bg-blue-50 text-blue-700" },
    in_disposal:     { dot: "bg-orange-500", bg: "bg-orange-50 text-orange-700" },
    in_handover:     { dot: "bg-teal-500",   bg: "bg-teal-50 text-teal-700" },
    maintenance:     { dot: "bg-yellow-400", bg: "bg-yellow-50 text-yellow-700" },
    inactive:        { dot: "bg-gray-400",   bg: "bg-gray-100 text-gray-600" },
    retired:         { dot: "bg-gray-500",   bg: "bg-gray-100 text-gray-700" },
    disposed:        { dot: "bg-red-500",    bg: "bg-red-50 text-red-600" },
  }
  const s = map[value?.toLowerCase()] ?? map["inactive"]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {value ?? "-"}
    </span>
  )
}

// --- Action Buttons ---
function ActionButtons({ id }: { id: string }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => navigate(`/dashboard/asset/${id}`)}
        className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
      >
        Detail
      </button>
    </div>
  )
}

export const assetsColumns: ColumnDef<listAssetsState>[] = [
  {
    accessorKey: "asset_number",
    header: "NO. ASET",
    cell: ({ row }) => (
      <div className="text-xs text-gray1 font-mono leading-tight whitespace-nowrap">
        {row.getValue("asset_number")}
      </div>
    ),
  },
  {
    accessorKey: "asset_name",
    header: "NAMA ASET",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-semibold leading-tight">{row.getValue("asset_name")}</p>
        <p className="text-xs text-gray1 mt-0.5">{row.original.category_name}</p>
      </div>
    ),
  },
  {
    accessorKey: "branch_code",
    header: "CABANG",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("branch_code") ?? "-"}</span>
    ),
  },
  {
    // pemegang hasil serah terima aset; kosong = dipegang cabang
    accessorKey: "assigned_user_name",
    header: "PEMEGANG",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.assigned_user_name ?? "-"}</span>
    ),
  },
  {
    accessorKey: "io_number",
    header: "NO. IO",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-gray1">{row.getValue("io_number") ?? "-"}</span>
    ),
  },
  {
    accessorKey: "current_value",
    header: "NILAI BUKU",
    cell: ({ row }) => {
      const cv = row.original.current_value
      return (
        <div>
          <p className="text-sm font-semibold tabular-nums whitespace-nowrap">
            {cv?.book_value != null ? formatRupiah(cv.book_value) : "-"}
          </p>
          {cv?.acquisition_value != null && (
            <p className="text-xs text-gray1 mt-0.5 tabular-nums whitespace-nowrap">
              Perolehan: {formatRupiah(cv.acquisition_value)}
            </p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "asset_status",
    header: "STATUS",
    cell: ({ row }) => <AssetStatusBadge value={row.getValue("asset_status")} />,
  },
  {
    accessorKey: "created_at",
    header: "TGL DIBUAT",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return (
        <span className="text-sm whitespace-nowrap">
          {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      )
    },
  },
  {
    id: "aksi",
    header: "AKSI",
    cell: ({ row }) => <ActionButtons id={row.original.asset_number.toString()} />,
  },
]