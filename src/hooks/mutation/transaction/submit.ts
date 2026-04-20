import { useMutation, useQueryClient } from "@tanstack/react-query"
import { submitProcurement, type SubmitProcurementPayload } from "../../../services/transaction/submit"
import toast from "react-hot-toast"

interface UseSubmitProcurementOptions {
    onSuccess?: () => void
    onError?: (err: Error) => void
}

export const useSubmitProcurement = (options?: UseSubmitProcurementOptions) => {
    const queryClient = useQueryClient()

    const { mutate, isPending, error } = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: SubmitProcurementPayload }) =>
            submitProcurement(id, payload),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["transaction-list"] })
            queryClient.invalidateQueries({ queryKey: ["transaction-detail", variables.id] })
            toast.success("Transaction submitted successfully")
            options?.onSuccess?.()
        },

        onError: (err: any) => {
            const message = err?.response?.data?.message ?? "Failed to submit transaction"
            toast.error(message)
            options?.onError?.(err)
        },
    })

    return { mutate, isPending, error }
}