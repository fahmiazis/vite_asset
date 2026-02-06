import { useQuery } from "@tanstack/react-query";
import type { roleListProps } from "../../../models/roles/list";
import { roleList } from "../../../services/roles/list";

export const useRoleList = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<roleListProps>({
    queryKey: ["role-list"],
    queryFn: roleList,
  });

  return { data, isLoading, error, refetch };
};
