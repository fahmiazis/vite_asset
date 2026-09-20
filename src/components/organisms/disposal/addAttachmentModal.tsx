import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useAttachmentSettingList } from "../../../hooks/query/attachmentSetting/list"
import toast from "react-hot-toast"
import { FileUploadField } from "../transaction/detail"
import { useUploadDisposalAttachment } from "../../../hooks/mutation/disposal/uploadAttachmentDisposal"
import { disposalStageLabel } from "../../../utils/disposalStage"

interface AttachmentFileState {
    id: number
    name: string
    description: string
    is_required: boolean
    stage: string
    file: File | null
}

interface AddAttachmentModalProps {
    transactionNumber: string
    /** ID baris transaction_disposal_assets (asset.id), BUKAN asset_id */
    transactionDisposalAssetId: string
    assetNumber?: string
    /** stage transaksi saat ini — menentukan config attachment mana yang diminta */
    stage: string
    onConfirm: () => void
    onCancel: () => void
}

export default function AddAttachmentModal({
    transactionNumber,
    transactionDisposalAssetId,
    assetNumber,
    stage,
    onConfirm,
    onCancel,
}: AddAttachmentModalProps) {
    const { t } = useTranslation()
    const [attachments, setAttachments] = useState<AttachmentFileState[]>([])

    const { data: attachSetting, isLoading } = useAttachmentSettingList("disposal")
    const { mutateAsync: uploadAttachment, isPending: isUploading } = useUploadDisposalAttachment()

    useEffect(() => {
        if (!attachSetting?.data) return

        // FIX: hanya config yang aktif DAN milik stage berjalan
        const filtered = attachSetting.data.filter(
            (item) => item.is_active && item.stage === stage
        )

        setAttachments(
            filtered.map((item) => ({
                id: item.id,
                name: item.attachment_type,
                description: item.description,
                is_required: item.is_required,
                stage: item.stage,
                file: null,
            }))
        )
    }, [attachSetting, stage])

    const handleFileChange = (id: number, file: File | null) => {
        setAttachments((prev) =>
            prev.map((item) => (item.id === id ? { ...item, file } : item))
        )
    }

    const hasMissingRequired = attachments.some((item) => item.is_required && !item.file)
    const hasAnyFile = attachments.some((item) => item.file)

    const handleSubmit = async () => {
        try {
            const filesToUpload = attachments.filter((item) => item.file)
            await Promise.all(
                filesToUpload.map((item) =>
                    uploadAttachment({
                        params: { transaction_number: transactionNumber },
                        payload: {
                            transaction_disposal_asset_id: transactionDisposalAssetId,
                            attachment_config_id: String(item.id),
                            stage,
                            file: item.file!,
                        },
                    })
                )
            )
            toast.success(t("attachment.uploadSuccess"))
            onConfirm()
        } catch {
            toast.error(t("attachment.uploadError"))
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 mx-auto mb-4">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </div>
                <h3 className="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">
                    {t("attachment.modal.title")}
                </h3>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t("attachment.modal.desc")}
                </p>
                <p className="text-center text-xs text-gray-400 mb-5">
                    Stage <span className="font-semibold">{disposalStageLabel(stage)}</span>
                    {assetNumber && <> &middot; Aset <span className="font-mono">{assetNumber}</span></>}
                </p>

                {/* Content */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : attachments.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 dark:text-gray-600 py-6">
                            Tidak ada konfigurasi dokumen untuk stage {disposalStageLabel(stage)}
                        </p>
                    ) : (
                        attachments.map((item) => (
                            <div key={item.id}>
                                <FileUploadField
                                    label={`${item.name}${item.is_required ? " *" : ""}`}
                                    file={item.file}
                                    onChange={(file) => handleFileChange(item.id, file)}
                                    onRemove={() => handleFileChange(item.id, null)}
                                />
                                {item.description && (
                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                    <button
                        onClick={onCancel}
                        disabled={isUploading}
                        className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {t("attachment.modal.cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isUploading || hasMissingRequired || !hasAnyFile}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isUploading ? t("attachment.modal.uploading") : t("attachment.modal.submit")}
                    </button>
                </div>
            </div>
        </div>
    )
}
