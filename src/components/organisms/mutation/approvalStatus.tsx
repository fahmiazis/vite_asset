import { useTranslation } from "react-i18next"
import { useMutationApprovalStatus } from "../../../hooks/query/mutation/approvalStatus"
import type { Approval } from "../../../models/mutation/approvalStatus"

type MutationApprovalStatusProps = {
  transactionNumber: string
}

export function MutationApprovalStatus({ transactionNumber }: MutationApprovalStatusProps) {
  const { t } = useTranslation()
  const { data, isLoading } = useMutationApprovalStatus(transactionNumber)

  const approvalData   = data?.data
  const approvals      = approvalData?.approvals      ?? []
  const totalSteps     = approvalData?.total_steps    ?? 0
  const completedSteps = approvalData?.completed_steps ?? 0

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {t("approvalStatus.title")}
        </h3>
        {totalSteps > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {completedSteps} / {totalSteps} {t("approvalStatus.completed")}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {totalSteps > 0 && (
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
          />
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading ? (
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
        <p className="text-xs text-gray-400 text-center py-4">
          {t("approvalStatus.noData")}
        </p>
      ) : (
        <div>
          {approvals.map((approval: Approval, index: number) => {
            const status     = approval.status?.toLowerCase() ?? "pending"
            const isLast     = index === approvals.length - 1
            const isApproved = status === "approved"
            const isRejected = status === "rejected"

            const stepColor = isApproved
              ? "bg-emerald-500 border-emerald-500 text-white"
              : isRejected
              ? "bg-red-500 border-red-500 text-white"
              : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"

            const badgeColor = isApproved
              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700"
              : isRejected
              ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700"
              : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700"

            const dotColor   = isApproved ? "bg-emerald-500" : isRejected ? "bg-red-500" : "bg-amber-400"
            const badgeLabel = isApproved
              ? t("approvalStatus.badge.approved")
              : isRejected
              ? t("approvalStatus.badge.rejected")
              : t("approvalStatus.badge.pending")

            return (
              <div key={approval.id} className="flex gap-3">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${stepColor}`}>
                    {isApproved ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isRejected ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 flex-1 mt-1 min-h-4 ${isApproved ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"}`} />
                  )}
                </div>

                {/* Content */}
                <div className="pb-4 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                        {approval.flow_step?.step_name ?? `${t("approvalStatus.step")} ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {approval.approver_role_name}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border flex-shrink-0 ${badgeColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                      {badgeLabel}
                    </span>
                  </div>

                  {/* Approved at */}
                  {isApproved && approval.approved_at && (
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(approval.approved_at).toLocaleString("id-ID", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                      {approval.approved_by && (
                        <span className="text-gray-400 dark:text-gray-500 ml-1">
                          · {t("approvalStatus.by")} {approval.approved_by}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Rejected at */}
                  {isRejected && approval.rejected_at && (
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(approval.rejected_at).toLocaleString("id-ID", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                      {approval.rejected_by && (
                        <span className="text-gray-400 dark:text-gray-500 ml-1">
                          · {t("approvalStatus.by")} {approval.rejected_by}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Notes */}
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
  )
}