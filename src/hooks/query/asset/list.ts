import { useQuery } from "@tanstack/react-query";
import type { listAssestProps } from "../../../models/asset/list";
import { assetList } from "../../../services/asset/list";

export const useAssetList = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<listAssestProps>({
    queryKey: ["asset-list"],
    queryFn: assetList,
  });

  return { data, isLoading, error, refetch };
};
