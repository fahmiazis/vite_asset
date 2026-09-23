import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Camera01Icon } from "hugeicons-react"
import { useAuthedBlobUrl } from "../../../hooks/custom/useAuthedBlobUrl"
import { FilePreviewModal } from "./filePreviewModal"

interface StockOpnamePhotoViewCellProps {
  photoUrl?: string | null
  capturedAt?: string | null
}

function formatCapturedDate(capturedAt?: string | null) {
  if (!capturedAt) return null
  return new Date(capturedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

// Versi read-only dari PhotoUploadField (variant="grid") — dipakai di halaman
// detail yang cuma boleh lihat foto, gak ada tombol upload/ganti.
export function StockOpnamePhotoViewCell({ photoUrl, capturedAt }: StockOpnamePhotoViewCellProps) {
  const { t } = useTranslation()
  const [previewOpen, setPreviewOpen] = useState(false)
  const photoBlob = useAuthedBlobUrl(photoUrl ? `${import.meta.env.VITE_IMAGE_ACCESS}${photoUrl}` : null)
  const formattedDate = formatCapturedDate(capturedAt)

  if (!photoUrl) {
    return <span className="block text-center text-xs text-gray-300 dark:text-gray-700">-</span>
  }

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        disabled={photoBlob.isLoading}
        title={
          `${formattedDate ? `${t("stockOpnamePhoto.capturedOn")} ${formattedDate} — ` : ""}${t("stockOpnamePhoto.clickToView")}`
        }
        className="w-9 h-9 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden transition-colors flex-shrink-0 disabled:opacity-50"
      >
        {photoBlob.isLoading ? (
          <span className="w-3 h-3 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
        ) : photoBlob.objectUrl ? (
          <img src={photoBlob.objectUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <Camera01Icon className="w-4 h-4 text-gray-300" />
        )}
      </button>
      {previewOpen && photoBlob.objectUrl && (
        <FilePreviewModal
          title={t("stockOpnamePhoto.label")}
          src={photoBlob.objectUrl}
          mimeType="image/*"
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  )
}
