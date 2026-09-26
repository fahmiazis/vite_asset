import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Head from "../../molecules/head"
import { useHandoverApprovalStatus, useHandoverDetail } from "../../../hooks/query/handover"
import { useMyProfile } from "../../../hooks/query/auth/myProfile"
import {
  useApproveHandoverStep,
  useCancelHandover,
  useConfirmHandoverReceiving,
  useRejectHandoverReceiving,
  useRejectHandoverStep,
  useReviseHandover,
  useSubmitHandover,
} from "../../../hooks/mutation/handover"
import { StageActionModal } from "../../organisms/disposal/stageActionModal"
import { RevisionDecisionModal } from "../../organisms/common/revisionDecisionModal"
import { HandoverStageBadge, HandoverTypeBadge } from "../../organisms/handover/badges"
import { HandoverDocumentsPanel } from "../../organisms/handover/documentsPanel"
import { HANDOVER_STAGE, handoverStages, isHandoverTerminal } from "../../../constans/handover"
import { withStageEmail } from "../../../stores/stageEmailStore"
import type { EmailAction } from "../../../models/emailSetting/template"

type Modal =
  | "submit"
  | "cancel"
  | "revise"
  | "step-approve"
  | "step-reject"
  | "confirm"
  | "reject-receiving"
  | null

function formatDate(value?: string | null) {
  if (!value) return "-"
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

export default function HandoverDetailPage() {
  const { "*": rawNumber } = useParams()
  const number = rawNumber ?? ""
  const { t } = useTranslation()

  const { data, isLoading } = useHandoverDetail(number)
  const detail = data?.data
  const stage = detail?.transaction.current_stage ?? ""

  const hasApproval = !!detail && stage !== HANDOVER_STAGE.DRAFT && stage !== HANDOVER_STAGE.CANCELLED
  const { data: approvalData } = useHandoverApprovalStatus(number, hasApproval)
  const approvals = approvalData?.data?.approvals ?? []

  const { data: profile } = useMyProfile()
  const myUserId = profile?.data?.id
  const myRoleIds = new Set((profile?.data?.roles ?? []).map((r) => r.id))

  const submit = useSubmitHandover(number)
  const cancel = useCancelHandover(number)
  const revise = useReviseHandover(number)
  const approve = useApproveHandoverStep(number)
  const rejectStep = useRejectHandoverStep(number)
  const confirm = useConfirmHandoverReceiving(number)
  const rejectReceiving = useRejectHandoverReceiving(number)

  const [modal, setModal] = useState<Modal>(null)
  const close = () => setModal(null)

  if (isLoading) return <p className="p-6 text-sm text-gray-400">{t("handover.loading")}</p>
  if (!detail) return <p className="p-6 text-sm text-gray-500">{t("handover.notFound")}</p>

  const trx = detail.transaction
  const isCreator = !!myUserId && myUserId === trx.created_by
  const isDraft = stage === HANDOVER_STAGE.DRAFT
  const isApproval = stage === HANDOVER_STAGE.APPROVAL
  const isReceiving = stage === HANDOVER_STAGE.RECEIVING

  // step berjalan = baris pending pertama (backend sudah mengurutkan)
  const currentApproval = approvals.find((a) => a.status?.toLowerCase() === "pending")
  const isCurrentApprover =
    isApproval &&
    !!currentApproval &&
    (myRoleIds.has(currentApproval.approver_role_id) || currentApproval.approver_user_id === myUserId)

  const gate = (action: EmailAction, run: () => Promise<unknown>) =>
    withStageEmail({ transactionType: "handover", transactionNumber: number, action }, run)
  const done = { onSuccess: close }

  const activeAssets = detail.assets.filter((a) => a.status !== "CANCELLED")
  const stepIndex = handoverStages.indexOf(stage as (typeof handoverStages)[number])

  const docStage = isDraft ? HANDOVER_STAGE.DRAFT : HANDOVER_STAGE.RECEIVING
  const showDocs = isDraft || isReceiving || stage === HANDOVER_STAGE.FINISHED
  const canUploadDocs = (isDraft && isCreator) || (isReceiving && detail.can_confirm_receiving)

  const recipientLabel =
    detail.handover_type === "RETURN" ? t("handover.branch", { code: detail.branch_code }) : detail.to_user_name ?? "-"

  const info = [
    { label: t("handover.info.type"), value: <HandoverTypeBadge type={detail.handover_type} /> },
    { label: t("handover.info.recipient"), value: recipientLabel },
    { label: t("handover.info.branch"), value: detail.branch_code },
    { label: t("handover.info.date"), value: new Date(trx.transaction_date).toLocaleDateString("id-ID") },
    { label: t("handover.info.createdBy"), value: trx.created_by_name ?? trx.created_by },
    { label: t("handover.info.totalAssets"), value: detail.total_assets },
  ]

  const button = (label: string, onClick: () => void, tone: "primary" | "danger" | "warning" | "ghost" | "success") => {
    const styles = {
      primary: "text-white bg-indigo-600 hover:bg-indigo-700",
      success: "text-white bg-emerald-600 hover:bg-emerald-700",
      danger: "border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30",
      warning: "border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30",
      ghost: "border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
    }
    return (
      <button onClick={onClick} className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-colors ${styles[tone]}`}>
        {label}
      </button>
    )
  }

  return (
    <section className="space-y-4 mt-2">
      {/* ── Modals ── */}
      {modal === "submit" && (
        <StageActionModal
          title={detail.needs_revision ? t("handover.action.resubmit") : t("handover.action.submit")}
          transactionNumber={number}
          infoMessage={t("handover.action.submitInfo")}
          notesLabel={t("handover.action.notes")}
          confirmLabel={t("handover.action.submit")}
          isPending={submit.isPending}
          onConfirm={(notes) => gate("proceed", () => submit.mutateAsync(notes || undefined, done))}
          onClose={close}
        />
      )}
      {(modal === "step-approve" || modal === "step-reject") && currentApproval && (
        <StageActionModal
          title={modal === "step-approve" ? t("handover.action.approve") : t("handover.action.reject")}
          transactionNumber={number}
          infoMessage={t("handover.action.stepInfo", { step: currentApproval.approver_role_name ?? "" })}
          notesLabel={t("handover.action.notes")}
          notesRequired={modal === "step-reject"}
          notesMinLength={modal === "step-reject" ? 10 : 0}
          confirmLabel={modal === "step-approve" ? t("handover.action.approve") : t("handover.action.reject")}
          tone={modal === "step-approve" ? "emerald" : "red"}
          isPending={approve.isPending || rejectStep.isPending}
          onConfirm={(notes) => {
            const payload = { transaction_approval_id: currentApproval.id, notes: notes.trim() || undefined }
            return modal === "step-approve"
              ? gate("proceed", () => approve.mutateAsync(payload, done))
              : gate("reject", () => rejectStep.mutateAsync(payload, done))
          }}
          onClose={close}
        />
      )}
      {(modal === "revise" || modal === "cancel") && (
        <RevisionDecisionModal
          mode={modal}
          transactionNumber={number}
          rows={activeAssets.map((a) => ({ id: a.id, label: a.asset_name || a.asset_number, sublabel: a.asset_number }))}
          isPending={revise.isPending || cancel.isPending}
          onConfirm={({ notes, rowIds }) =>
            modal === "revise"
              ? gate("revise", () => revise.mutateAsync({ revision_notes: notes, row_ids: rowIds }, done))
              : gate("cancel", () => cancel.mutateAsync(notes, done))
          }
          onClose={close}
        />
      )}
      {modal === "confirm" && (
        <StageActionModal
          title={t("handover.action.confirm")}
          transactionNumber={number}
          infoMessage={t(`handover.action.confirmInfo.${detail.handover_type}`)}
          notesLabel={t("handover.action.notes")}
          confirmLabel={t("handover.action.confirm")}
          tone="emerald"
          isPending={confirm.isPending}
          onConfirm={(notes) => gate("proceed", () => confirm.mutateAsync(notes || undefined, done))}
          onClose={close}
        />
      )}
      {modal === "reject-receiving" && (
        <StageActionModal
          title={t("handover.action.rejectReceiving")}
          transactionNumber={number}
          infoMessage={t("handover.action.rejectReceivingInfo")}
          notesLabel={t("handover.action.reason")}
          notesRequired
          notesMinLength={10}
          confirmLabel={t("handover.action.rejectReceiving")}
          tone="red"
          isPending={rejectReceiving.isPending}
          onConfirm={(notes) => gate("reject", () => rejectReceiving.mutateAsync(notes.trim(), done))}
          onClose={close}
        />
      )}

      <Head label={t("handover.detailTitle")} className="mb-0" />

      {/* Header */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400">{t("handover.info.number")}</p>
            <p className="text-base font-semibold font-mono text-gray-800 dark:text-gray-200 break-all">{trx.transaction_number}</p>
          </div>
          <HandoverStageBadge stage={stage} />
        </div>

        {detail.needs_revision && isDraft && (
          <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-700 dark:text-amber-400">
            {t("handover.revisionBanner")}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {info.map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value}</div>
            </div>
          ))}
        </div>
        {trx.notes && (
          <div>
            <p className="text-xs text-gray-400 mb-1">{t("handover.info.notes")}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{trx.notes}</p>
          </div>
        )}

        {/* Stepper */}
        {!isHandoverTerminal(stage) || stage === HANDOVER_STAGE.FINISHED ? (
          <ol className="flex flex-wrap items-center gap-2 pt-2">
            {handoverStages.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold ${
                    i < stepIndex || stage === HANDOVER_STAGE.FINISHED
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : i === stepIndex
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                  }`}
                >
                  {s}
                </span>
                {i < handoverStages.length - 1 && <span className="text-gray-300">→</span>}
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      {/* Aset */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {t("handover.assetsTitle", { count: detail.total_assets })}
        </p>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-900/60">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2.5">{t("handover.column.assetNumber")}</th>
                <th className="px-3 py-2.5">{t("handover.column.assetName")}</th>
                <th className="px-3 py-2.5">{t("handover.column.category")}</th>
                <th className="px-3 py-2.5">{t("handover.column.previousHolder")}</th>
                <th className="px-3 py-2.5">{t("handover.column.rowStatus")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {detail.assets.map((a) => (
                <tr key={a.id} className={a.status === "CANCELLED" ? "opacity-50" : ""}>
                  <td className="px-3 py-2.5 font-mono text-xs">
                    <Link to={`/dashboard/asset/${a.asset_number}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                      {a.asset_number}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    {a.asset_name}
                    {a.needs_revision && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        {t("handover.needsRevision")}{a.revision_notes ? `: ${a.revision_notes}` : ""}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">{a.category_name ?? "-"}</td>
                  <td className="px-3 py-2.5 text-gray-500">{a.from_user_name ?? t("handover.heldByBranch")}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval */}
      {approvals.length > 0 && (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {t("handover.approvalTitle", {
              done: approvalData?.data?.completed_steps ?? 0,
              total: approvalData?.data?.total_steps ?? 0,
            })}
          </p>
          <ol className="space-y-2">
            {approvals.map((a, i) => (
              <li key={a.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {i + 1}. {a.approver_role_name ?? "-"}
                </span>
                <span className="text-[11px] font-semibold font-mono uppercase text-gray-500">{a.status}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {showDocs && (
        <HandoverDocumentsPanel
          transactionNumber={number}
          stage={docStage}
          branchCode={detail.branch_code}
          canUpload={canUploadDocs}
        />
      )}

      {/* Riwayat stage */}
      {detail.stages.length > 0 && (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{t("handover.historyTitle")}</p>
          <ol className="space-y-2">
            {detail.stages.map((s) => (
              <li key={s.id} className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-mono">{s.from_stage ?? "-"} → {s.to_stage}</span>
                <span className="text-gray-400"> · {s.actor_name ?? s.actor_id} · {formatDate(s.created_at)}</span>
                {s.notes && <p className="text-gray-500 mt-0.5 whitespace-pre-wrap">{s.notes}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Aksi */}
      {!isHandoverTerminal(stage) && (
        <div className="flex flex-wrap items-center justify-end gap-3">
          {isCreator && (isDraft || isApproval) && button(t("handover.action.cancel"), () => setModal("cancel"), "ghost")}
          {isDraft && isCreator && (
            <Link
              to={`/dashboard/handover/create?edit=${encodeURIComponent(number)}`}
              className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {t("handover.action.edit")}
            </Link>
          )}
          {isDraft && isCreator && button(
            detail.needs_revision ? t("handover.action.resubmit") : t("handover.action.submit"),
            () => setModal("submit"),
            "primary"
          )}
          {isCurrentApprover && (
            <>
              {button(t("handover.action.revise"), () => setModal("revise"), "warning")}
              {button(t("handover.action.reject"), () => setModal("step-reject"), "danger")}
              {button(t("handover.action.approve"), () => setModal("step-approve"), "success")}
            </>
          )}
          {isReceiving && detail.can_confirm_receiving && (
            <>
              {button(t("handover.action.rejectReceiving"), () => setModal("reject-receiving"), "danger")}
              {button(t("handover.action.confirm"), () => setModal("confirm"), "success")}
            </>
          )}
          {isReceiving && !detail.can_confirm_receiving && (
            <p className="text-xs text-gray-500 mr-auto">
              {detail.handover_type === "HANDOVER"
                ? t("handover.waitingRecipient", { name: detail.to_user_name ?? "-" })
                : t("handover.waitingBranch")}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
