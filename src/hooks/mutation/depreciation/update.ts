import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { updateDepre, type UpdateDeprePayload } from "../../../services/depreciation/update"

export function useUpdateDepreciation(id: string | number) {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (payload: UpdateDeprePayload) => updateDepre(id, payload),
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["depre-list"] })
            queryClient.resetQueries({ queryKey: ["depre-detail", String(id)] })
            navigate("/dashboard/depreciation")
        },
    })
}