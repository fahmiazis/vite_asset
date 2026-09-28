import { useQuery } from "@tanstack/react-query"
import type { UserBranchesProps } from "../../../models/users/branches"
import { userBranches } from "../../../services/users/branches"

export const useUserBranches = (userId: string) => {
  const { data, isLoading, error, refetch } = useQuery<UserBranchesProps>({
    queryKey: ["user-branches", userId],
    queryFn: () => userBranches(userId),
    enabled: !!userId,
  })

  const branches = data?.data ?? []
  const homebase = branches.find(
    (b) => b.membership_type === "homebase" && b.is_active
  )

  return { branches, homebase, isLoading, error, refetch }
}
