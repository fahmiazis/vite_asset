import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StageActionModal } from "./stageActionModal"
import { useSetDisposalInvoices } from "../../../hooks/mutation/disposal/stageActions"
import type { DisposalAsset } from "../../../models/disposal/detail"

interface SetInvoicesModalProps {
  transactionNumber: string
  assets: DisposalAsset[]
  onClose: () => void
}

interface InvoiceInput {
  number: string
  date: string
}

/**
 * TAX (SELL only) — nomor dan tanggal faktur diisi per aset.
 *
 * Sama dengan nilai pemasukan: menyimpan tidak memindahkan stage. Aset yang
 * dijual terpisah punya faktur sendiri-sendiri, jadi tidak bisa satu nomor
 * untuk seluruh pengajuan.
 */
export function SetInvoicesModal({
  transactionNumber,
  assets,
  onClose,
}: SetInvoicesModalProps) {
  const { t } = useTranslation()
  const activeAssets = assets.filter((a) => a.status === "PENDING")

  const [values, setValues] = useState<Record<number, InvoiceInput>>(() =>
    Object.fromEntries(
      activeAssets.map((a) => [
        a.id,
        {
          number: a.invoice_number ?? "",
          // input date hanya menerima YYYY-MM-DD, sedangkan API mengirim ISO
          date: a.invoice_date ? a.invoice_date.slice(0, 10) : "",
        },
      ])
    )
  )

  const { mutate: save, isPending } = useSetDisposalInvoices({
    transactionNumber,
    onSuccess: onClose,
  })

  const update = (id: number, patch: Partial<InvoiceInput>) =>
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))

  const incomplete = activeAssets.some((asset) => {
    const item = values[asset.id]
    return !item || item.number.trim() === "" || item.date === ""
  })

  return (
    <StageActionModal
      title={t("disposalAction.invoices.title")}
      transactionNumber={transactionNumber}
      infoMessage={t("disposalAction.invoices.info")}
      notesLabel={t("disposalAction.invoices.notesLabel")}
      confirmLabel={t("disposalAction.invoices.confirm")}
      tone="emerald"
      isPending={isPending}
      confirmDisabled={incomplete || activeAssets.length === 0}
      onConfirm={(notes) =>
        save({
          assets: activeAssets.map((asset) => ({
            disposal_asset_id: asset.id,
            invoice_number: values[asset.id].number.trim(),
            invoice_date: values[asset.id].date,
          })),
          notes: notes || undefined,
        })
      }
      onClose={onClose}
    >
      <div className="space-y-3">
        {activeAssets.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            {t("disposalAction.invoices.noAssets")}
          </p>
        ) : (
          activeAssets.map((asset) => {
            const item = values[asset.id] ?? { number: "", date: "" }

            return (
              <div
                key={asset.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 space-y-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {asset.asset_name ?? "-"}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">{asset.asset_number}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    {t("disposalAction.tax.invoiceNumberLabel")}
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.number}
                    disabled={isPending}
                    onChange={(e) => update(asset.id, { number: e.target.value })}
                    placeholder={t("disposalAction.tax.invoiceNumberPlaceholder")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    {t("disposalAction.tax.invoiceDateLabel")}
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="date"
                    value={item.date}
                    disabled={isPending}
                    onChange={(e) => update(asset.id, { date: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  />
                </div>
              </div>
            )
          })
        )}

        <p className="text-xs text-gray-400">{t("disposalAction.tax.invoiceHint")}</p>
      </div>
    </StageActionModal>
  )
}
