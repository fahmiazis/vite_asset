import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StageActionModal } from "./stageActionModal"
import { useSetDisposalIncomeValues } from "../../../hooks/mutation/disposal/stageActions"
import { formatRupiah } from "../../../utils/disposalStage"
import type { DisposalAsset } from "../../../models/disposal/detail"

interface SetIncomeValuesModalProps {
  transactionNumber: string
  assets: DisposalAsset[]
  onClose: () => void
}

/**
 * FINANCE (SELL only) — nilai pemasukan diisi per aset.
 *
 * Menyimpan nilai tidak memindahkan stage: konfirmasi stage tetap lewat tombol
 * di bar bawah, supaya pengisian bisa dicicil dan diperiksa ulang sebelum
 * transaksinya diteruskan.
 */
export function SetIncomeValuesModal({
  transactionNumber,
  assets,
  onClose,
}: SetIncomeValuesModalProps) {
  const { t } = useTranslation()
  const activeAssets = assets.filter((a) => a.status === "PENDING")

  const [values, setValues] = useState<Record<number, string>>(() =>
    Object.fromEntries(
      activeAssets.map((a) => [a.id, a.income_value != null ? String(a.income_value) : ""])
    )
  )

  const { mutate: save, isPending } = useSetDisposalIncomeValues({
    transactionNumber,
    onSuccess: onClose,
  })

  const parsed = activeAssets.map((asset) => ({
    asset,
    value: Number(values[asset.id] ?? ""),
  }))

  const hasInvalid = parsed.some(({ value }) => !Number.isFinite(value) || value <= 0)
  const total = parsed.reduce(
    (sum, { value }) => sum + (Number.isFinite(value) ? value : 0),
    0
  )
  const totalSale = activeAssets.reduce((sum, a) => sum + (a.sale_value ?? 0), 0)

  return (
    <StageActionModal
      title={t("disposalAction.incomeValues.title")}
      transactionNumber={transactionNumber}
      infoMessage={t("disposalAction.incomeValues.info")}
      notesLabel={t("disposalAction.incomeValues.notesLabel")}
      confirmLabel={t("disposalAction.incomeValues.confirm")}
      tone="emerald"
      isPending={isPending}
      confirmDisabled={hasInvalid || activeAssets.length === 0}
      onConfirm={(notes) =>
        save({
          assets: parsed.map(({ asset, value }) => ({
            disposal_asset_id: asset.id,
            income_value: value,
          })),
          notes: notes || undefined,
        })
      }
      onClose={onClose}
    >
      <div className="space-y-3">
        {activeAssets.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            {t("disposalAction.incomeValues.noAssets")}
          </p>
        ) : (
          activeAssets.map((asset) => {
            const raw = values[asset.id] ?? ""
            const num = Number(raw)
            const invalid = raw !== "" && (!Number.isFinite(num) || num <= 0)

            return (
              <div
                key={asset.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-3"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {asset.asset_name ?? "-"}
                </p>
                <p className="text-xs text-gray-400 font-mono mb-2">{asset.asset_number}</p>

                {/* pembanding: nilai jual yang disepakati purchasing */}
                {asset.sale_value != null && (
                  <p className="text-xs text-gray-400 mb-2">
                    {t("disposalAction.finance.saleValueLabel")}:{" "}
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {formatRupiah(asset.sale_value)}
                    </span>
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 flex-shrink-0">Rp</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={raw}
                    disabled={isPending}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [asset.id]: e.target.value }))
                    }
                    placeholder="0"
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 ${
                      invalid
                        ? "border-red-400 dark:border-red-600"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                  />
                </div>
                {invalid && (
                  <p className="text-xs text-red-500 mt-1">
                    {t("disposalAction.finance.incomeInvalid")}
                  </p>
                )}
              </div>
            )
          })
        )}

        {activeAssets.length > 0 && (
          <div className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t("disposalAction.incomeValues.total")}
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {formatRupiah(total)}
              </span>
            </div>
            {totalSale > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t("disposalAction.finance.difference")}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    total - totalSale >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {total - totalSale > 0 ? "+" : ""}
                  {formatRupiah(total - totalSale)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </StageActionModal>
  )
}
