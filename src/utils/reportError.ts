import type { TFunction } from "i18next"
import { isAxiosError } from "axios"

/** Pesan error halaman report — 403 dari backend berarti cabang/menu belum di-assign. */
export function reportErrorMessage(error: unknown, t: TFunction): string | undefined {
  if (!error) return undefined
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    if (error.response?.status === 403) {
      return message ? `${t("transactionReport.forbidden")} (${message})` : t("transactionReport.forbidden")
    }
    if (message) return message
  }
  return t("transactionReport.loadFailed")
}
