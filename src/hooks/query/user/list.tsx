import { useQuery } from "@tanstack/react-query";
import type { userListProps } from "../../../models/users/list";
import { userList } from "../../../services/users/list";

export const useUserList = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<userListProps>({
    queryKey: ["user-list"],
    queryFn: userList,
  });

  return { data, isLoading, error, refetch };
};
