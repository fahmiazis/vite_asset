import { useQuery } from "@tanstack/react-query";
import { myProfile } from "../../../services/auth/myProfile";
import type { myProfileProps } from "../../../models/auth/myProfile";

export const useMyProfile = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<myProfileProps>({
    queryKey: ["my-profile"],
    queryFn: myProfile,
  });

  return { data, isLoading, error, refetch };
};
