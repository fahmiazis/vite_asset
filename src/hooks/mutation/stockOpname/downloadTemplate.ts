import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { downloadStockOpnameTemplate } from "../../../services/stockOpname/downloadTemplate"

export function useDownloadStockOpnameTemplate() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (transactionNumber: string) => downloadStockOpnameTemplate(transactionNumber),
    onError: () => {
      toast.error(t("stockOpnameTemplateModal.toastDownloadError"))
    },
  })
}
