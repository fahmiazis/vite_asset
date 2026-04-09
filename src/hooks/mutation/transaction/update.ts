// hooks/mutation/transaction/update.ts

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { updateProcurement, type UpdateProcurementPayload } from "../../../services/transaction/update"

interface UseUpdateProcurementOptions {
    redirectOnSuccess?: boolean
    redirectPath?: string
}

export const useUpdateProcurement = (options?: UseUpdateProcurementOptions) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate, isPending, error } = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateProcurementPayload }) =>
            updateProcurement(id, payload),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["transaction-detail", variables.id] })
            queryClient.invalidateQueries({ queryKey: ["transaction-list"] })

            if (options?.redirectOnSuccess && options?.redirectPath) {
                navigate(options.redirectPath)
            }
        },

        onError: (err) => {
            console.error("Update procurement failed:", err)
        },
    })

    return { mutate, isPending, error }
}