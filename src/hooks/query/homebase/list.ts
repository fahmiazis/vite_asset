import { useQuery } from "@tanstack/react-query";
import { homebaseList } from "../../../services/homebase/list";
import type { homeBaseListProps } from "../../../models/homebase/list";

export const useHomebaseList = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<homeBaseListProps>({
    queryKey: ["homebase-list"],
    queryFn: homebaseList,
  });

  return { data, isLoading, error, refetch };
};
