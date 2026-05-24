import { useQuery } from "@tanstack/react-query";
import type { disposalDetailProps } from "../../../models/disposal/detail";
import { disposalDetail } from "../../../services/disposal/detail";

export const useDisposalDetail = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<disposalDetailProps>({
    queryKey: ["disposal-detail", id],
    queryFn: () => disposalDetail(id),
  });

  return { data, isLoading, error, refetch };
};
