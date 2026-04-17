// hooks/useLogout.ts
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { logout } from "../../utils/auth/logout"

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    logout()

    queryClient.clear()

    toast.success("Logged out successfully")

    navigate("/login", { replace: true })
  }
}