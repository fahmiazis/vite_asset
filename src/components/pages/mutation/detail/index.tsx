import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useMutationDetail } from "../../../../hooks/query/mutation/detail"
import { useState } from "react"
import { AddAssetModal } from "../../../organisms/mutation/addAssetModal"
import { SubmitMutationModal } from "../../../organisms/mutation/submitDraftMutationModal"
import { useMutationApprovalStatus } from "../../../../hooks/query/mutation/approvalStatus"
import { MutationApprovalStatus } from "../../../organisms/mutation/approvalStatus"
import { ApproveModal } from "../../../organisms/mutation/approveModal"
import { ConfirmReceivingModal } from "../../../organisms/mutation/confirmReceiveModal"
import { ExecuteMutationModal } from "../../../organisms/mutation/executeMutationModal"

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
    PENDING:  { dot: "bg-yellow-400", light: "bg-yellow-50 text-yellow-700", dark: "dark:bg-yellow-900/40 dark:text-yellow-400", label: "Pending" },
    REJECTED: { dot: "bg-red-500", light: "bg-red-50 text-red-600", dark: "dark:bg-red-900/40 dark:text-red-400", label: "Rejected" },
    DRAFT:    { dot: "bg-gray-400", light: "bg-gray-100 text-gray-600", dark: "dark:bg-gray-700 dark:text-gray-400", label: "Draft" },
  }
  const s = map[status?.toUpperCase()] ?? map["DRAFT"]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.light} ${s.dark}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

function AssetStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE:   "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700",
    INACTIVE: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    MUTATED:  "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
    PENDING:  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[status?.toUpperCase()] ?? map["INACTIVE"]}`}>
      {status}
    </span>
  )
}

export default function MutationDetailPage() {
  const { "*": id } = useParams()
  const { t } = useTranslation()
  const { data, isLoading } = useMutationDetail(id ?? "")
  const [showAddAsset, setShowAddAsset]             = useState(false)
  const [showSubmit, setShowSubmit]                 = useState(false)
  const [showApprove, setShowApprove]               = useState(false)
  const [showConfirmReceiving, setShowConfirmReceiving] = useState(false)
  const [showExecute, setShowExecute]               = useState(false)

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
        <AddAssetModal
          transactionNumber={id || ""}
          onClose={() => setShowAddAsset(false)}
          onSuccess={() => {}}
        />
      )}
      {showSubmit && (
        <SubmitMutationModal
          transactionNumber={id || ""}
          onClose={() => setShowSubmit(false)}
        />
      )}
      {showApprove && (
        <ApproveModal
          transactionNumber={id ?? ""}
          onClose={() => setShowApprove(false)}
          onSuccess={() => {}}
        />
      )}
      {showConfirmReceiving && (
        <ConfirmReceivingModal
          transactionNumber={id || ""}
          onClose={() => setShowConfirmReceiving(false)}
        />
      )}
      {showExecute && (
        <ExecuteMutationModal
          transactionNumber={id || ""}
          onClose={() => setShowExecute(false)}
        />
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">{t("mutationDetail.transactionNumber")}</p>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 font-mono">
              {transaction.transaction_number}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={transaction.status} />
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 font-medium">
              {transaction.current_stage}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: t("mutationDetail.transactionType"), value: transaction.transaction_type },
            { label: t("mutationDetail.date"),            value: formatDate(transaction.transaction_date) },
            { label: t("mutationDetail.category"),        value: transaction.category_name },
            { label: t("mutationDetail.targetBranch"),    value: transaction.to_branch_code },
            { label: t("mutationDetail.createdBy"),       value: transaction.created_by },
            { label: t("mutationDetail.createdAt"),       value: formatDateTime(transaction.created_at) },
            { label: t("mutationDetail.updatedAt"),       value: formatDateTime(transaction.updated_at) },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value}</p>
            </div>
          ))}
        </div>

        {transaction.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 mb-1">{t("mutationDetail.notes")}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{transaction.notes}</p>
          </div>
        )}
      </div>

      {/* Assets */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {t("mutationDetail.assetList")}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
              {assets.length} {t("mutationDetail.assets")}
            </span>
            {data.data.transaction.current_stage === "DRAFT" && (
              <button
                onClick={() => setShowAddAsset(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 px-2.5 py-1 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t("mutationDetail.addAsset")}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {assets.map((asset, index) => (
            <div key={asset.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              {/* Asset Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{asset.asset_name}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{asset.asset_number}</p>
                  </div>
                </div>
                <AssetStatusBadge status={asset.status} />
              </div>

              {/* Asset Body */}
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{t("mutationDetail.category2")}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{asset.category_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{t("mutationDetail.documentNumber")}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">{asset.document_number || "-"}</p>
                  </div>
                </div>

                {/* Mutation route */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg">
                  <div className="flex-1 text-center">
                    <p className="text-xs text-gray-400 mb-1">{t("mutationDetail.fromBranch")}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{asset.from_branch_code}</p>
                    {asset.from_location && (
                      <p className="text-xs text-gray-400 mt-0.5">{asset.from_location}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xs text-gray-400 mb-1">{t("mutationDetail.toBranch")}</p>
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{asset.to_branch_code}</p>
                    {asset.to_location && (
                      <p className="text-xs text-gray-400 mt-0.5">{asset.to_location}</p>
                    )}
                  </div>
                </div>

                {asset.notes && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                    "{asset.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage History */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {t("mutationDetail.stageHistory")}
        </h3>

        <div className="space-y-0">
          {stages.map((stage, index) => {
            const isLast = index === stages.length - 1
            return (
              <div key={stage.id} className="flex gap-3">
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

                <div className="pb-4 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{stage.from_stage}</p>
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{stage.to_stage}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {stage.action}
                        {stage.actor_name && (
                          <span className="ml-1">· {t("mutationDetail.by")} {stage.actor_name}</span>
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
      </div>

      {/* Approval Status */}
      <MutationApprovalStatus transactionNumber={id ?? ""} />

      {/* Actions */}
      {transaction.status === "DRAFT" && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowSubmit(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {t("mutationDetail.submitTransaction")}
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setShowApprove(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t("mutationDetail.approve")}
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowConfirmReceiving(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t("mutationDetail.confirmReceiving")}
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowExecute(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t("mutationDetail.executeTransaction")}
        </button>
      </div>
    </section>
  )
}