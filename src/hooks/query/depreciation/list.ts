import { useQuery } from "@tanstack/react-query";
import { depreList } from "../../../services/depreciation/list";
import type { depreListProps } from "../../../models/depreciation/list";

export const useDepreList = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<depreListProps>({
    queryKey: ["branch-list"],
    queryFn: depreList,
  });

  return { data, isLoading, error, refetch };
};
