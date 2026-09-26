import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import Head from "../../../molecules/head"
import { useEligibleDisposals } from "../../../../hooks/query/disposalAgreement"
import { useCreateDisposalAgreement } from "../../../../hooks/mutation/disposalAgreement"
import { disposalTypeLabel, formatRupiah } from "../../../../utils/disposalStage"

/**
 * Pembuatan kesepakatan disposal: pilih beberapa transaksi yang sudah lolos
 * approval request, lalu ajukan sekaligus ke manajemen puncak.
 *
 * Daftar pilihannya datang dari backend (`/eligible`) yang sudah memfilter
 * stage dan keanggotaan agreement aktif — frontend tidak menyaring sendiri.
 */
export default function CreateDisposalAgreementPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data, isLoading } = useEligibleDisposals()
  const createAgreement = useCreateDisposalAgreement()

  const [selected, setSelected] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const items = data?.data ?? []

  const toggle = (transactionNumber: string) =>
    setSelected((prev) =>
      prev.includes(transactionNumber)
        ? prev.filter((n) => n !== transactionNumber)
        : [...prev, transactionNumber]
    )

  const toggleAll = () =>
    setSelected((prev) =>
      prev.length === items.length ? [] : items.map((item) => item.transaction_number)
    )

  const summary = useMemo(() => {
    const picked = items.filter((item) => selected.includes(item.transaction_number))
    return {
      transactions: picked.length,
      assets: picked.reduce((sum, item) => sum + item.total_assets, 0),
      branches: new Set(picked.map((item) => item.branch_code)).size,
    }
  }, [items, selected])

  const handleSubmit = () => {
    if (selected.length === 0) {
      toast.error(t("disposalAgreement.validation.pickAtLeastOne"))
      return
    }

    createAgreement.mutate({
      transaction_numbers: selected,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <div>
      <Head label={t("disposalAgreement.createTitle")} className="mb-4" />

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {t("disposalAgreement.eligibleTitle")}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {t("disposalAgreement.eligibleHint")}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={toggleAll}
              className="flex-shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              {selected.length === items.length
                ? t("disposalAgreement.unselectAll")
                : t("disposalAgreement.selectAll")}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-10">
            {t("disposalAgreement.noEligible")}
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const checkboxId = `eligible-${item.transaction_id}`

              return (
                <div
                  key={item.transaction_number}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <input
                    id={checkboxId}
                    type="checkbox"
                    checked={selected.includes(item.transaction_number)}
                    onChange={() => toggle(item.transaction_number)}
                    disabled={createAgreement.isPending}
                    className="mt-0.5 w-4 h-4 accent-indigo-600 flex-shrink-0 cursor-pointer"
                  />

                  {/* label dipisah dari tombol Detail — kalau tombolnya ikut
                      dibungkus label, klik Detail juga akan menoggle centang */}
                  <label htmlFor={checkboxId} className="min-w-0 flex-1 cursor-pointer">
                    <p className="text-xs font-mono font-medium text-gray-800 dark:text-gray-200 truncate">
                      {item.transaction_number}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {disposalTypeLabel(item.disposal_type)}
                      {" · "}
                      {item.branch_code}
                      {" · "}
                      {t("disposalAgreement.assetCount", { count: item.total_assets })}
                      {item.created_by_name ? ` · ${item.created_by_name}` : ""}
                    </p>
                  </label>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {item.total_sale_value != null && (
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {formatRupiah(item.total_sale_value)}
                      </span>
                    )}

                    {/* Dibuka di tab baru supaya pilihan yang sudah dicentang
                        tidak hilang saat user mengecek isi transaksinya */}
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
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mt-4">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {t("disposalAgreement.notes")}{" "}
          <span className="text-gray-400 font-normal">
            ({t("disposalAgreement.optional")})
          </span>
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={createAgreement.isPending}
          placeholder={t("disposalAgreement.notesPlaceholder")}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />

        {selected.length > 0 && (
          <p className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg px-3 py-2">
            {t("disposalAgreement.summary", {
              transactions: summary.transactions,
              assets: summary.assets,
              branches: summary.branches,
            })}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate("/dashboard/disposal-agreement")}
            disabled={createAgreement.isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {t("disposalAgreement.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={createAgreement.isPending || selected.length === 0}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createAgreement.isPending
              ? t("disposalAgreement.submitting")
              : t("disposalAgreement.submit")}
          </button>
        </div>
      </div>
    </div>
  )
}
