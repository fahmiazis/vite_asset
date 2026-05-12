import { useParams } from "react-router-dom"
import { useDisposalDetail } from "../../../../hooks/query/disposal/detail"
import { useState } from "react"
import { AddAssetToDisposalModal } from "../../../organisms/disposal/addAssetModal"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { dot: string; light: string; dark: string; label: string }> = {
    APPROVED: { dot: "bg-green-500", light: "bg-green-50 text-green-700", dark: "dark:bg-green-900/40 dark:text-green-400", label: "Approved" },
    PENDING: { dot: "bg-yellow-400", light: "bg-yellow-50 text-yellow-700", dark: "dark:bg-yellow-900/40 dark:text-yellow-400", label: "Pending" },
    REJECTED: { dot: "bg-red-500", light: "bg-red-50 text-red-600", dark: "dark:bg-red-900/40 dark:text-red-400", label: "Rejected" },
    DRAFT: { dot: "bg-gray-400", light: "bg-gray-100 text-gray-600", dark: "dark:bg-gray-700 dark:text-gray-400", label: "Draft" },
    COMPLETED: { dot: "bg-blue-500", light: "bg-blue-50 text-blue-700", dark: "dark:bg-blue-900/40 dark:text-blue-400", label: "Completed" },
    CANCELLED: { dot: "bg-gray-400", light: "bg-gray-100 text-gray-500", dark: "dark:bg-gray-700 dark:text-gray-400", label: "Cancelled" },
  }
  const s = map[status?.toUpperCase()] ?? map["DRAFT"]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.light} ${s.dark}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

const DISPOSAL_TYPE_LABEL: Record<string, string> = {
  sale: "Penjualan",
  scrap: "Pemusnahan / Scrap",
  donation: "Donasi / Hibah",
  write_off: "Penghapusan (Write-off)",
}

function DisposalTypeBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    sale: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
    scrap: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
    donation: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700",
    write_off: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700",
  }
  const cls = map[value?.toLowerCase()] ?? "bg-gray-100 text-gray-600 border-gray-200"
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {DISPOSAL_TYPE_LABEL[value?.toLowerCase()] ?? value ?? "-"}
    </span>
  )
}

function AssetStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700",
    INACTIVE: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    DISPOSED: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[status?.toUpperCase()] ?? map["INACTIVE"]}`}>
      {status}
    </span>
  )
}

export default function DisposalDetailPage() {
  const { "*": id } = useParams()
  const { data, isLoading } = useDisposalDetail(id ?? "")
  const [showAddAsset, setShowAddAsset] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
      </div>
    )
  }

  if (!data?.data) return null

  const { transaction, assets, stages } = data.data

  return (
    <section className="space-y-4 mt-4">

      {showAddAsset && (
        <AddAssetToDisposalModal
          transactionNumber={transaction.transaction_number}
          onClose={() => setShowAddAsset(false)}
        />
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Nomor transaksi</p>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 font-mono">
              {transaction.transaction_number}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <StatusBadge status={transaction.status} />
            <DisposalTypeBadge value={transaction.disposal_type} />
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 font-medium">
              {transaction.current_stage}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Tipe transaksi", value: transaction.transaction_type },
            { label: "Tanggal", value: formatDate(transaction.transaction_date) },
            { label: "Tipe disposal", value: DISPOSAL_TYPE_LABEL[transaction.disposal_type?.toLowerCase()] ?? transaction.disposal_type },
            { label: "Dibuat oleh", value: transaction.created_by },
            { label: "Dibuat pada", value: formatDateTime(transaction.created_at) },
            { label: "Diupdate pada", value: formatDateTime(transaction.updated_at) },
            ...(transaction.sale_value != null
              ? [{ label: "Nilai jual", value: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(transaction.sale_value) }]
              : []
            ),
            ...(transaction.approval_request_number
              ? [{ label: "No. Permohonan", value: transaction.approval_request_number }]
              : []
            ),
            ...(transaction.approval_agreement_number
              ? [{ label: "No. Persetujuan", value: transaction.approval_agreement_number }]
              : []
            ),
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value}</p>
            </div>
          ))}
        </div>

        {transaction.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Catatan</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{transaction.notes}</p>
          </div>
        )}
      </div>

      {/* Assets */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Daftar Aset</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
              {assets.length} aset
            </span>
            <button
              onClick={() => setShowAddAsset(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 px-2.5 py-1 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah aset
            </button>
          </div>
        </div>

        {assets.length === 0 ? (
          <div className="text-center py-10 text-sm text-gray-400">
            Belum ada aset yang ditambahkan
          </div>
        ) : (
          <div className="space-y-3">
            {assets.map((asset: any, index: number) => (
              <div key={asset.id ?? index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                {/* Asset Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{asset.asset_name ?? "-"}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{asset.asset_number ?? "-"}</p>
                    </div>
                  </div>
                  <AssetStatusBadge status={asset.status ?? "INACTIVE"} />
                </div>

                {/* Asset Body */}
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {asset.category_name && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Kategori</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{asset.category_name}</p>
                      </div>
                    )}
                    {asset.branch_code && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Cabang</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{asset.branch_code}</p>
                      </div>
                    )}
                    {asset.document_number && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">No. Dokumen</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">{asset.document_number}</p>
                      </div>
                    )}
                  </div>

                  {asset.notes && (
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
                      "{asset.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stage History */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Riwayat Stage</h3>

        {stages.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400">
            Belum ada riwayat stage
          </div>
        ) : (
          <div className="space-y-0">
            {stages.map((stage: any, index: number) => {
              const isLast = index === stages.length - 1
              return (
                <div key={stage.id ?? index} className="flex gap-3">
                  {/* Timeline dot + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0
                      ${isLast
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {!isLast && (
                      <div className="w-0.5 flex-1 mt-1 min-h-4 bg-gray-200 dark:bg-gray-700" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                            {stage.from_stage}
                          </p>
                          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {stage.to_stage}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {stage.action}
                          {stage.actor_name && (
                            <span className="ml-1">· oleh {stage.actor_name}</span>
                          )}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatDateTime(stage.created_at)}
                      </span>
                    </div>

                    {stage.notes && (
                      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                        "{stage.notes}"
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        {transaction.status === "DRAFT" && (
          <button
            onClick={() => console.log("TODO: submit disposal", { transactionNumber: transaction.transaction_number })}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Submit transaksi
          </button>
        )}

        <button
          onClick={() => console.log("TODO: approve disposal", { transactionNumber: transaction.transaction_number })}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Approve
        </button>

        <button
          onClick={() => console.log("TODO: execute disposal", { transactionNumber: transaction.transaction_number })}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Eksekusi disposal
        </button>
      </div>

    </section>
  )
}