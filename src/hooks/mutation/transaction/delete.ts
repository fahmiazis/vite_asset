import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteProcurement } from "../../../services/transaction/delete"

interface UseDeleteProcurementOptions {
    onSuccess?: () => void
    onError?: (err: Error) => void
}

export const useDeleteProcurement = (options?: UseDeleteProcurementOptions) => {
    const queryClient = useQueryClient()

    const { mutate, isPending, error } = useMutation({
        mutationFn: (id: string) => deleteProcurement(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transaction-list"] })
            options?.onSuccess?.()
        },

        onError: (err: Error) => {
            console.error("Delete procurement failed:", err)
            options?.onError?.(err)
        },
    })

    return { mutate, isPending, error }
}