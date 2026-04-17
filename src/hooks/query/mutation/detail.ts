import { useQuery } from "@tanstack/react-query";
import { mutationDetail } from "../../../services/mutation/detail";
import type { detailMutationProps } from "../../../models/mutation/detail";

export const useMutationDetail = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<detailMutationProps>({
    queryKey: ["mutation-detail", id],
    queryFn: () => mutationDetail(id),
  });

  return { data, isLoading, error, refetch };
};
