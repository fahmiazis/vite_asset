import { useQuery } from "@tanstack/react-query";
import { assetsCategoryList } from "../../../services/assetsCategory/list";
import type { assetsCategoryListProps } from "../../../models/assetsCategory/list";

export const useAssetsCategoryList = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<assetsCategoryListProps>({
    queryKey: ["assets-category-list"],
    queryFn: assetsCategoryList,
  });

  return { data, isLoading, error, refetch };
};
