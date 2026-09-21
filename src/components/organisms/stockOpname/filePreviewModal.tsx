import { useEffect } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"

interface FilePreviewModalProps {
  title: string
  fileName?: string | null
  src: string | null
  mimeType: string | null
  isLoading?: boolean
  isError?: boolean
  onClose: () => void
  // Kalau di-set, muncul tombol "ganti" di header — dipanggil setelah modal
  // ditutup biar file picker bisa langsung kebuka.
  onReplace?: () => void
  replaceLabel?: string
}

type PreviewKind = "image" | "pdf" | "other"

function detectKind(mimeType: string | null, fileName?: string | null): PreviewKind {
  const ext = fileName?.split(".").pop()?.toLowerCase()
  if (mimeType?.startsWith("image/") || (ext && ["jpg", "jpeg", "png", "webp"].includes(ext))) return "image"
  if (mimeType === "application/pdf" || ext === "pdf") return "pdf"
  return "other"
}

// Preview file (foto / PDF) dalam modal. Word gak bisa dirender browser, jadi
// jatuh ke fallback download.
export function FilePreviewModal({
  title,
  fileName,
  src,
  mimeType,
  isLoading,
  isError,
  onClose,
  onReplace,
  replaceLabel,
}: FilePreviewModalProps) {
  const { t } = useTranslation()
  const kind = detectKind(mimeType, fileName)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{title}</p>
            {fileName && <p className="text-xs text-gray-400 truncate">{fileName}</p>}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {onReplace && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onReplace()
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {replaceLabel ?? t("stockOpnameFilePreview.replace")}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={t("stockOpnameFilePreview.close")}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-[240px] overflow-auto bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          {isLoading ? (
            <span className="w-6 h-6 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
          ) : isError || !src ? (
            <p className="text-sm text-red-500 px-4 text-center">{t("stockOpnameFilePreview.loadError")}</p>
          ) : kind === "image" ? (
            <img src={src} alt={fileName ?? title} className="max-w-full max-h-[75vh] object-contain" />
          ) : kind === "pdf" ? (
            <iframe src={src} title={fileName ?? title} className="w-full h-[75vh] border-0" />
          ) : (
            <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("stockOpnameFilePreview.noPreview")}</p>
              <a
                href={src}
                download={fileName ?? undefined}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                {t("stockOpnameFilePreview.download")}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
