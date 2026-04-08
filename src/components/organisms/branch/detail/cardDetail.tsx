import type { detailBranchState } from "../../../../models/branch/detail";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active"
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${isActive
        ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
        : "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
      }`}>
      {isActive ? "Aktif" : "Nonaktif"}
    </span>
  )
}

interface DetailBranchCardProps {
  data: detailBranchState
}

export function DetailBranchCard({ data }: DetailBranchCardProps) {
  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr))

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">
            B
          </div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Detail Cabang
          </h3>
        </div>
        <StatusBadge status={data.status} />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <InfoRow label="Kode Cabang" value={data.branch_code} />
        <InfoRow label="Nama Cabang" value={data.branch_name} />
        <InfoRow label="Tipe Cabang" value={data.branch_type} />
        <InfoRow label="ID" value={data.id} />
        <InfoRow label="Dibuat" value={formatDate(data.created_at)} />
        <InfoRow label="Diperbarui" value={formatDate(data.updated_at)} />
      </div>
    </div>
  )
}