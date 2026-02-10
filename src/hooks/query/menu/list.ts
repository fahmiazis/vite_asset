import { useQuery } from "@tanstack/react-query";
import { menuList } from "../../../services/menu/list";
import type { allMenuProps } from "../../../models/menu/list";

export const useMenuList = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<allMenuProps>({
    queryKey: ["menu-list"],
    queryFn: menuList,
  });

  return { data, isLoading, error, refetch };
};
