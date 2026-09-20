import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { updateMenu, type UpdateMenuPayload } from "../../../services/menu/update"

export function useUpdateMenu(id: string) {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (payload: UpdateMenuPayload) => updateMenu(id, payload),
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["menu-list"] })
            queryClient.resetQueries({ queryKey: ["menu-detail", id] })
            navigate("/dashboard/menu")
        },
    })
}