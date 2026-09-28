import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import { useTransactionDocuments } from "../../../../hooks/query/attachment/transactionDocuments"
import { useUploadAttachment } from "../../../../hooks/mutation/transaction/attachFile"
import { useReviewAttachment } from "../../../../hooks/mutation/attachSetting/reviewAttachment"
import { useAttachmentFile } from "../../../../hooks/useAttachmentFile"
import {
  transactionDocumentFile,
  type TransactionDocument,
  type TransactionDocumentConfig,
} from "../../../../services/attachment/transactionDocuments"
import { ReviewAttachmentDialog } from "../../common/reviewAttachmentDialog"
import { AttachmentStatusPill } from "../../common/attachmentBadges"
import {
  PROCUREMENT_STAGES,
  PROCUREMENT_TERMINAL_STAGES,
  hasReachedProcurementStage,
  procurementStageLabel,
} from "../../../../utils/procurementStage"

const TRANSACTION_TYPE = "procurement"
const MAX_FILE_SIZE = 10 * 1024 * 1024

const formatType = (value?: string | null) => (value ?? "-").replace(/_/g, " ")

// ─── Dialog lihat / review ───────────────────────────────────────────────────

function DocumentDialog({
  transactionNumber,
  document,
  canDecide,
  onClose,
}: {
  transactionNumber: string
  document: TransactionDocument
  canDecide: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { url, isLoading, error } = useAttachmentFile(transactionDocumentFile, document.id)
  const { mutate: review, isPending } = useReviewAttachment(transactionNumber)

  const decide = (payload: { status: "APPROVED" | "REJECTED"; rejection_reason?: string }) =>
    review(
      { id: document.id, payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["attachments"] })
          onClose()
        },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { message?: string } } }
          toast.error(e?.response?.data?.message ?? "Failed")
        },
      }
    )

  return (
    <ReviewAttachmentDialog
      fileName={document.file_name}
      attachmentType={formatType(document.attachment_type)}
      mimeType={document.mime_type}
      fileUrl={url}
      isLoadingFile={isLoading}
      fileError={error}
      canDecide={canDecide}
      isPending={isPending}
      onApprove={() => decide({ status: "APPROVED" })}
      onReject={(reason) => decide({ status: "REJECTED", rejection_reason: reason })}
      onClose={onClose}
    />
  )
}

// ─── Satu baris dokumen ──────────────────────────────────────────────────────

function DocumentRow({
  config,
  document,
  canUpload,
  canReview,
  isUploading,
  onUpload,
  onOpen,
}: {
  config: TransactionDocumentConfig
  document?: TransactionDocument
  canUpload: boolean
  canReview: boolean
  isUploading: boolean
  onUpload: (file: File) => void
  onOpen: (document: TransactionDocument, decide: boolean) => void
}) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  // sama dengan backend: unggah ulang hanya kalau belum ada atau ditolak
  const canReplace = !document || document.status === "REJECTED"
  const canDecide = canReview && document?.status === "PENDING"

  const pick = (file?: File) => {
    if (!file) return
    if (file.size > MAX_FILE_SIZE) return toast.error(t("procurementDocuments.tooLarge"))
    onUpload(file)
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {formatType(config.attachment_type)}
          {config.is_required && <span className="ml-1 text-red-500">*</span>}
        </p>
        {document ? (
          <button
            onClick={() => onOpen(document, false)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline break-all text-left"
          >
            {document.file_name}
          </button>
        ) : (
          <p className="text-xs text-gray-400">
            {config.is_required ? t("procurementDocuments.missing") : t("procurementDocuments.optional")}
          </p>
        )}
        {document?.status === "REJECTED" && document.rejection_reason && (
          <p className="text-xs text-red-500 mt-0.5">
            {t("disposalStagePanel.card.rejectionReason")}: {document.rejection_reason}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {document && <AttachmentStatusPill status={document.status} />}

        {canDecide && (
          <button
            onClick={() => onOpen(document!, true)}
            className="px-3 py-1.5 text-xs font-medium border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
          >
            {t("disposalStagePanel.card.review")}
          </button>
        )}

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
              {isUploading
                ? t("procurementDocuments.uploading")
                : document
                  ? t("procurementDocuments.reupload")
                  : t("disposalStagePanel.card.upload")}
            </button>
          </>
        )}
      </div>
    </li>
  )
}

// ─── Dokumen satu stage ──────────────────────────────────────────────────────

interface StageDocumentsProps {
  transactionNumber: string
  stage: string
  branchCode: string
  canUpload: boolean
  /** boleh menilai — dokumen milik sendiri tetap tidak bisa dinilai */
  canReview: boolean
  myUserId?: string
  /** true = dipakai di dalam kartu lain (tanpa judul stage) */
  embedded?: boolean
  /**
   * true = blok hanya muncul kalau ada berkas terunggah (transaksi berakhir
   * di stage terminal, urutan stage tidak bisa dipakai)
   */
  requireUploads?: boolean
  isCurrent?: boolean
  onResolved?: (stage: string, hasDocuments: boolean) => void
}

/**
 * Dokumen procurement untuk satu stage — attachment generik
 * (transaction_type=procurement), per transaksi, bukan per aset.
 */
export function ProcurementStageDocuments({
  transactionNumber,
  stage,
  branchCode,
  canUpload,
  canReview,
  myUserId,
  embedded = false,
  requireUploads = false,
  isCurrent = false,
  onResolved,
}: StageDocumentsProps) {
  const { t } = useTranslation()
  const { configs, status, isLoading } = useTransactionDocuments({
    transactionNumber,
    transactionType: TRANSACTION_TYPE,
    stage,
    branchCode,
  })
  const { mutate: upload, isPending: isUploading } = useUploadAttachment()
  const [opened, setOpened] = useState<{ document: TransactionDocument; decide: boolean } | null>(null)

  const documents = status?.attachments ?? []
  // berkas terbaru per config; berkas yang config-nya sudah tidak aktif tetap tampil
  const latestByConfig = new Map<number, TransactionDocument>()
  for (const doc of [...documents].sort((a, b) => a.id - b.id)) {
    latestByConfig.set(doc.attachment_config_id, doc)
  }
  const rows: { config: TransactionDocumentConfig; document?: TransactionDocument }[] = configs.map(
    (config) => ({ config, document: latestByConfig.get(config.id) })
  )
  for (const [configId, doc] of latestByConfig) {
    if (!configs.some((c) => c.id === configId)) {
      rows.push({
        config: { id: configId, attachment_type: doc.attachment_type ?? "-", description: null, is_required: false },
        document: doc,
      })
    }
  }

  const hasDocuments = requireUploads ? documents.length > 0 : rows.length > 0

  useEffect(() => {
    if (!isLoading) onResolved?.(stage, hasDocuments)
  }, [isLoading, hasDocuments, stage, onResolved])

  if (isLoading) return null
  if (!hasDocuments) {
    return embedded ? (
      <p className="text-xs text-gray-400">{t("procurementDocuments.noneForStage")}</p>
    ) : null
  }

  const required = configs.filter((c) => c.is_required).length
  const approved = configs.filter(
    (c) => c.is_required && latestByConfig.get(c.id)?.status === "APPROVED"
  ).length

  const list = (
    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
      {rows.map(({ config, document }) => (
        <DocumentRow
          key={config.id}
          config={config}
          document={document}
          canUpload={canUpload}
          // pengunggah tidak bisa menilai dokumennya sendiri
          canReview={canReview && !!document && document.uploaded_by !== myUserId}
          isUploading={isUploading}
          onUpload={(file) =>
            upload({
              params: { transaction_number: transactionNumber, transaction_type: TRANSACTION_TYPE, stage },
              payload: { attachment_config_id: String(config.id), file },
            })
          }
          onOpen={(doc, decide) => setOpened({ document: doc, decide })}
        />
      ))}
    </ul>
  )

  return (
    <>
      {opened && (
        <DocumentDialog
          transactionNumber={transactionNumber}
          document={opened.document}
          canDecide={opened.decide}
          onClose={() => setOpened(null)}
        />
      )}

      {embedded ? (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            {t("disposalStagePanel.documentsTitle", { stage: procurementStageLabel(stage) })}
          </h4>
          {list}
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {procurementStageLabel(stage)}
              </h4>
              {isCurrent && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  {t("disposalStagePanel.currentStage")}
                </span>
              )}
            </div>
            {required > 0 && (
              <span className="text-xs text-gray-400">
                {t("disposalDocuments.summary", { approved, required })}
              </span>
            )}
          </div>
          {list}
        </div>
      )}
    </>
  )
}

// ─── Section semua dokumen ───────────────────────────────────────────────────

interface ProcurementDocumentsSectionProps {
  transactionNumber: string
  branchCode: string
  currentStage: string
  canUploadAtStage: (stage: string) => boolean
  canReview: boolean
  myUserId?: string
}

/**
 * Semua dokumen procurement dari stage yang sudah dilalui, dikelompokkan per
 * stage — sama dengan DisposalDocumentsSection.
 */
export function ProcurementDocumentsSection({
  transactionNumber,
  branchCode,
  currentStage,
  canUploadAtStage,
  canReview,
  myUserId,
}: ProcurementDocumentsSectionProps) {
  const { t } = useTranslation()

  // Dokumen stage berikutnya belum relevan. Di stage terminal urutan stage
  // tidak bisa dipakai, jadi yang tampil hanya yang benar-benar terunggah.
  const terminal = PROCUREMENT_TERMINAL_STAGES.includes(currentStage?.toUpperCase())
  const stages = PROCUREMENT_STAGES.filter(
    (stage) => terminal || hasReachedProcurementStage(currentStage, stage)
  )

  const [resolved, setResolved] = useState<Record<string, boolean>>({})
  const handleResolved = useCallback((stage: string, hasDocuments: boolean) => {
    setResolved((prev) => (prev[stage] === hasDocuments ? prev : { ...prev, [stage]: hasDocuments }))
  }, [])

  const allResolved = stages.every((stage) => stage in resolved)
  const anyDocuments = stages.some((stage) => resolved[stage])

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {t("disposalDocuments.title")}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{t("disposalDocuments.subtitle")}</p>
      </div>

      <div className="space-y-3">
        {stages.map((stage) => (
          <ProcurementStageDocuments
            key={stage}
            transactionNumber={transactionNumber}
            stage={stage}
            branchCode={branchCode}
            isCurrent={stage === currentStage}
            canUpload={canUploadAtStage(stage)}
            canReview={canReview}
            myUserId={myUserId}
            requireUploads={terminal}
            onResolved={handleResolved}
          />
        ))}
      </div>

      {allResolved && !anyDocuments && (
        <p className="text-sm text-gray-400 text-center py-6">{t("disposalDocuments.empty")}</p>
      )}
    </div>
  )
}
