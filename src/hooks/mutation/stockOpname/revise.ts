import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import type { ReviseStockOpnameMode, ReviseStockOpnameRequest } from "../../../models/stockOpname/revise"
import { reviseStockOpnameByApprover, reviseStockOpnameByExecutor } from "../../../services/stockOpname/revise"

interface UseReviseStockOpnameParams {
  transactionNumber: string
  mode: ReviseStockOpnameMode
  onSuccess?: () => void
  onError?: (error: Error) => void
}

type ReviseStockOpnamePayload = ReviseStockOpnameRequest & {
  // wajib kalau mode = "approval"
  transaction_approval_id?: string
}

export function useReviseStockOpname({
  transactionNumber,
  mode,
  onSuccess,
  onError,
}: UseReviseStockOpnameParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ transaction_approval_id, ...payload }: ReviseStockOpnamePayload) =>
      mode === "approval"
        ? reviseStockOpnameByApprover(transactionNumber, {
            ...payload,
            transaction_approval_id: transaction_approval_id ?? "",
          })
        : reviseStockOpnameByExecutor(transactionNumber, payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-opname-detail", transactionNumber] })
      queryClient.invalidateQueries({ queryKey: ["stock-opname-approval-status", transactionNumber] })
      queryClient.invalidateQueries({ queryKey: ["stock-opname-list"] })

      toast.success(data.message || "Stock opname dikembalikan ke draft untuk direvisi")
      onSuccess?.()
    },

    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal merevisi stock opname"

      toast.error(errorMessage)
      onError?.(error)
    },
  })
}
