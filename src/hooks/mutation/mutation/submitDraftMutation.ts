import { useMutation, useQueryClient } from "@tanstack/react-query"
import { submitDraftMutation, type SubmitDraftMutationPayload } from "../../../services/mutation/submitDraftMutation"

export function useSubmitDraftMutation(transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubmitDraftMutationPayload) =>
      submitDraftMutation(transactionNumber, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mutation-draft-detail"],
      })
    },
  })
}