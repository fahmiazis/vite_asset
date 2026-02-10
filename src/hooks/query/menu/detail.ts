import { useQuery } from "@tanstack/react-query";
import { menuDetail } from "../../../services/menu/detail";
import type { detailMenuProps } from "../../../models/menu/detail";

export const useMenuDetail = (id: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<detailMenuProps>({
    queryKey: ["menu-detail", id],
    queryFn: () => menuDetail(id),
  });

  return { data, isLoading, error, refetch };
};
