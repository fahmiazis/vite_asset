import { useMutation, useQueryClient } from "@tanstack/react-query"
import { resendTransactionEmail } from "../../../services/emailSetting/transactionEmail"

export function useResendTransactionEmail() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (logId: number) => resendTransactionEmail(logId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["email-log-list"] })
    },
  })
}
