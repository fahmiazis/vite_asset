import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

interface UseRevisionActionParams {
  transactionNumber: string
  /** prefix query key yang perlu di-refresh, mis. ["procurement-detail"] */
  invalidateKeys: string[]
  onSuccess?: () => void
}

/**
 * Factory aksi revisi/pembatalan. Dipakai bersama procurement dan mutation
 * supaya penanganan toast, refresh, dan pesan error tidak berbeda antar menu.
 */
export function createRevisionActionHook<TPayload>(
  action: (transactionNumber: string, payload: TPayload) => Promise<any>,
  successMessage: string,
  errorMessage: string
) {
  return function useRevisionAction({
    transactionNumber,
    invalidateKeys,
    onSuccess,
  }: UseRevisionActionParams) {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: (payload: TPayload) => action(transactionNumber, payload),

      // onSettled, bukan onSuccess: aksi ini memindahkan stage, jadi kalau
      // gagal di tengah, halaman tetap harus menampilkan keadaan sebenarnya.
      onSettled: () => {
        invalidateKeys.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: [key] })
        )
      },

      onSuccess: (data) => {
        toast.success(data?.message || successMessage)
        onSuccess?.()
      },

      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || error.message || errorMessage
        )
      },
    })
  }
}
