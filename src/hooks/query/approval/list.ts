import { useQuery } from "@tanstack/react-query";
import type { approvalListProps } from "../../../models/approval/list";
import { approvalFlowList } from "../../../services/approval/list";

export const useApprovalFlowList = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<approvalListProps>({
    queryKey: ["approval-flow-list"],
    queryFn: approvalFlowList,
  });

  return { data, isLoading, error, refetch };
};
