import { useTranslation } from "react-i18next"
import { useDisposalApprovalStatus } from "../../../hooks/query/disposal/approvalStatus"
import type { DisposalApprovalKind } from "../../../services/disposal/approvalStatus"
import { approvalRoleWithActor } from "../../../utils/approval"

function ApprovalPill({ status }: { status: string }) {
  const { t } = useTranslation()
  const map: Record<string, string> = {
    APPROVED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    REJECTED: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    SKIPPED: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  }
  const key = status?.toUpperCase()
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[key] ?? map.PENDING}`}>
      {t(`disposalStagePanel.approvalStatus.${key}`, { defaultValue: status ?? "-" })}
    </span>
  )
}

interface DisposalApprovalStatusPanelProps {
  transactionNumber: string
  kind: DisposalApprovalKind
  title?: string
  /** true kalau dirender di dalam kartu lain (stepper) — chrome kartunya dilepas */
  embedded?: boolean
  /** flow belum diinisiasi → tampilkan CTA initiate */
  onInitiate?: () => void
  isInitiating?: boolean
}

/**
 * Menampilkan progres flow approval (request / agreement).
 * Kalau flow belum diinisiasi, backend membalas 404 → tampilkan tombol ajukan.
 */
export function DisposalApprovalStatusPanel({
  transactionNumber,
  kind,
  title,
  embedded = false,
  onInitiate,
  isInitiating = false,
}: DisposalApprovalStatusPanelProps) {
  const { t } = useTranslation()
  const { data, isLoading, error } = useDisposalApprovalStatus(transactionNumber, kind)
  const status = data?.data

  return (
    <div
      className={
        embedded
          ? ""
          : "bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5"
      }
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {title ?? t("disposalStagePanel.approvalTitle")}
        </h3>
        {status && (
          <span className="text-xs text-gray-400">
            {t("disposalStagePanel.stepsDone", {
              done: status.completed_steps,
              total: status.total_steps,
            })}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error || !status ? (
        <div className="text-center py-6 space-y-3">
          <p className="text-sm text-gray-400">{t("disposalStagePanel.notInitiated")}</p>
          {onInitiate && (
            <button
              onClick={onInitiate}
              disabled={isInitiating}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50"
            >
              {isInitiating
                ? t("disposalStagePanel.initiating")
                : t("disposalStagePanel.initiate")}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {status.approvals?.length ? (
            status.approvals.map((approval) => (
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
                {/* FIX: status_view itu 'visible'/'hidden', bukan status approval */}
                <ApprovalPill status={approval.status} />
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-400 py-4">
              {t("disposalStagePanel.noSteps")}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
