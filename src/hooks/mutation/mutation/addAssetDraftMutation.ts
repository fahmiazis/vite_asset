import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addAssetDraftMutation, type AddAssetDraftMutationPayload } from "../../../services/mutation/addAssetDraftMutation"

export function useAddAssetDraftMutation(transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddAssetDraftMutationPayload) =>
      addAssetDraftMutation(transactionNumber, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mutation-draft-detail", transactionNumber],
      })
    },
  })
}