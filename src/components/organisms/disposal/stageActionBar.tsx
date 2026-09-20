import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StageActionModal } from "./stageActionModal"
import { SetSaleValuesModal } from "./setSaleValuesModal"
import { SubmitDisposalModal } from "./submitDraftModal"
import {
  useConfirmDisposalAssetDeletion,
  useConfirmDisposalFinance,
  useConfirmDisposalTax,
  useExecuteDisposal,
  useInitiateDisposalApprovalAgreement,
  useInitiateDisposalApprovalRequest,
  useRejectDisposal,
} from "../../../hooks/mutation/disposal/stageActions"
import {
  DISPOSAL_STAGE,
  canRejectAtStage,
  disposalStageLabel,
  isTerminalStage,
} from "../../../utils/disposalStage"
import { useDisposalApprovalStatus } from "../../../hooks/query/disposal/approvalStatus"
import type { DisposalAsset, Transaction } from "../../../models/disposal/detail"

type ActiveModal =
  | "submit"
  | "sale-values"
  | "approval-request"
  | "approval-agreement"
  | "execute"
  | "finance"
  | "tax"
  | "asset-deletion"
  | "reject"
  | null

interface DisposalStageActionBarProps {
  transaction: Transaction
  assets: DisposalAsset[]
  /** false kalau syarat dokumen backend belum terpenuhi — aksi lanjut diblokir */
  canProceed?: boolean
  /** penjelasan kenapa diblokir, dari useDisposalStageGate */
  blockReason?: string
}

/**
 * Tombol aksi yang relevan dengan current_stage transaksi.
 * Alur stage mengikuti backend: DISPOSE (6 stage) vs SELL (9 stage).
 */
export function DisposalStageActionBar({
  transaction,
  assets,
  canProceed = true,
  blockReason,
}: DisposalStageActionBarProps) {
  const { t } = useTranslation()
  const [modal, setModal] = useState<ActiveModal>(null)
  const close = () => setModal(null)

  const transactionNumber = transaction.transaction_number
  const stage = transaction.current_stage?.toUpperCase()
  const params = { transactionNumber, onSuccess: close }

  const initiateRequest = useInitiateDisposalApprovalRequest(params)
  const initiateAgreement = useInitiateDisposalApprovalAgreement(params)
  const execute = useExecuteDisposal(params)
  const finance = useConfirmDisposalFinance(params)
  const tax = useConfirmDisposalTax(params)
  const assetDeletion = useConfirmDisposalAssetDeletion(params)
  const reject = useRejectDisposal(params)

  const blockedHint = canProceed ? undefined : blockReason

  // Sejak submit draft otomatis memanggil initiate (backend SubmitDisposal),
  // tombol "ajukan" manual hanya relevan untuk transaksi lama yang terlanjur
  // pindah stage tanpa punya baris approval. Endpoint status balas 404 kalau
  // approval-nya memang belum ada.
  const approvalKind =
    stage === DISPOSAL_STAGE.APPROVAL_REQUEST
      ? ("approval-request" as const)
      : stage === DISPOSAL_STAGE.APPROVAL_AGREEMENT
        ? ("approval-agreement" as const)
        : null

  const { data: approvalStatus, isLoading: approvalLoading } = useDisposalApprovalStatus(
    transactionNumber,
    approvalKind ?? "approval-request",
    !!approvalKind
  )

  const approvalSummary = approvalStatus?.data
  const approvalInitiated = (approvalSummary?.total_steps ?? 0) > 0

  // Aksi utama per stage
  const primaryAction = (() => {
    switch (stage) {
      case DISPOSAL_STAGE.DRAFT:
        return { label: t("disposalAction.submit.button"), modal: "submit" as const, tone: "indigo" as const }
      case DISPOSAL_STAGE.PURCHASING:
        return { label: t("disposalAction.saleValues.button"), modal: "sale-values" as const, tone: "indigo" as const }
      case DISPOSAL_STAGE.APPROVAL_REQUEST:
        // approval sudah terbentuk otomatis saat submit → tidak ada aksi manual
        if (approvalInitiated || approvalLoading) return null
        return { label: t("disposalAction.approvalRequest.button"), modal: "approval-request" as const, tone: "indigo" as const }
      case DISPOSAL_STAGE.APPROVAL_AGREEMENT:
        if (approvalInitiated || approvalLoading) return null
        return { label: t("disposalAction.approvalAgreement.button"), modal: "approval-agreement" as const, tone: "indigo" as const }
      case DISPOSAL_STAGE.EXECUTE:
        return { label: t("disposalAction.execute.button"), modal: "execute" as const, tone: "indigo" as const }
      case DISPOSAL_STAGE.FINANCE:
        return { label: t("disposalAction.finance.button"), modal: "finance" as const, tone: "emerald" as const }
      case DISPOSAL_STAGE.TAX:
        return { label: t("disposalAction.tax.button"), modal: "tax" as const, tone: "emerald" as const }
      case DISPOSAL_STAGE.ASSET_DELETION:
        return { label: t("disposalAction.assetDeletion.button"), modal: "asset-deletion" as const, tone: "emerald" as const }
      default:
        return null
    }
  })()

  // Gate sudah menghitung stage mana yang syarat dokumennya dicek backend
  const primaryDisabled = !canProceed

  if (isTerminalStage(stage)) {
    return (
      <div className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {t("disposalAction.terminal", { stage: disposalStageLabel(stage) })}
        </span>
      </div>
    )
  }

  return (
    <>
      {/* ── Modals ── */}
      {modal === "submit" && (
        <SubmitDisposalModal transactionNumber={transactionNumber} onClose={close} />
      )}

      {modal === "sale-values" && (
        <SetSaleValuesModal
          transactionNumber={transactionNumber}
          assets={assets}
          onClose={close}
        />
      )}

      {modal === "approval-request" && (
        <StageActionModal
          title={t("disposalAction.approvalRequest.title")}
          transactionNumber={transactionNumber}
          infoMessage={t("disposalAction.approvalRequest.info")}
          confirmLabel={t("disposalAction.submitLabel")}
          isPending={initiateRequest.isPending}
          onConfirm={() => initiateRequest.mutate()}
          onClose={close}
        />
      )}

      {modal === "approval-agreement" && (
        <StageActionModal
          title={t("disposalAction.approvalAgreement.title")}
          transactionNumber={transactionNumber}
          infoMessage={t("disposalAction.approvalAgreement.info")}
          confirmLabel={t("disposalAction.submitLabel")}
          isPending={initiateAgreement.isPending}
          onConfirm={() => initiateAgreement.mutate()}
          onClose={close}
        />
      )}

      {modal === "execute" && (
        <StageActionModal
          title={t("disposalAction.execute.title")}
          transactionNumber={transactionNumber}
          infoMessage={blockedHint ?? t("disposalAction.execute.info")}
          notesLabel={t("disposalAction.execute.notesLabel")}
          notesPlaceholder={t("disposalAction.execute.notesPlaceholder")}
          confirmLabel={t("disposalAction.execute.confirm")}
          tone={canProceed ? "indigo" : "red"}
          isPending={execute.isPending}
          confirmDisabled={!canProceed}
          onConfirm={(notes) => execute.mutate({ notes: notes || undefined })}
          onClose={close}
        />
      )}

      {modal === "finance" && (
        <StageActionModal
          title={t("disposalAction.finance.title")}
          transactionNumber={transactionNumber}
          infoMessage={blockedHint ?? t("disposalAction.finance.info")}
          notesLabel={t("disposalAction.finance.notesLabel")}
          confirmLabel={t("disposalAction.confirmLabel")}
          tone={canProceed ? "emerald" : "red"}
          isPending={finance.isPending}
          confirmDisabled={!canProceed}
          onConfirm={(notes) => finance.mutate({ notes: notes || undefined })}
          onClose={close}
        />
      )}

      {modal === "tax" && (
        <StageActionModal
          title={t("disposalAction.tax.title")}
          transactionNumber={transactionNumber}
          infoMessage={blockedHint ?? t("disposalAction.tax.info")}
          notesLabel={t("disposalAction.tax.notesLabel")}
          confirmLabel={t("disposalAction.confirmLabel")}
          tone={canProceed ? "emerald" : "red"}
          isPending={tax.isPending}
          confirmDisabled={!canProceed}
          onConfirm={(notes) => tax.mutate({ notes: notes || undefined })}
          onClose={close}
        />
      )}

      {modal === "asset-deletion" && (
        <StageActionModal
          title={t("disposalAction.assetDeletion.title")}
          transactionNumber={transactionNumber}
          infoMessage={t("disposalAction.assetDeletion.info")}
          notesLabel={t("disposalAction.assetDeletion.notesLabel")}
          confirmLabel={t("disposalAction.assetDeletion.confirm")}
          tone="emerald"
          isPending={assetDeletion.isPending}
          onConfirm={(notes) => assetDeletion.mutate({ notes: notes || undefined })}
          onClose={close}
        />
      )}

      {modal === "reject" && (
        <StageActionModal
          title={t("disposalAction.reject.title")}
          transactionNumber={transactionNumber}
          infoMessage={t("disposalAction.reject.info")}
          notesLabel={t("disposalAction.reject.notesLabel")}
          notesPlaceholder={t("disposalAction.reject.notesPlaceholder")}
          notesRequired
          notesMinLength={10}
          confirmLabel={t("disposalAction.reject.title")}
          tone="red"
          isPending={reject.isPending}
          onConfirm={(notes) => reject.mutate({ reason: notes.trim() })}
          onClose={close}
        />
      )}

      {/* ── Buttons ── */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {primaryDisabled && blockReason && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mr-auto">
            {blockReason}
          </p>
        )}

        {approvalKind && approvalInitiated && (
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mr-auto">
            {t("disposalAction.waitingApproval", {
              done: approvalSummary?.completed_steps ?? 0,
              total: approvalSummary?.total_steps ?? 0,
            })}
          </p>
        )}

        {canRejectAtStage(stage) && (
          <button
            onClick={() => setModal("reject")}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {t("disposalAction.reject.button")}
          </button>
        )}

        {primaryAction && (
          <button
            onClick={() => setModal(primaryAction.modal)}
            disabled={primaryDisabled}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              primaryAction.tone === "emerald"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {primaryAction.label}
          </button>
        )}
      </div>
    </>
  )
}
