import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useStockOpnameDetail } from "../../../../hooks/query/stockOpname/detail"
import { useStockOpnameApprovalStatus } from "../../../../hooks/query/stockOpname/approvalStatus"
import { useInitiateApprovalStockOpname } from "../../../../hooks/mutation/stockOpname/initiateApproval"
import { useDownloadStockOpnameTemplate } from "../../../../hooks/mutation/stockOpname/downloadTemplate"
import { UploadStockOpnameTemplateModal } from "../../../organisms/stockOpname/uploadTemplateModal"
import { UpdateStockOpnameFindingModal } from "../../../organisms/stockOpname/updateFindingModal"
import { SubmitStockOpnameModal } from "../../../organisms/stockOpname/submitDraftModal"
import { ApproveStockOpnameModal } from "../../../organisms/stockOpname/approveModal"
import { ExecuteStockOpnameModal } from "../../../organisms/stockOpname/executeModal"
import { RejectStockOpnameModal } from "../../../organisms/stockOpname/rejectModal"
import { StockOpnameStepper, StockOpnameStageHistory } from "../../../organisms/stockOpname/stageTimeline"
import { StatusBadge } from "../../../organisms/stockOpname/column"
import { StockOpnameItemsTable } from "../../../organisms/stockOpname/itemsTable"
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

export default function StockOpnameDetailPage() {
  const { "*": id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data, isLoading } = useStockOpnameDetail(id ?? "")
  const isSubmissive = data?.data?.is_submissive ?? null

  const [showUploadTemplate, setShowUploadTemplate] = useState(false)
  const [findingItem, setFindingItem] = useState<StockOpnameItem | null>(null)
  const [showSubmit, setShowSubmit] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const [showExecute, setShowExecute] = useState(false)
  const [showReject, setShowReject] = useState(false)

  const { data: approvalData, error: approvalError } = useStockOpnameApprovalStatus(id ?? "")
  const { mutate: retryInitiateApproval, isPending: isRetryingInitiate } = useInitiateApprovalStockOpname(id ?? "")
  const { mutate: downloadTemplate, isPending: isDownloadingTemplate } = useDownloadStockOpnameTemplate()

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

      {showUploadTemplate && (
        <UploadStockOpnameTemplateModal
          transactionNumber={transaction.transaction_number}
          onClose={() => setShowUploadTemplate(false)}
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
            <p className="text-xs text-gray-400 mb-1">{t("stockOpnameDetail.transactionNumber")}</p>
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
            { label: t("stockOpnameDetail.opnameDate"), value: formatDate(transaction.transaction_date) },
            { label: t("stockOpnameDetail.createdBy"), value: transaction.created_by },
            { label: t("stockOpnameDetail.createdAt"), value: formatDateTime(transaction.created_at) },
            { label: t("stockOpnameDetail.updatedAt"), value: formatDateTime(transaction.updated_at) },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value}</p>
            </div>
          ))}
          {isSubmissive !== null && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{t("stockOpnameDetail.submissionStatus")}</p>
              <p className={`text-sm font-medium ${isSubmissive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {isSubmissive ? t("stockOpnameDetail.onSchedule") : t("stockOpnameDetail.lateSchedule")}
              </p>
            </div>
          )}
        </div>

        {transaction.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 mb-1">{t("stockOpnameDetail.notes")}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{transaction.notes}</p>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t("stockOpnameDetail.assetList")}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
              {items.length} {t("stockOpnameDetail.assets")}
            </span>
            {isDraft && (
              <>
                <button
                  onClick={() => navigate(`/dashboard/stock-opname/fill/${transaction.transaction_number}`)}
                  className="flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-6 4h6m2 5H7a2 2 0 01-2-2V4a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V20a2 2 0 01-2 2z" />
                  </svg>
                  {t("stockOpnameDetail.fillDataButton")}
                </button>
                <button
                  onClick={() => downloadTemplate(transaction.transaction_number)}
                  disabled={isDownloadingTemplate}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  {t("stockOpnameDetail.downloadTemplate")}
                </button>
                <button
                  onClick={() => setShowUploadTemplate(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  {t("stockOpnameDetail.uploadTemplate")}
                </button>
              </>
            )}
          </div>
        </div>

        <StockOpnameItemsTable items={items} isDraft={isDraft} onFillFinding={setFindingItem} />
      </div>

      {/* Approval status */}
      {approvalData?.data && (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">{t("approvalStatus.title")}</h3>
          <div className="space-y-2">
            {approvalData.data.approvals.map((approval) => {
              const status = approval.status?.toLowerCase()
              const badge =
                status === "approved" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : status === "rejected" ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              const badgeLabel =
                status === "approved" ? t("approvalStatus.badge.approved")
                : status === "rejected" ? t("approvalStatus.badge.rejected")
                : t("approvalStatus.badge.pending")
              return (
                <div key={approval.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/40">
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      {approval.flow_step?.step_name ?? t("approveStockOpnameModal.stepFallback")}
                    </p>
                    <p className="text-xs text-gray-400">{approval.approver_role_name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
                    {badgeLabel}
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
            {t("stockOpnameDetail.approvalNotInitiated")}
          </p>
          <button
            onClick={() =>
              retryInitiateApproval(undefined, {
                onSuccess: () => toast.success(t("stockOpnameDetail.toastInitiateSuccess")),
                onError: () => toast.error(t("stockOpnameDetail.toastInitiateError")),
              })
            }
            disabled={isRetryingInitiate}
            className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isRetryingInitiate ? t("stockOpnameDetail.initiating") : t("stockOpnameDetail.initiateApproval")}
          </button>
        </div>
      )}

      {/* Stage History */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">{t("stockOpnameDetail.stageHistory")}</h3>
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
            {t("stockOpnameDetail.submitStockOpname")}
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
            {t("stockOpnameDetail.approve")}
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
            {t("stockOpnameDetail.execute")}
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
            {t("stockOpnameDetail.reject")}
          </button>
        )}
      </div>

    </section>
  )
}
