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
  useReviseAgreement,
} from "../../../../hooks/mutation/disposalAgreement"
import { useMyProfile } from "../../../../hooks/query/auth/myProfile"
import { AgreementStageBadge } from "../../../organisms/disposalAgreement/stageBadge"
import { StepDecisionModal } from "../../../organisms/disposal/stepDecisionModal"
import { formatRupiah } from "../../../../utils/disposalStage"
import { approvalRoleWithActor } from "../../../../utils/approval"
import { withStageEmail } from "../../../../stores/stageEmailStore"
import { RevisionDecisionModal } from "../../../organisms/common/revisionDecisionModal"

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
  const revise = useReviseAgreement(number)

  const [modal, setModal] = useState<"step-approve" | "step-reject" | null>(null)
  const [showRevise, setShowRevise] = useState(false)
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

  const isPending = approve.isPending || reject.isPending || revise.isPending

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

  const members = agreement.items ?? []

  return (
    <section className="space-y-4 mt-4">
      {showRevise && (
        // Revisi agreement = mengeluarkan anggota bermasalah ke DRAFT miliknya.
        // Minimal satu anggota tersisa; kalau semua bermasalah, pakai Tolak.
        <RevisionDecisionModal
          mode="revise"
          transactionNumber={agreement.agreement_number}
          info={t("disposalAgreement.revise.info")}
          pickLabel={t("disposalAgreement.revise.pickMembers")}
          maxSelected={Math.max(members.length - 1, 0)}
          maxSelectedMessage={t("disposalAgreement.revise.keepOne")}
          rows={members.map((item) => ({
            id: item.transaction_id,
            label: item.transaction_number,
            sublabel: `${item.branch_code} · ${item.created_by_name ?? item.created_by} · ${t("disposalAgreement.revise.assets", { count: item.total_assets })}`,
          }))}
          isPending={revise.isPending}
          onClose={() => setShowRevise(false)}
          onConfirm={({ notes, rowIds }) => {
            const picked = members
              .filter((item) => rowIds.includes(item.transaction_id))
              .map((item) => item.transaction_number)
            return withStageEmail(
              {
                transactionType: "disposal_agreement",
                transactionNumber: number,
                action: "revise",
                memberNumbers: picked,
              },
              () =>
                revise.mutateAsync(
                  { revision_notes: notes, transaction_numbers: picked },
                  { onSuccess: () => setShowRevise(false) }
                )
            )
          }}
        />
      )}

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

            const context = {
              transactionType: "disposal_agreement" as const,
              transactionNumber: number,
            }
            if (modal === "step-approve") {
              return withStageEmail({ ...context, action: "proceed" }, () => approve.mutateAsync(payload, done))
            }
            return withStageEmail({ ...context, action: "reject" }, () => reject.mutateAsync(payload, done))
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
              label: t("disposalAgreement.totalAssets"),
              value: `${agreement.total_assets ?? 0}`,
            },
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

      {/* Daftar aset — yang ditimbang saat menyetujui kesepakatan adalah
          asetnya, bukan nomor transaksinya. Nomor transaksi tetap dibawa per
          baris supaya tetap bisa ditelusuri. */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
          {t("disposalAgreement.assets")}
        </h3>
        <p className="text-xs text-gray-400 mb-4">{t("disposalAgreement.assetsHint")}</p>

        <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {[
                  { key: "no", label: t("disposalAgreement.assetColumn.no"), className: "w-16 text-center" },
                  { key: "asset", label: t("disposalAgreement.assetColumn.asset") },
                  { key: "category", label: t("disposalAgreement.assetColumn.category") },
                  { key: "branch", label: t("disposalAgreement.assetColumn.branch") },
                  { key: "reason", label: t("disposalAgreement.assetColumn.reason") },
                  { key: "value", label: t("disposalAgreement.assetColumn.saleValue"), className: "text-right" },
                  { key: "transaction", label: t("disposalAgreement.assetColumn.transaction") },
                ].map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 whitespace-nowrap ${
                      column.className ?? ""
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {(agreement.assets ?? []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                    {t("disposalAgreement.noAssets")}
                  </td>
                </tr>
              ) : (
                (agreement.assets ?? []).map((asset, index) => (
                  <tr
                    key={asset.disposal_asset_id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {asset.asset_name ?? "-"}
                      </p>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">
                        {asset.asset_number}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {asset.category_name ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {asset.branch_code ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                      {asset.disposal_reason || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {asset.sale_value != null ? formatRupiah(asset.sale_value) : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a
                        href={`/dashboard/disposal/${asset.transaction_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-600 hover:text-indigo-700 hover:underline"
                        title={t("disposalAgreement.viewDisposal")}
                      >
                        {asset.transaction_number}
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
                    {approvalRoleWithActor(approval.approver_role_name, approval)}
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
          {/* butuh minimal 2 anggota — satu harus tetap tinggal */}
          {members.length > 1 && (
            <button
              onClick={() => setShowRevise(true)}
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-medium border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors disabled:opacity-50"
            >
              {t("disposalAgreement.revise.button")}
            </button>
          )}
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
