import { useQuery } from "@tanstack/react-query";
import { depreDetail } from "../../../services/depreciation/detail";
import type { detailDepreProps } from "../../../models/depreciation/detail";

export const useDepreDetail = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<detailDepreProps>({
    queryKey: ["depre-detail", id],
    queryFn: () => depreDetail(id),
  });

  return { data, isLoading, error, refetch };
};
