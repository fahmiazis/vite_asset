import { useRef } from "react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { useHandoverAttachments } from "../../../hooks/query/handover"
import { useUploadHandoverDocument } from "../../../hooks/mutation/handover"
import { handoverAttachmentFile } from "../../../services/handover"
import type { HandoverAttachmentConfig } from "../../../models/handover"

const MAX_FILE_SIZE = 10 * 1024 * 1024

interface HandoverDocumentsPanelProps {
  transactionNumber: string
  stage: string
  branchCode: string
  /** pengunggah yang berhak: pembuat di DRAFT, pihak penerima di HANDOVER_RECEIVING */
  canUpload: boolean
}

/**
 * Dokumen serah terima (mis. BAST) — memakai attachment generik dengan
 * transaction_type=handover. Konfigurasinya diatur di Setting Attachment.
 * Cukup diunggah; tidak ada reviewer terpisah.
 */
export function HandoverDocumentsPanel({ transactionNumber, stage, branchCode, canUpload }: HandoverDocumentsPanelProps) {
  const { t } = useTranslation()
  const { data, isLoading } = useHandoverAttachments(transactionNumber, stage, branchCode)
  const upload = useUploadHandoverDocument(transactionNumber, stage)

  const configs = data?.configs ?? []
  const attachments = data?.status?.attachments ?? []

  if (isLoading) return null
  // stage tanpa konfigurasi dokumen dan tanpa file — panel tidak perlu tampil
  if (configs.length === 0 && attachments.length === 0) return null

  const openFile = async (id: number) => {
    try {
      const blob = await handoverAttachmentFile(id)
      window.open(URL.createObjectURL(blob), "_blank", "noopener")
    } catch {
      toast.error(t("handover.docs.openFailed"))
    }
  }

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-3">
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{t("handover.docs.title")}</p>
        <p className="text-xs text-gray-400 mt-0.5">{t("handover.docs.subtitle", { stage })}</p>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {configs.map((config) => (
          <DocumentRow
            key={config.id}
            config={config}
            attachment={attachments
              .filter((a) => a.attachment_config_id === config.id)
              .sort((a, b) => b.id - a.id)[0]}
            canUpload={canUpload}
            isUploading={upload.isPending}
            onUpload={(file) => upload.mutate({ configId: config.id, file })}
            onOpen={openFile}
          />
        ))}
      </ul>
    </div>
  )
}

function DocumentRow({
  config,
  attachment,
  canUpload,
  isUploading,
  onUpload,
  onOpen,
}: {
  config: HandoverAttachmentConfig
  attachment?: { id: number; file_name: string; status: string; rejection_reason: string | null }
  canUpload: boolean
  isUploading: boolean
  onUpload: (file: File) => void
  onOpen: (id: number) => void
}) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  // sama dengan backend: upload ulang hanya kalau belum ada atau ditolak
  const canReplace = !attachment || attachment.status === "REJECTED"

  const pick = (file?: File) => {
    if (!file) return
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t("handover.docs.tooLarge"))
      return
    }
    onUpload(file)
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {config.attachment_type.replace(/_/g, " ")}
          {config.is_required && <span className="ml-1 text-red-500">*</span>}
        </p>
        {attachment ? (
          <button onClick={() => onOpen(attachment.id)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline break-all text-left">
            {attachment.file_name}
          </button>
        ) : (
          <p className="text-xs text-gray-400">{config.is_required ? t("handover.docs.missing") : t("handover.docs.optional")}</p>
        )}
        {attachment?.status === "REJECTED" && attachment.rejection_reason && (
          <p className="text-xs text-red-500">{attachment.rejection_reason}</p>
        )}
      </div>

      {canUpload && canReplace && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              pick(e.target.files?.[0])
              e.target.value = ""
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
          >
            {isUploading ? t("handover.docs.uploading") : attachment ? t("handover.docs.reupload") : t("handover.docs.upload")}
          </button>
        </>
      )}
      {attachment && !canReplace && (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {t("handover.docs.uploaded")}
        </span>
      )}
    </li>
  )
}
