import { useQuery } from "@tanstack/react-query"
import type { roleDetailProps } from "../../../models/roles/detail"
import { roleDetail } from "../../../services/roles/detail"

export const useRoleDetail = (id: string) => {
  const { data, isLoading, error, refetch } = useQuery<roleDetailProps>({
    queryKey: ["role-detail", id],
    queryFn: () => roleDetail(id),
    enabled: !!id,
  })

  return { data, isLoading, error, refetch }
}
