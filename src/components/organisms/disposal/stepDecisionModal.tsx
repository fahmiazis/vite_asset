import { useTranslation } from "react-i18next"
import type { DisposalAsset } from "../../../models/disposal/detail"

export type StepDecisionMode = "step-approve" | "step-reject" | "step-revise" | "cancel"

interface StepDecisionModalProps {
  mode: StepDecisionMode
  stepName: string
  notes: string
  onNotesChange: (value: string) => void
  isPending: boolean
  onClose: () => void
  onConfirm: () => void
  /** khusus mode revisi — aset yang bisa ditandai untuk diperbaiki */
  assets?: DisposalAsset[]
  selectedAssetIds?: number[]
  onToggleAsset?: (disposalAssetId: number) => void
}

/** kunci i18n per mode — semuanya di bawah `disposalAction` */
const COPY: Record<StepDecisionMode, { key: string; tone: "emerald" | "red" | "amber" | "gray" }> = {
  "step-approve": { key: "step.approveModal", tone: "emerald" },
  "step-reject": { key: "step.rejectModal", tone: "red" },
  "step-revise": { key: "step.reviseModal", tone: "amber" },
  cancel: { key: "cancelRequest.modal", tone: "gray" },
}

const TONE_CLASS = {
  emerald: "bg-emerald-600 hover:bg-emerald-700",
  red: "bg-red-600 hover:bg-red-700",
  amber: "bg-amber-600 hover:bg-amber-700",
  gray: "bg-gray-700 hover:bg-gray-800",
}

/**
 * Konfirmasi aksi approver (setujui / tolak / revisi) dan pembatalan pengaju.
 *
 * Alasan wajib minimal 5 karakter untuk semua aksi kecuali setujui — sama
 * dengan binding `min=5` pada ReviseDisposalRequest & CancelDisposalRequest
 * di backend.
 */
export function StepDecisionModal({
  mode,
  stepName,
  notes,
  onNotesChange,
  isPending,
  onClose,
  onConfirm,
  assets = [],
  selectedAssetIds = [],
  onToggleAsset,
}: StepDecisionModalProps) {
  const { t } = useTranslation()
  const { key, tone } = COPY[mode]
  const needsNotes = mode !== "step-approve"
  const tooShort = needsNotes && notes.trim().length < 5

  // revisi wajib punya sasaran — backend menolak kalau disposal_asset_ids kosong
  const isRevise = mode === "step-revise"
  const noAssetPicked = isRevise && selectedAssetIds.length === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={() => !isPending && onClose()}
      />
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 p-6 z-10">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {t(`disposalAction.${key}.title`)}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t(`disposalAction.${key}.desc`, { step: stepName })}
        </p>

        {isRevise && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t("disposalAction.step.pickAssets")}{" "}
              <span className="text-red-500">*</span>
            </p>
            <div className="max-h-44 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl divide-y divide-gray-100 dark:divide-gray-800">
              {assets.map((asset) => (
                <label
                  key={asset.id}
                  className="flex items-start gap-2.5 px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60"
                >
                  <input
                    type="checkbox"
                    checked={selectedAssetIds.includes(asset.id)}
                    onChange={() => onToggleAsset?.(asset.id)}
                    disabled={isPending}
                    className="mt-0.5 w-4 h-4 accent-amber-600"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                      {asset.asset_name ?? asset.asset_number}
                    </span>
                    <span className="block text-xs text-gray-400 font-mono truncate">
                      {asset.asset_number}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {t("disposalAction.step.pickAssetsHint")}
            </p>
          </div>
        )}

        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mt-4 mb-1.5">
          {needsNotes
            ? t("disposalAction.step.notesRequired")
            : t("disposalAction.step.notesOptional")}
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={t(`disposalAction.${key}.placeholder`)}
          disabled={isPending}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none disabled:opacity-50"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {t("disposalAction.step.cancelButton")}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending || tooShort || noAssetPicked}
            className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${TONE_CLASS[tone]}`}
          >
            {isPending
              ? t("disposalAction.step.processing")
              : t(`disposalAction.${key}.confirm`)}
          </button>
        </div>
      </div>
    </div>
  )
}
