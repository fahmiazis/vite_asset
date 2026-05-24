import { useQuery } from "@tanstack/react-query";
import { approvalStatusMutationDetail } from "../../../services/mutation/approvalStatus";
import type { approvalStatusMutationProps } from "../../../models/mutation/approvalStatus";

export const useMutationApprovalStatus = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<approvalStatusMutationProps>({
    queryKey: ["mutation-approval-status", id],
    queryFn: () => approvalStatusMutationDetail(id),
  });

  return { data, isLoading, error, refetch };
};
