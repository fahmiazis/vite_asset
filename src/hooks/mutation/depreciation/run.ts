import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { runDepreciation } from "../../../services/depreciation/run"

export const useRunDepreciation = (options?: { onSuccess?: () => void }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (period: string) => runDepreciation(period),
    onSuccess: (res) => {
      // nilai aset berubah → daftar aset, detail, dan kartu dashboard ikut basi
      queryClient.invalidateQueries({ queryKey: ["asset-list"] })
      queryClient.invalidateQueries({ queryKey: ["asset-detail"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] })
      toast.success(
        t("runDepreciation.success", { count: res.data.processed_assets, period: res.data.period })
      )
      options?.onSuccess?.()
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t("runDepreciation.failed"))
    },
  })

  return { run: mutateAsync, isPending }
}
