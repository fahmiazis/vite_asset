import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { deleteMenu } from "../../../services/menu/detele"

export function useDeleteMenu() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: deleteMenu,
        onSuccess: () => {
            queryClient.resetQueries({ queryKey: ["menu-list"] })
            navigate("/dashboard/menu")
        },
    })
}