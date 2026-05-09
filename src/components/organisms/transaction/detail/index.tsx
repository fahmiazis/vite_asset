import { useEffect, useRef, useState } from "react"
import type { detailtransactionProps } from "../../../../models/transaction/detail"
import { useSubmitProcurement } from "../../../../hooks/mutation/transaction/submit"
import toast from "react-hot-toast"
import { useUploadAttachment } from "../../../../hooks/mutation/transaction/attachFile"
import { useAttachmentSettingList } from "../../../../hooks/query/attachmentSetting/list"
import type { Asset, detailTransactionWStageProps } from "../../../../models/transaction/detailWStages"
import { ReviewAttachmentModal } from "../../modals/reviewAttachmentTransaction"
import { useAttachTransaction } from "../../../../hooks/query/attachmentSetting/attachTransaction"
import { VerifyModal } from "../../modals/veriftTransactionModal"
import { ApproveModal } from "../approveModal"
import { useApprovalStatus } from "../../../../hooks/query/transaction/approvalStatus"
import type { approvalStatusState } from "../../../../models/transaction/approvalStatus"
import { getRolesFromToken } from "../../../../utils/auth"
import { ProcessBudgetModal } from "../processBudgetModal"
import { ExecuteAssetModal } from "../executeAssetModal"
import { GoodsReceiptModal } from "../goodsReceiptModal"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"

function formatRupiah(num: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(num)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    approved: "bg-green-50 text-green-700 border border-green-200",
    rejected: "bg-red-50 text-red-700 border border-red-200",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${map[status.toLowerCase()] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

const MAX_FILE_SIZE = 10 * 1024 * 1024

// ─── File Upload Field ────────────────────────────────────────────────────────

function FileUploadField({ label, file, onChange, onRemove }: {
  label: string
  file: File | null
  onChange: (file: File) => void
  onRemove: () => void
}) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (selected.size > MAX_FILE_SIZE) {
      toast.error(t("detailTransaction.fileUpload.sizeError", { label }))
      return
    }
    onChange(selected)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        <span className="ml-1 text-xs text-gray-400 font-normal">
          ({t("detailTransaction.fileUpload.maxSize")})
        </span>
      </label>
      {file ? (
        <div className="flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <button type="button" onClick={onRemove} className="ml-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {t("detailTransaction.fileUpload.clickToUpload")}
        </button>
      )}
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleChange} />
    </div>
  )
}

// ─── Submit Modal ─────────────────────────────────────────────────────────────

type AttachmentItem = { id: number; name: string; is_required?: boolean }
type AttachmentState = AttachmentItem & { file: File | null }

function SubmitModal({ transactionNumber, transactionType, stage, mappedAttachments = [], onConfirm, onCancel }: {
  transactionNumber: string
  transactionType: string
  stage: string
  mappedAttachments: AttachmentItem[]
  onConfirm: (notes: string) => void
  onCancel: () => void
}) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [notes, setNotes] = useState("")
  const [attachments, setAttachments] = useState<AttachmentState[]>([])
  const { mutateAsync: uploadAttachment, isPending: isUploading } = useUploadAttachment()

  useEffect(() => {
    if (mappedAttachments.length > 0) {
      setAttachments(mappedAttachments.map((item) => ({ ...item, file: null })))
    }
  }, [mappedAttachments])

  const handleFileChange = (id: number, file: File | null) => {
    setAttachments((prev) => prev.map((item) => item.id === id ? { ...item, file } : item))
  }

  const hasMissingRequired = attachments.some((item) => item.is_required && !item.file)

  const handleSubmit = async () => {
    try {
      const filesToUpload = attachments.filter((item) => item.file)
      await Promise.all(
        filesToUpload.map((item) =>
          uploadAttachment({
            params: { transaction_number: transactionNumber, transaction_type: transactionType, stage },
            payload: { attachment_config_id: String(item.id), file: item.file! },
          })
        )
      )
      await queryClient.resetQueries({
        queryKey: ["transaction-detail-with-stage"],
      })
      onConfirm(notes)
    } catch {
      toast.error(t("detailTransaction.submitModal.uploadError"))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 mx-auto mb-4">
          <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
          {t("detailTransaction.submitModal.title")}
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">
          {t("detailTransaction.submitModal.desc")}
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("detailTransaction.submitModal.notes")}{" "}
              <span className="text-gray-400 font-normal">({t("detailTransaction.submitModal.optional")})</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("detailTransaction.submitModal.notesPlaceholder")}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none"
            />
          </div>
          <div className="space-y-4">
            {attachments.map((item) => (
              <FileUploadField
                key={item.id}
                label={`${item.name}${item.is_required ? " *" : ""}`}
                file={item.file}
                onChange={(file) => handleFileChange(item.id, file)}
                onRemove={() => handleFileChange(item.id, null)}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onCancel} disabled={isUploading}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
            {t("detailTransaction.submitModal.cancel")}
          </button>
          <button onClick={handleSubmit} disabled={isUploading || hasMissingRequired}
            className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50">
            {isUploading ? t("detailTransaction.submitModal.uploading") : t("detailTransaction.submitModal.submit")}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default function DetailTransactionLayout({ data }: { data: detailTransactionWStageProps }) {
  const { t } = useTranslation()
  const { transaction, items } = data.data
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showExecuteModal, setShowExecuteModal] = useState(false)
  const [showGRModal, setShowGRModal] = useState(false)

  const totalUnit = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalNilai = items.reduce((sum, item) => sum + item.total_price, 0)

  const { data: attachSetting } = useAttachmentSettingList("procurement")

  const formatAttachmentName = (value: string) =>
    value.toLowerCase().split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  const mappedAttachments = attachSetting?.data?.map(item => ({
    id: item.id,
    name: formatAttachmentName(item.attachment_type),
  })) ?? []

  const { mutate: submitTransaction, isPending: isSubmitting } = useSubmitProcurement({
    onSuccess: () => setShowSubmitModal(false),
  })

  const handleConfirmSubmit = (notes: string) => {
    submitTransaction({ id: transaction.transaction_number, payload: { notes } })
  }

  const lastStage = data?.data?.stages?.at(-1)?.to_stage
  const isVerif = lastStage === "ASSET_VERIFICATION" && transaction?.status === "PENDING"
  const isApprove = lastStage === "APPROVAL" && transaction?.status === "PENDING"
  const isBudget = data.data.transaction.current_stage === "PROCESS_BUDGET"
  const isExecute = data.data.transaction.current_stage === "EXECUTE_ASET"
  const isGR = data.data.transaction.current_stage === "GR"

  const { data: approvalData, isLoading: isLoadingApproval } = useApprovalStatus(transaction.transaction_number)
  const approvals = approvalData?.data?.approvals ?? []
  const completedSteps = approvalData?.data?.completed_steps ?? 0
  const totalSteps = approvalData?.data?.total_steps ?? 0

  const userRoles = getRolesFromToken()
  const pendingApproval = approvals.find((a: approvalStatusState) => a.status?.toLowerCase() === "pending")
  const canApprove = isApprove && !!pendingApproval && (
    userRoles.includes(pendingApproval.approver_role_name) ||
    userRoles.includes(pendingApproval.approver_role_id)
  )

  const infoGrid = [
    { label: t("detailTransaction.info.transactionType"), value: transaction.transaction_type },
    { label: t("detailTransaction.info.date"), value: formatDate(transaction.transaction_date) },
    { label: t("detailTransaction.info.createdBy"), value: transaction.created_by },
    { label: t("detailTransaction.info.approvedBy"), value: transaction.approved_by ?? t("detailTransaction.info.notYetApproved") },
  ]

  function getAssetNumberRange(assets: Asset[]) {
    if (!assets || assets.length === 0) return "-"
    if (assets.length === 1) return assets[0].asset_number
    return `${assets[0].asset_number} – ${assets[assets.length - 1].asset_number}`
  }

  return (
    <section className="space-y-4 mt-4">
      {showGRModal && <GoodsReceiptModal transactionNumber={transaction.transaction_number} onClose={() => setShowGRModal(false)} onSuccess={() => { }} />}
      {showExecuteModal && <ExecuteAssetModal transactionNumber={transaction.transaction_number} onClose={() => setShowExecuteModal(false)} onSuccess={() => { }} />}
      {showBudgetModal && <ProcessBudgetModal transactionNumber={transaction.transaction_number} onClose={() => setShowBudgetModal(false)} />}
      {showApproveModal && <ApproveModal transactionNumber={transaction.transaction_number} transactionApprovalId={transaction.transaction_number} onClose={() => setShowApproveModal(false)} />}
      {showVerifyModal && <VerifyModal transactionNumber={transaction.transaction_number} items={items} onClose={() => setShowVerifyModal(false)} />}
      {showReviewModal && (
        <ReviewAttachmentModal
          transactionId={transaction.transaction_number}
          transactionNumber={transaction.transaction_number}
          transactionType={transaction.transaction_type}
          stage={transaction.status}
          onClose={() => setShowReviewModal(false)}
        />
      )}
      {showSubmitModal && (
        <SubmitModal
          transactionNumber={transaction.transaction_number}
          transactionType={transaction.transaction_type}
          stage={transaction.status}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowSubmitModal(false)}
          mappedAttachments={mappedAttachments}
        />
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">{t("detailTransaction.info.transactionNumber")}</p>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200">{transaction.transaction_number}</p>
          </div>
          <div className="flex items-center gap-2">
            {transaction.status.toLowerCase() === "draft" && (
              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isSubmitting ? t("detailTransaction.header.submitting") : t("detailTransaction.header.submitForVerification")}
              </button>
            )}
            <StatusBadge status={transaction.status} />
            <StatusBadge status={data?.data?.stages?.[data?.data?.stages?.length - 1]?.to_stage ?? ""} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {infoGrid.map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col items-center">
            {transaction.notes && (
              <div className="border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 mb-1">{t("detailTransaction.info.transactionNotes")}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{transaction.notes}</p>
              </div>
            )}
          </div>
          {transaction.status.toLowerCase() !== "draft" && (
            <div className="flex flex-col items-center py-auto">
              <button
                onClick={() => setShowReviewModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {t("detailTransaction.header.reviewAttachment")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t("detailTransaction.items.title")}</h3>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
            {t("detailTransaction.items.count", { count: items.length })}
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">{index + 1}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.item_name}</span>
                  <span className="text-xs bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">{item.category_name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatRupiah(item.total_price)}</span>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{t("detailTransaction.items.quantity")}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.quantity} {t("detailTransaction.items.unit")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{t("detailTransaction.items.unitPrice")}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatRupiah(item.unit_price)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{t("detailTransaction.items.branchCode")}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.branch_code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{t("detailTransaction.items.assetNumber")}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{getAssetNumberRange(item.assets)}</p>
                  </div>
                </div>

                {item.notes && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{t("detailTransaction.items.notes")}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.notes}</p>
                  </div>
                )}

                {item.details && item.details.length > 0 && (
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t("detailTransaction.items.recipientDetail")}</p>
                    <div className="space-y-2">
                      {item.details.map((detail) => (
                        <div key={detail.id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-medium flex items-center justify-center flex-shrink-0">
                            {detail.requester_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">{detail.requester_name}</p>
                            <p className="text-xs text-gray-400">
                              {detail.branch_code} · {detail.quantity} {t("detailTransaction.items.unit")}
                            </p>
                          </div>
                          {detail.notes && <p className="text-xs text-gray-400 italic">{detail.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Flow */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t("detailTransaction.approval.title")}</h3>
          {totalSteps > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t("detailTransaction.approval.stepsCompleted", { completed: completedSteps, total: totalSteps })}
            </span>
          )}
        </div>

        {totalSteps > 0 && (
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-5">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(completedSteps / totalSteps) * 100}%` }} />
          </div>
        )}

        {isLoadingApproval ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : approvals.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">{t("detailTransaction.approval.noData")}</p>
        ) : (
          <div>
            {approvals.map((approval: approvalStatusState, index: number) => {
              const status = approval.status?.toLowerCase() ?? "pending"
              const isLast = index === approvals.length - 1
              const isApproved = status === "approved"
              const isRejected = status === "rejected"

              const stepColor = isApproved ? "bg-emerald-500 border-emerald-500 text-white"
                : isRejected ? "bg-red-500 border-red-500 text-white"
                  : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"

              const badgeColor = isApproved ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700"
                : isRejected ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700"
                  : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700"

              const dotColor = isApproved ? "bg-emerald-500" : isRejected ? "bg-red-500" : "bg-amber-400"
              const badgeLabel = isApproved
                ? t("detailTransaction.approval.status.approved")
                : isRejected
                  ? t("detailTransaction.approval.status.rejected")
                  : t("detailTransaction.approval.status.pending")

              return (
                <div key={approval.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${stepColor}`}>
                      {isApproved ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      ) : isRejected ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      ) : index + 1}
                    </div>
                    {!isLast && <div className={`w-0.5 flex-1 mt-1 min-h-4 ${isApproved ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"}`} />}
                  </div>

                  <div className="pb-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                          {approval.flow_step?.step_name ?? t("detailTransaction.approval.stepFallback", { index: index + 1 })}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{approval.approver_role_name}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${badgeColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        {badgeLabel}
                      </span>
                    </div>

                    {isApproved && approval.updated_at && (
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {t("detailTransaction.approval.approvedAt", {
                          date: new Date(approval.updated_at).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
                        })}
                        {approval.approved_by && (
                          <span className="text-gray-400 dark:text-gray-500 ml-1">
                            · {t("detailTransaction.approval.by")} {approval.approved_by}
                          </span>
                        )}
                      </div>
                    )}

                    {isRejected && approval.rejected_at && (
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {t("detailTransaction.approval.rejectedAt", {
                          date: new Date(approval.rejected_at).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
                        })}
                        {approval.rejected_by && (
                          <span className="text-gray-400 dark:text-gray-500 ml-1">
                            · {t("detailTransaction.approval.by")} {approval.rejected_by}
                          </span>
                        )}
                      </div>
                    )}

                    {approval.notes && (
                      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                        "{approval.notes}"
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4">
        <div className="flex gap-8">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{t("detailTransaction.summary.totalItems")}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {t("detailTransaction.summary.itemsValue", { types: items.length, units: totalUnit })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">{t("detailTransaction.summary.totalValue")}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatRupiah(totalNilai)}</p>
          </div>
        </div>
        <div>
          {isVerif && <button onClick={() => setShowVerifyModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">{t("detailTransaction.actions.verify")}</button>}
          {isApprove && <button onClick={() => setShowApproveModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">{t("detailTransaction.actions.approve")}</button>}
          {isBudget && <button onClick={() => setShowBudgetModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">{t("detailTransaction.actions.processBudget")}</button>}
          {isExecute && <button onClick={() => setShowExecuteModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">{t("detailTransaction.actions.executeAsset")}</button>}
          {isGR && <button onClick={() => setShowGRModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">{t("detailTransaction.actions.goodsReceipt")}</button>}
        </div>
      </div>
    </section>
  )
}