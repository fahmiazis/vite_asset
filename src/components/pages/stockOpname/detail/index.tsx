import { useParams } from "react-router-dom"
import { useState } from "react"
import { useStockOpnameDetail } from "../../../../hooks/query/stockOpname/detail"
import { useStockOpnameApprovalStatus } from "../../../../hooks/query/stockOpname/approvalStatus"
import { useInitiateApprovalStockOpname } from "../../../../hooks/mutation/stockOpname/initiateApproval"
import { AddAssetToStockOpnameModal } from "../../../organisms/stockOpname/addAssetModal"
import { RemoveAssetFromStockOpnameModal } from "../../../organisms/stockOpname/deleteAssetModal"
import { UpdateStockOpnameFindingModal } from "../../../organisms/stockOpname/updateFindingModal"
import { SubmitStockOpnameModal } from "../../../organisms/stockOpname/submitDraftModal"
import { ApproveStockOpnameModal } from "../../../organisms/stockOpname/approveModal"
import { ExecuteStockOpnameModal } from "../../../organisms/stockOpname/executeModal"
import { RejectStockOpnameModal } from "../../../organisms/stockOpname/rejectModal"
import { StockOpnameStepper, StockOpnameStageHistory } from "../../../organisms/stockOpname/stageTimeline"
import { StatusBadge } from "../../../organisms/stockOpname/column"
import type { StockOpnameItem } from "../../../../models/stockOpname/detail"
import toast from "react-hot-toast"

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

function AssetStatusBadge({ status }: { status?: string | null }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700",
    AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700",
    INACTIVE: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
    RETIRED: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
    DISPOSED: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  }
  const key = status?.toUpperCase() ?? "INACTIVE"
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[key] ?? map["INACTIVE"]}`}>
      {status ?? "-"}
    </span>
  )
}

export default function StockOpnameDetailPage() {
  const { "*": id } = useParams()
  const { data, isLoading } = useStockOpnameDetail(id ?? "")

  const [showAddAsset, setShowAddAsset] = useState(false)
  const [assetToRemove, setAssetToRemove] = useState<{ id: number; name: string } | null>(null)
  const [findingItem, setFindingItem] = useState<StockOpnameItem | null>(null)
  const [showSubmit, setShowSubmit] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const [showExecute, setShowExecute] = useState(false)
  const [showReject, setShowReject] = useState(false)

  const { data: approvalData, error: approvalError } = useStockOpnameApprovalStatus(id ?? "")
  const { mutate: retryInitiateApproval, isPending: isRetryingInitiate } = useInitiateApprovalStockOpname(id ?? "")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
      </div>
    )
  }

  if (!data?.data) return null

  const { transaction, items, stages } = data.data

  const isDraft = transaction.current_stage === "DRAFT"
  const isApprovalStage = transaction.current_stage === "APPROVAL"
  const isExecuteStage = transaction.current_stage === "EXECUTE_STOCK_OPNAME"
  const canReject = isApprovalStage || isExecuteStage
  const approvalNotYetInitiated = isApprovalStage && !!approvalError && !approvalData?.data

  return (
    <section className="space-y-4 mt-4">

      {showAddAsset && (
        <AddAssetToStockOpnameModal
          transactionNumber={transaction.transaction_number}
          onClose={() => setShowAddAsset(false)}
        />
      )}
      {assetToRemove && (
        <RemoveAssetFromStockOpnameModal
          transactionNumber={transaction.transaction_number}
          assetId={assetToRemove.id}
          assetName={assetToRemove.name}
          onClose={() => setAssetToRemove(null)}
        />
      )}
      {findingItem && (
        <UpdateStockOpnameFindingModal
          transactionNumber={transaction.transaction_number}
          item={findingItem}
          onClose={() => setFindingItem(null)}
        />
      )}
      {showSubmit && (
        <SubmitStockOpnameModal
          transactionNumber={transaction.transaction_number}
          onClose={() => setShowSubmit(false)}
        />
      )}
      {showApprove && (
        <ApproveStockOpnameModal
          transactionNumber={transaction.transaction_number}
          onClose={() => setShowApprove(false)}
        />
      )}
      {showExecute && (
        <ExecuteStockOpnameModal
          transactionNumber={transaction.transaction_number}
          onClose={() => setShowExecute(false)}
        />
      )}
      {showReject && (
        <RejectStockOpnameModal
          transactionNumber={transaction.transaction_number}
          onClose={() => setShowReject(false)}
        />
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Nomor transaksi</p>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 font-mono">
              {transaction.transaction_number}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <StatusBadge value={transaction.status} />
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 font-medium">
              {transaction.current_stage}
            </span>
          </div>
        </div>

        {/* Stepper */}
        <div className="py-3">
          <StockOpnameStepper currentStage={transaction.current_stage} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {[
            { label: "Tanggal Opname", value: formatDate(transaction.transaction_date) },
            { label: "Dibuat oleh", value: transaction.created_by },
            { label: "Dibuat pada", value: formatDateTime(transaction.created_at) },
            { label: "Diupdate pada", value: formatDateTime(transaction.updated_at) },
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

      {/* Items */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Daftar Aset</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
              {items.length} aset
            </span>
            {isDraft && (
              <button
                onClick={() => setShowAddAsset(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 px-2.5 py-1 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah aset
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-10 text-sm text-gray-400">
            Belum ada aset yang ditambahkan
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                {/* Item Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.asset_name ?? "-"}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{item.asset_number}</p>
                    </div>
                  </div>
                  {isDraft && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFindingItem(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {item.found_physical_status ? "Edit Temuan" : "Isi Temuan"}
                      </button>
                      <button
                        onClick={() => setAssetToRemove({ id: item.asset_id, name: item.asset_name ?? item.asset_number })}
                        className="flex items-center justify-center w-7 h-7 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        title="Hapus aset"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Item Body — Found vs System */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Data Sistem</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Kondisi</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{item.system_condition ?? "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Status Fisik</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{item.system_physical_status ?? "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Status Aset</span>
                        <AssetStatusBadge status={item.system_asset_status} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-indigo-500 uppercase tracking-wide mb-2">Hasil Temuan</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Kondisi</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{item.found_condition ?? "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Status Fisik</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{item.found_physical_status ?? "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Status Aset</span>
                        <AssetStatusBadge status={item.found_asset_status} />
                      </div>
                    </div>
                  </div>
                  {item.notes && (
                    <p className="md:col-span-2 text-xs text-gray-500 dark:text-gray-400 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval status */}
      {approvalData?.data && (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Status Approval</h3>
          <div className="space-y-2">
            {approvalData.data.approvals.map((approval) => {
              const status = approval.status?.toLowerCase()
              const badge =
                status === "approved" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : status === "rejected" ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              return (
                <div key={approval.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/40">
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      {approval.flow_step?.step_name ?? "Step approval"}
                    </p>
                    <p className="text-xs text-gray-400">{approval.approver_role_name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${badge}`}>
                    {approval.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {approvalNotYetInitiated && (
        <div className="bg-white dark:bg-gray-950 border border-amber-200 dark:border-amber-800 rounded-xl p-5 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Approval belum diajukan untuk transaksi ini.
          </p>
          <button
            onClick={() =>
              retryInitiateApproval(undefined, {
                onSuccess: () => toast.success("Approval berhasil diajukan"),
                onError: () => toast.error("Gagal mengajukan approval"),
              })
            }
            disabled={isRetryingInitiate}
            className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isRetryingInitiate ? "Mengajukan..." : "Ajukan Approval"}
          </button>
        </div>
      )}

      {/* Stage History */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Riwayat Stage</h3>
        <StockOpnameStageHistory stages={stages} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        {isDraft && (
          <button
            onClick={() => setShowSubmit(true)}
            disabled={items.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Submit Stock Opname
          </button>
        )}

        {isApprovalStage && approvalData?.data && (
          <button
            onClick={() => setShowApprove(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Approve
          </button>
        )}

        {isExecuteStage && (
          <button
            onClick={() => setShowExecute(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Eksekusi Stock Opname
          </button>
        )}

        {canReject && (
          <button
            onClick={() => setShowReject(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Tolak
          </button>
        )}
      </div>

    </section>
  )
}
