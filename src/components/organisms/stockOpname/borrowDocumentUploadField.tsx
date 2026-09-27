import { useRef, useState, type ChangeEvent } from "react"
import { useTranslation } from "react-i18next"
import { useUploadStockOpnameBorrowDocument } from "../../../hooks/mutation/stockOpname/uploadBorrowDocument"
import { useStockOpnameConfig } from "../../../hooks/query/stockOpname/config"
import { useAuthedBlobUrl } from "../../../hooks/custom/useAuthedBlobUrl"
import { borrowDocumentAcceptAttr } from "./findingOptions"
import { FilePreviewModal } from "./filePreviewModal"

interface BorrowDocumentUploadFieldProps {
  transactionNumber: string
  assetId: number
  fileName?: string | null
  documentUrl?: string | null
  onUploaded?: (fileName: string) => void
}

// Dipakai di grid "Lengkapi Data" — upload langsung begitu file dipilih
// (bukan nunggu klik simpan), sama pola-nya kayak PhotoUploadField.
export function BorrowDocumentUploadField({
  transactionNumber,
  assetId,
  fileName,
  documentUrl,
  onUploaded,
}: BorrowDocumentUploadFieldProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate: uploadDoc, isPending } = useUploadStockOpnameBorrowDocument({ transactionNumber })
  const { data: configData } = useStockOpnameConfig()
  const isRequired = configData?.data.borrow_doc_is_required ?? true

  // Nama file lokal biar tooltip langsung update begitu upload sukses,
  // gak nunggu round-trip refetch detail (sama alasan kayak PhotoUploadField).
  const [localFileName, setLocalFileName] = useState<string | null>(null)
  const effectiveFileName = localFileName ?? fileName ?? null

  // Dokumen di-fetch (pakai token) cuma pas modal preview dibuka — bukan
  // di-load per-baris pas grid render. Komponen modalnya sendiri unmount pas
  // ditutup, jadi tiap dibuka selalu ambil versi terbaru (upload ulang
  // nimpa dokumen yang sama, URL-nya gak berubah).
  const [previewOpen, setPreviewOpen] = useState(false)
  const docBlob = useAuthedBlobUrl(
    documentUrl ? `${import.meta.env.VITE_IMAGE_ACCESS}${documentUrl}` : null,
    previewOpen
  )
  const canPreview = !!(effectiveFileName && documentUrl)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploadDoc(
      { assetId, file },
      {
        onSuccess: () => {
          setLocalFileName(file.name)
          onUploaded?.(file.name)
        },
      }
    )
    e.target.value = ""
  }

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => (canPreview ? setPreviewOpen(true) : inputRef.current?.click())}
        disabled={isPending}
        title={
          effectiveFileName
            ? `${effectiveFileName} — ${canPreview ? t("stockOpnameBorrowDocument.clickToView") : t("stockOpnameBorrowDocument.clickToReplace")}`
            : t("stockOpnameBorrowDocument.uploadTooltip")
        }
        className={`w-9 h-9 rounded-md border flex items-center justify-center overflow-hidden transition-colors flex-shrink-0 disabled:opacity-50 ${
          effectiveFileName
            ? "border-gray-200 dark:border-gray-700 text-indigo-500"
            : isRequired
            ? "border-dashed border-red-300 dark:border-red-700 text-red-400 hover:border-indigo-400 hover:text-indigo-500"
            : "border-dashed border-gray-300 dark:border-gray-700 text-gray-400 hover:border-indigo-400 hover:text-indigo-500"
        }`}
      >
        {isPending ? (
          <span className="w-3 h-3 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m1 5H8a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={borrowDocumentAcceptAttr(configData?.data)}
        className="hidden"
        onChange={handleFileChange}
      />
      {previewOpen && (
        <FilePreviewModal
          title={t("stockOpnameBorrowDocument.label")}
          fileName={effectiveFileName}
          src={docBlob.objectUrl}
          mimeType={docBlob.mimeType}
          isLoading={docBlob.isLoading}
          isError={docBlob.isError}
          onClose={() => setPreviewOpen(false)}
          onReplace={() => inputRef.current?.click()}
          replaceLabel={t("stockOpnameBorrowDocument.replace")}
        />
      )}
    </div>
  )
}
