import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addAssetDraftMutation, type AddAssetDraftMutationPayload } from "../../../services/mutation/addAssetDraftMutation"
import { refreshMutationQueries } from "./refresh"

export function useAddAssetDraftMutation(transactionNumber: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddAssetDraftMutationPayload) =>
      addAssetDraftMutation(transactionNumber, payload),

    onSuccess: () => {
      refreshMutationQueries(queryClient)
    },
  })
}