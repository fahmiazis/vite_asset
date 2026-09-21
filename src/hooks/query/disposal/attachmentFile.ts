import { useEffect, useState } from "react"
import { disposalAttachmentFile } from "../../../services/disposal/attachmentFile"

/** tipe yang bisa ditampilkan langsung di dialog */
export type PreviewKind = "image" | "pdf" | "none"

export function previewKindOf(mimeType?: string | null, fileName?: string): PreviewKind {
  const mime = (mimeType ?? "").toLowerCase()
  if (mime.startsWith("image/")) return "image"
  if (mime === "application/pdf") return "pdf"

  // sebagian file lama tersimpan tanpa mime_type — jatuh ke ekstensi
  const ext = (fileName ?? "").split(".").pop()?.toLowerCase() ?? ""
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext)) return "image"
  if (ext === "pdf") return "pdf"

  return "none"
}

/**
 * Object URL file attachment. URL-nya dibebaskan saat komponen unmount supaya
 * blob-nya tidak menumpuk di memori.
 */
export function useDisposalAttachmentFile(attachmentId: number, enabled = true) {
  const [url, setUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    let objectUrl: string | null = null
    let cancelled = false

    setIsLoading(true)
    setError(null)

    disposalAttachmentFile(attachmentId)
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [attachmentId, enabled])

  return { url, isLoading, error }
}
