import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import type { emailTemplateState } from "../../../models/emailSetting/template"
import { emailTransactionTypes } from "../../../constans/email"
import { useDeleteEmailTemplate } from "../../../hooks/mutation/emailSetting/template"

function DeleteModal({ row, onClose }: { row: emailTemplateState; onClose: () => void }) {
  const { t } = useTranslation()
  const { mutate, isPending } = useDeleteEmailTemplate()

  const handleDelete = () =>
    mutate(row.id, {
      onSuccess: () => {
        toast.success(t("emailSetting.toast.deleted"))
        onClose()
      },
      onError: () => toast.error(t("emailSetting.toast.deleteFailed")),
    })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
          {t("emailSetting.delete.title")}
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6 break-words">
          {t("emailSetting.delete.message", {
            label: `${row.transaction_type} · ${row.stage} · ${t(`emailSetting.action.${row.action}`)}`,
          })}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {t("emailSetting.cancel")}
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
          >
            {isPending ? t("emailSetting.deleting") : t("emailSetting.delete.confirm")}
          </button>
        </div>
      </div>
    </div>
  )
}

export function EmailTemplateTable({ data }: { data: emailTemplateState[] }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [deleting, setDeleting] = useState<emailTemplateState | null>(null)

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return data.filter(
      (row) =>
        (!type || row.transaction_type === type) &&
        (!q ||
          row.subject.toLowerCase().includes(q) ||
          row.stage.toLowerCase().includes(q) ||
          row.cc_roles.some((r) => r.name.toLowerCase().includes(q)))
    )
  }, [data, search, type])

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder={t("emailSetting.searchTemplate")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 max-w-full"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
          >
            <option value="">{t("emailSetting.allTransactionTypes")}</option>
            {emailTransactionTypes.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => navigate("/dashboard/setting-email/create")}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          {t("emailSetting.create")}
        </button>
      </section>

      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr className="text-left text-xs font-medium uppercase tracking-wider">
              <th className="px-4 py-3">{t("emailSetting.column.no")}</th>
              <th className="px-4 py-3">{t("emailSetting.column.transactionType")}</th>
              <th className="px-4 py-3">{t("emailSetting.column.stage")}</th>
              <th className="px-4 py-3">{t("emailSetting.column.action")}</th>
              <th className="px-4 py-3">{t("emailSetting.column.subject")}</th>
              <th className="px-4 py-3">{t("emailSetting.column.ccRoles")}</th>
              <th className="px-4 py-3">{t("emailSetting.column.status")}</th>
              <th className="px-4 py-3">{t("emailSetting.column.actions")}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">{t("emailSetting.empty")}</td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 text-center w-12">{i + 1}</td>
                  <td className="px-4 py-3 font-medium capitalize">{row.transaction_type}</td>
                  <td className="px-4 py-3 font-mono text-xs">{row.stage}</td>
                  <td className="px-4 py-3">{t(`emailSetting.action.${row.action}`)}</td>
                  <td className="px-4 py-3 max-w-[280px] truncate" title={row.subject}>{row.subject}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.cc_roles.map((r) => (
                        <span key={r.id} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          {r.name || r.id}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        row.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {row.is_active ? t("emailSetting.active") : t("emailSetting.inactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/dashboard/setting-email/${row.id}`}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                      >
                        {t("emailSetting.edit")}
                      </Link>
                      <button
                        onClick={() => setDeleting(row)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        {t("emailSetting.delete.button")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleting && <DeleteModal row={deleting} onClose={() => setDeleting(null)} />}
    </div>
  )
}
