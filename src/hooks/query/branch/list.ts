import { useQuery } from "@tanstack/react-query";
import { branchList } from "../../../services/branch/list";
import type { listBranchProps } from "../../../models/branch/list";

export const useBranchList = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<listBranchProps>({
    queryKey: ["branch-list"],
    queryFn: branchList,
  });

  return { data, isLoading, error, refetch };
};
