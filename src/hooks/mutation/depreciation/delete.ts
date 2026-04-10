import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { deleteDepre } from "../../../services/depreciation/delete"

export function useDeleteDepreciation() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: deleteDepre,
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["depre-list"] })
            navigate("/dashboard/depreciation")
        },
    })
}