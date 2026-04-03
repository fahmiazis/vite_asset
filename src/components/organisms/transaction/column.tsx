import type { ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { TransaksiAset } from "./dataDummy";

// --- Avatar Pemohon ---
function Avatar({ nama, divisi }: { nama: string; divisi: string }) {
  const initials = nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
  const colors = ["bg-blue-400", "bg-green-400", "bg-orange-400", "bg-purple-400", "bg-rose-400"]
  const color = colors[initials.charCodeAt(0) % colors.length]
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${color}`}>
        {initials}
      </div>
      <div>
        <p className="text-sm font-medium leading-tight">{nama}</p>
        <p className="text-xs text-gray1">{divisi}</p>
      </div>
    </div>
  )
}

// --- Badge Prioritas ---
function PrioritasBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    Tinggi: "bg-red-100 text-red-600",
    Sedang: "bg-yellow-100 text-yellow-700",
    Rendah: "bg-green-100 text-green-700",
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${map[value] ?? "bg-gray-100 text-gray-600"}`}>
      {value}
    </span>
  )
}

// --- Badge Status ---
function StatusBadge({ value }: { value: string }) {
  const map: Record<string, { dot: string; bg: string; text: string }> = {
    Disetujui: { dot: "bg-green-500", bg: "bg-green-50 text-green-700", text: "Disetujui" },
    Menunggu:  { dot: "bg-yellow-400", bg: "bg-yellow-50 text-yellow-700", text: "Menunggu" },
    Ditolak:   { dot: "bg-red-500", bg: "bg-red-50 text-red-600", text: "Ditolak" },
    Draft:     { dot: "bg-gray-400", bg: "bg-gray-100 text-gray-600", text: "Draft" },
  }
  const s = map[value] ?? map["Draft"]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.text}
    </span>
  )
}

// --- Action Buttons ---
function ActionButtons({ id, status }: { id: string; status: string }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => navigate(`/dashboard/transaksi/${id}`)}
        className="px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        Detail
      </button>
      {status === "Menunggu" && (
        <button
          onClick={() => navigate(`/dashboard/transaksi/${id}/review`)}
          className="px-3 py-1 text-xs font-medium border border-yellow-400 text-yellow-600 rounded-md hover:bg-yellow-50 transition-colors"
        >
          Review
        </button>
      )}
    </div>
  )
}

// --- Columns ---
export const transaksiColumns: ColumnDef<TransaksiAset>[] = [
  {
    accessorKey: "no_po",
    header: "NO. PO",
    cell: ({ row }) => (
      <div className="text-xs text-gray1 font-mono leading-tight">
        {row.getValue("no_po")}
      </div>
    ),
  },
  {
    accessorKey: "nama_aset",
    header: "NAMA ASET",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-semibold leading-tight">{row.getValue("nama_aset")}</p>
        <p className="text-xs text-gray1 mt-0.5">{row.original.kategori}</p>
      </div>
    ),
  },
  {
    accessorKey: "pemohon",
    header: "PEMOHON",
    cell: ({ row }) => (
      <Avatar nama={row.original.pemohon} divisi={row.original.divisi} />
    ),
  },
  {
    accessorKey: "tgl_pengajuan",
    header: "TGL PENGAJUAN",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("tgl_pengajuan")}</span>
    ),
  },
  {
    accessorKey: "qty",
    header: "QTY",
    cell: ({ row }) => (
      <div className="text-center">
        <p className="text-sm font-medium">{row.original.qty}</p>
        <p className="text-xs text-gray1">{row.original.satuan}</p>
      </div>
    ),
  },
  {
    accessorKey: "nilai_total",
    header: "NILAI TOTAL",
    cell: ({ row }) => (
      <span className="text-sm font-semibold tabular-nums">
        {row.getValue("nilai_total")}
      </span>
    ),
  },
  {
    accessorKey: "prioritas",
    header: "PRIORITAS",
    cell: ({ row }) => <PrioritasBadge value={row.getValue("prioritas")} />,
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => <StatusBadge value={row.getValue("status")} />,
  },
  {
    id: "aksi",
    header: "AKSI",
    cell: ({ row }) => (
      <ActionButtons id={row.original.id} status={row.original.status} />
    ),
  },
]