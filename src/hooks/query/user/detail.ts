import { useQuery } from "@tanstack/react-query";
import { userDetail } from "../../../services/users/detail";
import type { DetailUserProps } from "../../../models/users/detail";

export const useUserDetail = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<DetailUserProps>({
    queryKey: ["user-detail"],
    queryFn: () => userDetail(id),
  });

  return { data, isLoading, error, refetch };
};
