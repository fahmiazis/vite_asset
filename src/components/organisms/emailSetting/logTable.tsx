import { useState } from "react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { useEmailLogList } from "../../../hooks/query/emailSetting/logs"
import { useResendTransactionEmail } from "../../../hooks/mutation/emailSetting/resend"
import type { EmailLogStatus, emailLogState } from "../../../models/emailSetting/transactionEmail"

function formatDateTime(value: string | null) {
  if (!value) return "-"
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function ResendButton({ row }: { row: emailLogState }) {
  const { t } = useTranslation()
  const { mutate, isPending } = useResendTransactionEmail()

  const handleResend = () =>
    mutate(row.id, {
      onSuccess: (log) => {
        if (log.status === "SENT") toast.success(t("stageEmail.sent"))
        else toast.error(log.error_message || t("emailSetting.log.resendFailed"))
      },
      onError: (error) => {
        const e = error as { response?: { data?: { message?: string } } }
        toast.error(e?.response?.data?.message ?? t("emailSetting.log.resendFailed"))
      },
    })

  return (
    <button
      onClick={handleResend}
      disabled={isPending}
      className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
    >
      {isPending ? t("stageEmail.sending") : t("stageEmail.resend")}
    </button>
  )
}

/** Riwayat email dari dialog aksi. Selain admin hanya melihat kirimannya sendiri (difilter backend). */
export function EmailLogTable() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<EmailLogStatus | "">("FAILED")
  const [search, setSearch] = useState("")

  const { data, isLoading } = useEmailLogList({ status, transactionNumber: search.trim() })
  const rows = data?.data ?? []

  const statusOptions: { value: EmailLogStatus | ""; label: string }[] = [
    { value: "FAILED", label: t("emailSetting.log.status.FAILED") },
    { value: "SENT", label: t("emailSetting.log.status.SENT") },
    { value: "", label: t("emailSetting.log.status.all") },
  ]

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
          {statusOptions.map((o) => (
            <button
              key={o.value || "all"}
              onClick={() => setStatus(o.value)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                status === o.value
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder={t("emailSetting.log.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 max-w-full"
        />
      </section>

      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr className="text-left text-xs font-medium uppercase tracking-wider">
              <th className="px-4 py-3">{t("emailSetting.log.column.time")}</th>
              <th className="px-4 py-3">{t("emailSetting.log.column.transaction")}</th>
              <th className="px-4 py-3">{t("emailSetting.log.column.stageAction")}</th>
              <th className="px-4 py-3">{t("emailSetting.log.column.subject")}</th>
              <th className="px-4 py-3">{t("emailSetting.log.column.recipients")}</th>
              <th className="px-4 py-3">{t("emailSetting.log.column.sender")}</th>
              <th className="px-4 py-3">{t("emailSetting.log.column.status")}</th>
              <th className="px-4 py-3">{t("emailSetting.column.actions")}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 align-top">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">{t("emailSetting.loading")}</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">{t("emailSetting.log.empty")}</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDateTime(row.created_at)}</td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs">{row.transaction_number}</p>
                    <p className="text-xs text-gray-400 capitalize">{row.transaction_type}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <p className="font-mono">{row.stage}</p>
                    <p className="text-gray-400">{t(`emailSetting.action.${row.action}`)}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[240px] truncate" title={row.subject}>{row.subject}</td>
                  <td className="px-4 py-3 text-xs max-w-[240px]">
                    <p className="truncate" title={row.to.join(", ")}>To: {row.to.join(", ")}</p>
                    <p className="truncate text-gray-400" title={row.cc.join(", ")}>Cc: {row.cc.join(", ")}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">{row.sent_by_name ?? row.sent_by}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        row.status === "SENT"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {t(`emailSetting.log.status.${row.status}`)}
                    </span>
                    {row.status === "FAILED" && row.error_message && (
                      <p className="mt-1 text-[11px] text-red-500 max-w-[220px] break-words">{row.error_message}</p>
                    )}
                    <p className="mt-1 text-[11px] text-gray-400">
                      {t("emailSetting.log.attempts", { count: row.attempts })}
                    </p>
                  </td>
                  <td className="px-4 py-3">{row.status === "FAILED" && <ResendButton row={row} />}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
