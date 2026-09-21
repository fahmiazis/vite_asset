import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Head from "../../molecules/head"
import { useDisposalAgreementList } from "../../../hooks/query/disposalAgreement"
import { AgreementStageBadge } from "../../organisms/disposalAgreement/stageBadge"

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

export default function DisposalAgreementPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const { data, isLoading } = useDisposalAgreementList({
    page: 1,
    limit: 25,
    search: search.trim() || undefined,
  })

  const agreements = data?.data?.data ?? []

  // Header tabel sengaja selalu dirender — termasuk saat data kosong — supaya
  // halaman tidak terlihat "mati" dan user tetap tahu kolom apa yang ada.
  const columns = [
    { key: "no", label: t("disposalAgreement.column.no"), className: "w-16 text-center" },
    { key: "number", label: t("disposalAgreement.column.number") },
    { key: "items", label: t("disposalAgreement.column.items"), className: "text-center" },
    { key: "createdBy", label: t("disposalAgreement.column.createdBy") },
    { key: "createdAt", label: t("disposalAgreement.column.createdAt") },
    { key: "status", label: t("disposalAgreement.column.status") },
  ]

  return (
    <>
      <Head label={t("disposalAgreement.title")} className="mb-4" />

      <div className="flex items-center justify-between gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("disposalAgreement.searchPlaceholder")}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-sm w-full"
        />
        <button
          onClick={() => navigate("/dashboard/disposal/agreement/create")}
          className="flex-shrink-0 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          {t("disposalAgreement.create")}
        </button>
      </div>

      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 whitespace-nowrap ${
                    column.className ?? ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12">
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : agreements.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-400">
                    {search.trim()
                      ? t("disposalAgreement.emptySearch")
                      : t("disposalAgreement.empty")}
                  </p>
                  {!search.trim() && (
                    <button
                      onClick={() => navigate("/dashboard/disposal/agreement/create")}
                      className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      {t("disposalAgreement.create")}
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              agreements.map((agreement, index) => (
                <tr
                  key={agreement.id}
                  onClick={() =>
                    navigate(`/dashboard/disposal/agreement/${agreement.agreement_number}`)
                  }
                  className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium font-mono text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {agreement.agreement_number}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    {agreement.total_items}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {agreement.created_by_name ?? agreement.created_by}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDateTime(agreement.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <AgreementStageBadge stage={agreement.current_stage} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
