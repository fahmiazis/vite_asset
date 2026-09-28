import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { downloadStockOpnameDocumentation } from "../../../services/stockOpname/downloadDocumentation"

export function useDownloadStockOpnameDocumentation() {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (transactionNumber: string) => downloadStockOpnameDocumentation(transactionNumber),
    onError: () => {
      toast.error(t("stockOpnameDetail.toastDownloadDocumentationError"))
    },
  })
}
