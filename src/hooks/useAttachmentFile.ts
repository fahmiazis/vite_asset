import { useEffect, useState } from "react"

/**
 * Object URL sebuah file attachment.
 *
 * Endpoint file butuh Authorization header, jadi tidak bisa dipasang langsung
 * ke <img src> / <iframe src> — file diambil sebagai blob lalu dibungkus object
 * URL. URL-nya dibebaskan saat unmount supaya blob tidak menumpuk di memori.
 *
 * `loader` dilewatkan dari pemanggil supaya hook ini dipakai bersama oleh
 * disposal dan mutation yang endpoint-nya berbeda.
 */
export function useAttachmentFile(
  loader: (attachmentId: number) => Promise<Blob>,
  attachmentId: number,
  enabled = true
) {
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

    loader(attachmentId)
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
    // loader sengaja tidak masuk deps: pemanggil mengirim referensi fungsi modul
    // yang stabil, dan memasukkannya membuat efek berjalan ulang tiap render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachmentId, enabled])

  return { url, isLoading, error }
}
