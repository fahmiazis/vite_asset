import { useTranslation } from "react-i18next"
import { Download04Icon } from "hugeicons-react"

export function ReportDownloadButton({
  onClick,
  isLoading,
  disabled,
}: {
  onClick: () => void
  isLoading: boolean
  disabled?: boolean
}) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
    >
      <Download04Icon size={14} />
      <span>{isLoading ? t("transactionReport.downloading") : t("transactionReport.downloadExcel")}</span>
    </button>
  )
}
