import { useQuery } from "@tanstack/react-query"
import type { roleMenusProps } from "../../../models/roles/roleMenus"
import { roleMenus } from "../../../services/roles/roleMenus"

export const useRoleMenus = (roleId: string) => {
  const { data, isLoading, error, refetch } = useQuery<roleMenusProps>({
    queryKey: ["role-menus", roleId],
    queryFn: () => roleMenus(roleId),
    enabled: !!roleId,
  })

  return { data, isLoading, error, refetch }
}
