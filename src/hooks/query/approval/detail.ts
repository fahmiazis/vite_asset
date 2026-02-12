import { useQuery } from "@tanstack/react-query";
import { approvalFlowDetail } from "../../../services/approval/detail";
import type { detailApprovalFlowProps } from "../../../models/approval/detail";

export const useApprovalFlowDetail = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<detailApprovalFlowProps>({
    queryKey: ["approval-flow-detail", id],
    queryFn: () => approvalFlowDetail(id),
  });

  return { data, isLoading, error, refetch };
};
