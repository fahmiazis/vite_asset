import { useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Head from "../../../molecules/head"
import {
  useDisposalAgreementApprovalStatus,
  useDisposalAgreementDetail,
} from "../../../../hooks/query/disposalAgreement"
import {
  useApproveAgreementStep,
  useRejectAgreementStep,
} from "../../../../hooks/mutation/disposalAgreement"
import { useMyProfile } from "../../../../hooks/query/auth/myProfile"
import { AgreementStageBadge } from "../../../organisms/disposalAgreement/stageBadge"
import { StepDecisionModal } from "../../../organisms/disposal/stepDecisionModal"
import { disposalTypeLabel, formatRupiah } from "../../../../utils/disposalStage"

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

export default function DisposalAgreementDetailPage() {
  const { "*": agreementNumber } = useParams()
  const number = agreementNumber ?? ""
  const { t } = useTranslation()

  const { data, isLoading } = useDisposalAgreementDetail(number)
  const { data: approvalStatus } = useDisposalAgreementApprovalStatus(number)
  const { data: profile } = useMyProfile()

  const approve = useApproveAgreementStep(number)
  const reject = useRejectAgreementStep(number)

  const [modal, setModal] = useState<"step-approve" | "step-reject" | null>(null)
  const [notes, setNotes] = useState("")

  const agreement = data?.data
  const summary = approvalStatus?.data

  const myRoleIds = new Set((profile?.data?.roles ?? []).map((role) => role.id))
  const myUserId = profile?.data?.id

  // step berjalan = baris pending pertama
  const currentApproval = summary?.approvals?.find(
    (item) => item.status?.toLowerCase() === "pending"
  )

  const isCurrentApprover =
    !!currentApproval &&
    (myRoleIds.has(currentApproval.approver_role_id) ||
      (!!currentApproval.approver_user_id &&
        currentApproval.approver_user_id === myUserId))

  const isPending = approve.isPending || reject.isPending

  const closeModal = () => {
    setModal(null)
    setNotes("")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 dark:border-white" />
      </div>
    )
  }

  if (!agreement) return null

  return (
    <section className="space-y-4 mt-4">
      {modal && currentApproval && (
        <StepDecisionModal
          mode={modal}
          stepName={currentApproval.flow_step?.step_name ?? ""}
          notes={notes}
          onNotesChange={setNotes}
          isPending={isPending}
          onClose={closeModal}
          onConfirm={() => {
            const payload = {
              transaction_approval_id: currentApproval.id,
              notes: notes.trim() || undefined,
            }
            const done = { onSuccess: closeModal }

            if (modal === "step-approve") approve.mutate(payload, done)
            else reject.mutate(payload, done)
          }}
        />
      )}

      <Head label={t("disposalAgreement.detailTitle")} className="mb-0" />

      {/* Header agreement */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-1">
              {t("disposalAgreement.agreementNumber")}
            </p>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 font-mono break-all">
              {agreement.agreement_number}
            </p>
          </div>
          <AgreementStageBadge stage={agreement.current_stage} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: t("disposalAgreement.totalTransactions"),
              value: `${agreement.total_items}`,
            },
            {
              label: t("disposalAgreement.createdBy"),
              value: agreement.created_by_name ?? agreement.created_by,
            },
            {
              label: t("disposalAgreement.createdAt"),
              value: formatDateTime(agreement.created_at),
            },
            ...(summary
              ? [
                  {
                    label: t("disposalAgreement.approvalProgress"),
                    value: `${summary.completed_steps}/${summary.total_steps}`,
                  },
                ]
              : []),
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {agreement.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 mb-1">{t("disposalAgreement.notes")}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{agreement.notes}</p>
          </div>
        )}

        {agreement.rejection_reason && (
          <p className="mt-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
            <span className="font-medium">
              {t("disposalAgreement.rejectionReason")}:
            </span>{" "}
            {agreement.rejection_reason}
          </p>
        )}
      </div>

      {/* Transaksi anggota */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
          {t("disposalAgreement.members")}
        </h3>
        <p className="text-xs text-gray-400 mb-4">{t("disposalAgreement.membersHint")}</p>

        <div className="space-y-2">
          {(agreement.items ?? []).map((item) => (
            <div
              key={item.transaction_number}
              className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-xs font-mono font-medium text-gray-800 dark:text-gray-200 truncate">
                  {item.transaction_number}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {disposalTypeLabel(item.disposal_type)}
                  {" · "}
                  {item.branch_code}
                  {" · "}
                  {t("disposalAgreement.assetCount", { count: item.total_assets })}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {item.total_sale_value != null && (
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {formatRupiah(item.total_sale_value)}
                  </span>
                )}

                {/* Dibuka di tab baru: approver biasanya memeriksa beberapa
                    transaksi sekaligus, jadi halaman agreement tidak ikut
                    hilang saat crosscheck. */}
                <a
                  href={`/dashboard/disposal/${item.transaction_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 rounded-lg transition-colors whitespace-nowrap"
                >
                  {t("disposalAgreement.viewDisposal")}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status approval */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {t("disposalAgreement.approvalStatus")}
          </h3>
          {summary && (
            <span className="text-xs text-gray-400">
              {t("disposalStagePanel.stepsDone", {
                done: summary.completed_steps,
                total: summary.total_steps,
              })}
            </span>
          )}
        </div>

        {!summary ? (
          <p className="text-center text-sm text-gray-400 py-6">
            {t("disposalStagePanel.notInitiated")}
          </p>
        ) : (
          <div className="space-y-2">
            {summary.approvals?.map((approval) => (
              <div
                key={approval.id}
                className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    {approval.flow_step?.step_order != null && (
                      <span className="text-gray-400 mr-1">
                        {approval.flow_step.step_order}.
                      </span>
                    )}
                    {approval.flow_step?.step_name ?? approval.approver_role_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {approval.approver_role_name}
                  </p>
                  {approval.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">
                      "{approval.notes}"
                    </p>
                  )}
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 flex-shrink-0">
                  {t(`disposalStagePanel.approvalStatus.${approval.status?.toUpperCase()}`, {
                    defaultValue: approval.status,
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Aksi approver */}
      {isCurrentApprover && (
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={() => setModal("step-reject")}
            disabled={isPending}
            className="px-5 py-2.5 text-sm font-medium border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
          >
            {t("disposalAction.step.reject")}
          </button>
          <button
            onClick={() => setModal("step-approve")}
            disabled={isPending}
            className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50"
          >
            {t("disposalAction.step.approve")}
          </button>
        </div>
      )}
    </section>
  )
}
