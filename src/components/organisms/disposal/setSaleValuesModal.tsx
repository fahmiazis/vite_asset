import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StageActionModal } from "./stageActionModal"
import { useSetDisposalSaleValues } from "../../../hooks/mutation/disposal/stageActions"
import { formatRupiah } from "../../../utils/disposalStage"
import { withStageEmail } from "../../../stores/stageEmailStore"
import type { DisposalAsset } from "../../../models/disposal/detail"

interface SetSaleValuesModalProps {
  transactionNumber: string
  assets: DisposalAsset[]
  onClose: () => void
}

/**
 * PURCHASING (SELL only) — isi nilai jual per aset.
 * Backend memvalidasi setiap sale_value > 0 dan minimal 1 aset.
 */
export function SetSaleValuesModal({
  transactionNumber,
  assets,
  onClose,
}: SetSaleValuesModalProps) {
  const { t } = useTranslation()
  const pendingAssets = assets.filter((a) => a.status === "PENDING")

  const [values, setValues] = useState<Record<number, string>>(() =>
    Object.fromEntries(
      pendingAssets.map((a) => [a.id, a.sale_value != null ? String(a.sale_value) : ""])
    )
  )

  const { mutateAsync: setSaleValues, isPending } = useSetDisposalSaleValues({
    transactionNumber,
    onSuccess: onClose,
  })

  const parsed = pendingAssets.map((a) => ({
    asset: a,
    value: Number(values[a.id] ?? ""),
  }))

  const hasInvalid = parsed.some(({ value }) => !Number.isFinite(value) || value <= 0)
  const total = parsed.reduce(
    (sum, { value }) => sum + (Number.isFinite(value) ? value : 0),
    0
  )

  // menyimpan nilai jual sekaligus meneruskan transaksi dari PURCHASING
  const handleConfirm = (notes: string) =>
    withStageEmail(
      { transactionType: "disposal", transactionNumber, action: "proceed" },
      () =>
        setSaleValues({
          assets: parsed.map(({ asset, value }) => ({
            disposal_asset_id: asset.id,
            sale_value: value,
          })),
          notes: notes || undefined,
        })
    )

  return (
    <StageActionModal
      title={t("disposalAction.saleValues.title")}
      transactionNumber={transactionNumber}
      infoMessage={t("disposalAction.saleValues.info")}
      notesLabel={t("disposalAction.saleValues.notesLabel")}
      notesPlaceholder={t("disposalAction.saleValues.notesPlaceholder")}
      confirmLabel={t("disposalAction.saleValues.confirm")}
      isPending={isPending}
      confirmDisabled={hasInvalid || pendingAssets.length === 0}
      onConfirm={handleConfirm}
      onClose={onClose}
    >
      <div className="space-y-3">
        {pendingAssets.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            {t("disposalAction.saleValues.noAssets")}
          </p>
        ) : (
          pendingAssets.map((asset) => {
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
                    className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${
                      invalid
                        ? "border-red-400 dark:border-red-600"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                  />
                </div>
                {invalid && (
                  <p className="text-xs text-red-500 mt-1">
                    {t("disposalAction.saleValues.invalid")}
                  </p>
                )}
              </div>
            )
          })
        )}

        {pendingAssets.length > 0 && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t("disposalAction.saleValues.total")}
            </span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {formatRupiah(total)}
            </span>
          </div>
        )}
      </div>
    </StageActionModal>
  )
}
