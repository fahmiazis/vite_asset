import { useQuery } from "@tanstack/react-query";
import type { approvalStatusProps } from "../../../models/transaction/approvalStatus";
import { approvalStatus } from "../../../services/transaction/approvalStatus";

export const useApprovalStatus = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<approvalStatusProps>({
    queryKey: ["approval-status", id],
    queryFn: () => approvalStatus(id),
  });

  return { data, isLoading, error, refetch };
};
