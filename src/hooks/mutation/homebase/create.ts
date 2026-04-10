import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { createHomeBase, type CreateHomeBasePayload } from "../../../services/homebase/create"
import toast from "react-hot-toast"

export function useCreateHomeBase() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (payload: CreateHomeBasePayload) => createHomeBase(payload),
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["homebase-list"] })
            toast.success("Home base set successfully")
            navigate("/dashboard/homebase")
        },
        onError: (err: any) => {
            const message = err?.response?.data?.message ?? "Failed to set home base"
            toast.error(message)
        },
    })
}