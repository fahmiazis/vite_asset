import { useQuery } from "@tanstack/react-query";
import type { detailBranchProps } from "../../../models/branch/detail";
import { branchDetail } from "../../../services/branch/detail";

export const useBranchDetail = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<detailBranchProps>({
    queryKey: ["branch-detail", id],
    queryFn: () => branchDetail(id),
  });

  return { data, isLoading, error, refetch };
};
