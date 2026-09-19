import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { useTranslation } from "react-i18next"
import { Camera01Icon } from "hugeicons-react"
import { useUploadStockOpnamePhoto } from "../../../hooks/mutation/stockOpname/uploadPhoto"

interface PhotoUploadFieldProps {
  transactionNumber: string
  assetId: number
  photoUrl?: string | null
  capturedAt?: string | null
  variant?: "modal" | "grid"
}

function formatCapturedDate(capturedAt?: string | null) {
  if (!capturedAt) return null
  return new Date(capturedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

export function PhotoUploadField({
  transactionNumber,
  assetId,
  photoUrl,
  capturedAt,
  variant = "modal",
}: PhotoUploadFieldProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate: uploadPhoto, isPending } = useUploadStockOpnamePhoto({ transactionNumber })

  // Preview langsung dari file yang dipilih (bukan nunggu round-trip upload
  // + refetch), soalnya prop `photoUrl`/`capturedAt` sering datang dari
  // snapshot item yang gak auto-refresh (mis. modal yang item-nya dikirim
  // sekali pas dibuka).
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  const fullUrl = localPreview ?? (photoUrl ? `${import.meta.env.VITE_IMAGE_ACCESS}${photoUrl}` : null)
  const formattedDate = localPreview ? null : formatCapturedDate(capturedAt)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLocalPreview(URL.createObjectURL(file))
    uploadPhoto(
      { assetId, file },
      {
        // Upload ditolak (validasi ukuran/EXIF/duplikat) -> jangan nampilin
        // foto yang ditolak seolah-olah berhasil kesimpen.
        onError: () => setLocalPreview(null),
      }
    )
    e.target.value = ""
  }

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg"
      className="hidden"
      onChange={handleFileChange}
    />
  )

  if (variant === "grid") {
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          title={
            formattedDate
              ? `${t("stockOpnamePhoto.capturedOn")} ${formattedDate} — ${t("stockOpnamePhoto.clickToReplace")}`
              : t("stockOpnamePhoto.uploadTooltip")
          }
          className={`w-9 h-9 rounded-md border flex items-center justify-center overflow-hidden transition-colors flex-shrink-0 disabled:opacity-50 ${
            fullUrl
              ? "border-gray-200 dark:border-gray-700"
              : "border-dashed border-red-300 dark:border-red-700 text-red-400 hover:border-indigo-400 hover:text-indigo-500"
          }`}
        >
          {isPending ? (
            <span className="w-3 h-3 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
          ) : fullUrl ? (
            <img src={fullUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <Camera01Icon className="w-4 h-4" />
          )}
        </button>
        {hiddenInput}
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
        {t("stockOpnamePhoto.label")} <span className="text-red-500">*</span>
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="relative w-full h-28 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-400 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-indigo-500 transition-colors overflow-hidden disabled:opacity-50"
      >
        {isPending && (
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/70 flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}
        {fullUrl ? (
          <img src={fullUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <>
            <Camera01Icon className="w-6 h-6" />
            <span className="text-xs">{t("stockOpnamePhoto.uploadCta")}</span>
          </>
        )}
      </button>
      <p className="text-[11px] text-gray-400">
        {formattedDate
          ? `${t("stockOpnamePhoto.capturedOn")} ${formattedDate}`
          : t("stockOpnamePhoto.hint")}
      </p>
      {hiddenInput}
    </div>
  )
}
