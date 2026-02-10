import { useQuery } from "@tanstack/react-query";
import type { sidebarListProps } from "../../../models/sidebar/list";
import { sidebarList } from "../../../services/sidebar/list";

export const useSidebarList = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<sidebarListProps>({
    queryKey: ["sidebar-list"],
    queryFn: sidebarList,
  });

  return { data, isLoading, error, refetch };
};
