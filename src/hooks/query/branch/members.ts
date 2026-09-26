import { useQuery } from "@tanstack/react-query"
import type {
  BranchMemberVariant,
  branchMembersProps,
} from "../../../models/branch/members"
import { branchMembers } from "../../../services/branch/members"

export const useBranchMembers = (
  branchId: string,
  variant: BranchMemberVariant
) => {
  const { data, isLoading, error, refetch } = useQuery<branchMembersProps>({
    queryKey: ["branch-members", branchId, variant],
    queryFn: () => branchMembers(branchId, variant),
    enabled: !!branchId,
  })

  return { data, isLoading, error, refetch }
}
