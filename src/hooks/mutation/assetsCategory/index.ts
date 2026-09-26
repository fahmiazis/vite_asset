import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { updateAssetsCategory } from "../../../services/assetsCategory/update"
import { deleteAssetsCategory } from "../../../services/assetsCategory/delete"
import type { UpdateAssetsCategoryPayload } from "../../../models/assetsCategory/update"

function useInvalidateCategory() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ["assets-category-list"] })
    queryClient.invalidateQueries({ queryKey: ["assets-category-detail"] })
    // kategori dipakai sebagai pilihan di form aset & transaksi
    queryClient.invalidateQueries({ queryKey: ["asset-list"] })
  }
}

export function useUpdateAssetsCategory(id: number) {
  const { t } = useTranslation()
  const invalidate = useInvalidateCategory()

  return useMutation({
    mutationFn: (payload: UpdateAssetsCategoryPayload) =>
      updateAssetsCategory(id, payload),
    onSuccess: (data) => {
      invalidate()
      toast.success(data?.message || t("assetCategory.toast.updated"))
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("assetCategory.toast.updateError")
      )
    },
  })
}

export function useDeleteAssetsCategory() {
  const { t } = useTranslation()
  const invalidate = useInvalidateCategory()

  return useMutation({
    mutationFn: (id: number) => deleteAssetsCategory(id),
    onSuccess: (data) => {
      invalidate()
      toast.success(data?.message || t("assetCategory.toast.deleted"))
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t("assetCategory.toast.deleteError")
      )
    },
  })
}
