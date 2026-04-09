import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { createDepreciation } from "../../../services/depreciation/create"
import type { CreateDepreciationFormValues } from "../../../components/organisms/depreciation/create" // sesuaikan path
import toast from "react-hot-toast"

interface UseCreateDepreciationOptions {
    redirectOnSuccess?: boolean
    redirectPath?: string
}

export const useCreateDepreciation = (options?: UseCreateDepreciationOptions) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate, isPending, error } = useMutation({
        mutationFn: (payload: CreateDepreciationFormValues) => createDepreciation(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["depreciation-list"] })
            toast.success("Depreciation setting created successfully")

            if (options?.redirectOnSuccess && options?.redirectPath) {
                navigate(options.redirectPath)
            }
        },

        onError: (err: any) => {
            toast.error(err?.response?.data?.message ?? "Failed to create depreciation setting")
        },
    })

    return { mutate, isPending, error }
}