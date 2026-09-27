import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuthedBlobUrl } from "../../../hooks/custom/useAuthedBlobUrl"
import { FilePreviewModal } from "./filePreviewModal"

interface StockOpnameBorrowDocumentViewCellProps {
  fileName?: string | null
  documentUrl?: string | null
}

// Versi read-only dari BorrowDocumentUploadField — dipakai di halaman detail,
// gak ada tombol upload/ganti kayak versi grid "Lengkapi Data". Dokumen
// di-fetch (pakai token) cuma pas modal preview dibuka, sama pola-nya kayak
// aslinya.
export function StockOpnameBorrowDocumentViewCell({ fileName, documentUrl }: StockOpnameBorrowDocumentViewCellProps) {
  const { t } = useTranslation()
  const [previewOpen, setPreviewOpen] = useState(false)
  const docBlob = useAuthedBlobUrl(
    documentUrl ? `${import.meta.env.VITE_IMAGE_ACCESS}${documentUrl}` : null,
    previewOpen
  )

  if (!documentUrl) {
    return <span className="block text-center text-xs text-gray-300 dark:text-gray-700">-</span>
  }

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        title={`${fileName ?? ""} — ${t("stockOpnameBorrowDocument.clickToView")}`}
        className="w-9 h-9 rounded-md border border-gray-200 dark:border-gray-700 text-indigo-500 flex items-center justify-center overflow-hidden transition-colors flex-shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m1 5H8a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
      {previewOpen && (
        <FilePreviewModal
          title={t("stockOpnameBorrowDocument.label")}
          fileName={fileName}
          src={docBlob.objectUrl}
          mimeType={docBlob.mimeType}
          isLoading={docBlob.isLoading}
          isError={docBlob.isError}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  )
}
